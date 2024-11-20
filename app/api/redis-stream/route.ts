import { Redis } from "ioredis";

type StreamData = {
  eventType: string;
  message: string;
  timestamp: string;
};

const isNumberArray = (value: unknown): value is number[] =>
  Array.isArray(value) && value.every((b) => typeof b === "number");

const parseByteString = (str: string): number[] | null => {
  try {
    // Remove brackets and split by comma
    const numbers = str
      .replace(/[\[\]]/g, "")
      .split(",")
      .map((n) => parseInt(n.trim(), 10));

    if (numbers.every((n) => !isNaN(n))) {
      return numbers;
    }
  } catch {
    // If parsing fails, return null
  }

  return null;
};

const bytesToString = (bytes: number[]): string => {
  const uint8Array = new Uint8Array(bytes);

  return new TextDecoder("utf-8").decode(uint8Array);
};

const handleStringBytes = (bytes: string): string => {
  const parsedBytes = parseByteString(bytes);
  if (parsedBytes) {
    return bytesToString(parsedBytes);
  }

  return bytes;
};

const parseJsonMessage = (str: string): string => {
  try {
    const parsed = JSON.parse(str);
    // Log the full message details to console
    console.log("Parsed message:", parsed);

    // Return only the output field
    return parsed.output || str;
  } catch (error) {
    console.error("Failed to parse JSON message:", error);

    return str;
  }
};

const convertBytesToString = (bytes: unknown): string => {
  if (bytes instanceof Buffer) {
    // Use Buffer's built-in UTF-8 decoding
    return bytes.toString("utf-8");
  }
  if (bytes instanceof Uint8Array) {
    return new TextDecoder("utf-8").decode(bytes);
  }
  if (typeof bytes === "string") {
    return handleStringBytes(bytes);
  }
  if (isNumberArray(bytes)) {
    return bytesToString(bytes);
  }

  return "";
};

const parseStreamFields = (messageId: string, fields: string[]): StreamData => {
  const fieldMap = new Map<string, unknown>();
  for (let i = 0; i < fields.length; i += 2) {
    fieldMap.set(fields[i], fields[i + 1]);
  }

  const eventType = fieldMap.get("event_type");
  const bytes = fieldMap.get("bytes");
  const messageStr = convertBytesToString(bytes);
  const message = parseJsonMessage(messageStr);

  return {
    eventType: typeof eventType === "string" ? eventType : "unknown",
    message,
    timestamp: new Date(parseInt(messageId.split("-")[0])).toISOString(),
  };
};

const handleStreamMessages = async (
  messages: [string, string[]][],
  writeSSE: (data: StreamData) => Promise<void>,
  isConnectionClosed: () => boolean,
): Promise<string | undefined> => {
  let lastId: string | undefined;

  for (const [id, fields] of messages) {
    if (isConnectionClosed()) {
      return lastId;
    }
    const data = parseStreamFields(id, fields);
    await writeSSE(data);
    lastId = id;
  }

  return lastId;
};

const createStreamHandler = (
  redis: Redis,
  writer: WritableStreamDefaultWriter<Uint8Array>,
) => {
  let closed = false;
  const encoder = new TextEncoder();

  const writeSSE = async (data: StreamData): Promise<void> => {
    const message = `data: ${JSON.stringify(data)}\n\n`;
    await writer.write(encoder.encode(message));
  };

  const writeKeepAlive = async (): Promise<void> => {
    await writer.write(encoder.encode(`: keep-alive\n\n`));
  };

  const isConnectionClosed = (): boolean => closed;

  const cleanup = (): void => {
    closed = true;
    void writer.close();
    redis.disconnect();
  };

  const readStreamMessages = async (
    logstreamId: string,
    lastId: string,
  ): Promise<string> => {
    const response = await redis.xread(
      "BLOCK",
      1000,
      "STREAMS",
      logstreamId,
      lastId,
    );

    if (!response?.[0]) {
      return lastId;
    }

    const [, messages] = response[0];
    const newLastId = await handleStreamMessages(
      messages,
      writeSSE,
      isConnectionClosed,
    );

    return newLastId ?? lastId;
  };

  const processMessages = async (logstreamId: string): Promise<void> => {
    await writeSSE({
      eventType: "info",
      message: "Connected to log stream",
      timestamp: new Date().toISOString(),
    });

    const pastMessages = await redis.xrange(logstreamId, "-", "+");
    let currentId =
      (await handleStreamMessages(
        pastMessages,
        writeSSE,
        isConnectionClosed,
      )) ?? "$";

    const keepAliveInterval = setInterval(() => void writeKeepAlive(), 30000);

    try {
      while (!isConnectionClosed()) {
        currentId = await readStreamMessages(logstreamId, currentId);
      }
    } finally {
      clearInterval(keepAliveInterval);
      cleanup();
    }
  };

  return { processMessages, cleanup };
};

export const GET = async (request: Request): Promise<Response> => {
  const { searchParams } = new URL(request.url);
  const logstreamId = searchParams.get("logstreamId");

  if (!logstreamId) {
    return new Response("Missing logstreamId parameter", { status: 400 });
  }

  const redis = new Redis(process.env.REDIS_URL ?? "");
  const stream = new TransformStream();
  const writer = stream.writable.getWriter();

  const handler = createStreamHandler(redis, writer);

  request.signal.addEventListener("abort", handler.cleanup);

  void handler.processMessages(logstreamId).catch((_error: Error) => {
    // Log error to monitoring service in production
    handler.cleanup();
  });

  return new Response(stream.readable, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
      "Access-Control-Allow-Origin": "*",
    },
  });
};

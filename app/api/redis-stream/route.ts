import { Redis } from "ioredis";
import { type StreamResponse } from "./types";

type StreamData = {
  eventType: string;
  message: string;
  timestamp: string;
};

const parseStreamFields = (messageId: string, fields: string[]): StreamData => {
  const fieldMap = new Map<string, string>();
  for (let i = 0; i < fields.length; i += 2) {
    fieldMap.set(fields[i], fields[i + 1]);
  }

  return {
    eventType: fieldMap.get("event_type") ?? "unknown",
    message: fieldMap.get("bytes") ?? "",
    timestamp: new Date(parseInt(messageId.split("-")[0])).toISOString(),
  };
};

const createStreamHandler = (
  redis: Redis,
  writer: WritableStreamDefaultWriter<Uint8Array>,
) => {
  let isConnectionClosed = false;
  const encoder = new TextEncoder();

  const writeSSE = async (data: StreamData): Promise<void> => {
    const message = `data: ${JSON.stringify(data)}\n\n`;
    await writer.write(encoder.encode(message));
  };

  const writeKeepAlive = async (): Promise<void> => {
    await writer.write(encoder.encode(`: keep-alive\n\n`));
  };

  const cleanup = (): void => {
    isConnectionClosed = true;
    void writer.close();
    redis.disconnect();
  };

  const processMessages = async (logstreamId: string): Promise<void> => {
    const initialMessage: StreamData = {
      eventType: "info",
      message: "Connected to log stream",
      timestamp: new Date().toISOString(),
    };
    await writeSSE(initialMessage);

    const pastMessages = await redis.xrange(logstreamId, "-", "+");

    for (const [id, fields] of pastMessages) {
      if (isConnectionClosed) return;
      const data = parseStreamFields(id, fields);
      await writeSSE(data);
    }

    const keepAliveInterval = setInterval(() => void writeKeepAlive(), 30000);

    try {
      let lastId = "$";
      while (!isConnectionClosed) {
        const response = await redis.xread(
          "BLOCK",
          1000,
          "STREAMS",
          logstreamId,
          lastId,
        );

        if (response?.[0]) {
          const [, messages] = response[0];
          for (const [id, fields] of messages) {
            if (isConnectionClosed) return;
            const data = parseStreamFields(id, fields);
            await writeSSE(data);
            lastId = id;
          }
        }
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

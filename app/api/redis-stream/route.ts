import { Redis } from "ioredis";
import { NextResponse } from "next/server";

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
    timestamp: new Date(parseInt(messageId.split('-')[0])).toISOString()
  };
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const logstreamId = searchParams.get("logstreamId");

  if (!logstreamId) {
    return new Response("Missing logstreamId parameter", { status: 400 });
  }

  let isConnectionClosed = false;
  const redis = new Redis(process.env.REDIS_URL ?? "");
  const encoder = new TextEncoder();

  const stream = new TransformStream();
  const writer = stream.writable.getWriter();

  // Function to write SSE messages
  const writeSSE = async (data: any) => {
    if (isConnectionClosed) return;

    try {
      const message = `data: ${JSON.stringify(data)}\n\n`;
      await writer.write(encoder.encode(message));
    } catch (error) {
      if (!isConnectionClosed) {
        console.error('Error writing SSE message:', error);
      }
    }
  };

  // Function to write keep-alive
  const writeKeepAlive = async () => {
    if (isConnectionClosed) return;
    try {
      await writer.write(encoder.encode(`: keep-alive\n\n`));
    } catch (error) {
      if (!isConnectionClosed) {
        console.error('Error writing keep-alive:', error);
      }
    }
  };

  // Handle client disconnect
  request.signal.addEventListener('abort', () => {
    console.log('Client disconnected, cleaning up...');
    isConnectionClosed = true;
    writer.close().catch(() => {});
    redis.disconnect();
  });

  // Start processing in the background
  (async () => {
    try {
      // Send initial connection message
      await writeSSE({
        eventType: "info",
        message: "Connected to log stream",
        timestamp: new Date().toISOString()
      });

      // Process past messages
      console.log('Fetching past messages...');
      const pastMessages = await redis.xrange(logstreamId, "-", "+");
      console.log(`Found ${pastMessages.length} past messages`);

      for (const [id, fields] of pastMessages) {
        if (isConnectionClosed) break;
        const data = parseStreamFields(id, fields);
        console.log('Sending past message:', data);
        await writeSSE(data);
      }

      // Set up keep-alive using proper SSE format
      const keepAliveInterval = setInterval(writeKeepAlive, 30000);

      // Monitor for new messages
      let lastId = "$";
      while (!isConnectionClosed) {
        try {
          const response = await redis.xread("BLOCK", 1000, "STREAMS", logstreamId, lastId);
          
          if (response && response[0]) {
            const [, messages] = response[0];
            for (const [id, fields] of messages) {
              if (isConnectionClosed) break;
              const data = parseStreamFields(id, fields);
              console.log('Sending new message:', data);
              await writeSSE(data);
              lastId = id;
            }
          }
        } catch (error) {
          if (!isConnectionClosed) {
            console.error('Error reading new messages:', error);
            await new Promise(resolve => setTimeout(resolve, 1000));
          }
        }
      }

      clearInterval(keepAliveInterval);
    } catch (error) {
      if (!isConnectionClosed) {
        console.error('Stream processing error:', error);
      }
    } finally {
      redis.disconnect();
    }
  })().catch(console.error);

  return new Response(stream.readable, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
      'Access-Control-Allow-Origin': '*'
    }
  });
}

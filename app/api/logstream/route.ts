import { TransformStream } from "stream/web";

import { ChangeStreamDocument } from "mongodb";

import { logstream } from "@/lib/api";
import { Repository } from "@/lib/db/models";

export const GET = async () => {
  const responseStream = new TransformStream();
  const writer = responseStream.writable.getWriter();

  const res = new Response(responseStream.readable, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });

  const sendUpdate = async (data: ChangeStreamDocument<Repository>) => {
    await writer.write(
      new TextEncoder().encode(`data: ${JSON.stringify(data)}\n\n`),
    );
  };

  const changeStream = await logstream("test");

  console.log("changeStream", changeStream);

  // changeStream.on("change", async (change) => {
  //   await sendUpdate(change);
  // });

  return res;
};

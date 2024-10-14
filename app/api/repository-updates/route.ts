import { TransformStream } from "stream/web";

import { ChangeStreamDocument } from "mongodb";
import { NextRequest } from "next/server";

import { repositoryStream } from "@/lib/api";
import { Repository } from "@/lib/db/models";

export const GET = async (req: NextRequest) => {
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

  const changeStream = await repositoryStream();

  changeStream.on("change", async (change) => {
    await sendUpdate(change);
  });

  return res;
};

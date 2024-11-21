import { TransformStream } from "stream/web";

import { ChangeStreamDocument } from "mongodb";
import { NextRequest } from "next/server";

import { repositoryStream } from "@/lib/api";
import { Repository } from "@/lib/db/models";

export const dynamic = "force-dynamic";

export const GET = async (_req: NextRequest) => {
  const responseStream = new TransformStream<Uint8Array>();
  const writer = responseStream.writable.getWriter();

  /* eslint-disable @typescript-eslint/consistent-type-assertions */
  const readable =
    responseStream.readable as unknown as ReadableStream<Uint8Array>;

  /* eslint-enable @typescript-eslint/consistent-type-assertions */

  const res = new Response(readable, {
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

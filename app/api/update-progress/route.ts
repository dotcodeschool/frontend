import { NextRequest, NextResponse } from "next/server";

import { clientPromise } from "@/lib/db/mongodb";
import { TypeProgressData, TypeProgressUpdate } from "@/lib/types";

export const POST = async (req: NextRequest) => {
  const client = await clientPromise;
  const db = client.db("dcs-test");

  try {
    const data = await req.json();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const updates: any = data.updates;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const operations = updates.map((update: any) => {
      const { user, progress } = update;
      const updateObject: Record<string, boolean> = {};
      for (const courseId in progress) {
        for (const lessonId in progress[courseId]) {
          for (const chapterId in progress[courseId][lessonId]) {
            const path = `progress.${courseId}.${lessonId}.${chapterId}`;
            updateObject[path] = progress[courseId][lessonId][chapterId];
          }
        }
      }

      return {
        updateOne: {
          filter: { email: user.email },
          update: { $set: updateObject },
        },
      };
    });

    const result = await db.collection("users").bulkWrite(operations);

    return NextResponse.json({ result });
  } catch (error) {
    console.error("Error updating progress:", error);

    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
};

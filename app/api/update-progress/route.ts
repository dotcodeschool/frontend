import { NextRequest, NextResponse } from "next/server";

import clientPromise from "@/app/lib/mongodb";

interface ProgressUpdate {
  user: {
    email: string;
  };
  progress: {
    [courseId: string]: {
      [lessonId: string]: {
        [chapterId: string]: boolean;
      };
    };
  };
}

export async function POST(req: NextRequest) {
  const client = await clientPromise;
  const db = client.db("test");

  try {
    const updates: ProgressUpdate[] = await req.json();

    const operations = updates.map((update) => {
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
}

import { NextRequest, NextResponse } from "next/server";

import { auth } from "@/auth";
import { getLessonCollectionTotal } from "@/app/courses/[course]/helpers";

export async function GET(req: NextRequest) {
  const { sectionId } = await req.json();
  const session = await auth();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const result = await getLessonCollectionTotal(sectionId);

    return NextResponse.json(result);
  } catch (error) {
    console.error("MongoDB error: GET /api/get-lesson-data", error);

    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}

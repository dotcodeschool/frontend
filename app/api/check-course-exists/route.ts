import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const slug = searchParams.get("slug");

    if (!slug) {
      return NextResponse.json(
        { error: "Slug parameter is required" },
        { status: 400 },
      );
    }

    // Check if the course exists in the local content/courses directory
    const courseDir = path.join(process.cwd(), "content/courses", slug);
    const exists = fs.existsSync(courseDir);

    console.log(
      `[check-course-exists] Checking for course: ${slug} in ${courseDir}, exists: ${exists}`,
    );

    return NextResponse.json({ exists });
  } catch (error) {
    console.error("[check-course-exists] Error:", error);
    return NextResponse.json(
      { error: "Failed to check course existence" },
      { status: 500 },
    );
  }
}

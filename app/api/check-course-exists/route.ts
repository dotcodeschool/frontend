import { NextRequest, NextResponse } from "next/server";
import { getCourseDetails } from "@/app/courses/[course]/helpers";
import { QUERY_COURSE_OVERVIEW_METADATA_FIELDS } from "@/queries";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const slug = searchParams.get("slug");

  if (!slug) {
    return NextResponse.json(
      { error: "Slug parameter is required" },
      { status: 400 },
    );
  }

  try {
    const course = await getCourseDetails(
      slug,
      QUERY_COURSE_OVERVIEW_METADATA_FIELDS,
    );
    return NextResponse.json({ exists: !!course });
  } catch (error) {
    console.error("Error checking course existence:", error);
    return NextResponse.json(
      { error: "Failed to check course existence" },
      { status: 500 },
    );
  }
}

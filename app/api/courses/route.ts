import { NextResponse } from "next/server";
import { getContentfulData } from "@/lib/api/contentful";
import { QUERY_COURSE_CATALOG } from "@/app/courses/queries";
import { getLocalCourses } from "@/app/courses/helpers/getLocalCourses";

export async function GET() {
  try {
    // Get courses from Contentful
    const contentfulCourses = await getContentfulData<
      "courseModuleCollection",
      Array<any>
    >(QUERY_COURSE_CATALOG, "courseModuleCollection");

    // Get courses from local MDX files
    const localCourses = await getLocalCourses();

    // Combine courses without grouping them
    const allCourses = [...contentfulCourses, ...localCourses];

    return NextResponse.json(allCourses);
  } catch (error) {
    console.error("Error fetching courses:", error);
    return NextResponse.json(
      { error: "Failed to fetch courses" },
      { status: 500 },
    );
  }
}

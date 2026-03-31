import { NextResponse } from "next/server";
import { getLocalCourses } from "@/app/courses/helpers/getLocalCourses";

export async function GET() {
  try {
    const courses = await getLocalCourses();
    return NextResponse.json(courses);
  } catch (error) {
    console.error("Error fetching courses:", error);
    return NextResponse.json(
      { error: "Failed to fetch courses" },
      { status: 500 },
    );
  }
}

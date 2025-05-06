import { getTestLogsForRepo } from "@/lib/api";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const repoName = searchParams.get("repoName");
  const sectionName = searchParams.get("sectionName") || undefined;
  const lessonName = searchParams.get("lessonName") || undefined;

  if (!repoName) {
    return NextResponse.json(
      { error: "Repository name is required" },
      { status: 400 },
    );
  }

  try {
    const testLog = await getTestLogsForRepo(repoName, sectionName, lessonName);

    // Return just the passed status if testLog exists, otherwise null
    const status = testLog ? { passed: testLog.passed } : null;
    return NextResponse.json({ status });
  } catch (error) {
    console.error("Error fetching test logs:", error);
    return NextResponse.json(
      { error: "Failed to fetch test status" },
      { status: 500 },
    );
  }
}

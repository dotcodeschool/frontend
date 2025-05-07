import { getTestLogsForRepo } from "@/lib/api";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const repoName = searchParams.get("repoName");
  const sectionId = searchParams.get("sectionId") || undefined;
  const lessonId = searchParams.get("lessonId") || undefined;

  console.log("[test-status] Request params:", {
    repoName,
    sectionId,
    lessonId,
  });

  if (!repoName) {
    console.log("[test-status] Error: Repository name is required");
    return NextResponse.json(
      { error: "Repository name is required" },
      { status: 400 },
    );
  }

  try {
    console.log("[test-status] Fetching test logs for repo:", repoName);

    // Fetch all test logs for the repository
    const allTestLogs = await getTestLogsForRepo(repoName);

    console.log(
      "[test-status] Received test logs:",
      allTestLogs
        ? `${Array.isArray(allTestLogs) ? allTestLogs.length : 1} logs`
        : "null",
    );

    // If we don't have section and lesson IDs, return the first log (original behavior)
    if (!sectionId || !lessonId) {
      console.log(
        "[test-status] No section/lesson IDs provided, returning first log",
      );

      const testLog =
        Array.isArray(allTestLogs) && allTestLogs.length > 0
          ? allTestLogs[0]
          : null;

      const status = testLog ? { passed: testLog.passed } : null;
      console.log("[test-status] Returning status:", status);

      return NextResponse.json({ status });
    }

    // Create a lesson slug from section and lesson IDs
    const lessonSlug = `${sectionId}-${lessonId}`;
    console.log("[test-status] Created lesson slug:", lessonSlug);

    // Filter logs by lesson slug
    const lessonLogs = Array.isArray(allTestLogs)
      ? allTestLogs.filter((log) => {
          const matches = log.lesson_slug === lessonSlug;
          console.log(
            `[test-status] Log ${log.test_name} lesson_slug: ${log.lesson_slug}, matches: ${matches}`,
          );
          return matches;
        })
      : [];

    console.log("[test-status] Filtered logs count:", lessonLogs.length);

    if (lessonLogs.length === 0) {
      console.log("[test-status] No logs found for this lesson slug");
      return NextResponse.json({
        status: null,
        tests: [],
      });
    }

    // Calculate summary
    const total = lessonLogs.length;
    const passedCount = lessonLogs.filter((test) => test.passed).length;

    console.log("[test-status] Test summary:", {
      total,
      passedCount,
      allPassed: passedCount === total,
    });

    return NextResponse.json({
      status: {
        passed: passedCount === total && total > 0, // All tests passed and at least one test exists
        total,
        passedCount,
      },
      tests: lessonLogs,
    });
  } catch (error) {
    console.error("[test-status] Error fetching test logs:", error);
    return NextResponse.json(
      { error: "Failed to fetch test status" },
      { status: 500 },
    );
  }
}

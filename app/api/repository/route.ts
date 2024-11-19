import { NextRequest, NextResponse } from "next/server";

import { getRepositories, getUserRepo } from "@/lib/api";
import { convertKeysToSnakeCase } from "@/lib/utils";

export const GET = async (request: NextRequest) => {
  const { searchParams } = new URL(request.url);
  const courseSlug = searchParams.get("courseSlug");
  const repoName = searchParams.get("repoName");

  if (!repoName && !courseSlug) {
    return NextResponse.json(
      { error: "Bad Request: `repoName` or `courseSlug` is required" },
      { status: 400 },
    );
  }

  try {
    if (courseSlug) {
      // Use getUserRepo for courseSlug queries
      const repo = await getUserRepo(courseSlug);
      
      if (!repo) {
        return NextResponse.json(
          { error: "Repository not found" },
          { status: 404 },
        );
      }

      return NextResponse.json(repo);
    }

    // Use existing repository lookup for repoName queries
    const filter = convertKeysToSnakeCase({ repoName });
    const repositories = await getRepositories();
    const repo = await repositories.findOne(filter);

    if (!repo) {
      return NextResponse.json(
        { error: "Repository not found" },
        { status: 404 },
      );
    }

    return NextResponse.json(repo);
  } catch (error) {
    console.error("Error fetching repository:", error);

    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
};

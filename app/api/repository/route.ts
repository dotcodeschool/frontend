import { NextRequest, NextResponse } from "next/server";

import { getRepositories, getUserRepo } from "@/lib/api";
import { convertKeysToSnakeCase } from "@/lib/utils";

export const dynamic = "force-dynamic";

const getRepoByName = async (repoName: string) => {
  const filter = convertKeysToSnakeCase({ repoName });
  const repositories = await getRepositories();

  return repositories.findOne(filter);
};

const handleError = (error: unknown) => {
  console.error("Error fetching repository:", error);

  return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
};

const validateParams = (courseSlug: string | null, repoName: string | null) => {
  if (!repoName && !courseSlug) {
    return NextResponse.json(
      { error: "Bad Request: `repoName` or `courseSlug` is required" },
      { status: 400 },
    );
  }

  return null;
};

const fetchRepo = async (
  courseSlug: string | null,
  repoName: string | null,
) => {
  if (courseSlug) {
    return getUserRepo(courseSlug);
  }

  if (repoName) {
    return getRepoByName(repoName);
  }

  return null;
};

export const GET = async (request: NextRequest) => {
  try {
    const { searchParams } = new URL(request.url);
    const courseSlug = searchParams.get("courseSlug");
    const repoName = searchParams.get("repoName");

    const validationError = validateParams(courseSlug, repoName);
    if (validationError) {
      return validationError;
    }

    const repo = await fetchRepo(courseSlug, repoName);
    if (!repo) {
      return NextResponse.json(
        { error: "Repository not found" },
        { status: 404 },
      );
    }

    return NextResponse.json(repo);
  } catch (error) {
    return handleError(error);
  }
};

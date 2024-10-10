import { NextRequest, NextResponse } from "next/server";

import { getRepositories } from "@/lib/api";
import { convertKeysToSnakeCase } from "@/lib/utils";

export const GET = async (request: NextRequest) => {
  const { searchParams } = new URL(request.url);
  const repoName = searchParams.get("repoName");

  if (!repoName) {
    return NextResponse.json(
      { error: "Repository name is required" },
      { status: 400 },
    );
  }

  try {
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

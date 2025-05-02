import { NextRequest, NextResponse } from "next/server";

import { bundleMdxContent } from "@/lib/mdx-bundle";

export const POST = async (req: NextRequest) => {
  try {
    const { source } = await req.json();

    if (!source || typeof source !== "string") {
      return NextResponse.json(
        { error: "Source is required and must be a string" },
        { status: 400 },
      );
    }

    const result = await bundleMdxContent(source);

    return NextResponse.json({ code: result.code || "" });
  } catch (error) {
    console.error("Error bundling MDX:", error);

    return NextResponse.json(
      { error: "Failed to bundle MDX content" },
      { status: 500 },
    );
  }
};

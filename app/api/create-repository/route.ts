import { NextRequest, NextResponse } from "next/server";

import { convertKeysToSnakeCase } from "@/lib/utils";

export const POST = async (request: NextRequest) => {
  try {
    const jsonData = await request.json();
    const body = JSON.stringify(convertKeysToSnakeCase(jsonData));

    const response = await fetch(
      `${process.env.BACKEND_URL}/api/v0/repository`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body,
      },
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const responseData = await response.json();

    return NextResponse.json(responseData);
  } catch (error) {
    console.error("An error occurred while creating the repository", error);

    return NextResponse.json(
      { error: "An error occurred while creating the repository" },
      { status: 500 },
    );
  }
};

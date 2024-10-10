import { NextRequest, NextResponse } from "next/server";

import { getUserByEmail } from "@/lib/api";

export const POST = async (req: NextRequest) => {
  const data = await req.json();

  if (typeof data?.userEmail !== "string") {
    return NextResponse.json(
      { error: "Bad Request: `userEmail` must be of type `string`" },
      { status: 400 },
    );
  }

  try {
    const result = await getUserByEmail(data.userEmail);

    return NextResponse.json(result);
  } catch (error) {
    console.error("MongoDB error:", error);

    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
};

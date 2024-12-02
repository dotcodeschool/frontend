import { NextRequest, NextResponse } from "next/server";

import { getProgressData, getUserByEmail } from "@/lib/api";
import { auth } from "@/auth";

export const POST = async (req: NextRequest) => {
  const session = await auth();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const result = await getProgressData(session);

    return NextResponse.json(result);
  } catch (error) {
    console.error("MongoDB error: GET /api/get-progress-data", error);

    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
};

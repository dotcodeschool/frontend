import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/app/lib/mongodb";

export async function GET(req: NextRequest) {
  const client = await clientPromise;
  const db = client.db("test");

  const searchParams = req.nextUrl.searchParams;
  const user = searchParams.get("user");

  if (!user) {
    return NextResponse.json(
      { error: "User parameter is required" },
      { status: 400 },
    );
  }

  try {
    const result = await db.collection("users").findOne({ user });
    return NextResponse.json({ result });
  } catch (error) {
    console.error("MongoDB error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}

import { MongoClient } from "mongodb";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

if (!process.env.MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable");
}

const client = new MongoClient(process.env.MONGODB_URI);

export const GET = async (request: NextRequest) => {
  try {
    const { searchParams } = new URL(request.url);
    const repoName = searchParams.get("repo_name");

    if (!repoName) {
      return NextResponse.json(
        { error: "repo_name parameter is required" },
        { status: 400 },
      );
    }

    await client.connect();
    const db = client.db("dcs-test");

    // Find the latest submission for the given repo_name
    const latestSubmission = await db.collection("submissions").findOne(
      { repo_name: repoName }, // eslint-disable-line camelcase
      {
        sort: { created_at: -1 }, // eslint-disable-line camelcase
        projection: { logstream_id: 1 }, // eslint-disable-line camelcase
      },
    );

    if (!latestSubmission) {
      return NextResponse.json(
        { error: "No submission found for the given repository" },
        { status: 404 },
      );
    }

    // eslint-disable-next-line camelcase
    return NextResponse.json({ logstream_id: latestSubmission.logstream_id });
  } catch (error) {
    console.error("Error fetching latest submission:", error);

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  } finally {
    await client.close();
  }
};

import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";

import { auth } from "@/auth";
import { getUserByEmail, getRepositories } from "@/lib/api";
import { Repository } from "@/lib/db/models";
import { getUserInfo } from "@/lib/helpers";

export const dynamic = "force-dynamic";

export const GET = async () => {
  try {
    const session = await auth();
    const userInfo = getUserInfo(session);

    if (userInfo instanceof Error) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await getUserByEmail(userInfo.email);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const repositories = await getRepositories();
    const userRepos = await repositories
      .find({
        "relationships.user.id": user._id,
      })
      .toArray();

    // Transform the data to match the expected format
    const courseReminders = userRepos.map((repo: Repository) => ({
      courseId: repo.relationships.course.id.toString(),
      courseName: repo.repo_template, // Using repo_template for now
      enabled: repo.is_reminder_enabled,
      frequency: repo.expected_practice_frequency,
    }));

    return NextResponse.json(courseReminders);
  } catch (error) {
    console.error("Error fetching user repositories:", error);

    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
};

export const PUT = async (request: Request) => {
  try {
    const session = await auth();
    const userInfo = getUserInfo(session);

    if (userInfo instanceof Error) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await getUserByEmail(userInfo.email);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const { courseReminders } = await request.json();
    const repositories = await getRepositories();

    // Update each repository's reminder settings
    for (const reminder of courseReminders) {
      await repositories.updateOne(
        {
          "relationships.user.id": user._id,
          "relationships.course.id": new ObjectId(reminder.courseId),
        },
        {
          $set: {
            // eslint-disable-next-line camelcase
            is_reminder_enabled: reminder.enabled,
            // eslint-disable-next-line camelcase
            expected_practice_frequency: reminder.frequency,
          },
        },
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating repositories:", error);

    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
};

import { NextResponse } from "next/server";

import { auth } from "@/auth";
import { getUserByEmail } from "@/lib/api";
import { clientPromise } from "@/lib/db/mongodb";
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

    // Return default preferences if not set
    const preferences = user.preferences?.notifications ?? {
      milestoneAlerts: true,
      newCourseAlerts: true,
    };

    return NextResponse.json(preferences);
  } catch (error) {
    console.error("Error fetching user preferences:", error);

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

    const { milestoneAlerts, newCourseAlerts } = await request.json();
    const database = await clientPromise.then((client) =>
      client.db(process.env.DB_NAME),
    );
    const users = database.collection("users");

    await users.updateOne(
      { _id: user._id },
      {
        $set: {
          "preferences.notifications": {
            milestoneAlerts,
            newCourseAlerts,
          },
        },
      },
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating user preferences:", error);

    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
};

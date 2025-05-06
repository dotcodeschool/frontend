// app/courses/[course]/(pages)/setup/page.tsx
import { Box, Text } from "@chakra-ui/react";
import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { Navbar } from "@/components";
import {
  findUserRepositoryByCourse,
  getCourseFromDb,
  getUserByEmail,
} from "@/lib/api";
import { questions as questionsData } from "@/lib/db/data";
import { RepositorySetup } from "@/lib/types";

import { StepsComponent } from "./components/StepsComponent";

// Helper function to authenticate the user and get their ID
const authenticateUserAndGetId = async (course: string) => {
  const session = await auth();
  console.log("[setup] authenticateUserAndGetId session", session);

  // If no session or no user email, redirect to sign in
  if (!session?.user?.email) {
    return { needsAuth: true, userId: null };
  }

  // If we have a user ID in the session, use it directly
  if (session.user.id) {
    console.log("[setup] Using session user ID:", session.user.id);
    return { needsAuth: false, userId: session.user.id };
  }

  try {
    const user = await getUserByEmail(session.user.email);
    // Only redirect to sign in if user truly doesn't exist
    // Not if we got a DB error
    if (user === null) {
      console.log("[setup] User not found by email, redirecting to sign in");
      return { needsAuth: true, userId: null };
    }

    console.log("[setup] User found by email:", user._id.toString());
    return { needsAuth: false, userId: user._id.toString() }; // Convert to string
  } catch (error) {
    // Log the error but don't redirect on DB errors
    console.error("[setup] Database error:", error);

    // If we have a database error but still have a session user ID, use that
    if (session.user.id) {
      console.log(
        "[setup] Falling back to session user ID after DB error:",
        session.user.id,
      );
      return { needsAuth: false, userId: session.user.id };
    }

    return { needsAuth: true, userId: null };
  }
};

const SetupPage = async ({ params }: { params: { course: string } }) => {
  const { course } = params;
  console.log("[setup] Course param:", course);

  const { needsAuth, userId } = await authenticateUserAndGetId(course);

  // If authentication is needed, redirect to login page
  if (needsAuth) {
    // Redirect to login page with a return URL
    redirect(`/login?returnUrl=/courses/${course}/setup`);
  }

  if (!userId) {
    console.log("[setup] No userId found");
    return <Text>loading...</Text>;
  }

  const courseData = await getCourseFromDb(course);
  console.log("[setup] Course data:", courseData);
  if (!courseData) {
    console.log("[setup] Course not found in database");

    // Default error for courses not found
    return (
      <div
        style={{
          margin: "1rem",
          color: "red",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          fontSize: "2rem",
          fontWeight: "bold",
          textAlign: "center",
          textShadow: "0 0 10px rgba(0, 0, 0, 0.5)",
          borderRadius: "10px",
        }}
      >
        <h1>Course not found</h1>
      </div>
    );
  }

  const repo = await findUserRepositoryByCourse(course, userId);

  // Serialize the repo object to avoid ObjectId issues
  const serializedRepo = repo ? JSON.parse(JSON.stringify(repo)) : null;

  const repositorySetup: RepositorySetup = {
    id: "repository-setup",
    kind: "repo_setup",
    title: "Repository Setup",
    description:
      "We've prepared a starter repository with some Rust code for you.",
    steps: [
      {
        title: "1. Install DotCodeSchool CLI",
        code: "curl -sSf https://dotcodeschool.com/install.sh | sh",
      },
      {
        title: "2. Clone the repository",
        code: `git clone https://git.dotcodeschool.com/${serializedRepo?.repo_name} dotcodeschool-${course}\ncd dotcodeschool-${course}`,
      },
      {
        title: "3. Push an empty commit",
        code: "git commit --allow-empty -m 'test'\ngit push origin master",
      },
    ],
  };

  return (
    <Box maxW="6xl" mx="auto" px={[4, 12]}>
      <Navbar cta={false} />
      <StepsComponent
        courseId={courseData._id.toString()}
        courseSlug={course}
        initialRepo={serializedRepo}
        questions={questionsData}
        repositorySetup={repositorySetup}
        startingLessonUrl={`/courses/${course}/section/1/lesson/1`}
        userId={userId}
      />
    </Box>
  );
};

export default SetupPage;

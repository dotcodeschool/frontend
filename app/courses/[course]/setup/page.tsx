import { Box } from "@chakra-ui/react";
import { ObjectId } from "mongodb";
import { redirect } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";

import { auth } from "@/auth";
import { MDXComponents, Navbar } from "@/components";
import { findUserRepositoryByCourse, getUserByEmail } from "@/lib/api";
import { questions as questionsData, repositorySetup } from "@/lib/db/data";
import { handleSignIn } from "@/lib/middleware/actions";
import { RepositorySetup } from "@/lib/types";

import { StepsComponent } from "./components/StepsComponent";

// TODO: Move helper functions to ./helpers/index.ts

// Helper function to authenticate the user
const authenticateUser = async (course: string) => {
  const session = await auth();
  if (!session || !session.user || typeof session.user.email !== "string") {
    await handleSignIn({
      redirectTo: `/courses/${course}/setup`,
    });

    return null;
  }

  return session.user.email;
};

// Helper function to get user ID by email
const getUserIdByEmail = async (email: string) => {
  const getUserResponse = await getUserByEmail(email);

  return getUserResponse?._id;
};

// Helper function to check if the user is enrolled in the course
const checkUserEnrollment = async (userId: ObjectId, course: string) => {
  const repo = await findUserRepositoryByCourse(course, userId);

  return !repo;
};

// Helper function to serialize repository setup steps
const serializeRepositorySetup = async (): Promise<RepositorySetup> => ({
  ...repositorySetup,
  steps: await Promise.all(
    repositorySetup.steps.map(async (step) => {
      if (typeof step.code !== "string") {
        console.error("Code must be of type 'string'");

        throw new Error("Code must be of type 'string'");
      }

      return {
        ...step,
        code: <MDXRemote components={MDXComponents} source={step.code} />,
      };
    }),
  ),
});

const SetupPage = async ({ params }: { params: { course: string } }) => {
  const { course } = params;

  const email = await authenticateUser(course);
  if (!email) {
    return null;
  }

  const userId = await getUserIdByEmail(email);
  if (!userId) {
    throw new Error("User not found");
  }

  const hasEnrolled = await checkUserEnrollment(userId, course);
  if (!hasEnrolled) {
    return redirect(`/courses/${course}/lesson/1/chapter/1`);
  }

  const serializedRepositorySetup = await serializeRepositorySetup();

  return (
    <Box maxW="6xl" mx="auto" px={[4, 12]}>
      <Navbar cta={false} />
      <StepsComponent
        courseSlug={course}
        questions={questionsData}
        repositorySetup={serializedRepositorySetup}
        startingLessonUrl={`/courses/${course}/lesson/1/chapter/1`}
      />
    </Box>
  );
};

export default SetupPage;

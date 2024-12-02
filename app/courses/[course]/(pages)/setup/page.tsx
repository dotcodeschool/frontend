import { Box, Text } from "@chakra-ui/react";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import rehypeMdxCodeProps from "rehype-mdx-code-props";
import { ErrorBoundary } from "react-error-boundary";

import { auth } from "@/auth";
import { MDXComponents, Navbar } from "@/components";
import {
  findUserRepositoryByCourse,
  getCourseFromDb,
  getUserByEmail,
} from "@/lib/api";
import { questions as questionsData } from "@/lib/db/data";
import { handleSignIn } from "@/lib/middleware/actions";
import { RepositorySetup } from "@/lib/types";

import { StepsComponent } from "./components/StepsComponent";

// TODO: Move helper functions to ./helpers/index.ts

// Helper function to authenticate the user and get their ID
const authenticateUserAndGetId = async (course: string) => {
  const session = await auth();
  console.log("[setup] authenticateUserAndGetId session", session);
  if (!session?.user?.email) {
    await handleSignIn({
      redirectTo: `/courses/${course}/setup`,
    });

    return null;
  }

  try {
    const user = await getUserByEmail(session.user.email);
    // Only redirect to sign in if user truly doesn't exist
    // Not if we got a DB error
    if (user === null) {
      await handleSignIn({
        redirectTo: `/courses/${course}/setup`,
      });

      return null;
    }

    return user._id;
  } catch (error) {
    // Log the error but don't redirect on DB errors
    console.error("Database error:", error);

    return null;
  }
};

// Helper function to serialize repository setup steps
const serializeRepositorySetup = async (
  repositorySetup: RepositorySetup,
): Promise<RepositorySetup> => ({
  ...repositorySetup,
  steps: await Promise.all(
    repositorySetup.steps.map(async (step) => {
      if (typeof step.code !== "string") {
        console.error("Code must be of type 'string'");

        throw new Error("Code must be of type 'string'");
      }

      return {
        ...step,
        code: (
          <MDXRemote
            components={MDXComponents}
            options={{
              mdxOptions: {
                rehypePlugins: [rehypeMdxCodeProps],
              },
            }}
            source={step.code}
          />
        ),
      };
    }),
  ),
});

const SetupPage = async ({ params }: { params: { course: string } }) => {
  const { course } = params;
  console.log("[setup] Course param:", course);

  const userId = await authenticateUserAndGetId(course);
  if (!userId) {
    console.log("[setup] No userId found");
    return <Text>loading...</Text>;
  }

  const courseData = await getCourseFromDb(course);
  console.log("[setup] Course data:", courseData);
  if (!courseData) {
    console.log("[setup] Course not found in database");
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

    // return notFound();
  }

  const repo = await findUserRepositoryByCourse(course, userId);

  const repositorySetup: RepositorySetup = {
    id: "repository-setup",
    kind: "repo_setup",
    title: "Repository Setup",
    description:
      "We've prepared a starter repository with some Rust code for you.",
    steps: [
      {
        title: "1. Install DotCodeSchool CLI",
        code: `\`\`\`bash
        curl -sSf https://dotcodeschool.com/install.sh | sh
        \`\`\``,
      },
      {
        title: "2. Clone the repository",
        code: `\`\`\`bash
        git clone https://git.dotcodeschool.com/${repo?.repo_name} dotcodeschool-${course}\ncd dotcodeschool-${course}
        \`\`\``,
      },
      {
        title: "3. Push an empty commit",
        code: `\`\`\`bash\ngit commit --allow-empty -m 'test'\ngit push origin master\n\`\`\``,
      },
    ],
  };

  const repoSetupContent = await serializeRepositorySetup(repositorySetup);

  return (
    <ErrorBoundary fallback={<div>Something went wrong</div>}>
      <Box maxW="6xl" mx="auto" px={[4, 12]}>
        <Navbar cta={false} />
        <StepsComponent
          courseId={courseData._id}
          courseSlug={course}
          initialRepo={repo}
          questions={questionsData}
          repositorySetup={repoSetupContent}
          startingLessonUrl={`/courses/${course}/lesson/1/chapter/1`}
          userId={userId}
        />
      </Box>
    </ErrorBoundary>
  );
};

export default SetupPage;

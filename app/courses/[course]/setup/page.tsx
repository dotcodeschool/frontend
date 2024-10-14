import { Box } from "@chakra-ui/react";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import rehypeMdxCodeProps from "rehype-mdx-code-props";

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

  const email = await authenticateUser(course);
  if (!email) {
    return null;
  }

  const userId = await getUserIdByEmail(email);
  if (!userId) {
    throw new Error("User not found");
  }

  const courseData = await getCourseFromDb(course);
  const repo = await findUserRepositoryByCourse(course, userId);

  if (!courseData) {
    return notFound();
  }

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
  );
};

export default SetupPage;

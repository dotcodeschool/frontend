import { WithId } from "mongodb";
import { Session } from "next-auth";

import { Repository } from "@/lib/db/models";
import { getUserInfo } from "@/lib/helpers";
import { PracticeFrequencyOptions, RepositorySetup } from "@/lib/types";

import { CreateRepoRequest } from "../types";

const validateAnswers = (
  answers: Record<string, boolean | PracticeFrequencyOptions>,
):
  | {
      expectedPracticeFrequency: PracticeFrequencyOptions;
      isReminderEnabled: boolean;
    }
  | Error => {
  const requiredQuestions = ["practice_frequency", "accountability"];
  const missingQuestions = requiredQuestions.filter(
    (question) => !Object.keys(answers).includes(question),
  );

  if (missingQuestions.length > 0) {
    return Error(`Missing required questions: ${missingQuestions.join(", ")}`);
  }

  const expectedPracticeFrequency = answers["practice_frequency"];
  if (typeof expectedPracticeFrequency === "boolean") {
    return Error("Invalid practice_frequency");
  }

  const isReminderEnabled = answers["accountability"];
  const invalidAccountability = typeof isReminderEnabled !== "boolean";

  if (invalidAccountability) {
    return Error("Invalid answer type");
  }

  return {
    expectedPracticeFrequency,
    isReminderEnabled,
  };
};

const getUser = async (userEmail: string) => {
  const response = await fetch("/api/get-user", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ userEmail }),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const user = await response.json();

  if (!user?._id) {
    throw new Error("User not found in database");
  }

  return user;
};

const createRepoRequest = async (req: CreateRepoRequest) => {
  const response = await fetch("/api/create-repository", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(req),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
};

const createRepository = async (
  session: Session,
  updatedAnswers: Record<string, boolean | PracticeFrequencyOptions>,
  courseSlug: string,
) => {
  const userInfo = getUserInfo(session);

  if (userInfo instanceof Error) {
    console.error("Error getting user info:", userInfo.message);

    return userInfo;
  }

  try {
    const user = await getUser(userInfo.email);
    const validatedAnswers = validateAnswers(updatedAnswers);

    if (validatedAnswers instanceof Error) {
      throw validatedAnswers;
    }

    const { expectedPracticeFrequency, isReminderEnabled } = validatedAnswers;

    const req: CreateRepoRequest = {
      repoTemplate: courseSlug,
      userId: user._id,
      expectedPracticeFrequency,
      isReminderEnabled,
    };

    return await createRepoRequest(req);
  } catch (error) {
    console.error("Error in createRepository:", error);

    throw error;
  }
};

const generateRepositorySetup = (
  repo: WithId<Repository>,
  courseSlug: string,
): RepositorySetup => ({
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
        git clone https://git.dotcodeschool.com/${repo.repo_name} dotcodeschool-${courseSlug}
        cd dotcodeschool-${courseSlug}
        \`\`\``,
    },
    {
      title: "3. Push an empty commit",
      code: `\`\`\`bash
      git commit --allow-empty -m 'test'
      git push origin master
      \`\`\``,
    },
  ],
});

export { createRepository, generateRepositorySetup };

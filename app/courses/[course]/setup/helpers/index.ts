import { Session } from "next-auth";

import { getUserInfo } from "@/lib/helpers";
import { PracticeFrequencyOptions } from "@/lib/types";

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

const createRepository = async (
  session: Session,
  updatedAnswers: Record<string, boolean | PracticeFrequencyOptions>,
  courseSlug: string,
) => {
  const userInfo = getUserInfo(session);

  if (userInfo instanceof Error) {
    return userInfo;
  }

  const data = await fetch("/api/get-user", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      userEmail: userInfo.email,
    }),
  });

  const user = await data.json();

  if (!user?._id) {
    return Error("User not found in database");
  }

  const validatedAnswers = validateAnswers(updatedAnswers);

  if (validatedAnswers instanceof Error) {
    return validatedAnswers;
  }

  const { expectedPracticeFrequency, isReminderEnabled } = validatedAnswers;

  const req: CreateRepoRequest = {
    repoTemplate: courseSlug,
    userId: user._id,
    expectedPracticeFrequency,
    isReminderEnabled,
  };

  const response = await fetch(`/api/create-repository`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(req),
  });

  if (response.status === 200) {
    // TODO: Update the user's repositories
    console.log(response);
  } else {
    // TODO: add proper error handling to provide user feedback
    console.error("Failed to create repository");
  }
};

export { createRepository };

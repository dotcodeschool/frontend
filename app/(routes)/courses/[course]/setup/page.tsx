import Navbar from "@/app/ui/components/navbar";
import { Box } from "@chakra-ui/react";
import { auth } from "@/auth";
import { handleSignIn } from "@/app/middleware/actions";
import { redirect } from "next/navigation";
import StepsComponent from "./components/Steps";
import { questions as questionsData } from "@/app/lib/data";
import { SetupQuestion } from "@/app/lib/types";
import { MDXRemote } from "next-mdx-remote/rsc";
import MDXComponents from "@/app/ui/components/lessons-interface/mdx-components";
import { MDXComponents as MDXComponentsType } from "mdx/types";

export default async function SetupPage({
  params,
}: {
  params: { course: string };
}) {
  const { course } = params;
  const session = await auth();
  if (!session) {
    await handleSignIn({
      redirectTo: `/courses/${course}/setup`,
    });
  }
  const hasEnrolled = false;
  if (hasEnrolled) {
    return redirect(`/courses/${course}/lesson/1/chapter/1`); // TODO: this should redirect to the last lesson the user was on or the first lesson if they haven't started
  }
  // convert the code in steps array in questions data's isCustom to serialized code
  const questions: SetupQuestion[] = await Promise.all(
    questionsData.map(async (question) => {
      if (question.isCustom) {
        return {
          ...question,
          steps: await Promise.all(
            question.steps.map(async (step) => {
              return {
                ...step,
                code: (
                  <MDXRemote
                    source={step.code}
                    components={MDXComponents as Readonly<MDXComponentsType>}
                  />
                ),
              };
            }),
          ),
        };
      }
      return question;
    }),
  );
  return (
    <Box maxW="6xl" mx="auto" px={[4, 12]}>
      <Navbar cta={false} />
      <StepsComponent
        questions={questions}
        startingLessonUrl={`/courses/${course}/lesson/1/chapter/1`}
      />
    </Box>
  );
}

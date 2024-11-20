import { Box, HStack } from "@chakra-ui/react";
import { isEmpty } from "lodash";
import { MDXRemote } from "next-mdx-remote/rsc";
import rehypeMdxCodeProps from "rehype-mdx-code-props";

import { MDXComponents, Navbar } from "@/components";

import { getLessonPageData } from "../helpers";

import { ProgressMarker } from "./ProgressMarker";
import { SolutionModal } from "./SolutionModal";
import { TestLogAccordion } from "./TestLogAccordion";

const OnMachineDesktopView = ({
  courseSlug,
  lessonPageData,
}: {
  courseSlug: string;
  lessonPageData: Awaited<ReturnType<typeof getLessonPageData>>;
}) => {
  const isSolutionEmpty = isEmpty(lessonPageData.solution);

  return (
    <Box display={{ base: "none", md: "block" }}>
      <Navbar
        cta={false}
        feedbackUrl={lessonPageData.feedbackUrl}
        isLessonInterface={true}
      />
      <Box
        h={["fit-content", "calc(100vh - 140px)"]}
        key={1}
        mr={1}
        overflowY="auto"
        pt={6}
        px={[6, 12]}
        sx={{
          overflowX: "auto",
          height: "100%",
          "::-webkit-scrollbar": {
            width: "2px",
          },
          ":hover::-webkit-scrollbar-thumb": { background: "whiteAlpha.300" },
        }}
      >
        <Box maxW="4xl" mx="auto">
          <MDXRemote
            components={MDXComponents}
            options={{
              mdxOptions: {
                rehypePlugins: [rehypeMdxCodeProps],
              },
            }}
            source={lessonPageData.lessonData.content ?? ""}
          />
          <TestLogAccordion courseSlug={courseSlug} didTestPass={true} />

          {isSolutionEmpty ? null : (
            <HStack justify="center" mt={6} spacing={4}>
              <SolutionModal
                solution={lessonPageData.solution}
                template={lessonPageData.startingFiles}
              />
            </HStack>
          )}
          <ProgressMarker />
        </Box>
      </Box>
    </Box>
  );
};

export { OnMachineDesktopView };

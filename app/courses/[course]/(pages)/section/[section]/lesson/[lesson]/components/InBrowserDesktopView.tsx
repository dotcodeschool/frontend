import { Box } from "@chakra-ui/react";

import { Navbar } from "@/components";
import { MDXBundlerRenderer } from "@/components/mdx-bundler-renderer";

import { EditorComponents } from "./EditorComponents";

type LessonPageDataProps = {
  lessonPageData: {
    startingFiles: any[];
    lessonData: {
      content?: string;
    };
    readOnly?: boolean;
    feedbackUrl: string;
    solution: any[];
  };
};

const InBrowserDesktopView = ({ lessonPageData }: LessonPageDataProps) => (
  <Box display={{ base: "none", md: "block" }}>
    <Navbar
      cta={false}
      feedbackUrl={lessonPageData.feedbackUrl}
      isLessonInterface={true}
    />
    <EditorComponents
      editorContent={lessonPageData.startingFiles}
      mdxContent={
        lessonPageData.lessonData.content ? (
          <MDXBundlerRenderer code={lessonPageData.lessonData.content} />
        ) : null
      }
      readOnly={lessonPageData.readOnly}
      showHints={!lessonPageData.readOnly}
      solution={lessonPageData.solution}
    />
  </Box>
);

export { InBrowserDesktopView };

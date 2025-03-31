import { Box } from "@chakra-ui/react";
import { MDXBundlerRenderer } from "@/components/mdx-bundler-renderer";

import { Navbar } from "@/components";
import { EditorComponents } from "./EditorComponents";

const InBrowserDesktopView = ({ lessonPageData }: any) => (
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
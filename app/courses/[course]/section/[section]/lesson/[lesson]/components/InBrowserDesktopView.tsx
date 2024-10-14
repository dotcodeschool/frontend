import { Box } from "@chakra-ui/react";
import { MDXRemote } from "next-mdx-remote/rsc";
import rehypeMdxCodeProps from "rehype-mdx-code-props";

import { MDXComponents, Navbar } from "@/components";

import { getLessonPageData } from "../helpers";

import { EditorComponents } from "./EditorComponents";

const InBrowserDesktopView = ({
  lessonPageData,
}: {
  lessonPageData: Awaited<ReturnType<typeof getLessonPageData>>;
}) => (
  <Box display={{ base: "none", md: "block" }}>
    <Navbar
      cta={false}
      feedbackUrl={lessonPageData.feedbackUrl}
      isLessonInterface={true}
    />
    <EditorComponents
      editorContent={lessonPageData.startingFiles}
      mdxContent={
        <MDXRemote
          components={MDXComponents}
          options={{
            mdxOptions: {
              rehypePlugins: [rehypeMdxCodeProps],
            },
          }}
          source={lessonPageData.lessonData.content ?? ""}
        />
      }
      readOnly={lessonPageData.readOnly}
      showHints={!lessonPageData.readOnly}
      solution={lessonPageData.solution}
    />
  </Box>
);

export { InBrowserDesktopView };

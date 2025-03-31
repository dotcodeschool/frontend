import { Grid, GridItem } from "@chakra-ui/react";
import { MDXBundlerRenderer } from "@/components/mdx-bundler-renderer";

import { EditorComponents } from "./EditorComponents";

const InBrowserMobileView = ({ lessonPageData }:any) => (
  <Grid
    display={{ base: "block", md: "none" }}
    gap={1}
    pb={24}
    templateColumns="repeat(12, 1fr)"
  >
    <GridItem colSpan={[12, 5]} overflowY="auto" pt={4} px={6}>
      {lessonPageData.lessonData.content ? (
        <MDXBundlerRenderer code={lessonPageData.lessonData.content} />
      ) : null}
    </GridItem>
    <GridItem colSpan={[12, 7]} overflow="clip">
      <EditorComponents
        editorContent={lessonPageData.startingFiles}
        readOnly={lessonPageData.readOnly}
        showHints={!lessonPageData.readOnly}
        solution={lessonPageData.solution}
      />
    </GridItem>
  </Grid>
);

export { InBrowserMobileView };
import { Grid, GridItem } from "@chakra-ui/react";
import { MDXRemote } from "next-mdx-remote/rsc";

import { MDXComponents } from "@/components";

import { getLessonPageData } from "../helpers";

import { EditorComponents } from "./EditorComponents";

const MobileView = ({
  lessonPageData,
}: {
  lessonPageData: Awaited<ReturnType<typeof getLessonPageData>>;
}) => (
  <Grid
    display={{ base: "block", md: "none" }}
    gap={1}
    pb={24}
    templateColumns="repeat(12, 1fr)"
  >
    <GridItem colSpan={[12, 5]} overflowY="auto" pt={4} px={6}>
      <MDXRemote
        components={MDXComponents}
        source={lessonPageData.lessonData.content || ""}
      />
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

export { MobileView };

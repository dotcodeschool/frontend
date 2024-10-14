import { Box } from "@chakra-ui/react";
import { MDXRemote } from "next-mdx-remote/rsc";

import { MDXComponents, Navbar } from "@/components";

import { getLessonPageData } from "../helpers";

import { ProgressMarker } from "./ProgressMarker";
import { TestLogDisplayModal } from "./TestLogDisplayModal";

const OnMachineDesktopView = ({
  lessonPageData,
}: {
  lessonPageData: Awaited<ReturnType<typeof getLessonPageData>>;
}) => (
  <Box display={{ base: "block", md: "block" }}>
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
          source={lessonPageData.lessonData.content ?? ""}
        />
        <TestLogDisplayModal />
        <ProgressMarker />
      </Box>
    </Box>
  </Box>
);

export { OnMachineDesktopView };

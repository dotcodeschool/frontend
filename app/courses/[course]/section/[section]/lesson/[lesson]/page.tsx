import "@/styles/resizer.css";

import { Box } from "@chakra-ui/react";

import { BottomNavbar } from "./components";
import { IconButtonFeedback } from "./components/IconButtonFeedback";
import { InBrowserDesktopView } from "./components/InBrowserDesktopView";
import { InBrowserMobileView } from "./components/InBrowserMobileView";
import { getLessonPageData } from "./helpers";

export { generateMetadata } from "./metadata";

const LessonPage = async ({
  params,
}: {
  params: { course: string; section: string; lesson: string };
}) => {
  const lessonPageData = await getLessonPageData(params);

  return (
    <Box
      h="100vh"
      overflow={{ base: "auto", md: "hidden" }}
      position="relative"
    >
      <Box>
        <IconButtonFeedback url={lessonPageData.feedbackUrl} />
        <InBrowserDesktopView lessonPageData={lessonPageData} />
        <InBrowserMobileView lessonPageData={lessonPageData} />
      </Box>
      <BottomNavbar
        chapterId={params.lesson}
        courseId={params.course}
        current={`${params.course}/section/${params.section}/lesson/${params.lesson}`}
        next={lessonPageData.next}
        prev={lessonPageData.prev}
        sectionIndex={parseInt(params.section) - 1}
        sections={lessonPageData.sections}
      />
    </Box>
  );
};

export default LessonPage;

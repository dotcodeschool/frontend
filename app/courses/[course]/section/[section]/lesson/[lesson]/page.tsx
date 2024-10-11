import "@/styles/resizer.css";

import { Box } from "@chakra-ui/react";

import { BottomNavbar } from "./components";
import { DesktopView } from "./components/DesktopView";
import { IconButtonFeedback } from "./components/IconButtonFeedback";
import { MobileView } from "./components/MobileView";
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
        <DesktopView lessonPageData={lessonPageData} />
        <MobileView lessonPageData={lessonPageData} />
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

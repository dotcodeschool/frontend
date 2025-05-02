import "@/styles/resizer.css";

import { Box, Flex } from "@chakra-ui/react";
import { Suspense } from "react";
import { bundleMdxContent } from "@/lib/mdx-bundle";

import { BottomNavbar } from "./components";
import { IconButtonFeedback } from "./components/IconButtonFeedback";
import { InBrowserDesktopView } from "./components/InBrowserDesktopView";
import { InBrowserMobileView } from "./components/InBrowserMobileView";
import { OnMachineDesktopView } from "./components/OnMachineDesktopView";
import { LessonSkeleton } from "./components/LessonSkeleton";
import { getLessonPageData } from "./helpers";

export { generateMetadata } from "./metadata";

const LessonPage = async ({
  params,
}: {
  params: { course: string; section: string; lesson: string };
}) => {
  try {
    const rawLessonPageData = await getLessonPageData(params);

    // Process the MDX content using the bundler
    let bundledMdxCode = "";
    if (rawLessonPageData.lessonData.content) {
      try {
        const result = await bundleMdxContent(
          rawLessonPageData.lessonData.content,
        );
        bundledMdxCode = result.code;
      } catch (error) {
        console.error("Error bundling lesson MDX:", error);
        // Provide fallback content if bundling fails
        bundledMdxCode = "";
      }
    }

    // Prepare data for client components
    const lessonPageData = {
      ...rawLessonPageData,
      lessonData: {
        ...rawLessonPageData.lessonData,
        content: bundledMdxCode,
      },
      // Serialize MongoDB objects to plain objects for client components
      startingFiles: JSON.parse(
        JSON.stringify(rawLessonPageData.startingFiles),
      ),
      solution: JSON.parse(JSON.stringify(rawLessonPageData.solution)),
      sections: JSON.parse(JSON.stringify(rawLessonPageData.sections)),
    };

    const renderContent = () => {
      if (lessonPageData.format === "inBrowserCourse") {
        return (
          <>
            <InBrowserDesktopView lessonPageData={lessonPageData} />
            <InBrowserMobileView lessonPageData={lessonPageData} />
          </>
        );
      } else {
        return (
          <OnMachineDesktopView
            courseSlug={params.course}
            lessonPageData={lessonPageData}
            sectionId={params.section}
            lessonId={params.lesson}
          />
        );
      }
    };

    return (
      <Box
        h="100vh"
        overflow={{ base: "auto", md: "hidden" }}
        position="relative"
      >
        <Box>
          <IconButtonFeedback url={lessonPageData.feedbackUrl} />
          <Suspense fallback={<LessonSkeleton />}>{renderContent()}</Suspense>
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
  } catch (error) {
    console.error("Error loading lesson:", error);
    return <LessonSkeleton />;
  }
};

export default LessonPage;

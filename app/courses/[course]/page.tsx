import React from "react";
import { Suspense } from "react";

import Navbar from "@/app/ui/components/navbar";
import { Box, Link } from "@chakra-ui/react";
import { TypeCourseModuleFields } from "@/app/lib/types/contentful";
import { IoArrowBack } from "react-icons/io5";
import CourseContent from "./components/CourseContent";
import { getCourseData } from "@/app/lib/utils";
import CourseContentSkeleton from "./components/CourseContentSkeleton";

const CoursePage = async ({ params }: { params: { course: string } }) => {
  const courseData: TypeCourseModuleFields = await getCourseData(params.course);

  return (
    <Box maxW="8xl" mx="auto" px={[4, 12]}>
      <Navbar cta={false} />
      <Box maxW="4xl" mx="auto">
        <Link href="/courses" color="green.500" fontSize="5xl">
          <IoArrowBack />
        </Link>
        <Suspense fallback={<CourseContentSkeleton />}>
          <CourseContent {...courseData} />
        </Suspense>
      </Box>
    </Box>
  );
};

export default CoursePage;

export async function generateMetadata({
  params,
}: {
  params: { course: string };
}) {
  const course = await getCourseData(params.course);

  return {
    title: `${course.title} | Dot Code School`,
    description: course.description.toString(),
    openGraph: {
      title: course.title.toString(),
      description: course.description.toString(),
      type: "website",
      url: `https://dotcodeschool.com/courses/${params.course}`,
    },
    twitter: {
      card: "summary_large_image",
      title: course.title.toString(),
      description: course.description.toString(),
    },
  };
}

import React from "react";
import { Suspense } from "react";
import { notFound } from "next/navigation";

import Navbar from "@/app/ui/components/navbar";
import { Box, Link } from "@chakra-ui/react";
import { getContentByType } from "@/app/api/get-content/route";
import {
  TypeCourseModuleFields,
  TypeCourseModuleSkeleton,
} from "@/app/lib/types/contentful";
import { isNil } from "lodash";
import { Entry } from "contentful";
import { IoArrowBack } from "react-icons/io5";
import CourseContent from "./components/CourseContent";

const CoursePage = async ({ params }: { params: { course: string } }) => {
  const courseData: TypeCourseModuleFields = await getCourseData(params.course);

  return (
    <Box maxW="8xl" mx="auto" px={[4, 12]}>
      <Navbar cta={false} />
      <Box maxW="4xl" mx="auto">
        <Link href="/courses" color="green.500" fontSize="5xl">
          <IoArrowBack />
        </Link>
        <Suspense fallback={<div>Loading course content...</div>}>
          <CourseContent {...courseData} />
        </Suspense>
      </Box>
    </Box>
  );
};

async function getCourseData(
  courseSlug: string,
): Promise<TypeCourseModuleFields> {
  const res = await getContentByType<TypeCourseModuleSkeleton>("courseModule");
  const entry = res.items.find((item) => item.fields.slug === courseSlug);

  if (isNil(entry)) {
    notFound();
  } else {
    const typedEntry = entry as Entry<TypeCourseModuleSkeleton>;

    return typedEntry.fields as unknown as TypeCourseModuleFields;
  }
}

export default CoursePage;

export async function generateMetadata({
  params,
}: {
  params: { course: string };
}) {
  const courseData = await getCourseData(params.course);

  return {
    title: `${courseData.moduleName} | Dot Code School`,
    description: courseData.moduleDescription.toString(),
    openGraph: {
      title: courseData.moduleName.toString(),
      description: courseData.moduleDescription.toString(),
      type: "website",
      url: `https://dotcodeschool.com/courses/${params.course}`,
    },
    twitter: {
      card: "summary_large_image",
      title: courseData.moduleName.toString(),
      description: courseData.moduleDescription.toString(),
    },
  };
}

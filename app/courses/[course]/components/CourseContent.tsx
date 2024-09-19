import { Accordion, Box, Heading, Text } from "@chakra-ui/react";
import { notFound } from "next/navigation";
import React from "react";

import { ButtonPrimary } from "@/components";
import { isSectionArray } from "@/lib/helpers";

import { getCourseDetails } from "../helpers";
import { QUERY_COURSE_OVERVIEW_FIELDS } from "../queries";
import { CourseDetails } from "../types";

import { CourseHeader } from "./CourseHeader";
import { ModuleItem, ModuleList } from "./modules";

const getStartCourseUrl = (format: string | null, slug: string) => {
  const setupUrl = `/courses/${slug}/setup`;
  const lessonsUrl = `/courses/${slug}/lesson/1/chapter/1`;
  const isOnMachineCourse = format === "onMachineCourse";
  const hasEnrolled = false;

  return isOnMachineCourse && !hasEnrolled ? setupUrl : lessonsUrl;
};

const CourseContent = async ({ slug }: { slug: string }) => {
  const courseDetails = await getCourseDetails(
    slug,
    QUERY_COURSE_OVERVIEW_FIELDS,
  );

  if (!courseDetails) {
    return notFound();
  }

  const { sectionsCollection, format }: CourseDetails = courseDetails;
  const sections = sectionsCollection?.items;

  if (!sections || !isSectionArray(sections)) {
    return notFound();
  }

  const startCourseUrl = getStartCourseUrl(format ?? null, slug);

  return (
    <Box maxW="4xl" mx="auto">
      <CourseHeader {...courseDetails} />
      <ButtonPrimary as="a" href={startCourseUrl} mt={8} px={12} size="lg">
        Start
      </ButtonPrimary>
      <ModuleList sections={sections} />
      <Heading as="h2" fontWeight="800" my={8} size="lg">
        Course Content
      </Heading>
      <Text color="gray.400" fontWeight="500" mb={8} mt={4}>
        {sections.length} sections
      </Text>
      <Accordion allowToggle>
        {sections.map((module, index) => (
          <ModuleItem
            index={index}
            isOnMachineCourse={format === "onMachineCourse"}
            key={index}
            module={module}
            slug={slug}
          />
        ))}
      </Accordion>
    </Box>
  );
};

export { CourseContent };

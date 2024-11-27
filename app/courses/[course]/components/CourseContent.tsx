import { Accordion, Box, Heading, Text } from "@chakra-ui/react";
import { notFound } from "next/navigation";
import React from "react";

import { auth } from "@/auth";
import { ButtonPrimary } from "@/components";
import { isSectionArray } from "@/lib/helpers";

import { getCourseDetails, getStartCourseUrl } from "../helpers";
import { QUERY_COURSE_OVERVIEW_FIELDS } from "../queries";
import { CourseDetails } from "../types";

import { CourseHeader } from "./CourseHeader";
import { ModuleItem, ModuleList } from "./modules";
// eslint-disable-next-line
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

  const session = await auth();

  console.log("[CourseContent] session", session);

  const startCourseUrl = await getStartCourseUrl(
    format ?? null,
    slug,
    session ?? undefined,
  );

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

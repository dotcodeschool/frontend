import { Accordion, Box, Heading, Text } from "@chakra-ui/react";
import React from "react";

import { auth } from "@/auth";
import { ButtonPrimary } from "@/components";

import { getMdxCourseDetails } from "../helpers/getMdxCourseDetails";
import { CourseHeader } from "./CourseHeader";
import { MdxModuleItem } from "./modules/MdxModuleItem";

// eslint-disable-next-line
const MdxCourseContent = async ({ slug }: { slug: string }) => {
  const mdxCourse = await getMdxCourseDetails(slug);

  if (!mdxCourse) {
    return null;
  }

  const session = await auth();

  return (
    <Box maxW="4xl" mx="auto">
      <CourseHeader
        title={mdxCourse.title}
        description={mdxCourse.description}
        author={mdxCourse.author}
        level={mdxCourse.level}
        language={mdxCourse.language}
      />
      <ButtonPrimary
        as="a"
        href={`/courses/${slug}/lesson/${mdxCourse.sections[0]?.id}/${mdxCourse.sections[0]?.lessons[0]?.id}`}
        mt={8}
        px={12}
        size="lg"
      >
        Start
      </ButtonPrimary>
      <Heading as="h2" fontWeight="800" my={8} size="lg">
        Course Content
      </Heading>
      <Text color="gray.400" fontWeight="500" mb={8} mt={4}>
        {mdxCourse.sections.length} sections
      </Text>
      <Accordion allowToggle>
        {mdxCourse.sections.map((section, index) => (
          <MdxModuleItem
            key={section.id}
            index={index}
            section={section}
            slug={slug}
          />
        ))}
      </Accordion>
    </Box>
  );
};

export { MdxCourseContent };

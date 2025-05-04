import {
  Accordion,
  Box,
  Divider,
  Grid,
  GridItem,
  Heading,
  Text,
} from "@chakra-ui/react";

import { ButtonPrimary } from "@/components";

import { getMdxCourseDetails } from "../helpers/getMdxCourseDetails";
import { CourseHeader } from "./CourseHeader";
import { MdxModuleItem } from "./modules/MdxModuleItem";
import { bundleMdxContent } from "@/lib/mdx-bundle";
import { TruncatedDescription } from "./course-components/TruncatedDescription";
import { Prerequisites } from "./course-components/Prerequisites";
import { WhatYoullLearn } from "./course-components/WhatYoullLearn";
import { CourseStats } from "./course-components/CourseStats";

// Main component (server component)
const MdxCourseContent = async ({ slug }: { slug: string }) => {
  const mdxCourse = await getMdxCourseDetails(slug);

  if (!mdxCourse) {
    return null;
  }

  // Bundle the MDX content
  let bundledContent = "";
  try {
    const result = await bundleMdxContent(mdxCourse.content);
    bundledContent = result.code;
  } catch (error) {
    console.error("Error bundling MDX content:", error);
    // Provide a fallback if bundling fails
    bundledContent = `export default function MDXContent() { return <pre>${JSON.stringify(mdxCourse.content)}</pre>; }`;
  }

  return (
    <Box maxW="4xl" mx="auto">
      <CourseHeader
        title={mdxCourse.title}
        description={mdxCourse.description}
        author={mdxCourse.author}
        level={mdxCourse.level}
        language={mdxCourse.language}
      />

      {/* Start button */}
      <ButtonPrimary
        as="a"
        href={`/courses/${slug}/lesson/${mdxCourse.sections[0]?.id}/${mdxCourse.sections[0]?.lessons[0]?.id}`}
        my={8}
        px={12}
        size="lg"
        width={{ base: "100%", md: "auto" }}
      >
        Start Course
      </ButtonPrimary>

      {/* Course stats */}
      <CourseStats
        sections={mdxCourse.sections}
        level={mdxCourse.level}
        prerequisites={mdxCourse.prerequisites}
        estimatedTime={mdxCourse.estimated_time}
      />

      {/* Truncated description and What You'll Learn side by side */}
      <Grid templateColumns={{ base: "1fr", md: "2fr 1fr" }} gap={6} my={12}>
        <GridItem>
          {/* Truncated description (client component) */}
          <TruncatedDescription
            content={mdxCourse.content}
            bundledContent={bundledContent}
          />
        </GridItem>
        <GridItem>
          <WhatYoullLearn whatYoullLearn={mdxCourse.whatYoullLearn} />
          {/* Prerequisites section below What You'll Learn */}
          {mdxCourse.prerequisites && mdxCourse.prerequisites.length > 0 && (
            <Box mb={6}>
              <Prerequisites prerequisites={mdxCourse.prerequisites} />
            </Box>
          )}
        </GridItem>
      </Grid>

      <Divider my={8} />

      {/* Course content section */}
      <Heading as="h2" fontWeight="800" my={8} size="lg">
        Course Content
      </Heading>
      <Text color="gray.400" fontWeight="500" mb={8} mt={4}>
        {mdxCourse.sections.length} sections •{" "}
        {mdxCourse.sections.reduce(
          (total, section) => total + section.lessons.length,
          0,
        )}{" "}
        lessons
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

import { Box, Link } from "@chakra-ui/react";
import React from "react";
import { IoArrowBack } from "react-icons/io5";
import fs from "fs";
import path from "path";

import { Navbar } from "@/components";

import { CourseContent } from "./components/CourseContent";
import { CourseContentSkeleton } from "./components/CourseContentSkeleton";
import { DelayedContentSwitch } from "./components/DelayedContentSwitch";
import { MdxCourseContent } from "./components/MdxCourseContent";

export { generateMetadata } from "./metadata";

const CoursePage = ({ params: { course } }: { params: { course: string } }) => {
  // Check if this is a local MDX course
  const mdxCourseExists = fs.existsSync(
    path.join(process.cwd(), "content/courses", course),
  );

  return (
    <Box maxW="8xl" mx="auto" px={[4, 12]}>
      <Navbar cta={false} />
      <Box maxW="4xl" mx="auto">
        <Link color="green.500" fontSize="5xl" href="/courses">
          <IoArrowBack />
        </Link>

        {mdxCourseExists ? (
          // Render MDX course content directly
          <MdxCourseContent slug={course} />
        ) : (
          // DelayedContentSwitch keeps the skeleton visible until content is fully ready
          <DelayedContentSwitch loadingComponent={<CourseContentSkeleton />}>
            <CourseContent slug={course} />
          </DelayedContentSwitch>
        )}
      </Box>
    </Box>
  );
};

export default CoursePage;

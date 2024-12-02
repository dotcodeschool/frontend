import { Box, Link } from "@chakra-ui/react";
import React, { Suspense } from "react";
import { IoArrowBack } from "react-icons/io5";

import { Navbar } from "@/components";

import { CourseContent } from "./components/CourseContent";
import { CourseContentSkeleton } from "./components/CourseContentSkeleton";

export { generateMetadata } from "./metadata";

const CoursePage = ({ params: { course } }: { params: { course: string } }) => {
  console.log("CoursePage", course);
  return (
    <Box maxW="8xl" mx="auto" px={[4, 12]}>
      <Navbar cta={false} />
      <Box maxW="4xl" mx="auto">
        <Link color="green.500" fontSize="5xl" href="/courses">
          <IoArrowBack />
        </Link>
        <Suspense fallback={<CourseContentSkeleton />}>
          <CourseContent slug={course} />
        </Suspense>
      </Box>
    </Box>
  );
};

export default CoursePage;

import { Box, Link } from "@chakra-ui/react";
import React from "react";
import { IoArrowBack } from "react-icons/io5";
import fs from "fs";
import path from "path";
import { notFound } from "next/navigation";

import { Navbar } from "@/components";
import { MdxCourseContent } from "./components/MdxCourseContent";

export { generateMetadata } from "./metadata";

const CoursePage = ({ params: { course } }: { params: { course: string } }) => {
  const mdxCourseExists = fs.existsSync(
    path.join(process.cwd(), "content/courses", course),
  );

  if (!mdxCourseExists) {
    return notFound();
  }

  return (
    <Box maxW="8xl" mx="auto" px={[4, 12]}>
      <Navbar cta={false} />
      <Box maxW="4xl" mx="auto">
        <Link color="green.500" fontSize="5xl" href="/courses">
          <IoArrowBack />
        </Link>
        <MdxCourseContent slug={course} />
      </Box>
    </Box>
  );
};

export default CoursePage;

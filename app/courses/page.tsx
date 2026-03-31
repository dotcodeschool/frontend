import { Box, Heading, Link } from "@chakra-ui/react";
import { IoArrowBack } from "react-icons/io5";

import { Navbar } from "@/components";

import { getCourseCatalog } from "./helpers";
import { CourseCard } from "./components/CourseCard";

export { generateMetadata } from "./metadata";

const CoursesPage = async () => {
  const courses = await getCourseCatalog();

  return (
    <Box maxW="8xl" mx="auto" px={[4, 12]}>
      <Navbar
        cta={false}
        navLinks={[{ label: "Articles", href: "/articles" }]}
      />
      <Box maxW="4xl" mx="auto">
        <Link color="green.500" fontSize="5xl" href="/">
          <IoArrowBack />
        </Link>
        <Heading as="h1" fontWeight="800" my={4} size="xl">
          Courses
        </Heading>
        {courses.map((course, index) => (
          <CourseCard
            key={course.slug}
            index={index}
            title={course.title || ""}
            description={course.description || ""}
            level={course.level || ""}
            language={course.language || ""}
            slug={course.slug || ""}
            isLastItem={index === courses.length - 1}
          />
        ))}
      </Box>
    </Box>
  );
};

export default CoursesPage;

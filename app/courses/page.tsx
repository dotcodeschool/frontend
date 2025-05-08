import { Box, Heading, Link } from "@chakra-ui/react";
import { IoArrowBack } from "react-icons/io5";

import { Navbar } from "@/components";
import { CourseOverview } from "@/lib/types";

import { getCourseCatalog } from "./helpers";
import { CourseCard } from "./components/CourseCard";

// Extended CourseOverview type with formats information
interface ExtendedCourseOverview extends CourseOverview {
  formats?: {
    hasInBrowser: boolean;
    hasOnMachine: boolean;
    inBrowserSlug?: string;
    onMachineSlug?: string;
  };
}

export { generateMetadata } from "./metadata";

const CoursesPage = async () => {
  // Get courses from both Contentful and local MDX files
  const allCourses: Array<ExtendedCourseOverview> = await getCourseCatalog();

  // Log the courses for debugging
  console.log(
    "All courses:",
    allCourses.map((course) => course.slug),
  );

  // Define the desired ordering of courses by slug
  const slugOrder = [
    "sample-course", // Our local MDX course
    "rust-state-machine",
    "substrate-kitties",
    "papi-intro-tutorial",
  ];

  // Sort courses according to the slugOrder array
  const courses = [...allCourses].sort((a, b) => {
    const indexA = slugOrder.indexOf(a.slug ?? "");
    const indexB = slugOrder.indexOf(b.slug ?? "");

    // Handle cases where a slug might not be in the order array
    if (indexA === -1 && indexB === -1) return 0; // Keep original order for items not in slugOrder
    if (indexA === -1) return 1; // Put items not in slugOrder at the end
    if (indexB === -1) return -1; // Put items not in slugOrder at the end

    // Sort according to the order in slugOrder
    return indexA - indexB;
  });

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
            formats={course.formats}
            isLastItem={index === courses.length - 1}
          />
        ))}
      </Box>
    </Box>
  );
};

export default CoursesPage;

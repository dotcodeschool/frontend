import {
  Box,
  Card,
  Circle,
  Flex,
  Heading,
  Link,
  Stack,
  Text,
} from "@chakra-ui/react";
import { IoArrowBack } from "react-icons/io5";

import { ButtonPrimary, Navbar } from "@/components";
import { CourseOverview } from "@/lib/types";

import { getCourseCatalog } from "./helpers";

export { generateMetadata } from "./metadata";

const CoursesPage = async () => {
  // Get courses from both Contentful and local MDX files
  const allCourses: Array<CourseOverview> = await getCourseCatalog();

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
    "intro-to-papi",
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
      <Navbar cta={false} />
      <Box maxW="4xl" mx="auto">
        <Link color="green.500" fontSize="5xl" href="/">
          <IoArrowBack />
        </Link>
        <Heading as="h1" fontWeight="800" my={4} size="xl">
          Courses
        </Heading>
        {courses.map(({ slug, title, description, level, language }, index) => (
          <Box key={slug} position="relative">
            {/* Connecting line - only show if not the last item */}
            {index < courses.length - 1 && (
              <Box
                position="absolute"
                left="32px"
                top="64px" // Start from bottom of circle
                height="calc(100% - 64px)" // Extend to next circle
                width="4px"
                bg="gray.700"
                zIndex={1}
              />
            )}
            <Flex>
              <Circle
                size="64px"
                bg="green.300"
                color="gray.900"
                fontWeight="bold"
                fontSize="xl"
                mr={4}
                zIndex={2}
                position="relative"
              >
                {index + 1}
              </Circle>
              <Card
                flex="1"
                direction={{ base: "column", md: "row" }}
                overflow="hidden"
                mb={12}
                p={8}
                borderLeft="4px"
                borderLeftColor="green.500"
              >
                <Stack>
                  <Heading as="h2" size="md">
                    {title}
                  </Heading>
                  <Text>
                    {level} • {language}
                  </Text>
                  <Text py={2}>{description}</Text>
                  <ButtonPrimary
                    mt={4}
                    as={Link}
                    href={`/courses/${slug}`}
                    _hover={{ textDecor: "none" }}
                    w="fit-content"
                  >
                    Start Course
                  </ButtonPrimary>
                </Stack>
              </Card>
            </Flex>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default CoursesPage;

import { Box, Card, Heading, Link, Stack, Text } from "@chakra-ui/react";
import { IoArrowBack } from "react-icons/io5";

import { ButtonPrimary, Navbar } from "@/components";
import { QUERY_COURSE_CATALOG, fetchGraphQL } from "@/lib/api";
import { TypeCourseModuleFields } from "@/lib/types/contentful";

export { generateMetadata } from "./metadata";

const CoursesPage = async () => {
  const courses = await fetchGraphQL<Array<TypeCourseModuleFields>>(
    QUERY_COURSE_CATALOG,
    "courseModuleCollection",
  );

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
        {courses.map((course) => (
          <Card
            direction={{ base: "column", md: "row" }}
            key={course.slug}
            my={4}
            overflow="hidden"
            p={8}
          >
            <Stack>
              <Heading as="h2" size="md">
                {course.title}
              </Heading>
              <Text>
                {course.level} • {course.language}
              </Text>
              <Text py={2}>{course.description}</Text>
              <ButtonPrimary
                _hover={{ textDecor: "none" }}
                as={Link}
                href={`/courses/${course.slug}`}
                mt={4}
                w="fit-content"
              >
                Start Course
              </ButtonPrimary>
            </Stack>
          </Card>
        ))}
      </Box>
    </Box>
  );
};

export default CoursesPage;

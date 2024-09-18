import { Box, Card, Heading, Link, Stack, Text } from "@chakra-ui/react";
import { IoArrowBack } from "react-icons/io5";

import { ButtonPrimary, Navbar } from "@/components";
import { QUERY_COURSE_CATALOG, fetchGraphQL } from "@/lib/api";
import { CourseOverview } from "@/lib/types";
import { getContentfulData } from "@/lib/api/contentful";

export { generateMetadata } from "./metadata";

const CoursesPage = async () => {
  const courses: Array<CourseOverview> = await getContentfulData<
    "courseModuleCollection",
    Array<CourseOverview>
  >(QUERY_COURSE_CATALOG, "courseModuleCollection");

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
        {courses.map(({ slug, title, description, level, language }) => (
          <Card
            direction={{ base: "column", md: "row" }}
            key={slug}
            my={4}
            overflow="hidden"
            p={8}
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
                _hover={{ textDecor: "none" }}
                as={Link}
                href={`/courses/${slug}`}
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

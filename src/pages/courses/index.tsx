import Navbar from "@/components/navbar";
import PrimaryButton from "@/components/primary-button";
import { getContentByType } from "@/pages/api/get-content";
import { ArrowBackIcon } from "@chakra-ui/icons";
import {
  Box,
  Card,
  Heading,
  Link,
  Stack,
  Text,
  Circle,
  Flex,
  VStack,
} from "@chakra-ui/react";

interface Course {
  slug: string;
  title: string;
  level: string;
  language: string;
  description: string;
}

export default function CoursesPage({ courses }: { courses: Course[] }) {
  return (
    <Box maxW="8xl" mx="auto" px={[4, 12]}>
      <Navbar cta={false} />
      <Box maxW="4xl" mx="auto">
        <Link href="/" color="green.500" fontSize="5xl">
          <ArrowBackIcon />
        </Link>
        <Heading as="h1" size="xl" fontWeight="800" my={4}>
          Courses
        </Heading>
        <Text color="gray.400" mb={8}>
          We recommend following the order below for the best learning
          experience.
        </Text>
        <VStack spacing={0} align="stretch">
          {courses.map((course, index) => (
            <Box key={course.slug} position="relative">
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
                      {course.title}
                    </Heading>
                    <Text>
                      {course.level} • {course.language}
                    </Text>
                    <Text py={2}>{course.description}</Text>
                    <PrimaryButton
                      mt={4}
                      as={Link}
                      href={`/courses/${course.slug}`}
                      _hover={{ textDecor: "none" }}
                      w="fit-content"
                    >
                      Start Course
                    </PrimaryButton>
                  </Stack>
                </Card>
              </Flex>
            </Box>
          ))}
        </VStack>
      </Box>
    </Box>
  );
}

export async function getStaticProps() {
  const res = await getContentByType("courseModule");
  const entry = res.items.map((item) => {
    const fields = item.fields as unknown as Course;
    return fields;
  });

  // Define the desired order of slugs
  const slugOrder = [
    "rust-state-machine",
    "substrate-kitties",
    "intro-to-papi",
    "build-your-own-dex",
  ];

  // Sort the courses based on the slug order
  const sortedCourses = entry.sort((a, b) => {
    const indexA = slugOrder.indexOf(a.slug);
    const indexB = slugOrder.indexOf(b.slug);

    // If a slug is not in the order array, put it at the end
    if (indexA === -1) return 1;
    if (indexB === -1) return -1;

    return indexA - indexB;
  });

  return {
    props: {
      courses: sortedCourses,
    },
  };
}

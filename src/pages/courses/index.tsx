import Navbar from "@/components/navbar";
import PrimaryButton from "@/components/primary-button";
import { getContentByType } from "@/pages/api/get-content";
import { ArrowBackIcon } from "@chakra-ui/icons";
import { Box, Card, Heading, Link, Stack, Text } from "@chakra-ui/react";

export default function CoursesPage({ courses }: { courses: any[] }) {
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
        {courses.map((course) => (
          <Card
            key={course.slug}
            direction={{ base: "column", md: "row" }}
            overflow="hidden"
            my={4}
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
        ))}
      </Box>
    </Box>
  );
}

export async function getStaticProps() {
  const res = await getContentByType("courseModule");
  const entry = res.items.map((item) => item.fields);

  return {
    props: {
      courses: entry,
    },
  };
}

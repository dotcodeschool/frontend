import Navbar from "@/app/ui/components/navbar";
import PrimaryButton from "@/app/ui/components/primary-button";
import { Box, Card, Heading, Link, Stack, Text } from "@chakra-ui/react";
import { TypeCourseModuleFields } from "@/app/lib/types/contentful";
import { IoArrowBack } from "react-icons/io5";
import { getContentByType } from "@/app/lib/utils";

export default async function CoursesPage() {
  const data = await getContentByType("courseModule");
  const courses: TypeCourseModuleFields[] = data.items.map(
    (item) => item.fields as unknown as TypeCourseModuleFields,
  );
  return (
    <Box maxW="8xl" mx="auto" px={[4, 12]}>
      <Navbar cta={false} />
      <Box maxW="4xl" mx="auto">
        <Link href="/" color="green.500" fontSize="5xl">
          <IoArrowBack />
        </Link>
        <Heading as="h1" size="xl" fontWeight="800" my={4}>
          Courses
        </Heading>
        {courses.map((course) => (
          <Card
            key={course.slug.toString()}
            direction={{ base: "column", md: "row" }}
            overflow="hidden"
            my={4}
            p={8}
          >
            <Stack>
              <Heading as="h2" size="md">
                {course.moduleName.toString()}
              </Heading>
              <Text>
                {course.level.toString()} • {course.language.toString()}
              </Text>
              <Text py={2}>{course.moduleDescription.toString()}</Text>
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

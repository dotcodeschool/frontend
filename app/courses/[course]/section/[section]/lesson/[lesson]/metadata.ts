// TODO: Update with new utils

import { getCourseDetails } from "@/app/courses/[course]/helpers";
import { QUERY_COURSE_OVERVIEW_FIELDS } from "@/app/courses/[course]/queries";
import { slugToTitle } from "@/lib/utils";

export const generateMetadata = async ({
  params,
}: {
  params: { course: string; section: string; lesson: string };
}) => {
  const { course: courseSlug, section, lesson } = params;
  const courseTitle = slugToTitle(courseSlug);
  const course = await getCourseDetails(
    courseSlug,
    QUERY_COURSE_OVERVIEW_FIELDS,
  );
  const sectionTitle = `Section`;
  const lessonTitle = `Lesson`;
  const title = `${lessonTitle} - ${sectionTitle} - ${courseTitle} | Dot Code School`;
  const description = course?.sectionsCollection?.items
    .find((value) => value?.description)
    ?.toString();

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      url: `https://dotcodeschool.com/courses`,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
};

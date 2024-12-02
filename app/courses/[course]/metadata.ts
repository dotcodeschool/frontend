import { defaultMetaDescription, defaultMetaTitle } from "@/lib/constants";

import { getCourseDetails } from "./helpers";
import { QUERY_COURSE_OVERVIEW_METADATA_FIELDS } from "../../../queries";
import { CourseMetadata } from "./types";

export const generateMetadata = async ({
  params: { course },
}: {
  params: { course: string };
}) => {
  const courseData: CourseMetadata | null = await getCourseDetails(
    course,
    QUERY_COURSE_OVERVIEW_METADATA_FIELDS,
  );

  const { title, description } = courseData ?? {
    title: defaultMetaTitle,
    description: defaultMetaDescription,
  };

  return {
    title: courseData ? `${title} | Dot Code School` : title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      url: `https://dotcodeschool.com/courses/${course}`,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
};

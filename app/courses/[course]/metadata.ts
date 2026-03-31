import { defaultMetaDescription, defaultMetaTitle } from "@/lib/constants";

import { getMdxCourseDetails } from "./helpers";

export const generateMetadata = async ({
  params: { course },
}: {
  params: { course: string };
}) => {
  const courseData = await getMdxCourseDetails(course);

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

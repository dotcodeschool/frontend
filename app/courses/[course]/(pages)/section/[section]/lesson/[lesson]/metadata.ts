import { slugToTitle } from "@/lib/utils";

import { getLessonData, getSectionData } from "./helpers";

export const generateMetadata = async ({
  params,
}: {
  params: { course: string; section: string; lesson: string };
}) => {
  const { course: courseSlug, section, lesson } = params;
  const sectionData = await getSectionData(courseSlug, parseInt(section) - 1);

  const lessonData = await getLessonData(
    courseSlug,
    parseInt(section) - 1,
    parseInt(lesson) - 1,
  );

  const courseTitle = slugToTitle(courseSlug);
  const sectionTitle = sectionData.title;
  const lessonTitle = lessonData.title;
  const title = `${lessonTitle} - ${sectionTitle} - ${courseTitle} | Dot Code School`;
  const description = sectionData.description;

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

import { ButtonPrimary } from "@/components";

const ButtonStartLesson = ({
  isOnMachineCourse,
  hasEnrolled,
  slug,
  index,
}: {
  isOnMachineCourse: boolean;
  hasEnrolled: boolean;
  slug: string;
  index: number;
}) => {
  const lessonUrl = `/courses/${slug}/lesson/${index + 1}/chapter/1`;
  const setupUrl = `/courses/${slug}/setup`;
  const url = isOnMachineCourse && !hasEnrolled ? setupUrl : lessonUrl;

  return (
    <ButtonPrimary as="a" href={url} mt={12}>
      Start Lesson
    </ButtonPrimary>
  );
};

export { ButtonStartLesson };

import { Navbar } from "@/components";

const LessonNavbar = () => (
  <Navbar
    cta={false}
    isLessonInterface
    lessonDetails={{
      courseId: course,
      lessonId: lesson,
      chapterId: chapter,
      chapters: lessons,
      githubUrl: courseData.fields.githubUrl.toString(),
    }}
  />
);

export { LessonNavbar };

// File: app/courses/[course]/section/[lesson]/lesson/[chapter].ts

const courses: EntryCollection<TypeCourseModuleSkeleton> =
  await getContentByType("courseModule");

const courseData = courses.items.find(
  (course) => course.fields.slug === params.course,
);
if (!courseData) {
  notFound();
}

// const session = await auth();

// const repo = await findRepo(course, userId)
const hasEnrolled = true; // TODO: check
if (!hasEnrolled && courseData.fields.format === "onMachineCourse") {
  redirect(`/courses/${params.course}/setup`);
}

const sections: TypeSectionFields[] = await Promise.all(
  (courseData.fields.sections as unknown as TypeSectionSkeleton[]).map(
    async (section) => {
      const lessons = await Promise.all(
        (
          section.fields.lessons as unknown as TypeLesson<"WITH_ALL_LOCALES">[]
        ).map(
          async (lesson: TypeLesson<"WITH_ALL_LOCALES">) =>
            await getContentById(lesson.sys.id),
        ),
      );

      return {
        ...section.fields,
        lessons,
      } as unknown as TypeSectionFields;
    },
  ),
);

const sectionData = sections[Number(lesson) - 1];
if (!sectionData) {
  notFound();
}

const lessons = (sectionData.lessons as unknown as TypeLessonSkeleton[]).map(
  (lesson) => lesson.fields,
);

if (!lessons) {
  notFound();
}

const lessonData: TypeLessonFields = lessons[
  Number(chapter) - 1
] as TypeLessonFields;
if (!lessonData) {
  notFound();
}

const { source, template, solution } = (
  lessonData.files as unknown as TypeFilesSkeleton
)?.fields || {
  source: [],
  template: [],
  solution: [],
};

const readOnly = isEmpty(solution) || isNil(solution);
const parsedSolution = !readOnly
  ? await Promise.all(
      (solution as unknown as Asset<"WITHOUT_LINK_RESOLUTION">[]).map((asset) =>
        fetchFile(asset.fields),
      ),
    )
  : solution;
const startingFiles = !isEmpty(source) ? source : template;
const startingFilesWithCodeAndLanguage = startingFiles
  ? await Promise.all(
      (startingFiles as unknown as Asset<"WITHOUT_LINK_RESOLUTION">[]).map(
        (asset) => fetchFile(asset.fields),
      ),
    )
  : [];

const prev: string | undefined =
  chapter === "1" && lesson === "1"
    ? undefined
    : chapter === "1"
      ? `${course}/lesson/${Number(lesson) - 1}/chapter/${size(sections[Number(lesson) - 2].lessons)}`
      : `${course}/lesson/${lesson}/chapter/${Number(chapter) - 1}`;

const next: string | undefined =
  chapter === size(sections[Number(lesson) - 1].lessons).toString() &&
  lesson === sections.length.toString()
    ? undefined
    : chapter === size(sections[Number(lesson) - 1].lessons).toString()
      ? `${course}/lesson/${Number(lesson) + 1}/chapter/1`
      : `${course}/lesson/${lesson}/chapter/${Number(chapter) + 1}`;

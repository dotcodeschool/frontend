import { MDXRemoteSerializeResult } from "next-mdx-remote";

import {
  CourseModule,
  Section,
  SectionLessonsCollection,
  TypeFile,
} from "@/lib/types";

import {
  QUERY_COURSE_OVERVIEW_FIELDS,
  QUERY_COURSE_OVERVIEW_METADATA_FIELDS,
} from "../../../../queries";

type Module = {
  id: string;
  index: number;
  title: string;
  description: MDXRemoteSerializeResult;
  numOfLessons: number;
};

type ModuleProps = {
  index: number;
  module: Section;
  slug: string;
  isOnMachineCourse: boolean;
};

type EditorContextType = {
  tabIndex: number;
  setTabIndex: React.Dispatch<React.SetStateAction<number>>;
  showDiff: boolean;
  setShowDiff: React.Dispatch<React.SetStateAction<boolean>>;
  editorContent: TypeFile[];
  setEditorContent: React.Dispatch<React.SetStateAction<TypeFile[]>>;
  toggleDiff: () => void;
};

type CourseDetails = Pick<
  CourseModule,
  | "title"
  | "description"
  | "author"
  | "level"
  | "language"
  | "format"
  | "formatData"
  | "sectionsCollection"
  | "slug"
  | "githubUrl"
>;

type CourseQuery =
  | typeof QUERY_COURSE_OVERVIEW_FIELDS
  | typeof QUERY_COURSE_OVERVIEW_METADATA_FIELDS;

type CourseMetadata = Pick<CourseModule, "title" | "description">;

type LessonIdAndTotalData = {
  lessonsCollection: Pick<SectionLessonsCollection, "items" | "total">;
};

export type {
  CourseDetails,
  CourseMetadata,
  CourseQuery,
  EditorContextType,
  LessonIdAndTotalData,
  Module,
  ModuleProps,
};

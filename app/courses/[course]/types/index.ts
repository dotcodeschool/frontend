import { MDXRemoteSerializeResult } from "next-mdx-remote";

import { CourseModule, Section, TypeFile } from "@/lib/types";

import {
  QUERY_COURSE_OVERVIEW_FIELDS,
  QUERY_COURSE_OVERVIEW_METADATA_FIELDS,
} from "../queries";

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
  numOfCompletedLessons: number;
  isOnMachineCourse: boolean;
  hasEnrolled: boolean;
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

type CourseDetails = Required<
  Omit<
    CourseModule,
    "sys" | "__typename" | "_id" | "contentfulMetadata" | "linkedFrom"
  >
>;

type CourseQuery =
  | typeof QUERY_COURSE_OVERVIEW_FIELDS
  | typeof QUERY_COURSE_OVERVIEW_METADATA_FIELDS;

type CourseMetadata = Pick<CourseModule, "title" | "description">;

export type {
  CourseDetails,
  CourseMetadata,
  CourseQuery,
  EditorContextType,
  Module,
  ModuleProps,
};

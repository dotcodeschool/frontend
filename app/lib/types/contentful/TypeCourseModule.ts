import type {
  ChainModifiers,
  Entry,
  EntryFieldTypes,
  EntrySkeletonType,
  LocaleCode,
} from "contentful";
import type { TypeAuthorSkeleton } from "./TypeAuthor";
import type { TypeLessonSkeleton } from "./TypeLesson";
import type { TypeSectionSkeleton } from "./TypeSection";

export interface TypeCourseModuleFields {
  moduleName: EntryFieldTypes.Symbol;
  author: EntryFieldTypes.EntryLink<TypeAuthorSkeleton>;
  moduleDescription: EntryFieldTypes.Text;
  level: EntryFieldTypes.Symbol<
    "Advanced" | "Beginner" | "Expert" | "Intermediate"
  >;
  language: EntryFieldTypes.Symbol<"Javascript" | "Rust" | "Typescript">;
  sections: EntryFieldTypes.Array<
    EntryFieldTypes.EntryLink<TypeLessonSkeleton | TypeSectionSkeleton>
  >;
  slug: EntryFieldTypes.Symbol;
  githubUrl: EntryFieldTypes.Symbol;
  courseType: EntryFieldTypes.Symbol<"in_browser" | "local">;
}

export type TypeCourseModuleSkeleton = EntrySkeletonType<
  TypeCourseModuleFields,
  "courseModule"
>;
export type TypeCourseModule<
  Modifiers extends ChainModifiers,
  Locales extends LocaleCode = LocaleCode,
> = Entry<TypeCourseModuleSkeleton, Modifiers, Locales>;

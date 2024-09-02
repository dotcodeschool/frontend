import type {
  ChainModifiers,
  Entry,
  EntryFieldTypes,
  EntrySkeletonType,
  LocaleCode,
} from "contentful";
import type { TypeFilesSkeleton } from "./TypeFiles";

export interface TypeLessonFields {
  lessonName: EntryFieldTypes.Symbol;
  lessonContent: EntryFieldTypes.Text;
  lessonDescription: EntryFieldTypes.Text;
  files?: EntryFieldTypes.EntryLink<TypeFilesSkeleton>;
  lessonId?: EntryFieldTypes.Integer;
  slug?: EntryFieldTypes.Symbol;
}

export type TypeLessonSkeleton = EntrySkeletonType<TypeLessonFields, "lesson">;
export type TypeLesson<
  Modifiers extends ChainModifiers,
  Locales extends LocaleCode = LocaleCode,
> = Entry<TypeLessonSkeleton, Modifiers, Locales>;

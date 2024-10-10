import { CourseModule, Query } from "./schema";

type ExtractedData<T> = T extends Array<infer U> ? U[] : T;

type QueryKey = keyof Query;

type QueryResult<T extends QueryKey> = NonNullable<Query[T]>;

type CourseOverview = Required<
  Pick<CourseModule, "slug" | "title" | "level" | "language" | "description">
>;

export type { CourseOverview, ExtractedData, QueryKey, QueryResult };

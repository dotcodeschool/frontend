import { CourseModule, Query } from "./schema";

type ExtractedData<T> = T extends Array<infer U> ? U[] : T;

type QueryKey = keyof Query;
type QueryResult<K extends QueryKey> = ExtractedData<Query[K]>;

type CourseOverview = Required<
  Pick<CourseModule, "slug" | "title" | "level" | "language" | "description">
> & {
  author?: string;
  formats?: {
    hasInBrowser: boolean;
    hasOnMachine: boolean;
    inBrowserSlug?: string;
    onMachineSlug?: string;
  };
};

export type { CourseOverview, ExtractedData, QueryKey, QueryResult };

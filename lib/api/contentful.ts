import { ExtractedData, Query, QueryKey, QueryResult } from "../types";

const getContentfulData = async <T extends QueryKey, U>(
  query: string,
  operationName: T,
  variables?: Record<string, unknown>,
  path?: string,
): Promise<U> => {
  const data = await fetchGraphQL<T>(query, variables);

  return extractData(data, operationName, path) as U;
};

const fetchGraphQL = async <T extends QueryKey>(
  query: string,
  variables?: Record<string, unknown>,
): Promise<Pick<Query, T>> => {
  const response = await fetch(
    `https://graphql.contentful.com/content/v1/spaces/${process.env.CONTENTFUL_SPACE_ID}/environments/development`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.CONTENTFUL_ACCESS_TOKEN}`,
      },
      body: JSON.stringify({ query, variables }),
      next: {
        revalidate: 3600,
      },
    },
  );

  const { data, errors } = await response.json();

  if (errors) {
    throw new Error(`GraphQL Error: ${errors[0].message}`);
  }

  return data;
};

const extractData = <T extends QueryKey>(
  data: Pick<Query, T>,
  key: T,
  path?: string,
): ExtractedData<QueryResult<T>> => {
  let result = data[key];

  if (result == null) {
    throw new Error(`No data found for key: ${key}`);
  }

  if (path) {
    result = getNestedValue(result, path);
  }

  return processResult(result);
};

const getNestedValue = (obj: unknown, path: string): unknown =>
  path.split(".").reduce((acc: any, part: string) => {
    if (acc && typeof acc === "object" && part in acc) {
      return acc[part];
    }

    throw new Error(`Invalid path: ${path}`);
  }, obj);

const processResult = <T>(result: unknown): ExtractedData<QueryResult<T>> => {
  if (isCollectionResult(result)) {
    return extractCollectionData(result);
  }

  return result as ExtractedData<QueryResult<T>>;
};

const isCollectionResult = (result: unknown): result is { items: unknown[] } =>
  result !== null &&
  typeof result === "object" &&
  "items" in result &&
  Array.isArray((result as { items: unknown[] }).items);

const extractCollectionData = <T>(result: { items: T[] }): NonNullable<T>[] =>
  result.items.filter((item): item is NonNullable<T> => item != null);

export { extractData, fetchGraphQL, getContentfulData };

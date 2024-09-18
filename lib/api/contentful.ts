import { ExtractedData, Query, QueryKey, QueryResult } from "../types";

async function getContentfulData<T extends QueryKey, U>(
  query: string,
  operationName: T,
): Promise<U> {
  const data = await fetchGraphQL(query);
  return extractData(data, operationName) as U;
}

const fetchGraphQL = async <T extends QueryKey>(
  query: string,
): Promise<Pick<Query, T>> => {
  const response = await fetch(
    `https://graphql.contentful.com/content/v1/spaces/${process.env.CONTENTFUL_SPACE_ID}/environments/development`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.CONTENTFUL_ACCESS_TOKEN}`,
      },
      body: JSON.stringify({ query }),
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

export { fetchGraphQL, getContentfulData };

const extractData = <T extends QueryKey>(
  data: Pick<Query, T>,
  key: T,
): ExtractedData<QueryResult<T>> => {
  const result = data[key];

  if (result == null) {
    throw new Error(`No data found for key: ${key}`);
  }

  if (isCollectionResult(result)) {
    return extractCollectionData(result) as ExtractedData<QueryResult<T>>;
  }

  return result as ExtractedData<QueryResult<T>>;
};

const isCollectionResult = (result: any): result is { items: any[] } => {
  return "items" in result && Array.isArray(result.items);
};

const extractCollectionData = <T>(result: { items: T[] }): NonNullable<T>[] => {
  return result.items.filter((item): item is NonNullable<T> => item != null);
};

import axios from "axios";

const fetchGraphQL = async <T>(
  query: string,
  collectionName: string,
): Promise<T> => {
  const response = await axios({
    url: `https://graphql.contentful.com/content/v1/spaces/${process.env.CONTENTFUL_SPACE_ID}/environments/development`,
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.CONTENTFUL_ACCESS_TOKEN}`,
    },
    data: JSON.stringify({ query }),
  });

  const value: Promise<T> = response.data.data[collectionName].items;

  return value;
};

export { fetchGraphQL };

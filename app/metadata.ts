import { defaultMetaDescription, defaultMetaTitle } from "@/lib/constants";

export const generateMetadata = () => {
  const title = defaultMetaTitle;
  const description = defaultMetaDescription;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      url: `https://dotcodeschool.com/courses`,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
};

export const slugToTitle = (slug: string): string => {
  // Split the slug into words
  const words = slug.split("-");

  // Capitalize the first letter of each word and join them
  const title = words
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");

  return title;
};

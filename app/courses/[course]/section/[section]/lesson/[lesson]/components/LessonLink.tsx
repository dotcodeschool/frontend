import { Link, Text } from "@chakra-ui/react";

const getHoverStyles = (isCurrent: boolean) => ({
  bg: !isCurrent ? "whiteAlpha.100" : "",
  color: !isCurrent ? "white" : "",
});

const getLinkStyles = (isCurrent: boolean) => ({
  bg: isCurrent ? "whiteAlpha.200" : "",
  color: isCurrent ? "white" : "gray.300",
  fontWeight: isCurrent ? "semibold" : "",
  _hover: getHoverStyles(isCurrent),
});

const LessonLink = ({
  slug,
  current,
  lessonTitle,
}: {
  slug: string;
  current: string;
  lessonTitle: string;
}) => {
  const isCurrent = slug === current;
  const linkStyles = getLinkStyles(isCurrent);

  return (
    <Link _hover={{ textDecor: "none" }} href={`/courses/${slug}`}>
      <Text {...linkStyles} isTruncated px={8} py={2}>
        {lessonTitle}
      </Text>
    </Link>
  );
};

export { LessonLink };

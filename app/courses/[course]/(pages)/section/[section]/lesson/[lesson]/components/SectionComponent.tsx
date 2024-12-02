import {
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Icon,
  Text,
  Tooltip,
} from "@chakra-ui/react";
import { MdCode, MdNumbers } from "react-icons/md";

import { Lesson, Section } from "@/lib/types";

import { LessonLink } from "./LessonLink";

type SectionProps = {
  courseId: string;
  sectionIndex: number;
  section: Section;
  current: string;
  isActive: boolean;
};

const getButtonStyles = (isActive: boolean) => ({
  _hover: {
    bg: !isActive ? "whiteAlpha.100" : "",
    color: !isActive ? "white" : "",
  },
  fontWeight: isActive ? "bold" : "500",
});

const getIconProps = (isActive: boolean) => ({
  as: isActive ? MdCode : MdNumbers,
  color: isActive ? "green.300" : "gray.300",
  fontSize: "xl",
});

const SectionComponent = ({
  courseId,
  sectionIndex,
  section: { title, lessonsCollection },
  current,
  isActive,
}: SectionProps) => {
  if (!title) {
    console.error("Section title is missing", sectionIndex, title);

    return null;
  }

  if (!lessonsCollection?.items) {
    return null;
  }

  const lessonsArray: string[] = lessonsCollection.items
    .filter((item): item is Lesson => item !== null)
    .map(({ title }) => title ?? "");

  const buttonStyles = getButtonStyles(isActive);
  const iconProps = getIconProps(isActive);

  return (
    <AccordionItem border="none">
      <AccordionButton {...buttonStyles} py={4}>
        <Icon {...iconProps} />
        <Tooltip aria-label={title} hasArrow label={title} openDelay={750}>
          <Text flex={1} isTruncated pl={2} textAlign="left">
            {title}
          </Text>
        </Tooltip>
        <AccordionIcon />
      </AccordionButton>
      <AccordionPanel px={0}>
        {lessonsArray.map((lesson, index) => {
          const slug = `${courseId}/section/${Number(sectionIndex + 1)}/lesson/${Number(index + 1)}`;

          return (
            <LessonLink
              current={current}
              key={index}
              lessonTitle={lesson}
              slug={slug}
            />
          );
        })}
      </AccordionPanel>
    </AccordionItem>
  );
};

export { SectionComponent };

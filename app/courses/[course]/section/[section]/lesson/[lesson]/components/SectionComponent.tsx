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
  section: { title, lessons },
  current,
  isActive,
}: SectionProps) => {
  const lessonsArray = lessons.map(
    ({ fields }: { fields: TypeLessonFields }) => fields,
  );

  const buttonStyles = getButtonStyles(isActive);
  const iconProps = getIconProps(isActive);

  return (
    <AccordionItem border="none">
      <AccordionButton {...buttonStyles} py={4}>
        <Icon {...iconProps} />
        <Tooltip
          aria-label={title.toString()}
          hasArrow
          label={title.toString()}
          openDelay={750}
        >
          <Text flex={1} isTruncated pl={2} textAlign="left">
            {title.toString()}
          </Text>
        </Tooltip>
        <AccordionIcon />
      </AccordionButton>
      <AccordionPanel px={0}>
        {lessonsArray.map((lesson, index) => {
          const slug = `${courseId}/lesson/${Number(sectionIndex + 1)}/chapter/${Number(index + 1)}`;

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

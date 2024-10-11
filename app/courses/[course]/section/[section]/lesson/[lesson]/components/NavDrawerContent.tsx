import { Accordion, DrawerBody } from "@chakra-ui/react";

import { Section } from "@/lib/types";

import { SectionComponent } from "./SectionComponent";

const NavDrawerContent = ({
  sections,
  courseId,
  current,
  lessonId,
}: {
  sections: Section[];
  courseId: string;
  current: string;
  lessonId: string;
}) => (
  <DrawerBody
    px={0}
    sx={{
      "::-webkit-scrollbar": {
        width: "1px",
        borderRadius: "8px",
      },
      "::-webkit-scrollbar-thumb": {
        width: "6px",
        borderRadius: "8px",
      },
      ":hover::-webkit-scrollbar-thumb": { background: "white.700" },
    }}
  >
    <Accordion allowMultiple defaultIndex={[Number(lessonId) - 1]}>
      {sections.map((section, index) => (
        <SectionComponent
          courseId={courseId}
          current={current}
          isActive={index === Number(lessonId) - 1}
          key={index}
          section={{ ...section }}
          sectionIndex={index}
        />
      ))}
    </Accordion>
  </DrawerBody>
);

export { NavDrawerContent };

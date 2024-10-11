import { Accordion, DrawerBody } from "@chakra-ui/react";

import { Section } from "@/lib/types";

import { SectionComponent } from "./SectionComponent";

const NavDrawerContent = ({
  sections,
  courseId,
  current,
  sectionIndex,
}: {
  sections: Section[];
  courseId: string;
  current: string;
  sectionIndex: number;
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
    <Accordion allowMultiple defaultIndex={[sectionIndex]}>
      {sections.map((section, index) => (
        <SectionComponent
          courseId={courseId}
          current={current}
          isActive={index === sectionIndex}
          key={index}
          section={{ ...section }}
          sectionIndex={index}
        />
      ))}
    </Accordion>
  </DrawerBody>
);

export { NavDrawerContent };

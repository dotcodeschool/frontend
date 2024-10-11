"use client";

import {
  CheckIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  HamburgerIcon,
} from "@chakra-ui/icons";
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Button,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Flex,
  Icon,
  IconButton,
  Link,
  Text,
  Tooltip,
} from "@chakra-ui/react";
import { map } from "lodash";
import { useSession } from "next-auth/react";
import { useCallback, useEffect, useState } from "react";
import { MdCode, MdNumbers } from "react-icons/md";

import { useProgress } from "@/lib/hooks";
import { Section } from "@/lib/types";

type BottomNavbarProps = {
  courseId: string;
  lessonId: string;
  chapterId: string;
  current: string;
  prev?: string;
  next?: string;
  // sections: TypeSectionFields[];
};

const BottomNavbar = ({
  courseId,
  lessonId,
  chapterId,
  current,
  prev,
  next,
  // sections,
}: BottomNavbarProps) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const { data: session } = useSession();

  const handleDrawerOpen = () => {
    setIsDrawerOpen(true);
  };

  const handleDrawerClose = () => {
    setIsDrawerOpen(false);
  };

  // const progressData = useProgress();
  // const saveProgress = useCallback(progressData.saveProgress, []);

  // useEffect(() => {
  //   // TODO: Refactor this to a custom hook
  //   const syncProgress = async () => {
  //     if (session) {
  //       const pendingUpdates = JSON.parse(
  //         localStorage.getItem("pendingUpdates") || "[]",
  //       );
  //       pendingUpdates.forEach(
  //         (update: {
  //           courseId: string;
  //           lessonId: string;
  //           chapterId: string;
  //         }) => {
  //           saveProgress(update.courseId, update.lessonId, update.chapterId);
  //         },
  //       );
  //       localStorage.setItem("pendingUpdates", "[]");
  //     }
  //   };
  //   syncProgress();
  // }, [session, saveProgress]);

  return (
    <Box
      bg="gray.900"
      bottom={0}
      left={0}
      position="fixed"
      px={4}
      py={4}
      w="100%"
      zIndex={1000}
    >
      <Flex align="center" justify="space-between">
        <IconButton
          aria-label="Open navigation drawer"
          icon={<HamburgerIcon />}
          onClick={handleDrawerOpen}
        />

        <Flex gap={2}>
          {prev ? (
            <Button
              _hover={{ textDecor: "none", color: "green.300" }}
              as={Link}
              gap={2}
              href={`/courses/${prev}`}
              variant="ghost"
            >
              <ChevronLeftIcon fontSize={24} />
              <Text display={["none", "block"]}>Back</Text>
            </Button>
          ) : (
            ""
          )}
          {next ? (
            <Button
              _hover={{ textDecor: "none", color: "green.300" }}
              as={Link}
              gap={2}
              href={`/courses/${next}`}
              onClick={() => {
                // saveProgress(courseId, lessonId, chapterId);
              }}
              variant="ghost"
            >
              <Text display={["none", "block"]}>Next</Text>
              <ChevronRightIcon fontSize={24} />
            </Button>
          ) : (
            <Button
              _hover={{ textDecor: "none" }}
              as={Link}
              colorScheme="green"
              gap={2}
              href={`/courses/${courseId}/success`}
              mr={4}
              onClick={() => {
                // saveProgress(courseId, lessonId, chapterId);
              }}
              px={[4, 8]}
              variant="solid"
            >
              <Text display={["none", "block"]}>Finish</Text>
              <CheckIcon fontSize={16} />
            </Button>
          )}
        </Flex>
      </Flex>

      <Drawer
        isOpen={isDrawerOpen}
        onClose={handleDrawerClose}
        placement="left"
      >
        <DrawerOverlay>
          <DrawerContent>
            <DrawerCloseButton />
            <DrawerHeader>Lessons</DrawerHeader>
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
                {/* {map(sections, (section, index) => (
                  <SectionComponent
                    courseId={courseId}
                    current={current}
                    isActive={index === Number(lessonId) - 1}
                    key={index}
                    section={{ ...section }}
                    sectionIndex={index}
                  />
                ))} */}
              </Accordion>
            </DrawerBody>
          </DrawerContent>
        </DrawerOverlay>
      </Drawer>
    </Box>
  );
};

export { BottomNavbar };

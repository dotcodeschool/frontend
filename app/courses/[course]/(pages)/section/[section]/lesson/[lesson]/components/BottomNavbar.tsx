"use client";

import { HamburgerIcon } from "@chakra-ui/icons";
import {
  Box,
  Drawer,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Flex,
  IconButton,
} from "@chakra-ui/react";
import { useState } from "react";

import { Section } from "@/lib/types";

import { NavDrawerContent } from "./NavDrawerContent";
import { NavigationButtons } from "./NavigationButtons";

type BottomNavbarProps = {
  courseId: string;
  sectionIndex: number;
  chapterId: string;
  current: string;
  prev?: string;
  next?: string;
  sections: Section[];
};

const BottomNavbar = ({
  courseId,
  sectionIndex,
  current,
  prev,
  next,
  sections,
}: BottomNavbarProps) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const handleDrawerOpen = () => setIsDrawerOpen(true);
  const handleDrawerClose = () => setIsDrawerOpen(false);

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
        <NavigationButtons courseId={courseId} next={next} prev={prev} />
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
            <NavDrawerContent
              courseId={courseId}
              current={current}
              sectionIndex={sectionIndex}
              sections={sections}
            />
          </DrawerContent>
        </DrawerOverlay>
      </Drawer>
    </Box>
  );
};

export { BottomNavbar };

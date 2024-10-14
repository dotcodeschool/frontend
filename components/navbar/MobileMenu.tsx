"use client";
import { HamburgerIcon } from "@chakra-ui/icons";
import {
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  IconButton,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";

import { Logo } from "./Logo";
import { MobileUserActions } from "./MobileUserActions";
import { NavLinks } from "./NavLinks";
import { NavLink } from "./types";

const MobileMenu = ({
  navLinks,
  cta,
}: {
  navLinks: NavLink[];
  cta: boolean;
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <IconButton
        _active={{ bg: "transparent" }}
        _hover={{ bg: "transparent" }}
        aria-label="Toggle navigation"
        bg="transparent"
        color="white"
        display={{ base: "block", md: "none" }}
        icon={<HamburgerIcon />}
        onClick={isOpen ? onClose : onOpen}
      />
      <Drawer isOpen={isOpen} onClose={onClose} placement="top">
        <DrawerOverlay />
        <DrawerContent bg="gray.800" color="white">
          <DrawerCloseButton />
          <DrawerHeader>
            <Logo />
          </DrawerHeader>

          <DrawerBody>
            <VStack align="start" spacing={0}>
              <NavLinks navLinks={navLinks} />
              <MobileUserActions cta={cta} w="full" />
            </VStack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export { MobileMenu };

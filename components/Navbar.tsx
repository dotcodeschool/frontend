"use client";

import { HamburgerIcon } from "@chakra-ui/icons";
import {
  Avatar,
  Box,
  Button,
  ChakraProps,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Flex,
  HStack,
  IconButton,
  Link,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Spacer,
  Text,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";
import { map } from "lodash";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { FaPen } from "react-icons/fa";

import { handleSignIn, handleSignOut } from "@/lib/middleware/actions";
import logo from "@/public/logo.svg";

import { ButtonPrimary } from "./button-primary";
import { Lesson } from "@/lib/types";

type NavLink = {
  name: string;
  href: string;
};

const NavLinks = ({ navLinks }: { navLinks: NavLink[] }) =>
  map(navLinks, (link) => (
    <Link
      _hover={{ textDecoration: "none", bg: "gray.700" }}
      key={link.name}
      px={6}
      py={2}
      w="full"
    >
      {link.name}
    </Link>
  ));

const Logo = () => (
  <HStack _hover={{ textDecor: "none" }} as={Link} href="/">
    <Image alt="dotcodeschool" height={32} src={logo} />
    <Text fontFamily="monospace" fontSize="lg" fontWeight="semibold">
      dotcodeschool
    </Text>
  </HStack>
);

const StartCourseButton = ({ ...props }: ChakraProps) => (
  <ButtonPrimary
    _hover={{ textDecor: "none" }}
    as={Link}
    href="/courses"
    {...props}
  >
    Courses
  </ButtonPrimary>
);

type UserDetailProps = {
  name?: string;
  image?: string;
  email?: string;
};

const UserDetails = ({ name, image, email }: UserDetailProps) => (
  <HStack
    pb={{ base: 0, md: 4 }}
    pt={{ base: 0, md: 2 }}
    px={{ base: 0, md: 4 }}
  >
    <Avatar name={name} src={image} />
    <VStack align="start" spacing={0}>
      <Text fontWeight="semibold">{name}</Text>
      <Text color="gray.400" fontSize="sm" fontWeight="normal">
        {email}
      </Text>
    </VStack>
  </HStack>
);

const Auth = () => {
  const { data: session } = useSession();

  return session ? (
    <>
      <VStack
        align="start"
        display={{ base: "flex", md: "none" }}
        spacing={4}
        w="full"
      >
        <UserDetails
          email={session.user?.email || undefined}
          image={session.user?.image || undefined}
          name={session.user?.name || undefined}
        />
        <Button
          onClick={() => handleSignOut()}
          variant="outline"
          w={{ base: "full", md: "fit-content" }}
        >
          Logout
        </Button>
      </VStack>
      <Box display={{ base: "none", md: "block" }}>
        <Menu>
          <MenuButton as={Button} variant="unstyled">
            <HStack>
              <Avatar
                name={session.user?.name || undefined}
                size="sm"
                src={session.user?.image || undefined}
              />
            </HStack>
          </MenuButton>
          <MenuList>
            <UserDetails
              email={session.user?.email || undefined}
              image={session.user?.image || undefined}
              name={session.user?.name || undefined}
            />
            <hr />
            <MenuItem onClick={() => handleSignOut()}>Logout</MenuItem>
          </MenuList>
        </Menu>
      </Box>
    </>
  ) : (
    <ButtonPrimary
      onClick={() => handleSignIn()}
      px={8}
      w={{ base: "full", md: "fit-content" }}
    >
      Login
    </ButtonPrimary>
  );
};

const DrawerMenu = ({
  navLinks,
  cta,
  isOpen,
  onClose,
}: {
  navLinks: NavLink[];
  cta: boolean;
  isOpen: boolean;
  onClose: () => void;
}) => (
  <Drawer isOpen={isOpen} onClose={onClose} placement="top">
    <DrawerOverlay />
    <DrawerContent bg="gray.800" color="white">
      <DrawerCloseButton />
      <DrawerHeader>
        <Logo />
      </DrawerHeader>
      <DrawerBody px={0}>
        <VStack align="start" spacing={0}>
          {navLinks ? <NavLinks navLinks={navLinks} /> : null}
          <VStack p={6} w="full">
            {cta ? <StartCourseButton w="full" /> : <Auth />}
          </VStack>
        </VStack>
      </DrawerBody>
    </DrawerContent>
  </Drawer>
);

type IPendingUpdate = {
  courseId: string;
  lessonId: string;
  chapterId: string;
};

type NavbarProps = {
  navLinks?: NavLink[];
  cta?: boolean;
  isLessonInterface?: boolean;
  lessonDetails?: {
    courseId: string;
    lessonId: string;
    chapterId: string;
    chapters: Lesson[];
    githubUrl: string;
  };
};

const Navbar = ({
  navLinks = [],
  cta = true,
  isLessonInterface,
  lessonDetails,
}: NavbarProps) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { data: session, status } = useSession();

  if (!lessonDetails) {
    lessonDetails = {
      courseId: "",
      lessonId: "",
      chapterId: "",
      chapters: [],
      githubUrl: "",
    };
  }

  const { lessonId, chapterId, chapters, githubUrl } = lessonDetails;
  const currentChapter = chapters[Number(chapterId) - 1]?.title;

  // TODO: Move this to a custom hook
  useEffect(() => {
    if (status === "authenticated") {
      const pendingUpdates: IPendingUpdate[] = JSON.parse(
        localStorage.getItem("pendingUpdates") || "[]",
      );

      const updates = pendingUpdates.map(
        ({ courseId, lessonId, chapterId }: IPendingUpdate) => {
          const progress: Record<
            string,
            Record<string, Record<string, boolean>>
          > = JSON.parse(localStorage.getItem("progress") || "{}");
          // Update the progress
          if (!progress[courseId]) {
            progress[courseId] = {};
          }
          if (!progress[courseId][lessonId]) {
            progress[courseId][lessonId] = {};
          }
          progress[courseId][lessonId][chapterId] = true;

          return {
            user: session.user,
            progress,
          };
        },
      );

      if (pendingUpdates.length > 0) {
        fetch("/api/update-progress", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updates),
          cache: "no-store",
        })
          .then(() => {
            localStorage.removeItem("pendingUpdates");
          })
          .catch((err) => {
            console.error(err);
          });
      }
    }
  }, [status, session?.user]);

  return (
    <Flex
      align="center"
      bg={isLessonInterface ? "gray.900" : "gray.800"}
      borderBottom={isLessonInterface ? "1px solid" : "none"}
      borderBottomColor="gray.700"
      color="white"
      justify="space-between"
      position={isLessonInterface ? "sticky" : "static"}
      px={[6, 12]}
      py={2}
      top={0}
      zIndex={10}
    >
      <Logo />
      <Spacer />
      <HStack display={{ base: "none", md: "flex" }} spacing={4}>
        {navLinks && !isLessonInterface ? (
          <NavLinks navLinks={navLinks} />
        ) : null}
        {isLessonInterface ? (
          <Button
            _hover={{
              textDecoration: "none",
            }}
            as={Link}
            href={`${githubUrl}/issues/new?assignees=&labels=feedback&template=feedback.md&title=Dot+Code+School+Suggestion:+Feedback+for+Section+${lessonId}+-+Chapter+${chapterId}:+${currentChapter}`}
            isExternal
            leftIcon={<FaPen />}
            variant="outline"
            w="full"
          >
            Submit Feedback
          </Button>
        ) : null}
        {cta ? <StartCourseButton /> : <Auth />}
      </HStack>
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
      <DrawerMenu
        cta={cta}
        isOpen={isOpen}
        navLinks={navLinks}
        onClose={onClose}
      />
    </Flex>
  );
};

export { Navbar };

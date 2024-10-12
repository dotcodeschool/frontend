import {
  Button,
  Flex,
  FlexProps,
  HStack,
  Link,
  Spacer,
} from "@chakra-ui/react";
import { FaPen } from "react-icons/fa";

import { Logo } from "./Logo";
import { MobileMenu } from "./MobileMenu";
import { NavMenu } from "./NavMenu";
import { NavbarProps } from "./types";
import { UserActions } from "./UserActions";

const regularNavStyle: FlexProps = {
  bg: "gray.800",
  position: "static",
};

const lessonNavStyle: FlexProps = {
  bg: "gray.900",
  borderBottom: "1px solid",
  borderBottomColor: "gray.700",
  position: "sticky" as const,
  top: 0,
  paddingX: 4,
};

const Navbar = ({
  navLinks = [],
  cta = true,
  isLessonInterface = false,
  feedbackUrl,
}: NavbarProps) => {
  const navbarStyle = isLessonInterface ? lessonNavStyle : regularNavStyle;

  return (
    <Flex
      align="center"
      color="white"
      justify="space-between"
      py={2}
      {...navbarStyle}
      zIndex={10}
    >
      <Logo />
      <Spacer />
      <HStack display={{ base: "none", md: "flex" }} spacing={4}>
        <NavMenu isLessonInterface={isLessonInterface} navLinks={navLinks} />
        {feedbackUrl ? (
          <Button
            _hover={{
              textDecoration: "none",
            }}
            as={Link}
            href={feedbackUrl}
            isExternal
            leftIcon={<FaPen />}
            variant="outline"
            w="full"
          >
            Submit Feedback
          </Button>
        ) : null}
        <UserActions cta={cta} />
      </HStack>
      <MobileMenu cta={cta} navLinks={navLinks} />
    </Flex>
  );
};

export { Navbar };

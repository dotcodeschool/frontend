import { HStack, Link } from "@chakra-ui/react";

import { NavLink } from "./types";

type NavMenuProps = {
  isLessonInterface: boolean;
  navLinks: NavLink[];
};

const NavMenu: React.FC<NavMenuProps> = ({ isLessonInterface, navLinks }) => {
  if (isLessonInterface) {
    return null;
  }

  return (
    <HStack spacing={4}>
      {navLinks.map((link) => (
        <Link
          _hover={{ textDecoration: "underline" }}
          color="white"
          href={link.href}
          key={link.label}
        >
          {link.label}
        </Link>
      ))}
    </HStack>
  );
};

export { NavMenu };

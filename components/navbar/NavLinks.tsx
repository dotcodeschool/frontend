import { Link } from "@chakra-ui/next-js";

import { NavLink } from "./types";

const NavLinks = ({ navLinks }: { navLinks: NavLink[] }) =>
  navLinks.map((link) => (
    <Link
      _hover={{ textDecoration: "none", bg: "gray.700" }}
      href={link.href}
      key={link.label}
      px={6}
      py={2}
      w="full"
    >
      {link.label}
    </Link>
  ));

export { NavLinks };

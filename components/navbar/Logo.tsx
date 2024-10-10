import { HStack, Link, Text } from "@chakra-ui/react";
import Image from "next/image";

import logo from "@/public/logo.svg";

const Logo = () => (
  <HStack _hover={{ textDecor: "none" }} as={Link} href="/">
    <Image alt="dotcodeschool" height={32} src={logo} />
    <Text fontFamily="monospace" fontSize="lg" fontWeight="semibold">
      dotcodeschool
    </Text>
  </HStack>
);

export { Logo };

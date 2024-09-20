"use client";

import { ChakraProps } from "@chakra-ui/react";

import { ButtonPrimary } from "@/components/button-primary";
import { handleSignIn } from "@/lib/middleware/actions";

const ButtonLogin = (props: ChakraProps) => (
  <ButtonPrimary
    onClick={() => handleSignIn()}
    px={8}
    w={{ base: "full", md: "fit-content" }}
    {...props}
  >
    Login
  </ButtonPrimary>
);

export { ButtonLogin };

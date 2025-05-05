"use client";

import { Button, ChakraProps, useToast } from "@chakra-ui/react";
import { useState } from "react";
import { FaGithub } from "react-icons/fa";

import { handleSignIn } from "@/lib/middleware/actions";

const ButtonLogin = (props: ChakraProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();

  const handleLogin = async () => {
    setIsLoading(true);
    try {
      // The server action will handle the redirect
      await handleSignIn();
      // We won't reach here because of the redirect
    } catch (error) {
      // We should only reach here if there's a real error, not a redirect
      console.error(error);
      toast({
        title: "Authentication failed",
        description: "There was an error signing in. Please try again.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      setIsLoading(false);
    }
  };

  return (
    <Button
      colorScheme="green"
      leftIcon={<FaGithub />}
      onClick={handleLogin}
      isLoading={isLoading}
      loadingText="Signing in..."
      px={8}
      w={{ base: "full", md: "fit-content" }}
      boxShadow="md"
      _hover={{ transform: "translateY(-2px)", boxShadow: "lg" }}
      transition="all 0.2s"
      {...props}
    >
      Sign in
    </Button>
  );
};

export { ButtonLogin };

"use client";

import { Button, ChakraProps, MenuItem, useToast } from "@chakra-ui/react";
import { useState } from "react";
import { FaSignOutAlt } from "react-icons/fa";

import { handleSignOut } from "@/lib/middleware/actions";

const ButtonLogout = ({
  isMenu,
  ...props
}: { isMenu?: boolean } & ChakraProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();

  const handleLogout = async () => {
    setIsLoading(true);
    try {
      // The server action will handle the redirect
      await handleSignOut();
      // We won't reach here because of the redirect
    } catch (error) {
      // We should only reach here if there's a real error, not a redirect
      console.error(error);
      toast({
        title: "Logout failed",
        description: "There was an error signing out. Please try again.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      setIsLoading(false);
    }
  };

  return isMenu ? (
    <MenuItem
      onClick={handleLogout}
      icon={<FaSignOutAlt />}
      color="red"
      {...props}
    >
      Sign out
    </MenuItem>
  ) : (
    <Button
      onClick={handleLogout}
      colorScheme="red"
      variant="outline"
      leftIcon={<FaSignOutAlt />}
      isLoading={isLoading}
      loadingText="Signing out..."
      w={{ base: "full", md: "fit-content" }}
      boxShadow="sm"
      _hover={{ transform: "translateY(-2px)", boxShadow: "md" }}
      transition="all 0.2s"
      {...props}
    >
      Sign out
    </Button>
  );
};

export { ButtonLogout };

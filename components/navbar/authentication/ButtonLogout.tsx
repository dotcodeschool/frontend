"use client";

import { Button, ChakraProps, MenuItem } from "@chakra-ui/react";

import { handleSignOut } from "@/lib/middleware/actions";

const ButtonLogout = ({
  isMenu,
  ...props
}: { isMenu?: boolean } & ChakraProps) =>
  isMenu ? (
    <MenuItem onClick={() => handleSignOut()} {...props}>
      Logout
    </MenuItem>
  ) : (
    <Button
      onClick={() => {
        if (typeof window !== "undefined") {
          window.location.reload();
        }

        return handleSignOut();
      }}
      variant="outline"
      w={{ base: "full", md: "fit-content" }}
      {...props}
    >
      Logout
    </Button>
  );

export { ButtonLogout };

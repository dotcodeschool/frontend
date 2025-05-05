"use client";

import {
  Avatar,
  Box,
  Button,
  Divider,
  HStack,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Skeleton,
  SkeletonCircle,
} from "@chakra-ui/react";
import { useSession } from "next-auth/react";
import { FaUserCircle, FaCog } from "react-icons/fa";

import { getUserInfo, isUserInfoError } from "@/lib/helpers";

import { ButtonLogin, ButtonLogout } from "./authentication";
import { UserDetails } from "./UserDetails";

const UserMenu = () => {
  const { data: session, status } = useSession();

  // Show loading state while session is loading
  if (status === "loading") {
    return (
      <Box display={{ base: "none", md: "block" }}>
        <SkeletonCircle size="8" />
      </Box>
    );
  }

  const user = getUserInfo(session);

  if (isUserInfoError(user)) {
    // No need to log the error message to console as it's expected for unauthenticated users
    return (
      <Box display={{ base: "none", md: "block" }}>
        <ButtonLogin />
      </Box>
    );
  }

  const { email, image, name } = user;

  return (
    <Box display={{ base: "none", md: "block" }}>
      <Menu>
        <MenuButton
          as={Button}
          variant="unstyled"
          _hover={{ transform: "scale(1.05)" }}
          transition="all 0.2s"
        >
          <HStack>
            <Avatar name={name} size="sm" src={image} boxShadow="sm" />
          </HStack>
        </MenuButton>
        <MenuList p={0} overflow="hidden" boxShadow="lg">
          <Box px={3} py={2}>
            <UserDetails email={email} image={image} name={name} />
          </Box>
          <Divider />
          <MenuItem
            as="a"
            href="/settings"
            icon={<FaCog />}
            _hover={{ bg: "gray.100" }}
          >
            Settings
          </MenuItem>
          <ButtonLogout isMenu={true} />
        </MenuList>
      </Menu>
    </Box>
  );
};

export { UserMenu };

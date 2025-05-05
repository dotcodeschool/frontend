"use client";

import {
  HStack,
  SkeletonCircle,
  SkeletonText,
  VStack,
  Divider,
} from "@chakra-ui/react";
import { useSession } from "next-auth/react";

import { getUserInfo, isUserInfoError } from "@/lib/helpers";

import { ButtonLogin, ButtonLogout } from "./authentication";
import { UserDetails } from "./UserDetails";

const MobileUserMenu = () => {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <VStack align="start" spacing={4} w="full">
        <HStack spacing={3} w="full">
          <SkeletonCircle size="12" />
          <VStack align="start" spacing={2} flex={1}>
            <SkeletonText noOfLines={1} w="120px" />
            <SkeletonText noOfLines={1} w="180px" />
          </VStack>
        </HStack>
        <Divider />
        <SkeletonText noOfLines={1} w="100px" />
      </VStack>
    );
  }

  const user = getUserInfo(session);

  if (isUserInfoError(user)) {
    // No need to log the error message to console as it's expected for unauthenticated users
    return (
      <VStack align="start" spacing={4} w="full">
        <ButtonLogin w="full" />
      </VStack>
    );
  }

  const { email, image, name } = user;

  return (
    <VStack
      align="start"
      display={{ base: "flex", md: "none" }}
      spacing={4}
      w="full"
    >
      <UserDetails email={email} image={image} name={name} />
      <Divider />
      <ButtonLogout w="full" />
    </VStack>
  );
};

export { MobileUserMenu };

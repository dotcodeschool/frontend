import { HStack, SkeletonCircle, SkeletonText, VStack } from "@chakra-ui/react";
import { useSession } from "next-auth/react";

import { getUserInfo, isUserInfoError } from "@/lib/helpers";

import { ButtonLogin, ButtonLogout } from "./authentication";
import { UserDetails } from "./UserDetails";

// TODO: Add a loading state
const MobileUserMenu = () => {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <HStack>
        <SkeletonCircle size="10" />
        <SkeletonText noOfLines={1} w="100px" />
      </HStack>
    );
  }

  const user = getUserInfo(session);

  if (isUserInfoError(user)) {
    const errorMessage = user.message;
    console.error(errorMessage);

    return <ButtonLogin />;
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
      <ButtonLogout />
    </VStack>
  );
};

export { MobileUserMenu };

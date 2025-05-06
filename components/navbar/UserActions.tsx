"use client";

import { ChakraProps, Skeleton } from "@chakra-ui/react";
import { useSession } from "next-auth/react";

import { getUserInfo, isUserInfoError } from "@/lib/helpers";

import { ButtonLogin } from "./authentication";
import { ButtonStartCourse } from "./ButtonStartCourse";
import { UserMenu } from "./UserMenu";

const UserActions = ({
  cta = true,
  ...restProps
}: { cta: boolean } & ChakraProps) => {
  const { data: session, status } = useSession();

  // Show loading state while session is loading
  if (status === "loading") {
    return (
      <Skeleton
        height="40px"
        width={{ base: "full", md: "120px" }}
        borderRadius="md"
      />
    );
  }

  const user = getUserInfo(session);

  if (isUserInfoError(user)) {
    // Use ButtonLogin directly without Link wrapper
    // The button now handles the authentication flow
    return <ButtonLogin />;
  }

  return cta ? <ButtonStartCourse {...restProps} /> : <UserMenu />;
};

export { UserActions };

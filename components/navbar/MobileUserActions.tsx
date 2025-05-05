"use client";

import { ChakraProps } from "@chakra-ui/react";
import { useSession } from "next-auth/react";

import { getUserInfo, isUserInfoError } from "@/lib/helpers";

import { ButtonLogin } from "./authentication";
import { ButtonStartCourse } from "./ButtonStartCourse";
import { MobileUserMenu } from "./MobileUserMenu";

const MobileUserActions = ({
  cta = true,
  ...restProps
}: { cta: boolean } & ChakraProps) => {
  const { data: session } = useSession();

  // If there's no session or user info has an error, show login button
  // This ensures consistent behavior with UserActions
  if (!session) {
    return <ButtonLogin w="full" {...restProps} />;
  }

  const user = getUserInfo(session);

  if (isUserInfoError(user)) {
    return <ButtonLogin w="full" {...restProps} />;
  }

  return cta ? <ButtonStartCourse {...restProps} /> : <MobileUserMenu />;
};

export { MobileUserActions };

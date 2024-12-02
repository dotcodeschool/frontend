"use client";

import { ChakraProps } from "@chakra-ui/react";
import { useSession } from "next-auth/react";

import { getUserInfo, isUserInfoError } from "@/lib/helpers";

import { ButtonLogin } from "./authentication";
import { ButtonStartCourse } from "./ButtonStartCourse";
import { UserMenu } from "./UserMenu";
import Link from "next/link";

const UserActions = ({
  cta = true,
  ...restProps
}: { cta: boolean } & ChakraProps) => {
  const { data: session } = useSession();
  const user = getUserInfo(session);

  if (isUserInfoError(user)) {
    return (
      <Link href="/login">
        <ButtonLogin />
      </Link>
    );
  }

  return cta ? <ButtonStartCourse {...restProps} /> : <UserMenu />;
};

export { UserActions };

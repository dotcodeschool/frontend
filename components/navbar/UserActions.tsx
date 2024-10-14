import { ChakraProps } from "@chakra-ui/react";

import { auth } from "@/auth";
import { getUserInfo, isUserInfoError } from "@/lib/helpers";

import { ButtonLogin } from "./authentication";
import { ButtonStartCourse } from "./ButtonStartCourse";
import { UserMenu } from "./UserMenu";

const UserActions = async ({
  cta = true,
  ...restProps
}: { cta: boolean } & ChakraProps) => {
  const session = await auth();
  const user = getUserInfo(session);

  if (isUserInfoError(user)) {
    const errorMessage = user.message;
    console.error(errorMessage);

    return <ButtonLogin />;
  }

  return cta ? <ButtonStartCourse {...restProps} /> : <UserMenu />;
};

export { UserActions };

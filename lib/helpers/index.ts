import { Session } from "next-auth";

import { Maybe, Section, UserInfo } from "../types";

const getUserInfo = (session: Session | null): UserInfo | Error => {
  const user = session?.user;

  if (!user) {
    return Error("No user session found");
  }

  if (!user.email) {
    return Error("User email is missing");
  }

  if (!user.name) {
    return Error("User name is missing");
  }

  return {
    email: user.email,
    image: user.image ?? undefined,
    name: user.name,
  };
};

const isSectionArray = (arr: Maybe<Section>[]): arr is Section[] =>
  arr.every((item): item is Section => item !== null);

const isUserInfoError = (result: UserInfo | Error): result is Error =>
  result instanceof Error;

export { getUserInfo, isSectionArray, isUserInfoError };

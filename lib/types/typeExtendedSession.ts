import { Session } from "next-auth";

import { TypeExtendedUser } from "./typeExtendedUser";

type TypeExtendedSession = {
  user: TypeExtendedUser;
} & Session;

export type { TypeExtendedSession };

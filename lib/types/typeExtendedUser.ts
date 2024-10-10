import { User } from "next-auth";

import { TypeProgressData } from "./typeProgress";

type TypeExtendedUser = {
  progress: TypeProgressData;
} & User;

export type { TypeExtendedUser };

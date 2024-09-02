import { IProgressData } from "@/app/lib/types/IProgress";
import { Session, User } from "next-auth";

export interface ISessionExtended extends Session {
  user: IUserExtended;
}

export interface IUserExtended extends User {
  progress: IProgressData;
}

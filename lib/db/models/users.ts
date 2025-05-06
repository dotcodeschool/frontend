import { ObjectId } from "mongodb";

import { Relationship } from "@/lib/types";

export type User = {
  _id?: ObjectId;
  name?: string;
  email?: string;
  image?: string;
  emailVerified?: boolean | null;
  relationships?: {
    repositories: {
      data: Array<Relationship>;
    };
  };
  progress?: Record<string, Record<number, Record<number, boolean>>>;
  preferences?: {
    notifications: {
      milestoneAlerts: boolean;
      newCourseAlerts: boolean;
    };
  };
};

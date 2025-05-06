import { ObjectId } from "mongodb";

import { Relationship } from "@/lib/types";

export type Course = {
  _id: ObjectId;
  slug: string;
  name: string;
  tester_url: string;
  relationships: Array<Relationship>;
};

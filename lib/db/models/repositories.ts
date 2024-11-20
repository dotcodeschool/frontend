import { ObjectId } from "mongodb";

import { PracticeFrequencyOptions, Relationship } from "@/lib/types";

export type Repository = {
  _id: ObjectId;
  repo_name: string;
  repo_template: string;
  tester_url: string;
  test_ok?: boolean;
  relationships: Record<string, Relationship>;
  expected_practice_frequency: PracticeFrequencyOptions;
  is_reminder_enabled: boolean;
};

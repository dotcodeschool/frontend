import { FormControl, FormLabel, Select } from "@chakra-ui/react";

import { PracticeFrequencyOptions } from "@/lib/types";

type FrequencySelectProps = {
  value: PracticeFrequencyOptions;
  onChange: (value: PracticeFrequencyOptions) => void;
};

const FREQUENCY_OPTIONS = [
  { value: "every_day", display: "Every day" },
  { value: "once_a_week", display: "Once a week" },
  { value: "once_a_month", display: "Once a month" },
] as const;

export const FrequencySelect = ({ value, onChange }: FrequencySelectProps) => (
  <FormControl mt={2}>
    <FormLabel color="gray.400" fontSize="sm">
      Reminder Frequency
    </FormLabel>
    <Select
      maxW="xs"
      onChange={(e) => {
        if (
          e.target.value === "every_day" ||
          e.target.value === "once_a_week" ||
          e.target.value === "once_a_month"
        ) {
          onChange(e.target.value);
        }
      }}
      size="sm"
      value={value}
    >
      {FREQUENCY_OPTIONS.map((option) => (
        <option key={option.value} value={option.value}>
          {option.display}
        </option>
      ))}
    </Select>
  </FormControl>
);

"use client";

import { Text } from "@chakra-ui/react";

export type LogEntry = {
  eventType: string;
  message: string;
  timestamp: string;
};

export const LogMessage = ({ log }: { log: LogEntry }) => (
  <Text display="block" fontFamily="mono" fontSize="sm" whiteSpace="pre-wrap">
    <Text as="span" color="blue.300">
      [{log.eventType}]
    </Text>{" "}
    <Text as="span" color="gray.400">
      {new Date(log.timestamp).toLocaleTimeString()}
    </Text>{" "}
    {log.message}
  </Text>
);

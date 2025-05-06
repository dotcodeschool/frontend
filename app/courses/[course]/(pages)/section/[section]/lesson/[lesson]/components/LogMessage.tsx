"use client";

import { Box, Text } from "@chakra-ui/react";
import Convert from "ansi-to-html";
import { useMemo } from "react";

const convert = new Convert({
  fg: "#CBD5E0", // gray.400 in Chakra UI
  bg: "#1A202C", // gray.800 in Chakra UI
  newline: true,
  escapeXML: true,
});

export type LogEntry = {
  eventType: string;
  message: string;
  timestamp: string;
};

export const LogMessage = ({ log }: { log: LogEntry }) => {
  const processedMessage = useMemo(
    () => convert.toHtml(log.message),
    [log.message],
  );

  return (
    <Text display="block" fontFamily="mono" fontSize="sm" whiteSpace="pre-wrap">
      <Text as="span" color="blue.300">
        [{log.eventType}]
      </Text>{" "}
      <Text as="span" color="gray.400">
        {new Date(log.timestamp).toLocaleTimeString()}
      </Text>{" "}
      <Box
        as="span"
        dangerouslySetInnerHTML={{ __html: processedMessage }}
        sx={{
          'span[style*="color"]': {
            display: "inline",
          },
        }}
      />
    </Text>
  );
};

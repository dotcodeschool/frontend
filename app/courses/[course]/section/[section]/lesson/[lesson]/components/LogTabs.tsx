import {
  Tab,
  TabIndicator,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  VStack,
} from "@chakra-ui/react";
import { IoTerminal } from "react-icons/io5";
import { LogEntry, LogMessage } from "./LogMessage";
import { useEffect, useState } from "react";

const LogTabs = ({ logstreamId }: { logstreamId: string }) => {
  const [logs, setLogs] = useState<LogEntry[]>([]);

  useEffect(() => {
    let eventSource: EventSource | null = null;

    if (logstreamId) {
      console.log(
        "Opening EventSource connection for logstreamId:",
        logstreamId,
      );

      const url = `/api/redis-stream?logstreamId=${encodeURIComponent(logstreamId)}`;
      console.log("EventSource URL:", url);

      eventSource = new EventSource(url);

      eventSource.onopen = () => {
        console.log("EventSource connection opened successfully");
      };

      eventSource.onmessage = (event) => {
        console.log("Raw event received:", event);
        console.log("Received event data:", event.data);

        try {
          const data = JSON.parse(event.data);
          console.log("Parsed event data:", data);

          // Only process non-keepalive messages
          if (data.eventType !== "keepalive") {
            if (
              data &&
              typeof data === "object" &&
              "eventType" in data &&
              "message" in data &&
              "timestamp" in data
            ) {
              console.log("Valid log entry, adding to logs:", data);
              setLogs((prevLogs) => {
                const newLogs = [...prevLogs, data];
                console.log("Updated logs array:", newLogs);
                return newLogs;
              });
            } else {
              console.log("Invalid log entry format:", data);
              console.log("Missing properties:", {
                hasEventType: "eventType" in data,
                hasMessage: "message" in data,
                hasTimestamp: "timestamp" in data,
              });
            }
          }
        } catch (error) {
          console.error("Error parsing log data:", error);
          console.log("Raw data that failed to parse:", event.data);
        }
      };

      eventSource.onerror = (error) => {
        console.error("EventSource error:", error);
        if (eventSource) {
          console.log("EventSource readyState:", eventSource.readyState);
          if (eventSource.readyState === EventSource.CLOSED) {
            console.log("EventSource connection was closed");
          } else if (eventSource.readyState === EventSource.CONNECTING) {
            console.log("EventSource is attempting to reconnect");
          }
        }
      };
    }

    return () => {
      if (eventSource) {
        console.log("Cleaning up EventSource connection");
        eventSource.close();
        setLogs([]);
      }
    };
  }, [logstreamId]);

  return (
    <Tabs variant="unstyled">
      <TabList borderBottom="none">
        <Tab color="gray.400" fontSize="sm" px={2}>
          <IoTerminal />
          <Text pl={2}>Logs</Text>
        </Tab>
      </TabList>
      <TabIndicator bg="gray.400" borderRadius="1px" height="3px" mt="-1.5px" />
      <TabPanels pt={2}>
        <TabPanel
          background="gray.800"
          border="1px solid"
          borderColor="gray.600"
          rounded="md"
        >
          <VStack align="stretch" spacing={2}>
            {logs.length === 0 ? (
              <LogMessage
                log={{
                  eventType: "info",
                  message: "Waiting for logs...",
                  timestamp: new Date().toISOString(),
                }}
              />
            ) : (
              logs.map((log, index) => (
                <LogMessage key={`${log.timestamp}-${index}`} log={log} />
              ))
            )}
          </VStack>
        </TabPanel>
      </TabPanels>
    </Tabs>
  );
};

export { LogTabs };

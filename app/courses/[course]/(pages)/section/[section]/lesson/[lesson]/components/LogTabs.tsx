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
import { useEffect, useState, useRef } from "react";
import { IoTerminal } from "react-icons/io5";

import { LogEntry, LogMessage } from "./LogMessage";

type LogData = {
  eventType: string;
  message: string;
  timestamp: string;
};

const hasRequiredFields = (data: object): data is LogData =>
  "eventType" in data && "message" in data && "timestamp" in data;

const isValidLogData = (data: unknown): data is LogData => {
  if (typeof data !== "object" || data === null) {
    return false;
  }

  return hasRequiredFields(data);
};

const processLogData = (data: unknown): LogEntry | null => {
  if (isValidLogData(data) && data.eventType !== "keepalive") {
    return data;
  }

  return null;
};

const useEventSource = (
  logstreamId: string,
  setLogs: React.Dispatch<React.SetStateAction<LogEntry[]>>,
) => {
  useEffect(() => {
    let eventSource: EventSource | null = null;

    if (logstreamId) {
      const url = `/api/redis-stream?logstreamId=${encodeURIComponent(logstreamId)}`;
      eventSource = new EventSource(url);

      eventSource.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          const logEntry = processLogData(data);

          if (logEntry) {
            setLogs((prevLogs) => [...prevLogs, logEntry]);
          }
        } catch (error) {
          console.error("Error processing log data:", error);
        }
      };

      eventSource.onerror = () => {
        if (eventSource?.readyState === EventSource.CLOSED) {
          console.info("EventSource connection was closed");
        }
      };
    }

    return () => {
      if (eventSource) {
        eventSource.close();
        setLogs([]);
      }
    };
  }, [logstreamId, setLogs]);
};

const useScrollToBottom = (
  scrollRef: React.RefObject<HTMLDivElement>,
  logs: LogEntry[],
) => {
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs, scrollRef]);
};

const LogTabs = ({ logstreamId }: { logstreamId: string }) => {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEventSource(logstreamId, setLogs);
  useScrollToBottom(scrollRef, logs);

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
          maxH="70vh"
          overflow="auto"
          ref={scrollRef}
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

import type { LogEntry } from "../components/LogMessage";

export const isObject = (value: unknown): value is object =>
  typeof value === "object" && value !== null;

export const isString = (value: unknown): value is string =>
  typeof value === "string";

const validateLogEntryTypes = (
  data: Record<keyof LogEntry, unknown>,
): boolean => {
  const isValid =
    isString(data.eventType) &&
    isString(data.message) &&
    isString(data.timestamp);

  if (!isValid) {
    console.log("Invalid field types:", {
      eventType: typeof data.eventType,
      message: typeof data.message,
      timestamp: typeof data.timestamp,
    });
  }

  return isValid;
};

export const hasLogEntryShape = (
  obj: object,
): obj is Record<keyof LogEntry, unknown> =>
  "eventType" in obj && "message" in obj && "timestamp" in obj;

export const isLogEntry = (data: unknown): data is LogEntry => {
  if (!isObject(data)) {
    console.log("Not an object:", data);

    return false;
  }

  if (!hasLogEntryShape(data)) {
    console.log("Missing required fields:", data);

    return false;
  }

  return validateLogEntryTypes(data);
};

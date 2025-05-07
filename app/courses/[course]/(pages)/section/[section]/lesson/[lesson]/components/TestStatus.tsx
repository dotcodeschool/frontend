import { Circle, HStack, Spinner, Text } from "@chakra-ui/react";

type TestStatusProps = {
  didTestPass: boolean;
  isLoading?: boolean;
  total?: number;
  passedCount?: number;
};

const TestStatus = ({
  didTestPass,
  isLoading = false,
  total,
  passedCount,
}: TestStatusProps) => {
  const testStatusColor = didTestPass ? "green.300" : "red.300";

  // Show a spinner during loading
  if (isLoading) {
    return (
      <HStack spacing={1}>
        <Spinner color="gray.400" size="xs" />
        <Text color="gray.400" fontSize="xs">
          Loading test results...
        </Text>
      </HStack>
    );
  }

  // If we have multiple tests, show the count
  if (total && total > 1) {
    return (
      <HStack spacing={1}>
        <Circle bg={testStatusColor} size="8px" />
        <Text color={testStatusColor} fontSize="xs">
          {passedCount} of {total} tests passed
        </Text>
      </HStack>
    );
  }

  // Default single test or unknown count
  return (
    <HStack spacing={1}>
      <Circle bg={testStatusColor} size="8px" />
      <Text color={testStatusColor} fontSize="xs">
        Tests {didTestPass ? "passed" : "failed"}
      </Text>
    </HStack>
  );
};

export { TestStatus };

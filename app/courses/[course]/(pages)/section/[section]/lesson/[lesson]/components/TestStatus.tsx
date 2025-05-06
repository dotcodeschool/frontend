import { Circle, HStack, Spinner, Text } from "@chakra-ui/react";

type TestStatusProps = {
  didTestPass: boolean;
  isLoading?: boolean;
};

const TestStatus = ({ didTestPass, isLoading = false }: TestStatusProps) => {
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

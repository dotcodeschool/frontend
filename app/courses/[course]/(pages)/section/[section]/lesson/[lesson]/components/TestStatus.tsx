import { Circle, HStack, Text } from "@chakra-ui/react";

const TestStatus = ({ didTestPass }: { didTestPass: boolean }) => {
  const testStatusColor = didTestPass ? "green.300" : "red.300";

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

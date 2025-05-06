import { CheckIcon, ChevronLeftIcon, ChevronRightIcon } from "@chakra-ui/icons";
import { Button, Flex, Link, Text } from "@chakra-ui/react";

type NavigationButtonsProps = {
  prev?: string;
  next?: string;
  courseId: string;
};

const NavigationButtons = ({
  prev,
  next,
  courseId,
}: NavigationButtonsProps) => (
  <Flex gap={2}>
    {prev && prev.length > 0 ? (
      <Button
        _hover={{ textDecor: "none", color: "green.300" }}
        as={Link}
        gap={2}
        href={`/courses/${prev}`}
        variant="ghost"
      >
        <ChevronLeftIcon fontSize={24} />
        <Text display={["none", "block"]}>Back</Text>
      </Button>
    ) : null}
    {next ? (
      <Button
        _hover={{ textDecor: "none", color: "green.300" }}
        as={Link}
        gap={2}
        href={`/courses/${next}`}
        variant="ghost"
      >
        <Text display={["none", "block"]}>Next</Text>
        <ChevronRightIcon fontSize={24} />
      </Button>
    ) : (
      <Button
        _hover={{ textDecor: "none" }}
        as={Link}
        colorScheme="green"
        gap={2}
        href={`/courses/${courseId}/success`}
        mr={4}
        px={[4, 8]}
        variant="solid"
      >
        <Text display={["none", "block"]}>Finish</Text>
        <CheckIcon fontSize={16} />
      </Button>
    )}
  </Flex>
);

export { NavigationButtons };

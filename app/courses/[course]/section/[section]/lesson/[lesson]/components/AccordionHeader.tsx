import { AccordionButton, Button, Text } from "@chakra-ui/react";
import { IoArrowDown, IoArrowUp } from "react-icons/io5";

type AccordionHeaderProps = {
  isExpanded: boolean;
};

export const AccordionHeader = ({ isExpanded }: AccordionHeaderProps) => (
  <AccordionButton>
    <Text
      casing="uppercase"
      color="gray.300"
      fontSize="sm"
      fontWeight="semibold"
      letterSpacing={1}
      pr={2}
    >
      Test Runner:
    </Text>
    <Button
      as="span"
      colorScheme="gray"
      leftIcon={isExpanded ? <IoArrowUp /> : <IoArrowDown />}
      ml="auto"
      mr={2}
      size="xs"
      variant="outline"
    >
      {isExpanded ? "Hide" : "View"} Instructions
    </Button>
  </AccordionButton>
);

import { Button, VStack } from "@chakra-ui/react";

import { AnswerOptions } from "@/lib/types";

const QuestionOptions = ({
  options,
  onOptionClick,
}: {
  options: AnswerOptions[];
  onOptionClick?: (option: AnswerOptions) => void;
}) => (
  <VStack spacing={4}>
    {options.map((option, index) => (
      <Button
        _hover={{ bg: "gray.800", color: "white" }}
        height="auto"
        justifyContent="flex-start"
        key={index}
        onClick={() => onOptionClick && onOptionClick(option)}
        px={4}
        py={3}
        variant="outline"
        width="full"
      >
        {option.display}
      </Button>
    ))}
  </VStack>
);

export { QuestionOptions };

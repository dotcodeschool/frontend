import { CheckIcon, CopyIcon } from "@chakra-ui/icons";
import { IconButton } from "@chakra-ui/react";

const CopyIconButton = ({ copySuccess }: { copySuccess: boolean }) => (
  <IconButton
    _hover={{ color: "gray.200", bg: "gray.600" }}
    aria-label="Copy code to clipboard"
    as={copySuccess ? CheckIcon : CopyIcon}
    color={copySuccess ? "green.200" : "gray.400"}
    cursor={copySuccess ? "default" : "pointer"}
    p={2}
    position="absolute"
    right={3}
    size="sm"
    top={3}
  />
);

export { CopyIconButton };

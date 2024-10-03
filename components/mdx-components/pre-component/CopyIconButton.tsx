import { CheckIcon, CopyIcon } from "@chakra-ui/icons";
import { IconButton } from "@chakra-ui/react";

const CopyIconButton = ({
  text,
  copySuccess,
  setCopySuccess,
}: {
  text: string;
  copySuccess: boolean;
  setCopySuccess: (success: boolean) => void;
}) => {
  const copyToClipboard = async () => {
    if ("clipboard" in navigator) {
      try {
        await navigator.clipboard.writeText(text);
        setCopySuccess(true);
      } catch (err) {
        console.error("Failed to copy:", err);
      }
    } else {
      console.error("Clipboard API not supported");
    }
  };

  return (
    <IconButton
      _hover={{ color: "gray.200", bg: "gray.600" }}
      aria-label="Copy code to clipboard"
      as={copySuccess ? CheckIcon : CopyIcon}
      color={copySuccess ? "green.200" : "gray.400"}
      cursor={copySuccess ? "default" : "pointer"}
      onClick={copyToClipboard}
      p={2}
      position="absolute"
      right={3}
      size="sm"
      top={3}
    />
  );
};

export { CopyIconButton };

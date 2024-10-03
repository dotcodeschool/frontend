import { CheckIcon, CopyIcon } from "@chakra-ui/icons";
import { IconButton } from "@chakra-ui/react";

const copySuccessButtonProps = {
  as: CheckIcon,
  bg: "gray.600",
  color: "green.200",
  cursor: "default",
  _hover: { color: "green.200", bg: "gray.600" },
};

const defaultButtonProps = {
  as: CopyIcon,
  color: "gray.400",
  cursor: "pointer",
  _hover: { color: "gray.200", bg: "gray.600" },
};

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
      aria-label="Copy code to clipboard"
      onClick={copyToClipboard}
      p={2}
      position="absolute"
      right={3}
      size="sm"
      top={3}
      {...(copySuccess ? copySuccessButtonProps : defaultButtonProps)}
    />
  );
};

export { CopyIconButton };

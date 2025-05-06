import { CheckIcon, CopyIcon } from "@chakra-ui/icons";
import { IconButton, IconButtonProps } from "@chakra-ui/react";

const copySuccessButtonProps = {
  as: CheckIcon,
  bg: "none",
  color: "green.200",
  cursor: "default",
  _hover: { color: "green.200", bg: "none" },
};

const defaultButtonProps = {
  as: CopyIcon,
  color: "gray.400",
  cursor: "pointer",
  _hover: { color: "gray.200", bg: "whiteAlpha.300" },
};

const CopyIconButton = ({
  text,
  copySuccess,
  setCopySuccess,
  ...props
}: {
  text: string;
  copySuccess: boolean;
  setCopySuccess: (success: boolean) => void;
} & IconButtonProps) => {
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
      onClick={copyToClipboard}
      {...props}
      {...(copySuccess ? copySuccessButtonProps : defaultButtonProps)}
    />
  );
};

export { CopyIconButton };

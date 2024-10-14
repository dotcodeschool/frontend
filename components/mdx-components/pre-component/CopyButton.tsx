import { CopyButtonProps } from "../types";

import { CopyIconButton } from "./CopyIconButton";

const CopyButton = ({
  text,
  isHovered,
  copySuccess,
  setCopySuccess,
}: CopyButtonProps) => {
  if (!isHovered && !copySuccess) {
    return null;
  }

  return (
    <CopyIconButton
      aria-label="Copy code to clipboard"
      copySuccess={copySuccess}
      p={2}
      position="absolute"
      right={3}
      setCopySuccess={setCopySuccess}
      size="sm"
      text={text}
      top={3}
    />
  );
};

export { CopyButton };

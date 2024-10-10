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
      copySuccess={copySuccess}
      setCopySuccess={setCopySuccess}
      text={text}
    />
  );
};

export { CopyButton };

import { CopyToClipboard } from "react-copy-to-clipboard";

import { CopyButtonProps } from "../types";

import { CopyIconButton } from "./CopyIconButton";

const CopyButton = ({
  code,
  isHovered,
  copySuccess,
  setCopySuccess,
}: CopyButtonProps) => {
  if (!isHovered && !copySuccess) {
    return null;
  }

  return (
    <CopyToClipboard onCopy={() => setCopySuccess(true)} text={code}>
      <CopyIconButton copySuccess={copySuccess} />
    </CopyToClipboard>
  );
};

export { CopyButton };

import {
  LineInputProps,
  LineOutputProps,
  Token,
  TokenInputProps,
  TokenOutputProps,
} from "prism-react-renderer";
import { ReactNode } from "react";

type CopyButtonProps = {
  text: string;
  isHovered: boolean;
  copySuccess: boolean;
  setCopySuccess: (success: boolean) => void;
};

type HighlightedCodeProps = {
  style: object;
  tokens: Token[][];
  getLineProps: (input: LineInputProps) => LineOutputProps;
  getTokenProps: (input: TokenInputProps) => TokenOutputProps;
};

type PreComponentProps = {
  children?: string | ReactNode | null | undefined;
  className?: string;
  filename?: string;
};

export type { CopyButtonProps, HighlightedCodeProps, PreComponentProps };

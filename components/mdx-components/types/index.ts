import {
  LineInputProps,
  LineOutputProps,
  Token,
  TokenInputProps,
  TokenOutputProps,
} from "prism-react-renderer";

type CopyButtonProps = {
  code: string;
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
  children: string;
  className?: string;
};

export type { CopyButtonProps, HighlightedCodeProps, PreComponentProps };

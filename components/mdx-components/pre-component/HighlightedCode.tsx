import { Box } from "@chakra-ui/react";
import {
  LineInputProps,
  LineOutputProps,
  Token,
  TokenInputProps,
  TokenOutputProps,
} from "prism-react-renderer";
import { Key } from "react";

const HighlightedCode = ({
  style,
  tokens,
  getLineProps,
  getTokenProps,
}: {
  style: object;
  tokens: Token[][];
  getLineProps: (input: LineInputProps) => LineOutputProps;
  getTokenProps: (input: TokenInputProps) => TokenOutputProps;
}) => (
  <Box
    as="pre"
    overflowX="auto"
    px={6}
    py={4}
    rounded={8}
    style={style}
    sx={{
      "::-webkit-scrollbar": { height: "6px", borderRadius: "8px" },
      "::-webkit-scrollbar-thumb": { height: "6px", borderRadius: "8px" },
      ":hover::-webkit-scrollbar-thumb": { background: "gray.700" },
    }}
  >
    <Box pr={12}>
      {tokens.map((line, i) => (
        <div key={i} {...getLineProps({ line })}>
          {line.map((token, key: Key) => (
            <span key={key} {...getTokenProps({ token })} />
          ))}
        </div>
      ))}
    </Box>
  </Box>
);

export { HighlightedCode };

import { Box } from "@chakra-ui/react";
import { Key } from "react";

import { HighlightedCodeProps } from "../types";

const HighlightedCode = ({
  style,
  tokens,
  getLineProps,
  getTokenProps,
}: HighlightedCodeProps) => (
  <Box
    as="pre"
    overflowX="auto"
    px={6}
    py={4}
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

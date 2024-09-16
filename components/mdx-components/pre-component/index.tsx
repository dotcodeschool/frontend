"use client";

import { Box } from "@chakra-ui/react";
import { Highlight, themes } from "prism-react-renderer";
import { useEffect, useState } from "react";

import { IPreComponentProps } from "@/lib/types/IPreComponentProps";

import { CopyButton } from "./CopyButton";
import { HighlightedCode } from "./HighlightedCode";

const PreComponent = ({ children }: { children: IPreComponentProps }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  const code = children.props.children.trim();
  const languageFromClassName = children.props.className?.replace(
    "language-",
    "",
  );
  const language = languageFromClassName ?? "rust";

  useEffect(() => {
    if (copySuccess) {
      const timer = setTimeout(() => setCopySuccess(false), 3000);

      return () => clearTimeout(timer);
    }
  }, [copySuccess]);

  return (
    <Box
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      position="relative"
    >
      <Highlight code={code} language={language} theme={themes.dracula}>
        {({ style, tokens, getLineProps, getTokenProps }) => (
          <HighlightedCode
            getLineProps={getLineProps}
            getTokenProps={getTokenProps}
            style={style}
            tokens={tokens}
          />
        )}
      </Highlight>
      <CopyButton
        code={code}
        copySuccess={copySuccess}
        isHovered={isHovered}
        setCopySuccess={setCopySuccess}
      />
    </Box>
  );
};

export { PreComponent };

"use client";

import { Box, HStack, Spacer, Text } from "@chakra-ui/react";
import { Highlight, themes } from "prism-react-renderer";
import { useEffect, useState } from "react";
import { FiTerminal } from "react-icons/fi";

import { PreComponentProps } from "../types";

import { CopyButton } from "./CopyButton";
import { CopyIconButton } from "./CopyIconButton";
import { HighlightedCode } from "./HighlightedCode";

const PreComponent: React.FC<PreComponentProps> = ({
  children,
  className,
  filename,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  const code = typeof children === "string" ? children.trim() : "";
  const languageFromClassName = className?.replace("language-", "");
  const language = languageFromClassName ?? "rust";

  useEffect(() => {
    if (copySuccess) {
      const timer = setTimeout(() => setCopySuccess(false), 3000);

      return () => clearTimeout(timer);
    }
  }, [copySuccess]);

  return (
    <Box
      border="1px solid"
      borderColor="gray.600"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      overflow="hidden"
      position="relative"
      rounded="lg"
    >
      {filename ? (
        <HStack
          bg={themes.dracula.plain.backgroundColor}
          borderBottom="1px solid"
          borderColor="gray.600"
          borderTopLeftRadius="lg"
          borderTopRightRadius="lg"
          color="gray.300"
          fontSize="sm"
          fontWeight="semibold"
          p={2}
          width="100%"
        >
          <FiTerminal />
          <Text>{filename}</Text>
          <Spacer />
          <CopyIconButton
            _hover={{ bg: "none" }}
            aria-label="Copy code to clipboard"
            copySuccess={copySuccess}
            setCopySuccess={setCopySuccess}
            size="xxs"
            text={code}
            variant="ghost"
          />
        </HStack>
      ) : (
        <CopyButton
          copySuccess={copySuccess}
          isHovered={isHovered}
          setCopySuccess={setCopySuccess}
          text={code}
        />
      )}
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
    </Box>
  );
};

export { PreComponent };

// app/courses/[course]/(pages)/setup/components/CodeBlock.tsx
"use client";

import { Box } from "@chakra-ui/react";
import React from "react";
import SyntaxHighlighter from "react-syntax-highlighter";
import { dracula } from "react-syntax-highlighter/dist/esm/styles/hljs";

type CodeBlockProps = {
  language?: string;
  filename?: string;
  children: string;
};

export const CodeBlock: React.FC<CodeBlockProps> = ({
  language = "bash",
  filename = "Terminal",
  children,
}) => {
  return (
    <Box borderRadius="md" overflow="hidden" mb={4}>
      <Box
        bg="#2d2d2d"
        color="gray.300"
        fontSize="sm"
        px={4}
        py={2}
        borderTopRadius="md"
        fontWeight="medium"
      >
        {filename}
      </Box>
      <SyntaxHighlighter
        language={language}
        style={dracula}
        customStyle={{
          borderBottomLeftRadius: "0.375rem",
          borderBottomRightRadius: "0.375rem",
          borderTopLeftRadius: 0,
          borderTopRightRadius: 0,
          padding: "1rem",
          margin: 0,
        }}
      >
        {children.trim()}
      </SyntaxHighlighter>
    </Box>
  );
};

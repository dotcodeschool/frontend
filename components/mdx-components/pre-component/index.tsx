"use client";

import { Box, HStack, Spacer, Text } from "@chakra-ui/react";
import { Highlight, themes } from "prism-react-renderer";
import { useEffect, useState } from "react";
import { FaFile, FaInfoCircle } from "react-icons/fa";
import { FiTerminal } from "react-icons/fi";
import { MdLock, MdTerminal } from "react-icons/md";
import { PiCertificateFill } from "react-icons/pi";
import {
  SiBun,
  SiDocker,
  SiGit,
  SiJavascript,
  SiMarkdown,
  SiMdx,
  SiNodedotjs,
  SiPnpm,
  SiReact,
  SiRust,
  SiToml,
  SiTypescript,
  SiYarn,
} from "react-icons/si";
import { VscJson } from "react-icons/vsc";

import { PreComponentProps } from "../types";

import { CopyButton } from "./CopyButton";
import { CopyIconButton } from "./CopyIconButton";
import { HighlightedCode } from "./HighlightedCode";

// eslint-disable-next-line complexity
const getFileIcon = (filename: string) => {
  switch (filename) {
    case "bun.lockb":
      return <SiBun />;

    case "package.json":
      return <SiNodedotjs />;

    case "pnpm-lock.yaml":
      return <SiPnpm />;

    case "yarn.lock":
      return <SiYarn />;

    case "Dockerfile":
      return <SiDocker />;

    case "LICENSE":
      return <PiCertificateFill />;

    // TODO: find a better icon for Makefile
    case "Makefile":
      return <FaFile />;

    case "README.md":
      return <FaInfoCircle />;
  }

  const parsedFilename = filename.split(".").pop();

  if (parsedFilename?.startsWith("git")) {
    return <SiGit />;
  }

  switch (parsedFilename) {
    case "js":
      return <SiJavascript />;

    case "json":
      return <VscJson />;

    case "jsx":
      return <SiReact />;

    case "lock":
      return <MdLock />;

    case "md":
      return <SiMarkdown />;

    case "mdx":
      return <SiMdx />;

    case "rs":
      return <SiRust />;

    case "sh":
      return <MdTerminal />;

    case "toml":
      return <SiToml />;

    case "ts":
      return <SiTypescript />;

    case "tsx":
      return <SiReact />;

    case "Terminal":
      return <FiTerminal />;

    default:
      return <FaFile />;
  }
};

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
      mb={8}
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
          {getFileIcon(filename)}
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

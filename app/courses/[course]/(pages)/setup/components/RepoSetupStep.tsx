// app/courses/[course]/(pages)/setup/components/RepoSetupStep.tsx
"use client";

import { Box, Heading } from "@chakra-ui/react";
import React, { ReactElement } from "react";
import { CodeBlock } from "./CodeBlock";

type RepoSetupStepProps = {
  title: string | ReactElement;
  code: string | ReactElement;
};

const RepoSetupStep: React.FC<RepoSetupStepProps> = ({ code, title }) => {
  // Render differently based on the type of code
  const renderCode = () => {
    if (typeof code === "string") {
      const cleanCode = code.replace(/```\w*\s*|\s*```/g, "").trim();
      return <CodeBlock>{cleanCode}</CodeBlock>;
    } else {
      return code;
    }
  };

  return (
    <Box borderRadius="md" w="full" mb={6}>
      <Heading mb={3} size="sm">
        {title}
      </Heading>
      {renderCode()}
    </Box>
  );
};

export { RepoSetupStep };

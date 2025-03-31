'use client';

import { Box, Heading } from "@chakra-ui/react";
import React from "react";
import { MDXBundlerRenderer } from "@/components/mdx-bundler-renderer";

type RepoSetupStepProps = {
  title: string | React.ReactElement;
  code: string;
};

const RepoSetupStep: React.FC<RepoSetupStepProps> = ({ code, title }) => (
  <Box borderRadius="md" w="full">
    <Heading mb={2} size="sm">
      {title}
    </Heading>
    <MDXBundlerRenderer code={code} />
  </Box>
);

export { RepoSetupStep };
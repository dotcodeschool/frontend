import { Box, Heading } from "@chakra-ui/react";
import React, { ReactElement } from "react";

type RepoSetupStepProps = {
  title: string | ReactElement;
  code: string | ReactElement;
};

const RepoSetupStep: React.FC<RepoSetupStepProps> = ({ code, title }) => (
  <Box borderRadius="md" w="full">
    <Heading mb={2} size="sm">
      {title}
    </Heading>
    {code}
  </Box>
);

export { RepoSetupStep };

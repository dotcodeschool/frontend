import React, {
  JSXElementConstructor,
  ReactElement,
  useEffect,
  useState,
} from "react";
import { ObjectId, WithId } from "mongodb";
import { Repository } from "@/lib/db/models";
import { RepositorySetup } from "@/lib/types";
import { RepositorySteps } from "./RepositoryStepBlocks";
import { Box, Text, Spinner, VStack, Heading } from "@chakra-ui/react";
import { RepoStepLoadingSkeleton } from "./RepoStepLoadingSkeleton";
import { size } from "lodash";
import { title } from "process";

interface RepoSetupStepProps {
  title: string | ReactElement<any, string | JSXElementConstructor<any>>;
  code: string | ReactElement<any, string | JSXElementConstructor<any>>;
}

const RepoSetupStep: React.FC<RepoSetupStepProps> = ({ code, title }) => (
  <Box borderRadius="md" w="full">
    <Heading mb={2} size="sm">
      {title}
    </Heading>
    {code}
  </Box>
);

export { RepoSetupStep };

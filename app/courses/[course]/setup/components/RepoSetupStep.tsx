import { Box, Heading } from "@chakra-ui/react";

const RepoSetupStep = ({
  title,
  code,
}: {
  title: string;
  code: React.ReactElement | string;
}) => (
  <Box borderRadius="md" w="full">
    <Heading mb={2} size="sm">
      {title}
    </Heading>
    {code}
  </Box>
);

export { RepoSetupStep };

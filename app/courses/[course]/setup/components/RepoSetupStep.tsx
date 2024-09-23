import { Box, Heading } from "@chakra-ui/react";

const RepoSetupStep = ({
  title,
  code,
}: {
  title: string;
  code: React.ReactElement | string;
}) => (
  <Box bg="gray.800" borderRadius="md" p={4} w="full">
    <Heading mb={2} size="sm">
      {title}
    </Heading>
    {code}
  </Box>
);

export { RepoSetupStep };

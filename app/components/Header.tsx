import { Heading, Stack, Text } from "@chakra-ui/react";

import { LandingCTA } from "./LandingCTA";

const Header = () => (
  <Stack align="center" mt={20} pb={20} textAlign="center">
    <Heading as="h1" fontWeight="800" maxW="3xl" size="4xl">
      Learn to Code Web3 Apps by Building Real Projects.
    </Heading>
    <Text fontSize="xl" maxW="3xl" mb={20} mt={4}>
      Dot Code School is an interactive online school that teaches you how to
      build meaningful web3 applications using the Polkadot SDK. Learn how to
      build your own custom blockchain from zero to one hundred.
    </Text>
    <LandingCTA />
  </Stack>
);

export { Header };

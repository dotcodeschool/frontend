import { Box, Heading, Stack } from "@chakra-ui/react";

import { Footer, Navbar } from "@/components";

import { FeaturesList, Header, LandingCTA } from "./components";

export { generateMetadata } from "./metadata";

const Home = () => (
  <Box maxW="8xl" mx="auto" px={[4, 12]}>
    <Navbar />
    <Header />
    <FeaturesList />
    <Stack align="center" mt={20} pb={20} spacing={8}>
      <Heading as="h2" fontWeight="800" size="2xl">
        Ready to get started?
      </Heading>
      <LandingCTA />
    </Stack>
    <Footer />
  </Box>
);

export default Home;

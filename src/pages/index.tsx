import Navbar from "@/app/common/components/navbar";
import {
  Box,
  Heading,
  Text,
  Link,
  Button,
  ButtonGroup,
} from "@chakra-ui/react";
import PrimaryButton from "@/app/common/components/primary-button";
import Footer from "@/app/common/components/footer";

export default function Index() {
  return (
    <Box maxW="6xl" mx="auto" px={[4, 12]}>
      <Navbar />
      <Box mt={20}>
        <Heading as="h1" fontWeight="800" size="4xl" maxW="3xl">
          Learn to Code Web3 Apps by Building Real Projects.
        </Heading>
        <Text mt={4} fontSize="xl" maxW="3xl">
          Dot Code School is an interactive online school that teaches you how
          to build meaningful web3 applications using the Polkadot SDK. Learn
          how to build your own custom blockchain from zero to one hundred.
        </Text>
        <ButtonGroup mt={12} spacing={4}>
          <PrimaryButton
            as={Link}
            href="/courses/rust-state-machine"
            size="lg"
            _hover={{ textDecor: "none" }}
          >
            View Course
          </PrimaryButton>
          <Button
            as={Link}
            href="https://forms.gle/2o4hBauCJ6Fkf9Zz7"
            size="lg"
            variant="outline"
            _hover={{ textDecor: "none" }}
            isExternal
          >
            Become a Teacher
          </Button>
        </ButtonGroup>
      </Box>
      <Footer />
    </Box>
  );
}

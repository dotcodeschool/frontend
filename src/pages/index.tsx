import Navbar from "@/app/common/components/navbar";
import {
  Box,
  Heading,
  Text,
  Link,
  Button,
  ButtonGroup,
  Stack,
  Image,
} from "@chakra-ui/react";
import PrimaryButton from "@/app/common/components/primary-button";
import Footer from "@/app/common/components/footer";

export default function Index() {
  return (
    <Box maxW="8xl" mx="auto" px={[4, 12]}>
      <Navbar />
      <Header />
      <FeaturesList />
      <Stack spacing={8} mt={20} align="center" pb={20}>
        <Heading as="h2" size="2xl" fontWeight="800">
          Ready to get started?
        </Heading>
        <LandingCTA />
      </Stack>
      <Footer />
    </Box>
  );
}

function Header() {
  return (
    <Stack mt={20} textAlign="center" align="center" pb={20}>
      <Heading as="h1" fontWeight="800" size="4xl" maxW="3xl">
        Learn to Code Web3 Apps by Building Real Projects.
      </Heading>
      <Text mt={4} mb={20} fontSize="xl" maxW="3xl">
        Dot Code School is an interactive online school that teaches you how to
        build meaningful web3 applications using the Polkadot SDK. Learn how to
        build your own custom blockchain from zero to one hundred.
      </Text>
      <LandingCTA />
    </Stack>
  );
}

function LandingCTA() {
  return (
    <ButtonGroup spacing={4}>
      <PrimaryButton
        as={Link}
        href="/courses"
        p={8}
        fontSize={"xl"}
        _hover={{ textDecor: "none" }}
      >
        Browse Courses
      </PrimaryButton>
      <Button
        as={Link}
        href="https://forms.gle/2o4hBauCJ6Fkf9Zz7"
        variant="solid"
        colorScheme="gray"
        fontSize={"xl"}
        p={8}
        _hover={{ textDecor: "none" }}
        isExternal
      >
        Become a Teacher
      </Button>
    </ButtonGroup>
  );
}

interface FeatureComponentProps {
  title: string | JSX.Element;
  description: string | JSX.Element;
  image: string;
  alt?: string;
  isImageFirst?: boolean;
  cta?: JSX.Element;
}

function FeatureComponent({
  title,
  description,
  image,
  alt,
  isImageFirst,
  cta,
}: FeatureComponentProps) {
  return (
    <Stack
      direction={isImageFirst ? ["column", "row-reverse"] : ["column", "row"]}
      align="center"
      spacing={8}
      mt={20}
      pb={20}
    >
      <Box w={["100%", "50%"]}>
        <Heading as="h1" size="2xl" fontWeight="800">
          {title}
        </Heading>
        <Text mt={4}>{description}</Text>
        {cta && cta}
      </Box>
      <Box w={["100%", "50%"]}>
        <Image src={image} alt={alt} />
      </Box>
    </Stack>
  );
}

function FeaturesList() {
  return (
    <Stack spacing={8}>
      <FeatureComponent
        title={
          <>
            Ditch the Docs.
            <br />
            Code the Blocks.
          </>
        }
        description={
          <>
            The most respected engineers don't just read about technology — they
            build it.
            <br />
            <br />
            Improve the depth of your understanding by building real projects
            with in-browser step-by-step interactive lessons.
          </>
        }
        image="/static/images/interface.png"
        alt="Interactive Learning"
      />
      <FeatureComponent
        title="Learn directly from experts"
        description="Our courses are created by industry experts who have first-hand experience building web3 applications and working in the blockchain industry."
        image="/static/images/experts.png"
        alt="Expert Instructors"
        isImageFirst
      />
    </Stack>
  );
}

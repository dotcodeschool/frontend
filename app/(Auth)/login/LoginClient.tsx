"use client";

import {
  Button,
  Heading,
  Text,
  VStack,
  useToast,
  Card,
  CardBody,
  CardHeader,
  Divider,
  Image,
  Link,
} from "@chakra-ui/react";
import { signIn, useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { FaGithub } from "react-icons/fa";
import { useState, useEffect } from "react";

// Error message mapping
const getErrorMessage = (error: string | null) => {
  switch (error) {
    case "OAuthSignin":
      return "An error occurred while starting the sign in process.";
    case "OAuthCallback":
      return "An error occurred during the sign in process.";
    case "OAuthCreateAccount":
      return "An error occurred while creating your account.";
    case "EmailCreateAccount":
      return "An error occurred while creating your account.";
    case "Callback":
      return "An error occurred during the sign in callback.";
    case "OAuthAccountNotLinked":
      return "This email is already associated with another account.";
    case "EmailSignin":
      return "An error occurred while sending the sign in email.";
    case "CredentialsSignin":
      return "The sign in credentials are invalid.";
    case "SessionRequired":
      return "You must be signed in to access this page.";
    case "OAuthCallbackError":
      return "The sign in process was cancelled or encountered an error.";
    default:
      return error ? `Authentication error: ${error}` : null;
  }
};

const LoginClient = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnUrl = searchParams.get("returnUrl") || "/";
  const error = searchParams.get("error");
  const errorMessage = getErrorMessage(error);
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (session?.user) {
      router.push(returnUrl);
    }
  }, [session, router, returnUrl]);

  if (session?.user) {
    return null;
  }

  const handleSignIn = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await signIn("github", { callbackUrl: returnUrl });
    } catch (error) {
      console.error(error);
      toast({
        title: "Authentication failed",
        description:
          "There was an error signing in with GitHub. Please try again.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      setIsLoading(false);
    }
  };

  return (
    <Card
      w="full"
      maxW="md"
      mx="auto"
      boxShadow="xl"
      borderRadius="xl"
      overflow="hidden"
      bg="gray.700"
    >
      <CardHeader bg="gray.900" py={6} textAlign="center">
        {errorMessage && (
          <Text
            color="red.300"
            fontWeight="medium"
            fontSize="sm"
            textAlign="center"
            rounded={2}
          >
            {errorMessage}
          </Text>
        )}
        <Image
          src="/logo.svg"
          alt="Dot Code School Logo"
          mx="auto"
          h="60px"
          my={4}
        />
        <Heading as="h1" size="lg" color="white">
          Login to Dotcodeschool
        </Heading>
      </CardHeader>

      <CardBody pt={0} p={8} bg="gray.900">
        <VStack spacing={6}>
          <Text textAlign="center" fontSize="md" color="gray.300">
            Sign in to access your courses, track your progress, and continue
            your coding journey.
          </Text>

          <Divider borderColor="gray.600" />

          <Button
            w="full"
            size="lg"
            colorScheme="green"
            leftIcon={<FaGithub />}
            onClick={handleSignIn}
            isLoading={isLoading}
            loadingText="Signing in..."
            boxShadow="md"
            _hover={{ transform: "translateY(-2px)", boxShadow: "lg" }}
            transition="all 0.2s"
          >
            Sign in with GitHub
          </Button>

          <Text fontSize="sm" color="gray.400" textAlign="center">
            By signing in, you agree to our{" "}
            <Link
              href="/legal/terms-of-service"
              color="blue.400"
              _hover={{ textDecoration: "underline" }}
            >
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link
              href="/legal/privacy-policy"
              color="blue.400"
              _hover={{ textDecoration: "underline" }}
            >
              Privacy Policy
            </Link>
            .
          </Text>
        </VStack>
      </CardBody>
    </Card>
  );
};

export default LoginClient;

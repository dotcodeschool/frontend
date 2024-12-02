"use client";

import { Box, Button, Flex, Heading, Text } from "@chakra-ui/react";
import { signIn, signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { FaGithub } from "react-icons/fa";

type Props = {};

const Login = (props: Props) => {
  const { data: session } = useSession();
  const router = useRouter();
  if (session?.user) {
    return router.push("/");
  }

  const handleSignIn = async (e: any) => {
    e.preventDefault();
    try {
      await signIn("github");
    } catch (error) {
      console.error(error);
    }
  };

  const handleSignOut = async (e: any) => {
    e.preventDefault();
    try {
      await signOut();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Flex align="center" justify="center" minH="100vh">
      <Box w="full" maxW="md" mx="auto" p={8} rounded="lg" shadow="lg">
        <Heading as="h1" size="lg" textAlign="center" mb={4}>
          Welcome Back
        </Heading>
        <Text textAlign="center" mb={6}>
          Login to access your account
        </Text>
        {session?.user ? (
          <Button
            w="full"
            size="lg"
            colorScheme="gray"
            variant="outline"
            leftIcon={<FaGithub />}
            onClick={(e) => handleSignOut(e)}
          >
            Sign Out
          </Button>
        ) : (
          <Button
            w="full"
            size="lg"
            colorScheme="gray"
            variant="outline"
            leftIcon={<FaGithub />}
            onClick={(e) => handleSignIn(e)}
          >
            Sign in with GitHub
          </Button>
        )}
      </Box>
    </Flex>
  );
};

export default Login;

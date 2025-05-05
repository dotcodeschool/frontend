import { Suspense } from "react";
import { Container } from "@chakra-ui/react";
import LoginClient from "./LoginClient";

const Login = () => {
  return (
    <Container
      minH="100vh"
      bg="gray.800"
      color="white"
      p={4}
      maxW="container.xl"
      alignContent="center"
    >
      <Suspense fallback={<div>Loading...</div>}>
        <LoginClient />
      </Suspense>
    </Container>
  );
};

export default Login;

import { Container, Heading } from "@chakra-ui/react";
import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { Navbar } from "@/components/navbar";

import { NotificationPreferences } from "./components/NotificationPreferences";

const SettingsPage = async () => {
  const session = await auth();

  if (!session) {
    redirect("/api/auth/signin");
  }

  return (
    <>
      <Container maxW="4xl" px={6}>
        <Navbar cta={false} />
      </Container>
      <Container maxW="4xl" p={6}>
        <Heading as="h1" pl={4} size="xl">
          Notification Settings
        </Heading>
        <NotificationPreferences />
      </Container>
    </>
  );
};

export default SettingsPage;

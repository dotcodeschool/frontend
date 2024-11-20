import { Container, Heading } from "@chakra-ui/react";
import { redirect } from "next/navigation";
import { auth } from "../../auth";

import { NotificationPreferences } from "./components/NotificationPreferences";
import { Navbar } from "@/components/navbar";

export default async function SettingsPage() {
  const session = await auth();

  if (!session) {
    redirect("/api/auth/signin");
  }

  return (
    <>
      <Container px={6} maxW="4xl">
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
}

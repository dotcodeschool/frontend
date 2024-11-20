import { Container, Heading } from "@chakra-ui/react";

import { NotificationPreferences } from "./components/NotificationPreferences";

const SettingsPage = () => (
  <Container maxW="4xl" p={6}>
    <Heading as="h1" mb={8} size="xl">
      Notification Settings
    </Heading>
    <NotificationPreferences />
  </Container>
);

export default SettingsPage;

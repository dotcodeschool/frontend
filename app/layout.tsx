import { ColorModeScript } from "@chakra-ui/react";
import { ClientLayout } from "@/app/components";

const RootLayout = ({ children }: { children: React.ReactNode }) => (
  <html lang="en">
    <body suppressHydrationWarning>
      <ColorModeScript initialColorMode="dark" />
      <ClientLayout>{children}</ClientLayout>
    </body>
  </html>
);

export default RootLayout;

import { ColorModeScript } from "@chakra-ui/react";
import { SpeedInsights } from "@vercel/speed-insights/next";

import { Providers } from "@/app/providers";

const RootLayout = ({ children }: { children: React.ReactNode }) => (
  <html lang="en">
    <body suppressHydrationWarning>
      <ColorModeScript initialColorMode="dark" />
      <Providers>{children}</Providers>
      <SpeedInsights />
    </body>
  </html>
);

export default RootLayout;

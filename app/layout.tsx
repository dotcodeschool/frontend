import { ColorModeScript } from "@chakra-ui/react";
import { SpeedInsights } from "@vercel/speed-insights/next";

import { Providers } from "@/app/providers";
import theme from "@/ui/theme";

const RootLayout = ({ children }: { children: React.ReactNode }) => (
  <html lang="en">
    <body>
      <ColorModeScript initialColorMode={theme.config.initialColorMode} />
      <Providers>{children}</Providers>
      <SpeedInsights />
    </body>
  </html>
);

export default RootLayout;

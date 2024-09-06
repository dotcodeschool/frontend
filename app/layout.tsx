import { Providers } from "@/app/providers";
import { ColorModeScript } from "@chakra-ui/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import theme from "@/app/ui/theme";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <ColorModeScript initialColorMode={theme.config.initialColorMode} />
        <Providers>{children}</Providers>
        <SpeedInsights />
      </body>
    </html>
  );
}

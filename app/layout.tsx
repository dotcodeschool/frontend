import { AppProps } from "next/app";
import { Providers } from "@/app/providers";
import { ColorModeScript } from "@chakra-ui/react";
import theme from "@/app/ui/theme";

interface IRootLayout extends AppProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: IRootLayout) {
  return (
    <html lang="en">
      <body>
        <ColorModeScript initialColorMode={theme.config.initialColorMode} />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

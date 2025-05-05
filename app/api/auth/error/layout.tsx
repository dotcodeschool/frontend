import { Providers } from "@/app/providers";
import { ColorModeScript } from "@chakra-ui/react";

export default function AuthErrorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <ColorModeScript initialColorMode="dark" />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

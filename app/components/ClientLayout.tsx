"use client";

import { Providers } from "@/app/providers";
import { ClientComponents } from "./ClientComponents";

export const ClientLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <Providers>
      {children}
      <ClientComponents />
    </Providers>
  );
};

"use client";

import dynamic from "next/dynamic";

// Dynamically import the CookieConsent component to avoid hydration issues
// This ensures the component only renders on the client side
const CookieConsent = dynamic(
  () => import("@/components/cookie-consent").then((mod) => mod.CookieConsent),
  { ssr: false },
);

export const CookieConsentWrapper = () => {
  return <CookieConsent />;
};

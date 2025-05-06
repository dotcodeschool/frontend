"use client";

import { CookieConsentWrapper } from "./CookieConsentWrapper";
import { ConditionalAnalytics } from "./ConditionalAnalytics";

export const ClientComponents = () => {
  return (
    <>
      <CookieConsentWrapper />
      <ConditionalAnalytics />
    </>
  );
};

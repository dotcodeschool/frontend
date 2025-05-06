"use client";

import { useEffect, useState } from "react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { useCookieConsent } from "@/lib/hooks/useCookieConsent";

export const ConditionalAnalytics = () => {
  const { hasConsent, isLoaded } = useCookieConsent();
  const [showAnalytics, setShowAnalytics] = useState(false);

  useEffect(() => {
    // Only show analytics if consent is loaded and granted
    if (isLoaded && hasConsent("analytics")) {
      setShowAnalytics(true);
    } else {
      setShowAnalytics(false);
    }
  }, [isLoaded, hasConsent]);

  // Only render SpeedInsights if user has consented to analytics
  if (!showAnalytics) return null;

  return <SpeedInsights />;
};

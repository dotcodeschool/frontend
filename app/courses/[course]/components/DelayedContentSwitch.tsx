"use client";

import { useEffect, useState } from "react";

export function DelayedContentSwitch({
  children,
  loadingComponent,
}: {
  children: React.ReactNode;
  loadingComponent: React.ReactNode;
}) {
  // Start in loading state
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    // After hydration, prepare to show real content with a small delay
    // to ensure all styles have been applied
    const timer = setTimeout(() => {
      setShowContent(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  // Return loader until content is fully ready to display
  return showContent ? <>{children}</> : <>{loadingComponent}</>;
}

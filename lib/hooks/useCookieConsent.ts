"use client";

import { useState, useEffect } from "react";

export type CookiePreferences = {
  essential: boolean;
  preferences: boolean;
  analytics: boolean;
};

export const COOKIE_CONSENT_KEY = "dotcodeschool-cookie-consent";

const defaultPreferences: CookiePreferences = {
  essential: true, // Essential cookies are always required
  preferences: false,
  analytics: false,
};

export const useCookieConsent = () => {
  const [cookiePreferences, setCookiePreferences] = useState<CookiePreferences>(defaultPreferences);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Only run on client-side
    if (typeof window === "undefined") return;

    try {
      const savedPreferences = localStorage.getItem(COOKIE_CONSENT_KEY);
      
      if (savedPreferences) {
        const parsedPreferences = JSON.parse(savedPreferences);
        setCookiePreferences(parsedPreferences);
      }
    } catch (error) {
      console.error("Error loading cookie preferences:", error);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  const updateCookiePreferences = (newPreferences: Partial<CookiePreferences>) => {
    const updatedPreferences = {
      ...cookiePreferences,
      ...newPreferences,
      essential: true, // Essential cookies are always required
    };

    setCookiePreferences(updatedPreferences);
    
    if (typeof window !== "undefined") {
      localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify(updatedPreferences));
    }

    return updatedPreferences;
  };

  const hasConsent = (type: keyof CookiePreferences): boolean => {
    return cookiePreferences[type];
  };

  return {
    cookiePreferences,
    isLoaded,
    updateCookiePreferences,
    hasConsent,
  };
};

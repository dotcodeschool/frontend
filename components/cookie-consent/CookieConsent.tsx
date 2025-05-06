"use client";

import { useState, useEffect } from "react";
import {
  Box,
  Button,
  Flex,
  Text,
  Link,
  Collapse,
  VStack,
  HStack,
  Divider,
  Switch,
  FormControl,
  FormLabel,
  useDisclosure,
  useColorModeValue,
} from "@chakra-ui/react";
import { FaCookieBite } from "react-icons/fa";
import { useCookieConsent, CookiePreferences, COOKIE_CONSENT_KEY } from "@/lib/hooks/useCookieConsent";

export const CookieConsent = () => {
  const { cookiePreferences, updateCookiePreferences, isLoaded } = useCookieConsent();
  const [showBanner, setShowBanner] = useState(false);
  const { isOpen, onToggle } = useDisclosure();
  
  const bgColor = useColorModeValue("gray.800", "gray.800");
  const textColor = useColorModeValue("white", "white");
  const borderColor = useColorModeValue("gray.700", "gray.700");
  
  // Check if user has already set cookie preferences
  useEffect(() => {
    // Only show the banner if preferences haven't been set yet
    // and after the preferences have been loaded from localStorage
    if (isLoaded && !localStorage.getItem(COOKIE_CONSENT_KEY)) {
      setShowBanner(true);
    }
  }, [isLoaded]);
  
  const handleAcceptAll = () => {
    updateCookiePreferences({
      essential: true,
      preferences: true,
      analytics: true,
    });
    setShowBanner(false);
    
    // The ConditionalAnalytics component will automatically
    // load analytics based on the updated preferences
  };
  
  const handleRejectNonEssential = () => {
    updateCookiePreferences({
      essential: true,
      preferences: false,
      analytics: false,
    });
    setShowBanner(false);
    
    // The ConditionalAnalytics component will automatically
    // respect these preferences
  };
  
  const handleSavePreferences = () => {
    updateCookiePreferences(cookiePreferences);
    setShowBanner(false);
  };
  
  const handlePreferenceChange = (type: keyof CookiePreferences) => {
    if (type === "essential") return; // Essential cookies cannot be toggled
    
    updateCookiePreferences({
      ...cookiePreferences,
      [type]: !cookiePreferences[type],
    });
  };
  
  if (!showBanner) return null;

  return (
    <Box
      position="fixed"
      bottom="0"
      left="0"
      right="0"
      zIndex="1000"
      p={4}
      bg={bgColor}
      color={textColor}
      borderTop="1px solid"
      borderColor={borderColor}
      boxShadow="0 -4px 6px -1px rgba(0, 0, 0, 0.1), 0 -2px 4px -1px rgba(0, 0, 0, 0.06)"
    >
      <Box maxW="container.xl" mx="auto">
        <Flex
          direction={{ base: "column", md: "row" }}
          align="center"
          justify="space-between"
        >
          <HStack spacing={3} mb={{ base: 4, md: 0 }}>
            <FaCookieBite size={24} />
            <Text fontWeight="medium">This website uses cookies</Text>
          </HStack>

          <HStack spacing={3}>
            <Button
              variant="outline"
              size="sm"
              onClick={onToggle}
              colorScheme="gray"
            >
              {isOpen ? "Hide Preferences" : "Customize"}
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={handleRejectNonEssential}
              colorScheme="gray"
            >
              Reject Non-Essential
            </Button>

            <Button size="sm" onClick={handleAcceptAll} colorScheme="green">
              Accept All
            </Button>
          </HStack>
        </Flex>

        <Collapse in={isOpen} animateOpacity>
          <Box mt={4} p={4} borderRadius="md" bg="gray.700">
            <Text mb={4}>
              We use cookies to enhance your browsing experience, serve
              personalized content, and analyze our traffic. Read our{" "}
              <Link
                href="/legal/privacy-policy"
                color="blue.400"
                textDecoration="underline"
              >
                Privacy Policy
              </Link>{" "}
              to learn more.
            </Text>

            <Divider my={4} />

            <VStack align="stretch" spacing={4}>
              <FormControl
                display="flex"
                alignItems="center"
                justifyContent="space-between"
              >
                <Box>
                  <FormLabel
                    htmlFor="essential-cookies"
                    mb={0}
                    fontWeight="bold"
                  >
                    Essential Cookies
                  </FormLabel>
                  <Text fontSize="sm" color="gray.400">
                    Required for the website to function properly. Cannot be
                    disabled.
                  </Text>
                </Box>
                <Switch
                  id="essential-cookies"
                  isChecked={true}
                  isDisabled={true}
                  colorScheme="green"
                />
              </FormControl>

              <FormControl
                display="flex"
                alignItems="center"
                justifyContent="space-between"
              >
                <Box>
                  <FormLabel
                    htmlFor="preference-cookies"
                    mb={0}
                    fontWeight="bold"
                  >
                    Preference Cookies
                  </FormLabel>
                  <Text fontSize="sm" color="gray.400">
                    Remember your settings and preferences for a better
                    experience.
                  </Text>
                </Box>
                <Switch
                  id="preference-cookies"
                  isChecked={cookiePreferences.preferences}
                  onChange={() => handlePreferenceChange("preferences")}
                  colorScheme="green"
                />
              </FormControl>

              <FormControl
                display="flex"
                alignItems="center"
                justifyContent="space-between"
              >
                <Box>
                  <FormLabel
                    htmlFor="analytics-cookies"
                    mb={0}
                    fontWeight="bold"
                  >
                    Analytics Cookies
                  </FormLabel>
                  <Text fontSize="sm" color="gray.400">
                    Help us understand how visitors interact with our website.
                  </Text>
                </Box>
                <Switch
                  id="analytics-cookies"
                  isChecked={cookiePreferences.analytics}
                  onChange={() => handlePreferenceChange("analytics")}
                  colorScheme="green"
                />
              </FormControl>
            </VStack>

            <Flex justify="flex-end" mt={4}>
              <Button
                size="sm"
                onClick={handleSavePreferences}
                colorScheme="blue"
              >
                Save Preferences
              </Button>
            </Flex>
          </Box>
        </Collapse>
      </Box>
    </Box>
  );
};

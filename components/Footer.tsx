import { Box, HStack, Link, Text, VStack, Divider } from "@chakra-ui/react";
import { FaDiscord, FaEnvelope, FaGithub, FaTwitter } from "react-icons/fa";

const socialLinks = [
  {
    label: "Twitter",
    icon: FaTwitter,
    href: "https://twitter.com/dotcodeschool",
  },
  {
    label: "GitHub",
    icon: FaGithub,
    href: "https://github.com/dotcodeschool",
  },
  {
    label: "Discord",
    icon: FaDiscord,
    href: "https://discord.gg/Z6QBZ886Bq",
  },
  {
    label: "Email",
    icon: FaEnvelope,
    href: "mailto:batman@dotcodeschool.com",
  },
];

const legalLinks = [
  {
    label: "Terms of Service",
    href: "/legal/terms-of-service",
  },
  {
    label: "Privacy Policy",
    href: "/legal/privacy-policy",
  },
  {
    label: "Disclaimer",
    href: "/legal/disclaimer",
  },
];

/**
 * Footer component that displays social media links and legal links.
 *
 * This component renders a footer with centered social media icons
 * and links to legal documents.
 *
 * @returns A footer element with social media and legal links
 * @example
 * ```tsx
 * <Footer />
 * ```
 */

const Footer = () => (
  <Box as="footer" mt={20} py={12} textAlign="center">
    <VStack spacing={6}>
      <HStack justify="center" spacing={8}>
        {socialLinks.map((link) => (
          <Link href={link.href} isExternal key={link.label}>
            <link.icon size={24} />
          </Link>
        ))}
      </HStack>

      <Divider maxW="200px" mx="auto" borderColor="gray.600" />

      <HStack justify="center" spacing={6}>
        {legalLinks.map((link) => (
          <Link
            href={link.href}
            key={link.label}
            fontSize="sm"
            color="gray.500"
            _hover={{ color: "gray.300", textDecoration: "underline" }}
          >
            {link.label}
          </Link>
        ))}
      </HStack>

      <Text fontSize="xs" color="gray.500">
        © {new Date().getFullYear()} DotCodeSchool. Funded by the Polkadot
        Treasury.
      </Text>
    </VStack>
  </Box>
);

export { Footer };

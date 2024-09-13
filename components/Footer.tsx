import { Box, HStack, Link } from "@chakra-ui/react";
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

export const Footer = () => (
  <Box as="footer" mt={20} py={12} textAlign="center">
    <HStack justify="center" spacing={8}>
      {socialLinks.map((link) => (
        <Link href={link.href} isExternal key={link.label}>
          <link.icon size={24} />
        </Link>
      ))}
    </HStack>
  </Box>
);

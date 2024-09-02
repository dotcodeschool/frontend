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

export default function Footer() {
  return (
    <Box as="footer" mt={20} py={12} textAlign="center">
      <HStack spacing={8} justify="center">
        {socialLinks.map((link) => (
          <Link key={link.label} href={link.href} isExternal>
            <link.icon size={24} />
          </Link>
        ))}
      </HStack>
    </Box>
  );
}

import {
  Button,
  ButtonGroup,
  IconButton,
  Link,
  Text,
  VStack,
} from "@chakra-ui/react";
import { FaDiscord, FaTwitter } from "react-icons/fa";

type SocialButtonsProps = {
  tweetText: string;
};

export const SocialButtons = ({ tweetText }: SocialButtonsProps) => (
  <VStack mt={8} opacity={1} transition="opacity 0.5s" transitionDelay="4s">
    <VStack mb={8} spacing={4}>
      <Button
        _hover={{
          bg: "gray.200",
          textDecoration: "none",
        }}
        as={Link}
        bg="white"
        color="gray.800"
        href={`https://twitter.com/intent/tweet?text=${tweetText}`}
        isExternal
        leftIcon={<FaTwitter />}
        px={12}
        size="lg"
        w="full"
      >
        Tweet Your Achievement
      </Button>
    </VStack>
    <ButtonGroup spacing={4}>
      <IconButton
        aria-label="Follow us on Twitter"
        as={Link}
        colorScheme="twitter"
        href="https://twitter.com/intent/user?screen_name=dotcodeschool"
        isExternal
        size="lg"
        variant="outline"
      >
        <FaTwitter />
      </IconButton>
      <IconButton
        aria-label="Join us on Discord"
        as={Link}
        colorScheme="purple"
        href="https://discord.gg/Z6QBZ886Bq"
        isExternal
        size="lg"
        variant="outline"
      >
        <FaDiscord />
      </IconButton>
    </ButtonGroup>
    <Text color="gray.400" fontSize="sm" fontStyle="italic" mb={2} mt={8}>
      We have more content coming soon... Stay tuned!
    </Text>
  </VStack>
);

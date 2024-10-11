import { IconButton, Link, Text } from "@chakra-ui/react";

const IconButtonFeedback = ({ url }: { url: string }) => (
  <IconButton
    _hover={{ textDecor: "none" }}
    aria-label="Submit Feedback"
    as={Link}
    bottom={20}
    colorScheme="blue"
    display={{ base: "block", md: "none" }}
    href={url}
    icon={
      <Text fontSize="xl" pt="2" textAlign="center" w="full">
        ✍️
      </Text>
    }
    isExternal
    position="fixed"
    right={4}
    variant="solid"
    zIndex={100}
  />
);

export { IconButtonFeedback };

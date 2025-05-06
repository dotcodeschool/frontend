import { Avatar, HStack, Text, VStack } from "@chakra-ui/react";

import { UserInfo } from "@/lib/types";

const UserDetails = ({ name, email, image }: UserInfo) => (
  <HStack
    pb={{ base: 0, md: 4 }}
    pt={{ base: 0, md: 2 }}
    px={{ base: 0, md: 4 }}
  >
    <Avatar name={name} src={image} />
    <VStack align="start" spacing={0}>
      <Text fontWeight="semibold">{name}</Text>
      <Text color="gray.400" fontSize="sm" fontWeight="normal">
        {email}
      </Text>
    </VStack>
  </HStack>
);

export { UserDetails };

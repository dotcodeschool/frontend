"use client";

import {
  Card,
  CardBody,
  Flex,
  Heading,
  Icon,
  List,
  ListIcon,
  ListItem,
  Text,
} from "@chakra-ui/react";
import { FaCheck, FaGraduationCap } from "react-icons/fa";

// Component to display prerequisites
export const Prerequisites = ({
  prerequisites,
}: {
  prerequisites: string[];
}) => {
  if (!prerequisites || prerequisites.length === 0) return null;

  return (
    <Card variant="outline" my={6}>
      <CardBody>
        <Flex align="center" mb={4}>
          <Icon as={FaGraduationCap} mr={2} color="green.500" />
          <Heading as="h3" size="md">
            Prerequisites
          </Heading>
        </Flex>
        {
          <List spacing={2}>
            {prerequisites.map((item, index) => (
              <ListItem key={index} display="flex" alignItems="flex-start">
                <ListIcon as={FaCheck} color="green.500" mt={1} />
                <Text>{item}</Text>
              </ListItem>
            ))}
          </List>
        }
      </CardBody>
    </Card>
  );
};

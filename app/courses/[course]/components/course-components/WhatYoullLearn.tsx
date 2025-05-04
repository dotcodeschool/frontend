"use client";

import {
  Card,
  CardBody,
  Heading,
  List,
  ListIcon,
  ListItem,
  SimpleGrid,
  Text,
} from "@chakra-ui/react";
import { FaCheck } from "react-icons/fa";

// Component to display "What You'll Learn"
export const WhatYoullLearn = ({
  whatYoullLearn,
}: {
  whatYoullLearn: string[];
}) => {
  if (!whatYoullLearn || whatYoullLearn.length === 0) return null;

  return (
    <Card variant="outline" my={6}>
      <CardBody>
        <Heading as="h3" size="md" mb={4}>
          What You&apos;ll Learn
        </Heading>
        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
          <List spacing={2}>
            {whatYoullLearn
              .slice(0, Math.ceil(whatYoullLearn.length / 2))
              .map((item, index) => (
                <ListItem key={index} display="flex" alignItems="flex-start">
                  <ListIcon as={FaCheck} color="green.500" mt={1} />
                  <Text>{item}</Text>
                </ListItem>
              ))}
          </List>
          {whatYoullLearn.length > 1 && (
            <List spacing={2}>
              {whatYoullLearn
                .slice(Math.ceil(whatYoullLearn.length / 2))
                .map((item, index) => (
                  <ListItem
                    key={index + Math.ceil(whatYoullLearn.length / 2)}
                    display="flex"
                    alignItems="flex-start"
                  >
                    <ListIcon as={FaCheck} color="green.500" mt={1} />
                    <Text>{item}</Text>
                  </ListItem>
                ))}
            </List>
          )}
        </SimpleGrid>
      </CardBody>
    </Card>
  );
};

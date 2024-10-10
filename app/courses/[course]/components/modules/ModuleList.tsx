import { Box, Flex, Grid, GridItem, Heading, Text } from "@chakra-ui/react";
import { MdCheckCircle } from "react-icons/md";

import { Section } from "@/lib/types";

const ModuleList = ({ sections }: { sections: Section[] }) => {
  const sectionsData = sections;

  return (
    <Box
      bg="gray.700"
      border="2px solid"
      borderColor="gray.600"
      my={12}
      p={8}
      rounded={16}
      shadow="2xl"
    >
      <Heading as="h2" mb={6} size="lg">
        What you&apos;ll learn:
      </Heading>
      <Grid
        gap={4}
        mb={4}
        templateColumns={["repeat(1, 1fr)", "repeat(2, 1fr)"]}
      >
        {sectionsData.map((section, index) => (
          <GridItem colSpan={1} key={index}>
            <Flex align="center">
              <MdCheckCircle color="#68D391" size={21} />
              <Text ml={2}>{section.title}</Text>
            </Flex>
          </GridItem>
        ))}
      </Grid>
    </Box>
  );
};

export { ModuleList };

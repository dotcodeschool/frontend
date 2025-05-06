import { Box, Heading, Image, Stack, Text } from "@chakra-ui/react";

import { FeatureProps } from "../types";

const Feature = ({
  title,
  description,
  image,
  alt,
  isImageFirst,
  cta,
}: FeatureProps) => (
  <Stack
    align="center"
    direction={isImageFirst ? ["column", "row-reverse"] : ["column", "row"]}
    mt={20}
    pb={20}
    spacing={8}
  >
    <Box w={["100%", "50%"]}>
      <Heading as="h1" fontWeight="800" size="2xl">
        {title}
      </Heading>
      <Text mt={4}>{description}</Text>
      {cta ? cta : null}
    </Box>
    <Box w={["100%", "50%"]}>
      <Image alt={alt} src={image} />
    </Box>
  </Stack>
);

export { Feature };

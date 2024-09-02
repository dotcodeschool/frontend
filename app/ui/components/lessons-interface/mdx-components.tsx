import {
  Box,
  Heading,
  Text,
  Link,
  Code,
  HeadingProps,
  TextProps,
  BoxProps,
  LinkProps,
  CodeProps,
} from "@chakra-ui/react";
import PreComponent from "./PreComponent";
import { IPreComponentProps } from "@/app/lib/types/IPreComponentProps";

const MDXComponents = {
  h1: (props: HeadingProps) => <Heading as="h1" size="xl" mt={4} {...props} />,
  h2: (props: HeadingProps) => <Heading as="h2" size="lg" mt={4} {...props} />,
  h3: (props: HeadingProps) => <Heading as="h3" size="md" mt={4} {...props} />,
  p: (props: TextProps) => <Text my={4} {...props} />,
  a: (props: LinkProps) => <Link color="green.300" isExternal {...props} />,
  ul: (props: BoxProps) => <Box as="ul" pt={2} pl={4} ml={2} {...props} />,
  ol: (props: BoxProps) => <Box as="ol" pt={2} pl={4} ml={2} {...props} />,
  li: (props: BoxProps) => <Box as="li" pb={4} {...props} />,

  code: (props: CodeProps) => (
    <Code colorScheme="orange" variant="subtle" {...props} />
  ),

  pre: (props: IPreComponentProps) => <PreComponent {...props} />,

  blockquote: (props: BoxProps) => (
    <Box
      as="blockquote"
      borderLeft="4px solid"
      borderColor="green.500"
      background="gray.700"
      pl={4}
      py={1}
      my={4}
      {...props}
    />
  ),
};

export default MDXComponents;

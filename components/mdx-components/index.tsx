import {
  Box,
  BoxProps,
  Code,
  CodeProps,
  Heading,
  HeadingProps,
  Link,
  LinkProps,
  Text,
  TextProps,
} from "@chakra-ui/react";
import { ReactElement } from "react";

import { IPreComponentProps } from "@/lib/types/IPreComponentProps";

import { PreComponent } from "./pre-component";

const MDXComponents = {
  h1: (props: HeadingProps) => <Heading as="h1" mt={12} size="xl" {...props} />,
  h2: (props: HeadingProps) => <Heading as="h2" mt={12} size="lg" {...props} />,
  h3: (props: HeadingProps) => <Heading as="h3" mt={12} size="md" {...props} />,
  p: (props: TextProps) => <Text my={4} {...props} />,
  a: (props: LinkProps) => <Link color="green.300" isExternal {...props} />,
  ul: (props: BoxProps) => <Box as="ul" ml={2} pl={4} pt={2} {...props} />,
  ol: (props: BoxProps) => <Box as="ol" ml={2} pl={4} pt={2} {...props} />,
  li: (props: BoxProps) => <Box as="li" pb={4} {...props} />,

  code: (props: CodeProps) => (
    <Code colorScheme="orange" variant="subtle" {...props} />
  ),

  pre: ({
    children,
    ...props
  }: {
    children: ReactElement;
    props: IPreComponentProps;
  }) => <PreComponent {...props}>{children}</PreComponent>,

  blockquote: (props: BoxProps) => (
    <Box
      as="blockquote"
      background="gray.700"
      borderColor="green.500"
      borderLeft="4px solid"
      my={4}
      pl={4}
      py={1}
      {...props}
    />
  ),
};

export { MDXComponents };

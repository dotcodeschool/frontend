import {
  Box,
  Code,
  CodeProps,
  Heading,
  HeadingProps,
  Link,
  LinkProps,
  Text,
  TextProps,
} from "@chakra-ui/react";
import { isValidElement } from "react";

import { TypeMDXComponents } from "@/lib/types";

import { PreComponent } from "./pre-component";
import { PreComponentProps } from "./types";

const MDXComponents: TypeMDXComponents = {
  h1: (props: HeadingProps) => <Heading as="h1" mt={12} size="xl" {...props} />,
  h2: (props: HeadingProps) => <Heading as="h2" mt={12} size="lg" {...props} />,
  h3: (props: HeadingProps) => <Heading as="h3" mt={12} size="md" {...props} />,
  p: (props: TextProps) => <Text my={4} {...props} />,
  a: (props: LinkProps) => <Link color="green.300" isExternal {...props} />,
  ul: (
    props: React.DetailedHTMLProps<
      React.HTMLAttributes<HTMLUListElement>,
      HTMLUListElement
    >,
  ) => <Box as="ul" ml={2} pl={4} pt={2} {...props} />,
  ol: (
    props: React.DetailedHTMLProps<
      React.OlHTMLAttributes<HTMLOListElement>,
      HTMLOListElement
    >,
  ) => <Box as="ol" ml={2} pl={4} pt={2} {...props} />,
  li: (
    props: React.DetailedHTMLProps<
      React.LiHTMLAttributes<HTMLLIElement>,
      HTMLLIElement
    >,
  ) => <Box as="li" pb={4} {...props} />,

  code: (props: CodeProps) => (
    <Code colorScheme="orange" variant="subtle" {...props} />
  ),

  pre: (props: React.ComponentProps<"pre"> & PreComponentProps) => {
    const { children, filename } = props;

    if (isValidElement(children) && typeof children.props === "object") {
      return <PreComponent filename={filename} {...children.props} />;
    }

    console.warn("Unexpected child type for <pre>: ", children);

    return <pre {...props} />;
  },

  blockquote: (
    props: React.DetailedHTMLProps<
      React.BlockquoteHTMLAttributes<HTMLQuoteElement>,
      HTMLQuoteElement
    >,
  ) => (
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

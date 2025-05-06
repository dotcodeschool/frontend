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
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Image,
  ImageProps,
  OrderedList,
  UnorderedList,
  ListItem,
} from "@chakra-ui/react";
import { isValidElement } from "react";

import { TypeMDXComponents } from "@/lib/types";

import { PreComponent } from "./pre-component";
import { PreComponentProps } from "./types";
import Quiz from "./quiz/Quiz";
import TrueFalseQuiz from "./quiz/TrueFalseQuiz";
import FillInTheBlankQuiz from "./quiz/FillInTheBlankQuiz";
import QuizGroup from "./quiz/QuizGroup";

const MDXComponents: TypeMDXComponents = {
  Quiz,
  TrueFalseQuiz,
  FillInTheBlankQuiz,
  QuizGroup,
  h1: (props: HeadingProps) => <Heading as="h1" mt={12} size="xl" {...props} />,
  h2: (props: HeadingProps) => <Heading as="h2" mt={12} size="lg" {...props} />,
  h3: (props: HeadingProps) => <Heading as="h3" mt={12} size="md" {...props} />,
  h4: (props: HeadingProps) => <Heading as="h4" mt={10} size="sm" {...props} />,
  h5: (props: HeadingProps) => (
    <Heading as="h5" mt={8} size="xs" fontWeight="semibold" {...props} />
  ),
  h6: (props: HeadingProps) => (
    <Heading as="h6" mt={8} size="xs" fontStyle="italic" {...props} />
  ),

  p: (props: TextProps) => <Text my={4} {...props} />,
  a: (props: LinkProps) => <Link color="green.300" isExternal {...props} />,

  ul: (
    props: React.DetailedHTMLProps<
      React.HTMLAttributes<HTMLUListElement>,
      HTMLUListElement
    >,
  ) => <UnorderedList ml={2} pl={4} pt={2} spacing={2} {...props} />,

  ol: (
    props: React.DetailedHTMLProps<
      React.OlHTMLAttributes<HTMLOListElement>,
      HTMLOListElement
    >,
  ) => <OrderedList ml={2} pl={4} pt={2} spacing={2} {...props} />,

  li: (
    props: React.DetailedHTMLProps<
      React.LiHTMLAttributes<HTMLLIElement>,
      HTMLLIElement
    >,
  ) => <ListItem pb={2} {...props} />,

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

  // Table components
  table: (props: any) => (
    <Box overflowX="auto" my={6}>
      <Table variant="simple" size="sm" {...props} />
    </Box>
  ),
  thead: Thead,
  tbody: Tbody,
  tr: Tr,
  th: (props: any) => <Th p={2} {...props} />,
  td: (props: any) => <Td p={2} {...props} />,

  // Image component
  img: (props: ImageProps) => (
    <Image my={4} borderRadius="md" maxW="100%" {...props} />
  ),

  // Custom components used in your template
  InfoBox: (props: any) => (
    <Alert
      status="info"
      variant="left-accent"
      my={4}
      borderRadius="md"
      flexDirection="column"
      alignItems="flex-start"
    >
      <Box display="flex" alignItems="center" width="100%">
        <AlertIcon />
        <AlertTitle fontSize="md" fontWeight="semibold">
          Info
        </AlertTitle>
      </Box>
      <AlertDescription mt={2} ml={8}>
        {props.children}
      </AlertDescription>
    </Alert>
  ),

  Warning: (props: any) => (
    <Alert
      status="warning"
      variant="left-accent"
      my={4}
      borderRadius="md"
      flexDirection="column"
      alignItems="flex-start"
    >
      <Box display="flex" alignItems="center" width="100%">
        <AlertIcon />
        <AlertTitle fontSize="md" fontWeight="semibold">
          Warning
        </AlertTitle>
      </Box>
      <AlertDescription mt={2} ml={8}>
        {props.children}
      </AlertDescription>
    </Alert>
  ),

  Success: (props: any) => (
    <Alert
      status="success"
      variant="left-accent"
      my={4}
      borderRadius="md"
      flexDirection="column"
      alignItems="flex-start"
    >
      <Box display="flex" alignItems="center" width="100%">
        <AlertIcon />
        <AlertTitle fontSize="md" fontWeight="semibold">
          Success
        </AlertTitle>
      </Box>
      <AlertDescription mt={2} ml={8}>
        {props.children}
      </AlertDescription>
    </Alert>
  ),

  Error: (props: any) => (
    <Alert
      status="error"
      variant="left-accent"
      my={4}
      borderRadius="md"
      flexDirection="column"
      alignItems="flex-start"
    >
      <Box display="flex" alignItems="center" width="100%">
        <AlertIcon />
        <AlertTitle fontSize="md" fontWeight="semibold">
          Error
        </AlertTitle>
      </Box>
      <AlertDescription mt={2} ml={8}>
        {props.children}
      </AlertDescription>
    </Alert>
  ),

  // Fallback component for any other custom components
  // This prevents errors from unknown components
  wrapper: ({ components, ...rest }: any) => <Box {...rest} />,
};

export { MDXComponents };

import { ChakraProps } from "@chakra-ui/react";

type ButtonPrimaryProps = ChakraProps & {
  as?: React.ElementType;
  href?: string;
  size?: "sm" | "md" | "lg";
  onClick?: () => void;
  children: React.ReactNode;
};

export type { ButtonPrimaryProps };

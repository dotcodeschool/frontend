import React from "react";
import {
  Button as ChakraButton,
  ButtonProps as ChakraButtonProps,
} from "@chakra-ui/react";
import { LinkProps } from "@chakra-ui/react";
import NextLink from "next/link";

export interface ButtonProps extends Omit<ChakraButtonProps, "as"> {
  href?: string;
  target?: string;
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  onClick?: () => void;
}

/**
 * Button component for MDX content
 * Can be used as a regular button with onClick or as a link with href
 */
const Button: React.FC<ButtonProps> = ({
  children,
  href,
  target,
  variant = "primary",
  size = "md",
  onClick,
  ...rest
}) => {
  // Map variant names to Chakra UI styles
  const variantStyles = {
    primary: {
      colorScheme: "green",
      bg: "green.300",
      color: "gray.900",
      fontWeight: "semibold",
      _hover: { bg: "green.500" },
    },
    secondary: {
      colorScheme: "gray",
      bg: "gray.600",
      color: "white",
      fontWeight: "semibold",
      _hover: { bg: "gray.700" },
    },
    outline: {
      variant: "outline",
      colorScheme: "green",
      borderColor: "green.300",
      color: "green.300",
      fontWeight: "semibold",
      _hover: { bg: "green.300", color: "gray.900" },
    },
    ghost: {
      variant: "ghost",
      colorScheme: "green",
      color: "green.300",
      fontWeight: "semibold",
      _hover: { bg: "green.100", color: "green.600" },
    },
  };

  // If href is provided, render as a link
  if (href) {
    return (
      <ChakraButton
        as={NextLink}
        href={href}
        target={target}
        size={size}
        my={4}
        borderRadius="md"
        {...variantStyles[variant]}
        {...rest}
      >
        {children}
      </ChakraButton>
    );
  }

  // Otherwise render as a button
  return (
    <ChakraButton
      size={size}
      onClick={onClick}
      my={4}
      borderRadius="md"
      {...variantStyles[variant]}
      {...rest}
    >
      {children}
    </ChakraButton>
  );
};

export default Button;

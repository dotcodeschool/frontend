import { Button, ChakraProps } from "@chakra-ui/react";

interface PrimaryButtonProps extends React.PropsWithChildren<ChakraProps> {
  as?: React.ElementType;
  href?: string;
  size?: "sm" | "md" | "lg";
  onClick?: () => void;
}

const PrimaryButton: React.FC<PrimaryButtonProps> = ({
  children,
  ...props
}) => {
  return (
    <Button colorScheme="green" color="gray.800" {...props}>
      {children}
    </Button>
  );
};

export default PrimaryButton;

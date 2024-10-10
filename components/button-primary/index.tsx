import { Button } from "@chakra-ui/react";

import { ButtonPrimaryProps } from "./types";

const ButtonPrimary = ({ children, ...props }: ButtonPrimaryProps) => (
  <Button color="gray.800" colorScheme="green" {...props}>
    {children}
  </Button>
);

export { ButtonPrimary };

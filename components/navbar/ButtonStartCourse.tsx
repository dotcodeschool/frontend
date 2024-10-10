import { ChakraProps } from "@chakra-ui/react";
import Link from "next/link";

import { ButtonPrimary } from "../button-primary";

const ButtonStartCourse = ({ ...props }: ChakraProps) => (
  <ButtonPrimary
    _hover={{ textDecor: "none" }}
    as={Link}
    href="/courses"
    {...props}
  >
    Courses
  </ButtonPrimary>
);

export { ButtonStartCourse };

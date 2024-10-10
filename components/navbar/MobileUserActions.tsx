import { ChakraProps } from "@chakra-ui/react";

import { ButtonStartCourse } from "./ButtonStartCourse";
import { MobileUserMenu } from "./MobileUserMenu";

const MobileUserActions = ({
  cta = true,
  ...restProps
}: { cta: boolean } & ChakraProps) =>
  cta ? <ButtonStartCourse {...restProps} /> : <MobileUserMenu />;

export { MobileUserActions };

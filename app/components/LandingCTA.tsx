import { Button, ButtonGroup, Link } from "@chakra-ui/react";

import { ButtonPrimary } from "@/components";

const LandingCTA = () => (
  <ButtonGroup
    flexWrap={{
      base: "wrap",
      md: "nowrap",
    }}
    spacing={{
      base: 0,
      md: 4,
    }}
  >
    <ButtonPrimary
      _hover={{ textDecor: "none" }}
      as={Link}
      fontSize="xl"
      href="/courses"
      mb={{
        base: 4,
        md: 0,
      }}
      p={8}
      w={{
        base: "full",
        md: "auto",
      }}
    >
      Browse Courses
    </ButtonPrimary>
    <Button
      _hover={{ textDecor: "none" }}
      as={Link}
      colorScheme="gray"
      fontSize="xl"
      href="https://forms.gle/2o4hBauCJ6Fkf9Zz7"
      isExternal
      p={8}
      variant="solid"
      w={{
        base: "full",
        md: "auto",
      }}
    >
      Become a Teacher
    </Button>
  </ButtonGroup>
);

export { LandingCTA };

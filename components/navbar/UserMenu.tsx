import {
  Avatar,
  Box,
  Button,
  HStack,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
} from "@chakra-ui/react";
import { useSession } from "next-auth/react";

import { getUserInfo, isUserInfoError } from "@/lib/helpers";

import { ButtonLogin, ButtonLogout } from "./authentication";
import { UserDetails } from "./UserDetails";

const UserMenu = () => {
  const { data: session } = useSession();
  const user = getUserInfo(session);

  if (isUserInfoError(user)) {
    const errorMessage = user.message;
    console.error(errorMessage);

    return <ButtonLogin />;
  }

  const { email, image, name } = user;

  return (
    <Box display={{ base: "none", md: "block" }}>
      <Menu>
        <MenuButton as={Button} variant="unstyled">
          <HStack>
            <Avatar name={name} size="sm" src={image} />
          </HStack>
        </MenuButton>
        <MenuList>
          <UserDetails email={email} image={image} name={name} />
          <hr />
          <MenuItem as="a" href="/settings">
            Settings
          </MenuItem>
          <ButtonLogout isMenu={true} />
        </MenuList>
      </Menu>
    </Box>
  );
};

export { UserMenu };

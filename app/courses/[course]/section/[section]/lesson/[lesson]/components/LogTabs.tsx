import {
  Tab,
  TabIndicator,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
} from "@chakra-ui/react";
import { IoTerminal } from "react-icons/io5";

const LogTabs = () => (
  <Tabs variant="unstyled">
    <TabList borderBottom="none">
      <Tab color="gray.400" fontSize="sm" px={2}>
        <IoTerminal />
        <Text pl={2}>Logs</Text>
      </Tab>
    </TabList>
    <TabIndicator bg="gray.400" borderRadius="1px" height="3px" mt="-1.5px" />
    <TabPanels pt={2}>
      <TabPanel
        background="gray.800"
        border="1px solid"
        borderColor="gray.600"
        rounded="md"
      >
        <Text>Logs</Text>
      </TabPanel>
    </TabPanels>
  </Tabs>
);

export { LogTabs };

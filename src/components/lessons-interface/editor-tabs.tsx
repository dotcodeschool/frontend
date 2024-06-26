import {
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  IconButton,
  Flex,
  Tooltip,
} from "@chakra-ui/react";
import { DiffEditor, Editor } from "@monaco-editor/react";
import { map, find, matches, endsWith, repeat } from "lodash";
import stripComments from "strip-comments";
import { FiMaximize2 } from "react-icons/fi";
import { IoGitCompareOutline } from "react-icons/io5";
import { parseDiff } from "@/utils";

// TODO: Move to a types.ts file
type File = {
  fileName: string;
  code: string;
  language: string;
};

interface EditorTabsProps {
  showHints: boolean;
  isAnswerOpen: boolean;
  readOnly?: boolean;
  incorrectFiles: File[];
  solution: File[];
  editorContent: File[];
  setEditorContent: (editorContent: File[]) => void;
}

const EditorTabs = ({
  showHints,
  isAnswerOpen,
  readOnly,
  incorrectFiles,
  solution,
  editorContent,
  setEditorContent,
}: EditorTabsProps) => {
  return (
    <Tabs
      variant="unstyled"
      h="80vh"
      border="1px solid"
      borderColor="whiteAlpha.200"
      bg="#2e2e2e"
      w="auto"
    >
      <TabList>
        <Flex
          position="relative"
          w="full"
          sx={{
            overflowX: "auto",
            height: "100%",
            "::-webkit-scrollbar": {
              height: "2px",
            },
            ":hover::-webkit-scrollbar-thumb": { background: "whiteAlpha.300" },
          }}
        >
          {map(editorContent, (file, i) => {
            const incorrectColor = find(
              incorrectFiles,
              matches({ fileName: file.fileName }),
            )
              ? "red.300"
              : null;
            return (
              !endsWith(file.fileName, ".diff") && (
                <Tab
                  key={i}
                  borderRight="1px solid"
                  borderRightColor="#111111"
                  color={incorrectColor ? incorrectColor : "whiteAlpha.600"}
                  _hover={{ bg: "whiteAlpha.300" }}
                  _selected={{
                    bg: "whiteAlpha.100",
                    color: incorrectColor ? incorrectColor : "orange.200",
                    borderBottom: "1px solid",
                    borderColor: incorrectColor ? incorrectColor : "orange.200",
                    borderRightColor: "#111111",
                  }}
                >
                  {file.fileName}
                </Tab>
              )
            );
          })}
        </Flex>
        <Flex alignItems="center" px={2}>
          <Tooltip
            hasArrow
            maxW={32}
            label="Enter Fullscreen Code Editor"
            textAlign="center"
          >
            <IconButton
              size="sm"
              bg="none"
              p={0}
              aria-label="Enter Fullscreen Code Editor"
              icon={<FiMaximize2 size={18} />}
            />
          </Tooltip>
          <Tooltip hasArrow maxW={32} label="Open Changes" textAlign="center">
            <IconButton
              size="sm"
              bg="none"
              p={0}
              aria-label="Open Changes"
              icon={<IoGitCompareOutline size={18} />}
            />
          </Tooltip>
        </Flex>
      </TabList>
      <TabPanels h="90%">
        {map(editorContent, (file, i) => (
          <TabPanel key={i} h="100%" p={0} pb={0}>
            {file.language === "diff" ? (
              <DiffEditor
                height="100%"
                theme="vs-dark"
                language="rust"
                original={parseDiff(file.code).originalContent}
                modified={parseDiff(file.code).modifiedContent}
                options={{
                  readOnly: true,
                  renderSideBySide: false,
                  automaticLayout: true,
                }}
              />
            ) : (
              <Editor
                height={isAnswerOpen ? "0%" : "100%"}
                theme="vs-dark"
                defaultLanguage={file.language || "rust"}
                defaultValue={file.code || "// placeholder"}
                options={{ readOnly: readOnly || file.language === "diff" }}
                onChange={(value) => {
                  const newEditorContent = [...editorContent];
                  newEditorContent[i].code = value?.toString() || "";
                  setEditorContent(newEditorContent);
                }}
              />
            )}
            {isAnswerOpen && (
              <DiffEditor
                height="100%"
                theme="vs-dark"
                original={
                  showHints ? stripComments(editorContent[i]?.code) : ""
                }
                modified={showHints ? stripComments(solution[i]?.code) : ""}
                options={{ readOnly: true, comments: false }}
              />
            )}
          </TabPanel>
        ))}
      </TabPanels>
    </Tabs>
  );
};

export default EditorTabs;

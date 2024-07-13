import {
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  IconButton,
  Flex,
  Tooltip,
  CloseButton,
} from "@chakra-ui/react";
import { DiffEditor, Editor } from "@monaco-editor/react";
import { map, find, matches, endsWith } from "lodash";
import stripComments from "strip-comments";
import { FiMaximize2, FiMinimize2 } from "react-icons/fi";
import { IoGitCompareOutline } from "react-icons/io5";
import { parseDiff } from "@/utils";

// TODO: Move to a types.ts file
type File = {
  fileName: string;
  code: string;
  language: string;
};

interface setEditorContent {
  (newEditorContent: File[]): void;
}

export interface EditorTabsProps {
  showHints: boolean;
  isAnswerOpen: boolean;
  readOnly?: boolean;
  incorrectFiles: File[];
  solution: File[];
  editorContent: File[];
  isOpen: boolean;
  tabIndex: number;
  showDiff: boolean;
  setShowDiff: (showDiff: boolean) => void;
  setTabIndex: (index: number) => void;
  onOpen: () => void;
  onClose: () => void;
  setEditorContent: setEditorContent;
}

const EditorTabs = ({
  showHints,
  isAnswerOpen,
  readOnly,
  incorrectFiles,
  solution,
  editorContent,
  isOpen,
  tabIndex,
  showDiff,
  setShowDiff,
  setTabIndex,
  onOpen,
  onClose,
  setEditorContent,
}: EditorTabsProps) => {
  const handleTabsChange = (index: number) => {
    setTabIndex(index);
  };

  return (
    <Tabs
      index={tabIndex}
      onChange={handleTabsChange}
      variant="unstyled"
      h={isOpen ? "100vh" : "80vh"}
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
              <Tab
                key={i}
                as={
                  showDiff && endsWith(file.fileName, ".diff") ? "i" : undefined
                }
                display={
                  !showDiff && endsWith(file.fileName, ".diff")
                    ? "none"
                    : "block"
                }
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
                {showDiff && endsWith(file.fileName, ".diff") && (
                  <>
                    &nbsp;(Prev. Changes)
                    <CloseButton
                      display={"inline"}
                      size="sm"
                      p={0}
                      verticalAlign="middle"
                      h="fit-content"
                      bg="transparent"
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowDiff(false);
                        setTabIndex(0);
                      }}
                    />
                  </>
                )}
              </Tab>
            );
          })}
        </Flex>
        <Flex alignItems="center" px={2}>
          <Tooltip
            hasArrow
            maxW={32}
            label={showDiff ? "Hide Changes" : "Open Changes"}
            textAlign="center"
          >
            <IconButton
              size="sm"
              bg="none"
              p={0}
              aria-label={showDiff ? "Hide Changes" : "Open Changes"}
              icon={<IoGitCompareOutline size={18} />}
              onClick={() => setShowDiff(!showDiff)}
            />
          </Tooltip>
          <Tooltip
            hasArrow
            maxW={32}
            label={
              isOpen
                ? "Exit Fullscreen Code Editor"
                : "Enter Fullscreen Code Editor"
            }
            textAlign="center"
          >
            <IconButton
              size="sm"
              bg="none"
              p={0}
              aria-label={
                isOpen
                  ? "Exit Fullscreen Code Editor"
                  : "Enter Fullscreen Code Editor"
              }
              icon={
                isOpen ? <FiMinimize2 size={18} /> : <FiMaximize2 size={18} />
              }
              onClick={isOpen ? onClose : onOpen}
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
                key={i + file.fileName}
                height={isAnswerOpen ? "0%" : "100%"}
                theme="vs-dark"
                defaultLanguage={file.language || "rust"}
                defaultValue={file.code || "// placeholder"}
                options={{ readOnly: readOnly || file.language === "diff" }}
                value={file.code}
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

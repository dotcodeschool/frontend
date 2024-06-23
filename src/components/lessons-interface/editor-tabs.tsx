import { Tabs, TabList, TabPanels, Tab, TabPanel } from "@chakra-ui/react";
import { DiffEditor, Editor } from "@monaco-editor/react";
import { map, find, matches, endsWith } from "lodash";
import stripComments from "strip-comments";
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
      variant="enclosed"
      p={1}
      h="80vh"
      border="1px solid"
      borderColor="whiteAlpha.200"
      bg="#1e1e1e"
      rounded={8}
      w="auto"
    >
      <TabList
        overflowX="auto"
        overflowY="hidden"
        gap={1}
        sx={{
          "::-webkit-scrollbar": {
            height: "1px",
            borderRadius: "8px",
          },
          "::-webkit-scrollbar-thumb": {
            height: "1px",
            borderRadius: "8px",
          },
          ":hover::-webkit-scrollbar-thumb": { background: "gray.700" },
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
                border="none"
                color={incorrectColor ? incorrectColor : "whiteAlpha.600"}
                _hover={{ bg: "whiteAlpha.200" }}
                _selected={{
                  bg: "whiteAlpha.200",
                  color: incorrectColor ? incorrectColor : "orange.200",
                  borderBottom: "2px solid",
                  borderColor: incorrectColor ? incorrectColor : "orange.200",
                }}
              >
                {file.fileName}
              </Tab>
            )
          );
        })}
      </TabList>
      <TabPanels h="87%" pt={2}>
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

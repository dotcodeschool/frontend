import { TabPanel, HStack, Button, Icon, Text } from "@chakra-ui/react";
import { Editor, DiffEditor } from "@monaco-editor/react";
import { find } from "lodash";
import React from "react";
import { IoEyeOffOutline, IoCheckmarkDone } from "react-icons/io5";
import { MdCompareArrows } from "react-icons/md";
import stripComments from "strip-comments";

import { TypeFile } from "@/lib/types";

type EditorTabPanelProps = {
  file: TypeFile;
  index: number;
  showHints: boolean;
  readOnly: boolean;
  editorContent: TypeFile[];
  setEditorContent: React.Dispatch<React.SetStateAction<TypeFile[]>>;
  isAnswerOpen: boolean;
  solution: TypeFile[];
  doesAnswerMatch: boolean;
  compareAnswerAndUpdateState: () => void;
  toggleAnswer: () => void;
};

const getCodeWithoutComments = (showHints: boolean, code: string) =>
  showHints ? stripComments(code) : "";

const getSolutionCode = (
  solution: TypeFile[],
  fileName: string,
  defaultCode: string,
) => find(solution, (file) => file.fileName === fileName)?.code ?? defaultCode;

type RenderEditorProps = {
  file: TypeFile;
  index: number;
  isAnswerOpen: boolean;
  readOnly: boolean;
  editorContent: TypeFile[];
  setEditorContent: React.Dispatch<React.SetStateAction<TypeFile[]>>;
};
const renderEditor = ({
  file,
  index,
  isAnswerOpen,
  readOnly,
  editorContent,
  setEditorContent,
}: RenderEditorProps) => (
  <Editor
    defaultLanguage={file.language || "rust"}
    defaultValue={file.code || "// placeholder"}
    height={isAnswerOpen ? "0%" : "100%"}
    key={index + file.fileName}
    onChange={(value) => {
      const newEditorContent = [...editorContent];
      newEditorContent[index].code = value?.toString() ?? "";
      setEditorContent(newEditorContent);
    }}
    options={{ readOnly: readOnly || file.language === "diff" }}
    theme="vs-dark"
    value={file.code}
  />
);

const renderDiffEditor = (userCode: string, solutionCode: string) => (
  <DiffEditor
    height="100%"
    modified={solutionCode}
    options={{ readOnly: true }}
    original={userCode}
    theme="vs-dark"
  />
);

const renderHintsPanel = (
  isAnswerOpen: boolean,
  doesAnswerMatch: boolean,
  compareAnswerAndUpdateState: () => void,
  toggleAnswer: () => void,
) => (
  <HStack alignItems="center" bg="#2e2e2e" p={2} w="full">
    <Button
      leftIcon={<Icon as={isAnswerOpen ? IoEyeOffOutline : MdCompareArrows} />}
      onClick={() => {
        compareAnswerAndUpdateState();
        toggleAnswer();
      }}
      variant="outline"
    >
      {isAnswerOpen ? "Hide" : "Compare"} Answer
    </Button>
    {isAnswerOpen && doesAnswerMatch ? (
      <HStack>
        <Icon as={IoCheckmarkDone} color="green.300" />
        <Text color="green.300">Your solution matches ours</Text>
      </HStack>
    ) : null}
  </HStack>
);

export const EditorTabPanel: React.FC<EditorTabPanelProps> = ({
  file,
  index,
  showHints,
  readOnly,
  editorContent,
  setEditorContent,
  isAnswerOpen,
  solution,
  doesAnswerMatch,
  compareAnswerAndUpdateState,
  toggleAnswer,
}) => {
  const parsedCode = getCodeWithoutComments(
    showHints,
    editorContent[index]?.code || "",
  );
  const solutionCode = getSolutionCode(
    solution,
    editorContent[index].fileName,
    editorContent[index]?.code || "",
  );
  const parsedSolution = getCodeWithoutComments(showHints, solutionCode);

  let hintsPanel = null;
  if (showHints) {
    hintsPanel = renderHintsPanel(
      isAnswerOpen,
      doesAnswerMatch,
      compareAnswerAndUpdateState,
      toggleAnswer,
    );
  }

  return (
    <TabPanel h="full" p={0} pb={0}>
      {renderEditor({
        file,
        index,
        isAnswerOpen,
        readOnly,
        editorContent,
        setEditorContent,
      })}
      {isAnswerOpen ? renderDiffEditor(parsedCode, parsedSolution) : null}
      {hintsPanel}
    </TabPanel>
  );
};

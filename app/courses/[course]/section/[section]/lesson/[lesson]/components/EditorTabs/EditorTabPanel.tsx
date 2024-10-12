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

export const EditorTabPanel = ({
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
}: EditorTabPanelProps) => {
  const userCodeWithoutComments = showHints
    ? stripComments(editorContent[index]?.code)
    : "";
  const solutionWithoutComments = showHints
    ? stripComments(
        find(
          solution,
          ({ fileName }) => fileName === editorContent[index].fileName,
        )?.code ??
          editorContent[index]?.code ??
          "",
      )
    : "";

  return (
    <TabPanel h="full" p={0} pb={0}>
      <Editor
        defaultLanguage={file.language ?? "rust"}
        defaultValue={file.code ?? "// placeholder"}
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
      {isAnswerOpen ? (
        <DiffEditor
          height="100%"
          modified={solutionWithoutComments}
          options={{ readOnly: true }}
          original={userCodeWithoutComments}
          theme="vs-dark"
        />
      ) : null}
      {showHints ? (
        <HStack alignItems="center" bg="#2e2e2e" p={2} w="full">
          <Button
            leftIcon={
              <Icon as={isAnswerOpen ? IoEyeOffOutline : MdCompareArrows} />
            }
            onClick={() => {
              compareAnswerAndUpdateState();
              toggleAnswer();
            }}
            variant="outline"
          >
            {isAnswerOpen ? "Hide" : "Compare"} Answer
          </Button>
          {doesAnswerMatch && isAnswerOpen ? (
            <HStack>
              <Icon as={IoCheckmarkDone} color="green.300" />
              <Text color="green.300">Your solution matches ours</Text>
            </HStack>
          ) : null}
        </HStack>
      ) : null}
    </TabPanel>
  );
};

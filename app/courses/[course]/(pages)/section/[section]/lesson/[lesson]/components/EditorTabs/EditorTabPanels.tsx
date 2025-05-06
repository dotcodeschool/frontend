import { TabPanels } from "@chakra-ui/react";
import { map } from "lodash";
import React from "react";

import { TypeFile } from "@/lib/types";

import { EditorTabPanel } from "./EditorTabPanel";

type EditorTabPanelsProps = {
  editorContent: TypeFile[];
  setEditorContent: React.Dispatch<React.SetStateAction<TypeFile[]>>;
  showHints: boolean;
  readOnly: boolean;
  isAnswerOpen: boolean;
  solution: TypeFile[];
  doesAnswerMatch: boolean;
  toggleAnswer: () => void;
  compareAnswerAndUpdateState: () => void;
};

export const EditorTabPanels = ({
  editorContent,
  setEditorContent,
  showHints,
  readOnly,
  isAnswerOpen,
  solution,
  doesAnswerMatch,
  toggleAnswer,
  compareAnswerAndUpdateState,
}: EditorTabPanelsProps) => (
  <TabPanels h="full">
    {map(editorContent, (file, i) => (
      <EditorTabPanel
        compareAnswerAndUpdateState={compareAnswerAndUpdateState}
        doesAnswerMatch={doesAnswerMatch}
        editorContent={editorContent}
        file={file}
        index={i}
        isAnswerOpen={isAnswerOpen}
        key={i}
        readOnly={readOnly}
        setEditorContent={setEditorContent}
        showHints={showHints}
        solution={solution}
        toggleAnswer={toggleAnswer}
      />
    ))}
  </TabPanels>
);

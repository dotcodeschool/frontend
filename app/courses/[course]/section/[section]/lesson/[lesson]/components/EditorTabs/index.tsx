"use client";

import { Tabs } from "@chakra-ui/react";
import React from "react";

import { EditorTabList } from "./EditorTabList";
import { EditorTabPanels } from "./EditorTabPanels";
import { useEditorTabs } from "./hooks/useEditorTabs";

type EditorTabsProps = {
  showHints: boolean;
  readOnly: boolean;
  isOpen: boolean;
  handleFullscreenToggle: () => void;
};

export const EditorTabsComponent = ({
  showHints,
  readOnly,
  isOpen,
  handleFullscreenToggle,
}: EditorTabsProps) => {
  const { tabIndex, handleTabsChange, editorContent, ...editorProps } =
    useEditorTabs();

  return (
    <Tabs
      bg="#2e2e2e"
      h={getEditorHeight(readOnly, isOpen)}
      index={tabIndex}
      onChange={handleTabsChange}
      variant="unstyled"
      w="full"
    >
      <EditorTabList
        editorContent={editorContent}
        handleFullscreenToggle={handleFullscreenToggle}
        isOpen={isOpen}
        {...editorProps}
      />
      <EditorTabPanels
        editorContent={editorContent}
        readOnly={readOnly}
        showHints={showHints}
        {...editorProps}
      />
    </Tabs>
  );
};

const getEditorHeight = (readOnly: boolean, isOpen: boolean): string => {
  if (readOnly) {
    return "100vh";
  }
  if (isOpen) {
    return "calc(100vh - 96px)";
  }

  return "calc(100vh - 225px)";
};

export const EditorTabs = React.memo(EditorTabsComponent);

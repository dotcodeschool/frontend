"use client";

import {
  Button,
  CloseButton,
  Flex,
  HStack,
  Icon,
  IconButton,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  Tooltip,
  useToast,
} from "@chakra-ui/react";
import { DiffEditor, Editor } from "@monaco-editor/react";
import { endsWith, find, isEmpty, map, matches } from "lodash";
import React, { useCallback, useEffect, useRef } from "react";
import { FiMaximize2, FiMinimize2 } from "react-icons/fi";
import {
  IoCheckmarkDone,
  IoEyeOffOutline,
  IoGitCompareOutline,
} from "react-icons/io5";
import { MdCompareArrows } from "react-icons/md";
import stripComments from "strip-comments";

import { useEditor } from "./EditorComponents";

export type EditorTabsProps = {
  showHints: boolean;
  readOnly?: boolean;
  isOpen: boolean;
  handleFullscreenToggle: (e: React.MouseEvent) => void;
};

const EditorTabsComponent = ({
  showHints,
  readOnly,
  isOpen,
  handleFullscreenToggle,
}: EditorTabsProps) => {
  const {
    compareAnswerAndUpdateState,
    doesAnswerMatch,
    incorrectFiles,
    isAnswerOpen,
    tabIndex,
    setTabIndex,
    solution,
    editorContent,
    setEditorContent,
    showDiff,
    toggleAnswer,
    toggleDiff,
  } = useEditor();
  const isUserInteraction = useRef(false);

  const toast = useToast();

  const handleTabsChange = useCallback(
    (index: number) => {
      if (isUserInteraction.current) {
        setTabIndex(index);
      }
      isUserInteraction.current = false;
    },
    [setTabIndex],
  );

  const handleTabClick = useCallback(() => {
    isUserInteraction.current = true;
  }, []);

  useEffect(() => {
    if (isAnswerOpen) {
      toast.closeAll();
      if (doesAnswerMatch) {
        toast({
          title: "Your solution matches ours",
          description:
            "Great job! Your solution matches ours. You can now move on to the next step.",
          status: "success",
          duration: 9000,
          isClosable: true,
        });
      } else {
        toast({
          title: "Your solution doesn't match ours",
          description:
            "This doesn't mean you're wrong! We just might have different ways of solving the problem.",
          status: "warning",
          duration: 9000,
          isClosable: true,
        });
      }
    }
  }, [doesAnswerMatch, isAnswerOpen, toast]);

  return (
    <Tabs
      bg="#2e2e2e"
      h={
        readOnly
          ? "100vh"
          : isOpen
            ? "calc(100vh - 96px)"
            : "calc(100vh - 225px)"
      }
      index={tabIndex}
      onChange={(e) => handleTabsChange(e)}
      variant="unstyled"
      w="full"
    >
      <TabList>
        <Flex
          position="relative"
          sx={{
            overflowX: "auto",
            height: "100%",
            "::-webkit-scrollbar": {
              height: "2px",
            },
            ":hover::-webkit-scrollbar-thumb": {
              background: "whiteAlpha.300",
            },
          }}
          w="full"
        >
          {isEmpty(editorContent) ? (
            <Text m={4}>No files edited in this step.</Text>
          ) : (
            map(editorContent, (file, i) => {
              const incorrectColor = find(
                incorrectFiles,
                matches({ fileName: file.fileName }),
              )
                ? "red.300"
                : null;

              return (
                <Tab
                  _hover={{ bg: "whiteAlpha.300" }}
                  _selected={{
                    bg: "whiteAlpha.100",
                    color: incorrectColor ? incorrectColor : "orange.200",
                    borderBottom: "1px solid",
                    borderColor: incorrectColor ? incorrectColor : "orange.200",
                    borderRightColor: "#111111",
                  }}
                  as={
                    showDiff && endsWith(file.fileName, ".diff")
                      ? "i"
                      : undefined
                  }
                  borderRight="1px solid"
                  borderRightColor="#111111"
                  color={incorrectColor ? incorrectColor : "whiteAlpha.600"}
                  display={
                    !showDiff && endsWith(file.fileName, ".diff")
                      ? "none"
                      : "block"
                  }
                  key={i}
                  onClick={() => {
                    handleTabClick();
                  }}
                >
                  {file.fileName}
                  {showDiff && endsWith(file.fileName, ".diff") ? (
                    <>
                      &nbsp;(Prev. Changes)
                      <CloseButton
                        bg="transparent"
                        display="inline"
                        h="fit-content"
                        onClick={(e) => {
                          e.stopPropagation();
                          isUserInteraction.current = true;
                          toggleDiff();
                        }}
                        p={0}
                        size="sm"
                        verticalAlign="middle"
                      />
                    </>
                  ) : null}
                </Tab>
              );
            })
          )}
        </Flex>
        <Flex
          alignItems="center"
          display={isEmpty(editorContent) ? "none" : "flex"}
          px={2}
        >
          <Tooltip
            hasArrow
            label={showDiff ? "Hide Changes" : "Open Changes"}
            maxW={32}
            textAlign="center"
          >
            <IconButton
              aria-label={showDiff ? "Hide Changes" : "Open Changes"}
              bg="none"
              icon={<IoGitCompareOutline size={18} />}
              onClick={() => {
                isUserInteraction.current = showDiff;
                toggleDiff();
              }}
              p={0}
              size="sm"
            />
          </Tooltip>
          <Tooltip
            hasArrow
            label={
              isOpen
                ? "Exit Fullscreen Code Editor"
                : "Enter Fullscreen Code Editor"
            }
            maxW={32}
            textAlign="center"
          >
            <IconButton
              aria-label={
                isOpen
                  ? "Exit Fullscreen Code Editor"
                  : "Enter Fullscreen Code Editor"
              }
              bg="none"
              icon={
                isOpen ? <FiMinimize2 size={18} /> : <FiMaximize2 size={18} />
              }
              onClick={handleFullscreenToggle}
              p={0}
              size="sm"
            />
          </Tooltip>
        </Flex>
      </TabList>
      <TabPanels h="full">
        {map(editorContent, (file, i) => {
          const userCodeWithoutComments = showHints
            ? stripComments(editorContent[i]?.code)
            : "";
          const solutionWithoutComments = showHints
            ? stripComments(
                find(
                  solution,
                  ({ fileName }) => fileName === editorContent[i].fileName,
                )?.code ??
                  editorContent[i]?.code ??
                  "",
              )
            : "";

          return (
            <TabPanel h="full" key={i} p={0} pb={0}>
              <Editor
                defaultLanguage={file.language || "rust"}
                defaultValue={file.code || "// placeholder"}
                height={isAnswerOpen ? "0%" : "100%"}
                key={i + file.fileName}
                onChange={(value) => {
                  const newEditorContent = [...editorContent];
                  newEditorContent[i].code = value?.toString() || "";
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
                      <Icon
                        as={isAnswerOpen ? IoEyeOffOutline : MdCompareArrows}
                      />
                    }
                    onClick={() => {
                      isUserInteraction.current = true;
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
        })}
      </TabPanels>
    </Tabs>
  );
};

const EditorTabs = React.memo(EditorTabsComponent);

export { EditorTabs };

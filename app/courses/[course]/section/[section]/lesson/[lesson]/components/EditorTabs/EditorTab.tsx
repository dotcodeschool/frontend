import { Tab, CloseButton } from "@chakra-ui/react";
import { endsWith, find, matches } from "lodash";
import React from "react";

export const EditorTab = ({
  file,
  index,
  incorrectFiles,
  showDiff,
  toggleDiff,
  handleTabClick,
  isUserInteraction,
}) => {
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
        color: incorrectColor ?? "orange.200",
        borderBottom: "1px solid",
        borderColor: incorrectColor ?? "orange.200",
        borderRightColor: "#111111",
      }}
      as={showDiff && endsWith(file.fileName, ".diff") ? "i" : undefined}
      borderRight="1px solid"
      borderRightColor="#111111"
      color={incorrectColor ?? "whiteAlpha.600"}
      display={!showDiff && endsWith(file.fileName, ".diff") ? "none" : "block"}
      onClick={handleTabClick}
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
};

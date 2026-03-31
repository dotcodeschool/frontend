import { Tab, CloseButton } from "@chakra-ui/react";
import { endsWith, find, matches } from "lodash";
import React from "react";

type EditorTabProps = {
  file: { fileName: string };
  incorrectFiles: Array<{ fileName: string }>;
  showDiff: boolean;
  toggleDiff: () => void;
  handleTabClick: () => void;
  isUserInteraction: React.MutableRefObject<boolean>;
};

const getIncorrectColor = (
  file: { fileName: string },
  incorrectFiles: Array<{ fileName: string }>,
) =>
  find(incorrectFiles, matches({ fileName: file.fileName })) ? "red.300" : null;

const getTabStyle = (incorrectColor: string | null) => ({
  _hover: { bg: "whiteAlpha.300" },
  _selected: {
    bg: "whiteAlpha.100",
    color: incorrectColor ?? "orange.200",
    borderBottom: "1px solid",
    borderColor: incorrectColor ?? "orange.200",
    borderRightColor: "#111111",
  },
  borderRight: "1px solid",
  borderRightColor: "#111111",
  color: incorrectColor ?? "whiteAlpha.600",
});

const isDiffFile = (fileName: string) => endsWith(fileName, ".diff");

const renderDiffContent = (
  toggleDiff: () => void,
  isUserInteraction: React.MutableRefObject<boolean>,
) => (
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
);

const getTabAs = (showDiff: boolean, fileName: string) =>
  showDiff && isDiffFile(fileName) ? "i" : undefined;

const getTabDisplay = (showDiff: boolean, fileName: string) =>
  !showDiff && isDiffFile(fileName) ? "none" : "block";

export const EditorTab: React.FC<EditorTabProps> = ({
  file,
  incorrectFiles,
  showDiff,
  toggleDiff,
  handleTabClick,
  isUserInteraction,
}) => {
  const incorrectColor = getIncorrectColor(file, incorrectFiles);
  const tabStyle = getTabStyle(incorrectColor);
  const tabAs = getTabAs(showDiff, file.fileName);
  const tabDisplay = getTabDisplay(showDiff, file.fileName);

  const renderContent = () => {
    if (showDiff && isDiffFile(file.fileName)) {
      return (
        <>
          {file.fileName}
          {renderDiffContent(toggleDiff, isUserInteraction)}
        </>
      );
    }

    return file.fileName;
  };

  return (
    <Tab {...tabStyle} as={tabAs} display={tabDisplay} onClick={handleTabClick}>
      {renderContent()}
    </Tab>
  );
};

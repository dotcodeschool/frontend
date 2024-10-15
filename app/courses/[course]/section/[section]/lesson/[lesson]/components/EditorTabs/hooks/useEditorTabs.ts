import { useToast } from "@chakra-ui/react";
import { useCallback, useEffect, useRef } from "react";

import { useEditor } from "../../EditorProvider";

export const useEditorTabs = () => {
  const editorContext = useEditor();
  const isUserInteraction = useRef(false);
  const toast = useToast();

  const handleTabsChange = useCallback(
    (index: number) => {
      if (isUserInteraction.current) {
        editorContext.setTabIndex(index);
      }
      isUserInteraction.current = false;
    },
    [editorContext],
  );

  const handleTabClick = useCallback(() => {
    isUserInteraction.current = true;
  }, []);

  useEffect(() => {
    if (!editorContext.isOnMachineCourse && editorContext.isAnswerOpen) {
      toast.closeAll();
      if (editorContext.doesAnswerMatch) {
        toast({
          title: "Your solution matches ours",
          description: `Great job! Your solution matches ours. You can now move on to the next step.`,
          status: "success",
          duration: 9000,
          isClosable: true,
        });
      } else {
        toast({
          title: "Your solution doesn't match ours",
          description: `This doesn't mean you're wrong! We just might have different ways of solving the problem.`,
          status: "warning",
          duration: 9000,
          isClosable: true,
        });
      }
    }
  }, [editorContext, toast]);

  return {
    ...editorContext,
    handleTabsChange,
    handleTabClick,
    isUserInteraction,
    toast,
  };
};

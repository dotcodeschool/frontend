import { useCallback } from "react";
import axios from "axios";

const useSaveProgress = (session: any) => {
  const saveProgress = useCallback(
    async (courseId: string, lessonId: string, chapterId: string) => {
      // Load the progress from local storage
      const localProgress = localStorage.getItem("progress");

      // Load the progress from the database
      const savedProgress = session
        ? await axios
            .get("/api/get-progress", {
              params: { user: session?.user },
            })
            .then((res) => {
              return res.data.progress;
            })
            .catch((err) => {
              console.error(err);
            })
        : null;

      // Merge the progress from local storage and the database
      const progress = JSON.parse(
        savedProgress ? savedProgress : localProgress || "{}",
      );

      // Update the progress
      if (!progress[courseId]) {
        progress[courseId] = {};
      }
      if (!progress[courseId][lessonId]) {
        progress[courseId][lessonId] = {};
      }
      progress[courseId][lessonId][chapterId] = true;

      // Save the progress back to local storage
      localStorage.setItem("progress", JSON.stringify(progress));

      // Save the progress to the database
      if (session) {
        axios
          .post("/api/update-progress", {
            updates: [{ user: session?.user, progress }],
          })
          .catch((err) => {
            console.error(err);
            const pendingUpdates = JSON.parse(
              localStorage.getItem("pendingUpdates") || "[]",
            );
            pendingUpdates.push({ courseId, lessonId, chapterId });
            localStorage.setItem(
              "pendingUpdates",
              JSON.stringify(pendingUpdates),
            );
          });
      } else {
        const pendingUpdates = JSON.parse(
          localStorage.getItem("pendingUpdates") || "[]",
        );
        pendingUpdates.push({ courseId, lessonId, chapterId });
        localStorage.setItem("pendingUpdates", JSON.stringify(pendingUpdates));
      }
    },
    [session],
  );

  return saveProgress;
};

export default useSaveProgress;

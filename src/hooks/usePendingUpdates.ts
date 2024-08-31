import { useEffect } from "react";
import axios from "axios";
import { useSession } from "next-auth/react";

const usePendingUpdates = () => {
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === "authenticated") {
      const pendingUpdates = JSON.parse(
        localStorage.getItem("pendingUpdates") || "[]",
      );

      const updates = pendingUpdates.map(
        ({ courseId, lessonId, chapterId }: any) => {
          const progress = JSON.parse(localStorage.getItem("progress") || "{}");
          // Update the progress
          if (!progress[courseId]) {
            progress[courseId] = {};
          }
          if (!progress[courseId][lessonId]) {
            progress[courseId][lessonId] = {};
          }
          progress[courseId][lessonId][chapterId] = true;
          return {
            user: session?.user,
            progress,
          };
        },
      );

      if (pendingUpdates.length > 0) {
        axios
          .post("/api/update-progress", {
            updates,
          })
          .then(() => {
            localStorage.removeItem("pendingUpdates");
          })
          .catch((err) => {
            console.error(err);
          });
      }
    }
  }, [status, session?.user]);
};

export default usePendingUpdates;

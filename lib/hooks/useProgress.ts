import axios from "axios";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { TypeProgressData } from "../types/typeProgress";

const useProgress = () => {
  const { data: session } = useSession();
  const [progress, setProgress] = useState<TypeProgressData>(() => {
    const savedProgress = localStorage.getItem("progress");

    return savedProgress ? JSON.parse(savedProgress) : {};
  });

  useEffect(() => {
    if (session) {
      fetchProgress();
    }
  }, [session]);

  useEffect(() => {
    localStorage.setItem("progress", JSON.stringify(progress));
  }, [progress]);

  const fetchProgress = async () => {
    try {
      const response = await axios.get("/api/get-user", {
        params: { user: session?.user },
      });
      const serverProgress = response.data.progress || {};

      const mergedProgress = mergeProgress(progress, serverProgress);
      setProgress(mergedProgress);
    } catch (error) {
      console.error("Failed to fetch progress:", error);
    }
  };

  const saveProgress = async (
    courseId: string,
    lessonId: string,
    chapterId: string,
  ) => {
    const updatedProgress = {
      ...progress,
      [courseId]: {
        ...(progress[courseId] || {}),
        [lessonId]: {
          ...(progress[courseId][lessonId] || {}),
          [chapterId]: true,
        },
      },
    };

    setProgress(updatedProgress);

    try {
      const response = await axios.post("/api/update-progress", {
        updates: [{ user: session?.user, progress: updatedProgress }],
      });

      if (response.status !== 200) {
        throw new Error(`Server responded with status ${response.status}`);
      }

      console.log("Progress saved successfully");
    } catch (error) {
      console.error("Failed to save progress:", error);
      // Add the failed update to a queue for retry
      const pendingUpdates = JSON.parse(
        localStorage.getItem("pendingUpdates") || "[]",
      );
      pendingUpdates.push({ courseId, lessonId, chapterId });
      localStorage.setItem("pendingUpdates", JSON.stringify(pendingUpdates));
    }
  };

  const mergeProgress = (local: TypeProgressData, server: TypeProgressData) => {
    const merged: TypeProgressData = { ...local };
    Object.keys(server).forEach((courseId) => {
      if (!merged[courseId]) {
        merged[courseId] = {};
      }
      Object.keys(server[courseId]).forEach((lessonId) => {
        if (!merged[courseId][lessonId]) {
          merged[courseId][lessonId] = {};
        }
        Object.keys(server[courseId][lessonId]).forEach((chapterId) => {
          merged[courseId][lessonId][chapterId] =
            local[courseId][lessonId][chapterId] ||
            server[courseId][lessonId][chapterId];
        });
      });
    });

    return merged;
  };

  return { progress, saveProgress };
};

export { useProgress };

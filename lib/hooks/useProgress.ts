import { useSession } from "next-auth/react";
import { useCallback, useEffect, useState } from "react";

import { TypeProgressData } from "../types/typeProgress";

const getInitialProgress = (): TypeProgressData => {
  const savedProgress = localStorage.getItem("progress");

  return savedProgress ? JSON.parse(savedProgress) : {};
};

const getPendingUpdates = () =>
  JSON.parse(localStorage.getItem("pendingUpdates") ?? "[]");

const savePendingUpdate = (
  courseId: string,
  lessonId: string,
  chapterId: string,
) => {
  const pendingUpdates = getPendingUpdates();
  pendingUpdates.push({ courseId, lessonId, chapterId });
  localStorage.setItem("pendingUpdates", JSON.stringify(pendingUpdates));
};

const mergeProgress = (
  local: TypeProgressData,
  server: TypeProgressData,
): TypeProgressData => {
  const merged: TypeProgressData = { ...local };
  Object.keys(server).forEach((courseId) => {
    merged[courseId] = merged[courseId] ?? {};
    Object.keys(server[courseId]).forEach((lessonId) => {
      merged[courseId][lessonId] = merged[courseId][lessonId] ?? {};
      Object.keys(server[courseId][lessonId]).forEach((chapterId) => {
        // eslint-disable-next-line max-len
        merged[courseId][lessonId][chapterId] =
          local[courseId][lessonId][chapterId] ??
          server[courseId][lessonId][chapterId];
      });
    });
  });

  return merged;
};

const useProgress = () => {
  const { data: session } = useSession();
  const [progress, setProgress] =
    useState<TypeProgressData>(getInitialProgress);

  const fetchProgress = useCallback(async () => {
    try {
      const params = new URLSearchParams();
      if (session?.user) {
        params.append("user", JSON.stringify(session.user));
      }

      const response = await fetch(`/api/get-user?${params.toString()}`);
      if (!response.ok) {
        throw new Error(`Server responded with status ${response.status}`);
      }

      const data = await response.json();
      const serverProgress = data.progress ?? {};
      const mergedProgress = mergeProgress(progress, serverProgress);
      setProgress(mergedProgress);
    } catch (error) {
      console.error("Failed to fetch progress:", error);
    }
  }, [progress, session?.user]);

  const updateServerProgress = async (updatedProgress: TypeProgressData) => {
    const response = await fetch("/api/update-progress", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        updates: [{ user: session?.user, progress: updatedProgress }],
      }),
    });

    if (!response.ok) {
      throw new Error(`Server responded with status ${response.status}`);
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
        ...(progress[courseId] ?? {}),
        [lessonId]: {
          ...(progress[courseId][lessonId] ?? {}),
          [chapterId]: true,
        },
      },
    };

    setProgress(updatedProgress);

    try {
      await updateServerProgress(updatedProgress);
      console.error("Progress saved successfully");
    } catch (error) {
      console.error("Failed to save progress:", error);
      savePendingUpdate(courseId, lessonId, chapterId);
    }
  };

  useEffect(() => {
    if (session) {
      void fetchProgress();
    }
  }, [session, fetchProgress]);

  useEffect(() => {
    localStorage.setItem("progress", JSON.stringify(progress));
  }, [progress]);

  return { progress, saveProgress };
};

export { useProgress };

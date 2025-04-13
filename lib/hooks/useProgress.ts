"use client";

import { useSession } from "next-auth/react";
import { useCallback, useEffect, useState, useRef } from "react";
import { TypeProgressData } from "../types/typeProgress";

// Get the initial progress from localStorage if available
const getInitialProgress = (): TypeProgressData => {
  if (typeof window === 'undefined') return {};
  
  const savedProgress = localStorage.getItem("progress");
  return savedProgress ? JSON.parse(savedProgress) : {};
};

// Get any pending updates that couldn't be saved to the server
const getPendingUpdates = () => {
  if (typeof window === 'undefined') return [];
  
  const pending = localStorage.getItem("pendingUpdates");
  return pending ? JSON.parse(pending) : [];
};

// Save a pending update to be processed later
const savePendingUpdate = (
  courseId: string,
  sectionId: string,
  lessonId: string,
) => {
  const pendingUpdates = getPendingUpdates();
  pendingUpdates.push({ courseId, sectionId, lessonId });
  localStorage.setItem("pendingUpdates", JSON.stringify(pendingUpdates));
};

// Clear pending updates after they've been processed
const clearPendingUpdates = () => {
  localStorage.setItem("pendingUpdates", JSON.stringify([]));
};

// Merge server progress with local progress
const mergeProgress = (
  local: TypeProgressData,
  server: TypeProgressData,
): TypeProgressData => {
  const merged: TypeProgressData = { ...local };
  
  // Add server data not in local
  Object.keys(server).forEach((courseId) => {
    merged[courseId] = merged[courseId] ?? {};
    
    Object.keys(server[courseId]).forEach((sectionId) => {
      merged[courseId][sectionId] = merged[courseId][sectionId] ?? {};
      
      Object.keys(server[courseId][sectionId]).forEach((lessonId) => {
        // Prioritize local changes over server (local is more recent)
        if (merged[courseId]?.[sectionId]?.[lessonId] === undefined) {
          merged[courseId][sectionId][lessonId] = server[courseId][sectionId][lessonId];
        }
      });
    });
  });

  return merged;
};

export const useProgress = () => {
  const { data: session } = useSession();
  const [progress, setProgress] = useState<TypeProgressData>(getInitialProgress);
  const [isLoading, setIsLoading] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  // Add reference to prevent multiple fetches
  const hasFetchedRef = useRef(false);

  // Process any pending updates that couldn't be saved previously
  const processPendingUpdates = async (currentProgress: TypeProgressData) => {
    const pendingUpdates = getPendingUpdates();
    if (pendingUpdates.length === 0) return;
    
    setIsSyncing(true);
    
    try {
      // Create a copy of the progress with all pending updates applied
      let updatedProgress = { ...currentProgress };
      
      for (const { courseId, sectionId, lessonId } of pendingUpdates) {
        updatedProgress[courseId] = updatedProgress[courseId] || {};
        updatedProgress[courseId][sectionId] = updatedProgress[courseId][sectionId] || {};
        updatedProgress[courseId][sectionId][lessonId] = true;
      }
      
      // Save all updates at once
      await updateServerProgress(updatedProgress);
      
      // Update local state with the new progress
      setProgress(updatedProgress);
      
      // Clear pending updates since they've been processed
      clearPendingUpdates();
    } catch (error) {
      console.error("Failed to process pending updates:", error);
    } finally {
      setIsSyncing(false);
    }
  };

  // Fetch progress from the server when session is available
  const fetchProgress = useCallback(async () => {
    if (!session?.user || hasFetchedRef.current || isLoading) return;
    
    setIsLoading(true);
    try {
      // Changed from '/api/(new-test)/get-progress-data' to '/api/get-progress-data'
      const response = await fetch('/api/get-progress-data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      if (!response.ok) {
        throw new Error(`Server responded with status ${response.status}`);
      }

      const data = await response.json();
      console.log("Received progress data from server:", data);
      
      // Merge server progress with local progress
      const mergedProgress = mergeProgress(progress, data);
      setProgress(mergedProgress);
      
      // Process any pending updates
      await processPendingUpdates(mergedProgress);
      
      // Mark as fetched
      hasFetchedRef.current = true;
    } catch (error) {
      console.error("Failed to fetch progress:", error);
    } finally {
      setIsLoading(false);
    }
  }, [session?.user, isLoading, progress]);

  // Save progress to server
  const updateServerProgress = async (updatedProgress: TypeProgressData) => {
    if (!session?.user) {
      console.warn("Cannot update server progress: No active session");
      return;
    }
    
    try {
      const response = await fetch("/api/update-progress", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          updates: [{ user: session.user, progress: updatedProgress }],
        }),
      });

      if (!response.ok) {
        throw new Error(`Server responded with status ${response.status}`);
      }
      
      const result = await response.json();
      console.log("Progress update response:", result);
      
      return result;
    } catch (error) {
      console.error("Failed to save progress to server:", error);
      throw error;
    }
  };

  // Main function to save progress for a lesson
  const saveProgress = async (
    courseId: string,
    sectionId: string,
    lessonId: string,
  ) => {
    // FIX: Check if the value is explicitly true, not just if it exists
    const currentValue = progress?.[courseId]?.[sectionId]?.[lessonId] === true;
    const newValue = !currentValue;
    
    console.log(`Setting ${courseId}/${sectionId}/${lessonId} from ${currentValue} to ${newValue}`);
    
    // Create updated progress object
    const updatedProgress = {
      ...progress,
      [courseId]: {
        ...(progress[courseId] ?? {}),
        [sectionId]: {
          ...(progress[courseId]?.[sectionId] ?? {}),
          [lessonId]: newValue,
        },
      },
    };

    // Update local state immediately (optimistic update)
    setProgress(updatedProgress);
    
    // Save to localStorage
    localStorage.setItem("progress", JSON.stringify(updatedProgress));

    // Try to update the server
    try {
      console.log("Sending progress update to server");
      
      const response = await fetch("/api/update-progress", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          updates: [{ 
            user: session?.user, 
            progress: {
              [courseId]: {
                [sectionId]: {
                  [lessonId]: newValue
                }
              }
            }
          }],
        }),
      });

      if (!response.ok) {
        throw new Error(`Server responded with status ${response.status}`);
      }
      
      const result = await response.json();
      console.log("Server response:", result);
      
      return result;
    } catch (error) {
      console.error("Failed to update server:", error);
      savePendingUpdate(courseId, sectionId, lessonId);
      throw error;
    }
  };

  // Fetch progress when session changes - but only once
  useEffect(() => {
    if (session && !hasFetchedRef.current) {
      void fetchProgress();
    }
  }, [session, fetchProgress]);

  // Save progress to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("progress", JSON.stringify(progress));
  }, [progress]);

  return { 
    progress, 
    saveProgress, 
    isLoading,
    isSyncing 
  };
};
// app/courses/[course]/(pages)/setup/hooks/index.tsx
import { MDXRemote } from "next-mdx-remote";
import { serialize } from "next-mdx-remote/serialize";
import { useEffect, useState } from "react";

import { MDXComponents } from "@/components/mdx-components";
import { Repository } from "@/lib/db/models";
import { RepositorySetup, RepositorySetupStep } from "@/lib/types";

const useRepositorySetup = (
  initialRepo: Repository | null,
  repositorySetup: RepositorySetup,
  courseSlug: string,
) => {
  const [showRepositorySetup, setShowRepositorySetup] = useState(
    Boolean(initialRepo),
  );
  const [loadingRepo, setLoadingRepo] = useState(false);
  const [repoName, setRepoName] = useState<string>();
  const [repoSetupSteps, setRepoSetupSteps] =
    useState<RepositorySetup>(repositorySetup);
  const [gitPushReceived, setGitPushReceived] = useState(
    initialRepo?.test_ok ?? false,
  );
  const [repoId, setRepoId] = useState<string | null>(
    initialRepo?._id?.toString() ?? null,
  );

  // Effect for initial setup and repo data fetching
  useEffect(() => {
    if (initialRepo) {
      setShowRepositorySetup(true);
      setGitPushReceived(initialRepo.test_ok ?? false);
    } else if (repoName) {
      setShowRepositorySetup(true);
      const fetchRepoData = async () => {
        try {
          const response = await fetch(`/api/repository?repoName=${repoName}`);
          if (response.ok) {
            const repoData = await response.json();
            setRepoId(repoData._id?.toString());
            setGitPushReceived(repoData.test_ok ?? false);
          }
        } catch (error) {
          console.error("Error fetching repository data:", error);
        }
      };

      const updateRepoSetup = async () => {
        try {
          // Get the code as a string
          const codeString = `\`\`\`bash
git clone https://git.dotcodeschool.com/${repoName} dotcodeschool-${courseSlug}
cd dotcodeschool-${courseSlug}
\`\`\``;

          // Create updated steps with the new code
          const updatedSteps: RepositorySetupStep[] = repositorySetup.steps.map(
            (step, index) =>
              index === 1
                ? { ...step, title: step.title, code: codeString }
                : step,
          );

          // Update state with the new steps
          setRepoSetupSteps({
            ...repositorySetup,
            steps: updatedSteps,
          });
        } catch (error) {
          console.error("Error updating repo setup:", error);
        }
      };

      void fetchRepoData();
      void updateRepoSetup();
    }
  }, [
    initialRepo,
    repoName,
    repositorySetup.steps,
    courseSlug,
    repositorySetup,
  ]);

  // Effect for real-time repository updates
  useEffect(() => {
    if (!repoId) return;

    const eventSource = new EventSource("/api/repository-updates");

    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        // Check if the update is for our repository
        if (data.documentKey?._id === repoId) {
          // If there's an update to test_ok field, update our state
          if (data.updateDescription?.updatedFields?.test_ok !== undefined) {
            setGitPushReceived(data.updateDescription.updatedFields.test_ok);
          }
        }
      } catch (error) {
        console.error("Error processing repository update:", error);
      }
    };

    eventSource.onerror = (error) => {
      console.error("EventSource failed:", error);
    };

    return () => {
      eventSource.close();
    };
  }, [repoId]);

  return {
    showRepositorySetup,
    setShowRepositorySetup,
    loadingRepo,
    setLoadingRepo,
    repoName,
    setRepoName,
    repoSetupSteps,
    gitPushReceived,
  };
};

export { useRepositorySetup };

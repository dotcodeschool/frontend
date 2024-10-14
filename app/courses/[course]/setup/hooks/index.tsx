import { ObjectId, WithId } from "mongodb";
import { MDXRemote } from "next-mdx-remote";
import { serialize } from "next-mdx-remote/serialize";
import { useEffect, useState } from "react";

import { MDXComponents } from "@/components/mdx-components";
import { Repository } from "@/lib/db/models";
import { RepositorySetup } from "@/lib/types";

const useRepositorySetup = (
  initialRepo: WithId<Repository> | null,
  repositorySetup: RepositorySetup,
  courseSlug: string,
) => {
  const [showRepositorySetup, setShowRepositorySetup] = useState(
    Boolean(initialRepo),
  );
  const [loadingRepo, setLoadingRepo] = useState(false);
  const [repoName, setRepoName] = useState<string>();
  const [repoSetupSteps, setRepoSetupSteps] = useState(repositorySetup);
  const [gitPushReceived, setGitPushReceived] = useState(
    initialRepo?.test_ok ?? false,
  );
  const [repoId, setRepoId] = useState<ObjectId | null>(
    initialRepo?._id ?? null,
  );

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
            setRepoId(repoData._id);
            setGitPushReceived(repoData.test_ok ?? false);
          }
        } catch (error) {
          console.error("Error fetching repository data:", error);
        }
      };

      const updateRepoSetup = async () => {
        const mdxSource = await serialize(`\`\`\`bash
        git clone https://git.dotcodeschool.com/${repoName} dotcodeschool-${courseSlug}\ncd dotcodeschool-${courseSlug}
        \`\`\``);
        const code = <MDXRemote {...mdxSource} components={MDXComponents} />;
        const updatedSteps = repositorySetup.steps.map((step, index) =>
          index === 1 ? { title: step.title, code } : step,
        );
        setRepoSetupSteps((prev) => ({ ...prev, steps: updatedSteps }));
      };

      void fetchRepoData();
      void updateRepoSetup();
    }
  }, [initialRepo, repoName, repositorySetup.steps, courseSlug]);

  useEffect(() => {
    if (!repoId) {
      return;
    }

    const eventSource = new EventSource("/api/repository-updates");

    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);
      const isUpdate = data.operationType === "update";
      const isRepo = data.documentKey._id === repoId.toString();
      const isTestOk = data.updateDescription.updatedFields.test_ok;

      if (isUpdate && isRepo && isTestOk) {
        setGitPushReceived(true);
      }
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

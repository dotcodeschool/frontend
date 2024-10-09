import { WithId } from "mongodb";
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
  const [repoSetupSteps, setRepoSetupSteps] =
    useState<RepositorySetup>(repositorySetup);

  useEffect(() => {
    if (initialRepo) {
      setShowRepositorySetup(true);
    } else if (repoName) {
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
      void updateRepoSetup();
    }
  }, [initialRepo, repoName, repositorySetup.steps, courseSlug]);

  return {
    showRepositorySetup,
    setShowRepositorySetup,
    loadingRepo,
    setLoadingRepo,
    repoName,
    setRepoName,
    repoSetupSteps,
  };
};

export { useRepositorySetup };

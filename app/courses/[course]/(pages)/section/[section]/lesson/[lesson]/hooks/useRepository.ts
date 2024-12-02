import { useToast } from "@chakra-ui/react";
import { useEffect, useState } from "react";

export const useRepository = (courseSlug: string) => {
  const [repoName, setRepoName] = useState<string | null>(null);
  const toast = useToast();

  useEffect(() => {
    const fetchRepo = async () => {
      try {
        const response = await fetch(
          `/api/repository?courseSlug=${courseSlug}`,
        );
        if (!response.ok) {
          throw new Error("Failed to fetch repository");
        }
        const data = await response.json();
        setRepoName(data.repo_name ?? null);
      } catch (error) {
        console.error("Error fetching repository:", error);
        toast({
          title: "Error",
          description: "Failed to fetch repository. Please try again later.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
    };

    void fetchRepo();
  }, [courseSlug, toast]);

  return repoName;
};

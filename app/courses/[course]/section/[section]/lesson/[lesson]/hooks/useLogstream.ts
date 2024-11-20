import { useToast } from "@chakra-ui/react";
import { useEffect, useState } from "react";

export const useLogstream = (repoName: string | null) => {
  const [logstreamId, setLogstreamId] = useState<string | null>(null);
  const toast = useToast();

  useEffect(() => {
    const fetchLogstreamId = async () => {
      try {
        const response = await fetch(
          `/api/submission/latest?repo_name=${repoName}`,
        );
        if (!response.ok) {
          throw new Error("Failed to fetch logstream ID");
        }
        const data = await response.json();
        setLogstreamId(data.logstream_id);
      } catch (error) {
        console.error("Error fetching logstream ID:", error);
        toast({
          title: "Error",
          description: "Failed to fetch test logs. Please try again later.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
    };

    if (repoName) {
      void fetchLogstreamId();
    }
  }, [repoName, toast]);

  return logstreamId;
};

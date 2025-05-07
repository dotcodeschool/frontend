"use client";

import {
  Accordion,
  AccordionItem,
  AccordionPanel,
  Box,
  Text,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";

import { MDXBundlerRenderer } from "@/components/mdx-bundler-renderer";

import { useLogstream } from "../hooks/useLogstream";
import { useRepository } from "../hooks/useRepository";

import { AccordionHeader } from "./AccordionHeader";
import { TestLogDisplayModal } from "./TestLogDisplayModal";

type TestLogAccordionProps = {
  didTestPass: boolean;
  courseSlug: string;
};

const TestLogAccordion = ({ courseSlug }: TestLogAccordionProps) => {
  const repoName = useRepository(courseSlug);
  const logstreamId = useLogstream(repoName);
  const [mdxCode, setMdxCode] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMdx = async () => {
      try {
        setIsLoading(true);
        const source = `\`\`\`bash filename="Terminal"
dotcodeschool test
\`\`\``;

        const response = await fetch("/api/bundle-mdx", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ source }),
        });

        if (!response.ok) {
          throw new Error("Failed to bundle MDX");
        }

        const { code } = await response.json();
        setMdxCode(code);
      } catch (error) {
        console.error("Failed to load MDX:", error);
      } finally {
        setIsLoading(false);
      }
    };

    void fetchMdx();
  }, []);

  return (
    <Accordion allowToggle>
      <AccordionItem
        border="1px solid"
        borderColor="whiteAlpha.200"
        rounded="md"
      >
        {({ isExpanded }) => (
          <>
            <AccordionHeader isExpanded={isExpanded} />
            <AccordionPanel>
              <Text>
                To run tests again, make changes to your code and run the test
                command:
              </Text>
              <Box my={4}>
                {isLoading ? (
                  <Box bg="gray.800" borderRadius="md" p={4}>
                    Loading...
                  </Box>
                ) : mdxCode ? (
                  <MDXBundlerRenderer code={mdxCode} />
                ) : (
                  <Box bg="gray.800" borderRadius="md" p={4}>
                    <code>dotcodeschool test</code>
                  </Box>
                )}
              </Box>
              <TestLogDisplayModal
                logstreamId={logstreamId ?? ""}
                repoName={repoName ?? ""}
              />
            </AccordionPanel>
          </>
        )}
      </AccordionItem>
    </Accordion>
  );
};

export { TestLogAccordion };

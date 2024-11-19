"use client";

import {
  Accordion,
  AccordionButton,
  AccordionItem,
  AccordionPanel,
  Box,
  Button,
  Text,
  useToast,
} from "@chakra-ui/react";
import { MDXRemote } from "next-mdx-remote";
import { serialize } from "next-mdx-remote/serialize";
import { useEffect, useState } from "react";
import { IoArrowDown, IoArrowUp } from "react-icons/io5";
import rehypeMdxCodeProps from "rehype-mdx-code-props";

import { MDXComponents } from "@/components/mdx-components";

import { TestLogDisplayModal } from "./TestLogDisplayModal";
import { TestStatus } from "./TestStatus";

type TestLogAccordionProps = {
  didTestPass: boolean;
  courseSlug: string;
};

const TestLogAccordion = ({ didTestPass, courseSlug }: TestLogAccordionProps) => {
  const [code, setCode] = useState<React.ReactElement>();
  const [logstreamId, setLogstreamId] = useState<string | null>(null);
  const [repoName, setRepoName] = useState<string | null>(null);
  const toast = useToast();
  
  useEffect(() => {
    const fetchRepo = async () => {
      try {
        const response = await fetch(`/api/repository?courseSlug=${courseSlug}`);
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

  useEffect(() => {
    const fetchMdx = async () => {
      const source = `\`\`\`bash filename="Terminal"
    dotcodeschool test
    \`\`\``;
      const mdxSource = await serialize(source, {
        mdxOptions: {
          rehypePlugins: [rehypeMdxCodeProps],
        },
      });

      setCode(<MDXRemote {...mdxSource} components={MDXComponents} />);
    };
    void fetchMdx();
  }, []);

  useEffect(() => {
    const fetchLogstreamId = async () => {
      try {
        console.log("fetching data");
        const response = await fetch(
          `/api/submission/latest?repo_name=${repoName}`,
        );
        if (!response.ok) {
          throw new Error("Failed to fetch logstream ID");
        }
        const data = await response.json();
        console.log("data", data);
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

  return (
    <Accordion allowToggle>
      <AccordionItem
        border="1px solid"
        borderColor="whiteAlpha.200"
        rounded="md"
      >
        {({ isExpanded }) => (
          <>
            <AccordionButton>
              <Text
                casing="uppercase"
                color="gray.300"
                fontSize="sm"
                fontWeight="semibold"
                letterSpacing={1}
                pr={2}
              >
                Test Runner:
              </Text>
              {/* TODO: Implement test status feature
                <TestStatus didTestPass={didTestPass} />
              */}
              <Button
                as="span"
                colorScheme="gray"
                leftIcon={isExpanded ? <IoArrowUp /> : <IoArrowDown />}
                ml="auto"
                mr={2}
                size="xs"
                variant="outline"
              >
                {isExpanded ? "Hide" : "View"} Instructions
              </Button>
            </AccordionButton>
            <AccordionPanel>
              <Text>
                To run tests again, make changes to your code and run the test
                command:
              </Text>
              <Box my={4}>{code}</Box>
              <TestLogDisplayModal logstreamId={logstreamId ?? ""} />
            </AccordionPanel>
          </>
        )}
      </AccordionItem>
    </Accordion>
  );
};

export { TestLogAccordion };

"use client";

import {
  Accordion,
  AccordionItem,
  AccordionPanel,
  Box,
  Text,
} from "@chakra-ui/react";
import { MDXRemote } from "next-mdx-remote";
import { serialize } from "next-mdx-remote/serialize";
import React, { useEffect, useState } from "react";
import rehypeMdxCodeProps from "rehype-mdx-code-props";

import { MDXComponents } from "@/components/mdx-components";

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
  const [code, setCode] = useState<React.ReactElement | null>(null);

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

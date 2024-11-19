"use client";

import {
  Accordion,
  AccordionButton,
  AccordionItem,
  AccordionPanel,
  Box,
  Button,
  Text,
} from "@chakra-ui/react";
import { MDXRemote } from "next-mdx-remote";
import { serialize } from "next-mdx-remote/serialize";
import { useEffect, useState } from "react";
import { IoArrowDown, IoArrowUp } from "react-icons/io5";
import rehypeMdxCodeProps from "rehype-mdx-code-props";

import { MDXComponents } from "@/components/mdx-components";

import { TestLogDisplayModal } from "./TestLogDisplayModal";
import { TestStatus } from "./TestStatus";

const TestLogAccordion = ({ didTestPass }: { didTestPass: boolean }) => {
  const [code, setCode] = useState<React.ReactElement>();

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
              <TestLogDisplayModal logstreamId="test" />
            </AccordionPanel>
          </>
        )}
      </AccordionItem>
    </Accordion>
  );
};

export { TestLogAccordion };

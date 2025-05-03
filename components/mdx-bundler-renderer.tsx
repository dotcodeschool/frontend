"use client";

import { Box, Text } from "@chakra-ui/react";
import React, { useState, useEffect } from "react";
import { getMDXComponent } from "mdx-bundler/client";
import { LessonSkeleton } from "@/app/courses/[course]/(pages)/section/[section]/lesson/[lesson]/components/LessonSkeleton";
import { MDXComponents } from "@/components/mdx-components";

export function MDXBundlerRenderer({ code }: { code: string }) {
  const [Component, setComponent] = useState<React.ComponentType<any> | null>(
    null,
  );
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (code) {
      try {
        const MDXComponent = getMDXComponent(code);
        setComponent(() => MDXComponent);
        setIsLoading(false);
      } catch (err) {
        console.error("Error rendering MDX:", err);
        setError(
          err instanceof Error ? err.message : "Unknown error rendering MDX",
        );
        setIsLoading(false);
      }
    }
  }, [code]);

  if (isLoading) {
    return <LessonSkeleton />;
  }

  if (error || !Component) {
    return (
      <Box
        p={6}
        bg="red.50"
        color="red.800"
        borderRadius="md"
        my={4}
        borderWidth="1px"
        borderColor="red.200"
      >
        <Text fontWeight="bold">Error rendering content</Text>
        <Text>
          {error ||
            "We encountered a problem rendering this content. Please try refreshing the page."}
        </Text>
      </Box>
    );
  }

  return (
    <Box className="mdx-content">
      <Component components={MDXComponents} />
    </Box>
  );
}

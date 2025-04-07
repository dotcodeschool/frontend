// components/mdx-bundler-renderer.tsx
'use client';

import { Box, Text } from '@chakra-ui/react';
import React, { useState, useEffect } from 'react';

import { getMDXComponent } from 'mdx-bundler/client';
import { LessonSkeleton } from '@/app/courses/[course]/(pages)/section/[section]/lesson/[lesson]/components/LessonSkeleton';
import { MDXComponents } from '@/components/mdx-components';


export function MDXBundlerRenderer({ code }: { code: string }) {
  const [Component, setComponent] = useState<React.ComponentType<any> | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (code) {
      try {
        const MDXComponent = getMDXComponent(code);
        setComponent(() => MDXComponent);
        setIsLoading(false);
      } catch (err) {
        console.error('Error rendering MDX:', err);
        setIsLoading(false);
      }
    }
  }, [code]);

  if (isLoading) {
    // Use the more sophisticated skeleton loader
    return <LessonSkeleton />;
  }

  if (!Component) {
    return (
      <Box p={6} bg="red.900" color="white" borderRadius="md" my={4}>
        <Text fontWeight="bold">Error rendering content</Text>
        <Text>We encountered a problem rendering this content. Please try refreshing the page.</Text>
      </Box>
    );
  }

  // Use type assertion to fix TypeScript error
  return <Component components={MDXComponents as any} />;
}
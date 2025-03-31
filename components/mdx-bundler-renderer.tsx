'use client';

import React, { useState, useEffect } from 'react';
import { getMDXComponent } from 'mdx-bundler/client';
import { Box, Spinner } from '@chakra-ui/react';
import { MDXComponents } from '@/components/mdx-components';

export function MDXBundlerRenderer({ code }: { code: string }) {
  const [Component, setComponent] = useState<React.ComponentType<any> | null>(null);

  useEffect(() => {
    if (code) {
      try {
        const MDXComponent = getMDXComponent(code);
        setComponent(() => MDXComponent);
      } catch (err) {
        console.error('Error rendering MDX:', err);
      }
    }
  }, [code]);

  if (!Component) {
    return (
      <Box display="flex" justifyContent="center" p={4}>
        <Spinner size="md" />
      </Box>
    );
  }

  // Use type assertion to fix TypeScript error
  return <Component components={MDXComponents as any} />;
}
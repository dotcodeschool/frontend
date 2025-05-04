"use client";

import { MDXBundlerRenderer } from "@/components/mdx-bundler-renderer";
import { Box, Button, Card, CardBody, Heading } from "@chakra-ui/react";
import React, { useState } from "react";

// Maximum length for the truncated description
const MAX_DESCRIPTION_LENGTH = 300;

// Component to display a truncated description with a "Show more" button
export const TruncatedDescription = ({ 
  content, 
  bundledContent 
}: { 
  content: string; 
  bundledContent: string 
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  return (
    <Card variant="unstyled" h="100%">
      <CardBody>
        <Heading as="h3" size="md">
          About This Course
        </Heading>
        <Box className="mdx-content" style={{ 
          maxHeight: isExpanded ? 'none' : '200px', 
          overflow: isExpanded ? 'visible' : 'hidden',
          position: 'relative'
        }}>
          <MDXBundlerRenderer code={bundledContent} />
          {!isExpanded && content.length > MAX_DESCRIPTION_LENGTH && (
            <Box 
              position="absolute" 
              bottom="0" 
              left="0" 
              right="0" 
              height="80px" 
              background="linear-gradient(to bottom, transparent, var(--chakra-colors-chakra-body-bg))"
            />
          )}
        </Box>
        {content.length > MAX_DESCRIPTION_LENGTH && (
          <Button
            variant="link"
            colorScheme="green"
            onClick={() => setIsExpanded(!isExpanded)}
            mt={2}
          >
            {isExpanded ? "Show less" : "Show more"}
          </Button>
        )}
      </CardBody>
    </Card>
  );
};

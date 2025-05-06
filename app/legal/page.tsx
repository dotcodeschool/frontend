import React from 'react';
import { Container, Heading, VStack, Box, Text, SimpleGrid, Card, CardBody, CardHeader, Link as ChakraLink } from '@chakra-ui/react';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/Footer';

export const metadata = {
  title: 'Legal Documents | DotCodeSchool',
  description: 'Terms of Service, Privacy Policy, and Disclaimer for DotCodeSchool',
};

const legalDocuments = [
  {
    title: 'Terms of Service',
    description: 'Legal terms and conditions for using DotCodeSchool',
    href: '/legal/terms-of-service',
  },
  {
    title: 'Privacy Policy',
    description: 'How DotCodeSchool collects, uses, and protects your personal information',
    href: '/legal/privacy-policy',
  },
  {
    title: 'Disclaimer',
    description: 'Important disclaimers and limitations regarding DotCodeSchool\'s educational content',
    href: '/legal/disclaimer',
  },
];

export default function LegalPage() {
  return (
    <>
      <Navbar navLinks={[{ label: 'Courses', href: '/courses' }, { label: 'Articles', href: '/articles' }]} />
      <Container maxW="container.md" py={8} px={4}>
        <VStack spacing={8} align="stretch">
          <Box textAlign="center" mb={8}>
            <Heading as="h1" size="2xl" mb={4}>Legal Documents</Heading>
            <Text fontSize="lg" color="gray.500">
              These documents govern your use of DotCodeSchool and explain how we handle your data
            </Text>
          </Box>

          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
            {legalDocuments.map((doc) => (
              <Card 
                key={doc.title} 
                as={ChakraLink}
                href={doc.href}
                _hover={{ 
                  textDecoration: 'none',
                  transform: 'translateY(-5px)',
                  boxShadow: 'xl'
                }}
                transition="all 0.3s"
                borderRadius="lg"
                overflow="hidden"
                boxShadow="md"
                height="100%"
              >
                <CardHeader bg="gray.700" color="white" py={4}>
                  <Heading size="md">{doc.title}</Heading>
                </CardHeader>
                <CardBody>
                  <Text>{doc.description}</Text>
                </CardBody>
              </Card>
            ))}
          </SimpleGrid>

          <Box mt={12} textAlign="center">
            <Heading as="h2" size="lg" mb={4}>About DotCodeSchool</Heading>
            <Text>
              DotCodeSchool is an open-source educational platform funded by the Polkadot Treasury. 
              We are dedicated to providing high-quality learning resources for blockchain development.
            </Text>
            <Text mt={4}>
              As an open-source project, we are committed to transparency in all aspects of our operation, 
              including our legal policies. These documents are designed to clearly communicate your rights 
              and our responsibilities.
            </Text>
          </Box>
        </VStack>
      </Container>
      <Footer />
    </>
  );
}

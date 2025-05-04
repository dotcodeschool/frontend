"use client";

import {
  Box,
  Card,
  CardBody,
  Flex,
  Heading,
  Icon,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  SimpleGrid,
  Text,
  useColorModeValue,
  List,
  ListItem,
} from "@chakra-ui/react";
import { FaInfoCircle, FaPuzzlePiece, FaClipboardList, FaClock, FaBookOpen } from "react-icons/fa";

// Component to display course stats
export const CourseStats = ({
  prerequisites,
  sections,
  level,
  estimatedTime
}: {
  prerequisites: string[];
  sections: Array<{ lessons: any[] }>;
  level: string;
  estimatedTime?: number; // Optional estimated time from course metadata
}) => {
  // Calculate total lessons
  const totalLessons = sections.reduce(
    (total, section) => total + section.lessons.length,
    0,
  );

  // Use a dark brown background color similar to the screenshot
  const bgColor = useColorModeValue("brown.800", "brown.900");
  const textColor = useColorModeValue("white", "gray.100");
  const borderColor = useColorModeValue("brown.700", "brown.600");

  // Check if there are prerequisites
  const hasPrerequisites = prerequisites && prerequisites.length > 0;
  const prerequisiteCount = hasPrerequisites ? prerequisites.length : 0;
  
  // Use provided estimated time if available, otherwise calculate it
  // (rough estimate: 15 minutes per lesson)
  const estimatedHours = estimatedTime || Math.ceil((totalLessons * 15) / 60);

  return (
    <Card
      variant="filled"
      my={6}
      bg={bgColor}
      color={textColor}
      borderRadius="md"
      borderColor={borderColor}
      borderWidth="1px"
    >
      <CardBody>
        <SimpleGrid columns={{ base: 1, md: 4 }} spacing={8}>
          {/* Projects section */}
          <Flex align="center">
            <Icon as={FaPuzzlePiece} boxSize={8} mr={4} />
            <Box>
              <Heading as="h3" size="xs" fontWeight="normal">
                Skill Level
              </Heading>
              <Heading as="h2" size="md" mt={1}>
                {level}
              </Heading>
            </Box>
          </Flex>
          
          {/* Estimated Time */}
          <Flex align="center">
            <Icon as={FaClock} boxSize={8} mr={4} />
            <Box>
              <Heading as="h3" size="xs" fontWeight="normal">
                Time to Complete
              </Heading>
              <Heading as="h2" size="md" mt={1}>
                {estimatedHours} hour{estimatedHours === 1 ? '' : 's'}
              </Heading>
            </Box>
          </Flex>
          
          {/* Course Content */}
          <Flex align="center">
            <Icon as={FaBookOpen} boxSize={8} mr={4} />
            <Box>
              <Heading as="h3" size="xs" fontWeight="normal">
                Course Content
              </Heading>
              <Heading as="h2" size="md" mt={1}>
                {sections.length} {sections.length === 1 ? 'section' : 'sections'}
              </Heading>
            </Box>
          </Flex>

          {/* Prerequisites section */}
          <Flex align="center">
            <Icon as={FaClipboardList} boxSize={8} mr={4} />
            <Box>
              <Flex align="center">
                <Heading as="h3" size="xs" fontWeight="normal">
                  Prerequisites
                </Heading>
                {hasPrerequisites && (
                  <Popover placement="bottom" trigger="hover">
                    <PopoverTrigger>
                      <Box ml={2} cursor="pointer">
                        <Icon as={FaInfoCircle} color="gray.300" />
                      </Box>
                    </PopoverTrigger>
                    <PopoverContent bg="gray.800" borderColor="gray.600">
                      <PopoverArrow bg="gray.800" />
                      <PopoverBody>
                        <Box p={2}>
                          <Text mb={2}>
                            We suggest you complete the following courses before
                            you get started:
                          </Text>
                          <List spacing={2}>
                            {prerequisites.map((prereq, index) => (
                              <ListItem
                                key={index}
                                display="flex"
                                alignItems="center"
                              >
                                <Text as="span" mr={2}>
                                  ○
                                </Text>
                                <Text fontWeight="bold">{prereq}</Text>
                              </ListItem>
                            ))}
                          </List>
                        </Box>
                      </PopoverBody>
                    </PopoverContent>
                  </Popover>
                )}
              </Flex>
              <Heading as="h2" size="md" mt={1}>
                {hasPrerequisites ? `${prerequisiteCount} courses` : "None"}
              </Heading>
            </Box>
          </Flex>
        </SimpleGrid>
      </CardBody>
    </Card>
  );
};

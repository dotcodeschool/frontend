import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Flex,
  Grid,
  GridItem,
  Heading,
  HStack,
  Tag,
  Text,
  VStack,
} from "@chakra-ui/react";
import { map, size } from "lodash";
import React, { Suspense } from "react";
import { ModuleProps } from "../types";
import { MDXRemote } from "next-mdx-remote/rsc";
import MDXComponents from "@/app/ui/components/lessons-interface/mdx-components";
import PrimaryButton from "@/app/ui/components/primary-button";
import {
  TypeAuthorSkeleton,
  TypeCourseModuleFields,
  TypeLessonSkeleton,
  TypeSectionFields,
  TypeSectionSkeleton,
} from "@/app/lib/types/contentful";
import { Entry, EntryFieldTypes } from "contentful";
import ProgressBar from "./ProgressBar";
import { MdCheckCircle } from "react-icons/md";
import { auth } from "@/auth";
import clientPromise from "@/app/lib/mongodb";
import { MDXComponents as MDXComponentsType } from "mdx/types";
import { IProgressData } from "@/app/lib/types/IProgress";

const ModuleItem = async ({
  index,
  module,
  slug,
  numOfCompletedLessons,
  hasEnrolled,
}: ModuleProps) => {
  const { title, description, lessons } = module;
  const numOfLessons = size(lessons);

  return (
    <AccordionItem>
      <AccordionButton py={6}>
        <VStack spacing={4} w="full" align="start">
          <HStack w="full">
            <Text flex="1" textAlign="left" fontWeight="semibold" fontSize="xl">
              {title.toString()}
            </Text>
            <AccordionIcon fontSize={48} />
          </HStack>
          <VStack w="90%" align="end">
            <ProgressBar
              numOfCompletedLessons={numOfCompletedLessons}
              numOfLessons={numOfLessons}
            />
          </VStack>
        </VStack>
      </AccordionButton>
      <AccordionPanel pb={12} w="90%" pt={0}>
        <Suspense fallback={<div>Loading...</div>}>
          <MDXRemote
            source={description}
            components={MDXComponents as unknown as Readonly<MDXComponentsType>}
          />
        </Suspense>
        <PrimaryButton
          as="a"
          href={
            hasEnrolled
              ? `/courses/${slug}/lesson/${index + 1}/chapter/1`
              : `/courses/${slug}/setup`
          }
          mt={12}
        >
          Start Lesson
        </PrimaryButton>
      </AccordionPanel>
    </AccordionItem>
  );
};

const ModuleList = ({
  sections,
}: {
  sections: EntryFieldTypes.Array<
    EntryFieldTypes.EntryLink<TypeLessonSkeleton | TypeSectionSkeleton>
  >;
}) => {
  const sectionsData = sections as unknown as Entry<TypeSectionSkeleton>[];
  return (
    <Box
      bg="gray.700"
      border="2px solid"
      borderColor="gray.600"
      shadow="2xl"
      my={12}
      p={8}
      rounded={16}
    >
      <Heading as="h2" size="lg" mb={6}>
        What you&apos;ll learn:
      </Heading>
      <Grid
        templateColumns={["repeat(1, 1fr)", "repeat(2, 1fr)"]}
        gap={4}
        mb={4}
      >
        {sectionsData.map((section, index) => (
          <GridItem key={index} colSpan={1}>
            <Flex align="center">
              <MdCheckCircle size={21} color="#68D391" />
              <Text ml={2}>{section.fields.title.toString()}</Text>
            </Flex>
          </GridItem>
        ))}
      </Grid>
    </Box>
  );
};

const CourseContent = async ({
  slug,
  title,
  author,
  description,
  sections,
  level,
  language,
}: TypeCourseModuleFields) => {
  const session = await auth();
  const authorData = author as unknown as TypeAuthorSkeleton;
  const sectionsData = sections as unknown as Entry<TypeSectionSkeleton>[];

  let progressData: IProgressData = {};

  if (session) {
    try {
      const client = await clientPromise;
      const db = client.db("test");
      const res = await db
        .collection("users")
        .findOne({ email: session.user?.email });
      const data = res?.progress;
      progressData = data?.[slug.toString()];
    } catch (err) {
      console.error(err);
    }
  }
  const hasEnrolled = false;
  const startCourseUrl = hasEnrolled
    ? `/courses/${slug}/lesson/1/chapter/1`
    : `/courses/${slug}/setup`;

  return (
    <Box maxW="4xl" mx="auto">
      <Heading as="h1" size="xl" fontWeight="800" my={4}>
        {title.toString()}
      </Heading>
      <Text>
        Written by{" "}
        <a
          href={authorData.fields.url.toString()}
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: "#68D391" }}
        >
          {authorData.fields.name.toString()}
        </a>
      </Text>
      <Text mt={6}>{description.toString()}</Text>
      <HStack mt={4}>
        {map([level, language], (tag, key) => (
          <Tag key={key} size="md" variant="subtle" colorScheme="green">
            {tag.toString()}
          </Tag>
        ))}
      </HStack>
      <PrimaryButton as="a" size="lg" mt={8} href={startCourseUrl} px={12}>
        Start
      </PrimaryButton>

      <ModuleList sections={sections} />
      <Heading as="h2" size="lg" fontWeight="800" my={8}>
        Course Content
      </Heading>
      <Text mt={4} mb={8} color="gray.400" fontWeight="500">
        {size(sections)} lessons
      </Text>
      <Accordion allowToggle>
        {sectionsData.map((module, index) => (
          <ModuleItem
            key={index}
            index={index}
            module={module.fields as unknown as TypeSectionFields}
            numOfCompletedLessons={size(
              progressData?.[Number(index + 1).toString()],
            )}
            hasEnrolled={hasEnrolled}
            slug={slug.toString()}
          />
        ))}
      </Accordion>
    </Box>
  );
};

export default CourseContent;

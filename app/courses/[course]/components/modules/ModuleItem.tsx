import {
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  HStack,
  Text,
  VStack,
} from "@chakra-ui/react";
import { MDXRemote } from "next-mdx-remote/rsc";
import { Suspense } from "react";
import rehypeMdxCodeProps from "rehype-mdx-code-props";

import { MDXComponents } from "@/components";
import { Section, TypeMDXComponents } from "@/lib/types";

import { ModuleProps } from "../../types";

import { ButtonStartLesson } from "./ButtonStartLesson";
import { ProgressBar } from "./ProgressBar";

const ModuleItem = ({
  index,
  module,
  slug,
  isOnMachineCourse,
}: ModuleProps) => {
  const {
    title,
    description,
    sys: { id },
  }: Pick<Section, "title" | "description" | "sys"> = module;

  const components: Readonly<TypeMDXComponents> = MDXComponents;

  const hasEnrolled = false;

  return (
    <AccordionItem>
      <AccordionButton py={6}>
        <VStack align="start" spacing={4} w="full">
          <HStack w="full">
            <Text flex="1" fontSize="xl" fontWeight="semibold" textAlign="left">
              {title}
            </Text>
            <AccordionIcon fontSize={48} />
          </HStack>
          <VStack align="end" w="90%">
            <ProgressBar index={index} sectionId={id} slug={slug} />
          </VStack>
        </VStack>
      </AccordionButton>
      <AccordionPanel pb={12} pt={0} w="90%">
        <Suspense fallback={<Text>Loading...</Text>}>
          <MDXRemote
            components={components}
            options={{
              mdxOptions: {
                rehypePlugins: [rehypeMdxCodeProps],
              },
            }}
            source={description ?? ""}
          />
        </Suspense>
        <ButtonStartLesson
          hasEnrolled={hasEnrolled}
          index={index}
          isOnMachineCourse={isOnMachineCourse}
          slug={slug}
        />
      </AccordionPanel>
    </AccordionItem>
  );
};

export { ModuleItem };

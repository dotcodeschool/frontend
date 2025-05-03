"use client";

import Link from "next/link";
import {
  Box,
  Heading,
  Text,
  Flex,
  Tag,
  Avatar,
  HStack,
  Divider,
  Button,
  VStack,
  LinkBox,
  LinkOverlay,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  IconButton,
  Tooltip,
  useToast,
  useClipboard,
} from "@chakra-ui/react";
import { ChevronRightIcon, ArrowBackIcon, CheckIcon, LinkIcon } from "@chakra-ui/icons";
import { FaTwitter, FaFacebook, FaLinkedin } from "react-icons/fa";
import { MDXBundlerRenderer } from "@/components/mdx-bundler-renderer";

interface ArticleData {
  slug: string;
  title: string;
  description: string;
  tags: string[];
  author: string;
  date: string;
  code: string;
}

interface RelatedArticle {
  slug: string;
  title: string;
  description: string;
}

interface ArticleContentProps {
  article: ArticleData;
  formattedDate: string;
  relatedArticles: RelatedArticle[];
}

export default function ArticleContent({
  article,
  formattedDate,
  relatedArticles,
}: ArticleContentProps) {
  const toast = useToast();
  const { onCopy, hasCopied } = useClipboard(
    typeof window !== "undefined" ? window.location.href : ""
  );

  const handleShare = (platform: string) => {
    if (typeof window === "undefined") return;

    const url = encodeURIComponent(window.location.href);
    const title = encodeURIComponent(article.title);
    
    let shareUrl = "";
    
    switch (platform) {
      case "twitter":
        shareUrl = `https://twitter.com/intent/tweet?url=${url}&text=${title}`;
        break;
      case "facebook":
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
        break;
      case "linkedin":
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${url}`;
        break;
      default:
        return;
    }
    
    window.open(shareUrl, "_blank", "noopener,noreferrer");
  };

  const handleCopyLink = () => {
    onCopy();
    toast({
      title: "Link copied to clipboard",
      status: "success",
      duration: 2000,
      isClosable: true,
    });
  };
  return (
    <>
      {/* Article Header */}
      <Box mb={8}>
        {/* Breadcrumb */}
        <Breadcrumb
          separator={<ChevronRightIcon color="gray.500" />}
          mb={6}
          fontSize="sm"
          color="gray.500"
        >
          <BreadcrumbItem>
            <BreadcrumbLink as={Link} href="/">
              Home
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbItem>
            <BreadcrumbLink as={Link} href="/articles">
              Articles
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbItem isCurrentPage>
            <BreadcrumbLink>{article.title}</BreadcrumbLink>
          </BreadcrumbItem>
        </Breadcrumb>

        <Button
          as={Link}
          href="/articles"
          leftIcon={<ArrowBackIcon />}
          variant="ghost"
          size="sm"
          mb={4}
        >
          Back to articles
        </Button>

        <Heading as="h1" size="2xl" mb={4}>
          {article.title}
        </Heading>

        <Flex wrap="wrap" gap={2} mb={4}>
          {article.tags.map((tag) => (
            <Tag key={tag} colorScheme="gray" size="md">
              {tag}
            </Tag>
          ))}
        </Flex>

        <HStack mt={6} spacing={4}>
          <Avatar
            name={article.author}
            size="md"
            src={`/authors/${article.author.toLowerCase().replace(" ", "-")}.jpg`}
          />
          <Box>
            <Text fontWeight="bold">{article.author}</Text>
            <Text fontSize="sm" color="gray.500">
              {formattedDate}
            </Text>
          </Box>
        </HStack>

        <Divider my={6} />
      </Box>

      {/* Article Content using the existing MDXBundlerRenderer */}
      <Box className="article-content">
        <MDXBundlerRenderer code={article.code} />
      </Box>

      <Divider my={10} />

      {/* Share buttons */}
      <Flex mt={6} align="center">
        <Text mr={3} fontWeight="medium">
          Share:
        </Text>
        <HStack spacing={2}>
          <Tooltip label="Share on Twitter">
            <IconButton
              aria-label="Share on Twitter"
              icon={<FaTwitter />}
              size="sm"
              onClick={() => handleShare("twitter")}
            />
          </Tooltip>
          <Tooltip label="Share on Facebook">
            <IconButton
              aria-label="Share on Facebook"
              icon={<FaFacebook />}
              size="sm"
              onClick={() => handleShare("facebook")}
            />
          </Tooltip>
          <Tooltip label="Share on LinkedIn">
            <IconButton
              aria-label="Share on LinkedIn"
              icon={<FaLinkedin />}
              size="sm"
              onClick={() => handleShare("linkedin")}
            />
          </Tooltip>
          <Tooltip label={hasCopied ? "Copied!" : "Copy link"}>
            <IconButton
              aria-label="Copy link"
              icon={hasCopied ? <CheckIcon /> : <LinkIcon />}
              size="sm"
              onClick={handleCopyLink}
            />
          </Tooltip>
        </HStack>
      </Flex>

      {/* Related Articles */}
      {relatedArticles.length > 0 && (
        <Box mt={10}>
          <Heading as="h3" size="lg" mb={6}>
            Related Articles
          </Heading>
          <VStack spacing={4} align="stretch">
            {relatedArticles.map((relatedArticle) => (
              <LinkBox
                key={relatedArticle.slug}
                p={4}
                borderWidth="1px"
                borderRadius="md"
                _hover={{ bg: "gray.700" }}
              >
                <Flex justify="space-between" align="center">
                  <Box>
                    <LinkOverlay
                      as={Link}
                      href={`/articles/${relatedArticle.slug}`}
                    >
                      <Heading as="h4" size="md">
                        {relatedArticle.title}
                      </Heading>
                    </LinkOverlay>
                    <Text fontSize="sm" color="gray.500" noOfLines={2}>
                      {relatedArticle.description}
                    </Text>
                  </Box>
                  <ChevronRightIcon boxSize={6} color="green.500" />
                </Flex>
              </LinkBox>
            ))}
          </VStack>
        </Box>
      )}
    </>
  );
}

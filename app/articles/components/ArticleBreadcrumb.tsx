"use client";

import Link from "next/link";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink } from "@chakra-ui/react";
import { ChevronRightIcon } from "@chakra-ui/icons";

interface ArticleBreadcrumbProps {
  category?: string;
  tag?: string;
  categoryLabel?: string;
  tagLabel?: string;
}

export default function ArticleBreadcrumb({
  category,
  categoryLabel,
  tagLabel,
}: ArticleBreadcrumbProps) {
  return (
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
        <BreadcrumbLink>
          {category ? categoryLabel : `Tag: ${tagLabel}`}
        </BreadcrumbLink>
      </BreadcrumbItem>
    </Breadcrumb>
  );
}

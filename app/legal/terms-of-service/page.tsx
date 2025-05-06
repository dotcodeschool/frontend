import React from "react";
import { readFile } from "fs/promises";
import path from "path";
import { bundleMDX } from "mdx-bundler";
import { Container } from "@chakra-ui/react";
import { MDXBundlerRenderer } from "@/components/mdx-bundler-renderer";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/Footer";

export const metadata = {
  title: "Terms of Service | DotCodeSchool",
  description: "Legal terms and conditions for using DotCodeSchool",
};

async function getTermsOfService() {
  const filePath = path.join(
    process.cwd(),
    "content/legal/terms-of-service.mdx",
  );
  const source = await readFile(filePath, "utf8");

  const { code, frontmatter } = await bundleMDX({
    source,
    mdxOptions(options) {
      return options;
    },
  });

  return { code, frontmatter };
}

export default async function TermsOfServicePage() {
  const { code, frontmatter } = await getTermsOfService();

  return (
    <>
      <Navbar
        navLinks={[
          { label: "Courses", href: "/courses" },
          { label: "Articles", href: "/articles" },
        ]}
      />
      <Container maxW="container.md" py={8} px={4}>
        <MDXBundlerRenderer code={code} />
      </Container>
      <Footer />
    </>
  );
}

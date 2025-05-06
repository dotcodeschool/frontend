import React from "react";
import { readFile } from "fs/promises";
import path from "path";
import { bundleMDX } from "mdx-bundler";
import { Container } from "@chakra-ui/react";
import { MDXBundlerRenderer } from "@/components/mdx-bundler-renderer";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/Footer";

export const metadata = {
  title: "Privacy Policy | DotCodeSchool",
  description:
    "How DotCodeSchool collects, uses, and protects your personal information",
};

async function getPrivacyPolicy() {
  const filePath = path.join(process.cwd(), "content/legal/privacy-policy.mdx");
  const source = await readFile(filePath, "utf8");

  const { code, frontmatter } = await bundleMDX({
    source,
    mdxOptions(options) {
      return options;
    },
  });

  return { code, frontmatter };
}

export default async function PrivacyPolicyPage() {
  const { code, frontmatter } = await getPrivacyPolicy();

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

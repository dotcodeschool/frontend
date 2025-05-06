import React from "react";
import { readFile } from "fs/promises";
import path from "path";
import { bundleMDX } from "mdx-bundler";
import { Container } from "@chakra-ui/react";
import { MDXBundlerRenderer } from "@/components/mdx-bundler-renderer";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/Footer";

export const metadata = {
  title: "Disclaimer | DotCodeSchool",
  description:
    "Important disclaimers and limitations regarding DotCodeSchool's educational content",
};

async function getDisclaimer() {
  const filePath = path.join(process.cwd(), "content/legal/disclaimer.mdx");
  const source = await readFile(filePath, "utf8");

  const { code, frontmatter } = await bundleMDX({
    source,
    mdxOptions(options) {
      return options;
    },
  });

  return { code, frontmatter };
}

export default async function DisclaimerPage() {
  const { code, frontmatter } = await getDisclaimer();

  return (
    <>
      <Container px={4} maxW="container.xl">
        <Navbar
          navLinks={[
            { label: "Courses", href: "/courses" },
            { label: "Articles", href: "/articles" },
          ]}
        />
      </Container>
      <Container maxW="container.md" py={8} px={4}>
        <MDXBundlerRenderer code={code} />
      </Container>
      <Footer />
    </>
  );
}

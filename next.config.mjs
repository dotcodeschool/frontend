import createMDX from "@next/mdx";
import rehypeRaw from "rehype-raw";
import rehypeHighlight from "rehype-highlight";
import rehypeStringify from "rehype-stringify";
import rehypeMdxCodeProps from "rehype-mdx-code-props";
import rehypeSanitize from "rehype-sanitize";
import remarkGfm from "remark-gfm";

/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ["js", "jsx", "mdx", "ts", "tsx"],
  redirects: async function redirects() {
    return [
      {
        source: "/courses/:course/lesson/:lesson/chapter/:chapter",
        destination: "/courses/:course/section/:lesson/lesson/:chapter",
        permanent: true,
      },
    ];
  },
  webpack: (config, { isServer }) => {
    // Exclude JS/TS files in the content directory from being processed by webpack
    config.module.rules.forEach((rule) => {
      if (
        rule.test &&
        rule.test.test &&
        (rule.test.test(".js") ||
          rule.test.test(".ts") ||
          rule.test.test(".tsx") ||
          rule.test.test(".jsx"))
      ) {
        if (!rule.exclude) {
          rule.exclude = [];
        } else if (!Array.isArray(rule.exclude)) {
          rule.exclude = [rule.exclude];
        }

        // Add content directory to exclude
        rule.exclude.push(/content/);
      }
    });

    return config;
  },
};

const withMDX = createMDX({
  options: {
    remarkPlugins: [remarkGfm],
    rehypePlugins: [
      rehypeRaw,
      rehypeSanitize,
      rehypeHighlight,
      rehypeStringify,
      rehypeMdxCodeProps,
    ],
  },
});

export default withMDX({ ...nextConfig });

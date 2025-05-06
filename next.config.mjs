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

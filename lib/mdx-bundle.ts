import { bundleMDX } from 'mdx-bundler';
import rehypeMdxCodeProps from 'rehype-mdx-code-props';
import path from 'path';

// Polyfill for resolving ESBuild binary on different platforms
if (process.platform === 'win32') {
  process.env.ESBUILD_BINARY_PATH = path.join(
    process.cwd(),
    'node_modules',
    'esbuild',
    'esbuild.exe'
  );
} else {
  process.env.ESBUILD_BINARY_PATH = path.join(
    process.cwd(),
    'node_modules',
    'esbuild',
    'bin',
    'esbuild'
  );
}

export async function bundleMdxContent(mdxSource: string) {
  if (!mdxSource) return { code: '' };

  try {
    const result = await bundleMDX({
      source: mdxSource,
      mdxOptions(options) {
        options.rehypePlugins = [
          ...(options.rehypePlugins || []),
          rehypeMdxCodeProps
        ];
        return options;
      },
    });
    
    return result;
  } catch (error) {
    console.error('Error bundling MDX:', error);
    return { code: `export default function MDXContent() { return <pre>${JSON.stringify(mdxSource)}</pre>; }` };
  }
}
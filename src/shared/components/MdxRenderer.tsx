import { getMDXComponent } from "mdx-bundler/client";
import { useMemo } from "react";

import { mdxComponents } from "./mdx-components";

interface Props {
  code: string;
}

export default function MdxRenderer({ code }: Props) {
  const Component = useMemo(() => getMDXComponent(code), [code]);
  return <Component components={mdxComponents} />;
}

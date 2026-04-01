import { Error, InfoBox, Success, Warning } from "./Alert";
import { CodeBlock } from "./CodeBlock";
import { FillInTheBlankQuiz } from "./FillInTheBlank";
import { MdxButton } from "./MdxButton";
import { Quiz } from "./Quiz";
import { QuizGroup } from "./QuizGroup";
import { TrueFalseQuiz } from "./TrueFalseQuiz";

function Pre(props: any) {
  const childProps = props.children?.props ?? {};
  const code =
    typeof childProps.children === "string" ? childProps.children : "";
  const className = childProps.className ?? "";
  // rehype-mdx-code-props puts filename on the pre element (props), not on code (childProps)
  let filename = props.filename ?? childProps.filename;
  if (!filename) {
    // Fallback: check meta string on either element
    const meta = props.meta ?? childProps.meta ?? "";
    const match = meta.match(/filename="([^"]+)"/);
    if (match) filename = match[1];
  }
  return (
    <CodeBlock className={className} filename={filename}>
      {code}
    </CodeBlock>
  );
}

export const mdxComponents = {
  pre: Pre,
  code: (props: any) => {
    // If this code element is a direct child (no pre wrapper) but contains
    // what looks like a code block (multiline or code-like content), render as CodeBlock
    if (typeof props.children === "string") {
      const text = props.children;
      const hasNewlines = text.includes("\n");
      const lang = props.className?.replace("language-", "") ?? "";

      // Multi-line code or code with a language class → render as code block
      if (hasNewlines || lang) {
        return (
          <CodeBlock
            className={props.className ?? ""}
            filename={props.filename}
          >
            {text}
          </CodeBlock>
        );
      }

      // Single-line inline code
      return (
        <code className="text-accent bg-elevated px-1.5 py-0.5 rounded text-sm font-mono">
          {text}
        </code>
      );
    }
    return <code {...props} />;
  },
  a: (props: any) => {
    const isExternal =
      typeof props.href === "string" && props.href.startsWith("http");
    if (isExternal) {
      return (
        <a
          {...props}
          target="_blank"
          rel="noreferrer"
          className="group relative inline-flex items-center gap-0.5 text-accent no-underline after:absolute after:-bottom-px after:left-0 after:h-px after:w-full after:bg-current after:origin-right after:scale-x-0 after:transition-transform after:duration-300 after:ease-out hover:after:origin-left hover:after:scale-x-100"
        >
          <span className="group-hover:opacity-90 transition-opacity">
            {props.children}
          </span>
          <svg
            className="inline h-3.5 w-3.5 translate-y-0 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M7 17L17 7" />
            <path d="M7 7h10v10" />
          </svg>
        </a>
      );
    }
    return (
      <a
        {...props}
        className="text-accent relative no-underline after:absolute after:-bottom-px after:left-0 after:h-px after:w-full after:bg-current after:origin-right after:scale-x-0 after:transition-transform after:duration-300 after:ease-out hover:after:origin-left hover:after:scale-x-100"
      >
        {props.children}
      </a>
    );
  },
  blockquote: (props: any) => (
    <blockquote
      className="border-l-4 border-accent pl-4 py-2 my-4 bg-elevated/50 rounded-r-lg text-content-secondary italic"
      {...props}
    />
  ),
  img: (props: any) => (
    <img className="rounded-lg max-w-full my-4" {...props} />
  ),
  table: (props: any) => (
    <div className="overflow-x-auto my-6">
      <table className="w-full text-sm" {...props} />
    </div>
  ),
  th: (props: any) => (
    <th
      className="p-2 text-left font-semibold text-content-primary border-b border-border"
      {...props}
    />
  ),
  td: (props: any) => (
    <td
      className="p-2 text-content-secondary border-b border-border"
      {...props}
    />
  ),
  InfoBox,
  Warning,
  Success,
  Error,
  Button: MdxButton,
  Quiz,
  TrueFalseQuiz,
  FillInTheBlankQuiz,
  QuizGroup,
};

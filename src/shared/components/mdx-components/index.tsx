import { CodeBlock } from './CodeBlock'
import { InfoBox, Warning, Success, Error } from './Alert'
import { MdxButton } from './MdxButton'
import { Quiz } from './Quiz'
import { TrueFalseQuiz } from './TrueFalseQuiz'
import { FillInTheBlankQuiz } from './FillInTheBlank'
import { QuizGroup } from './QuizGroup'

function Pre(props: any) {
  const childProps = props.children?.props ?? {}
  const code = typeof childProps.children === 'string' ? childProps.children : ''
  const className = childProps.className ?? ''
  // rehype-mdx-code-props puts filename on the pre element (props), not on code (childProps)
  let filename = props.filename ?? childProps.filename
  if (!filename) {
    // Fallback: check meta string on either element
    const meta = props.meta ?? childProps.meta ?? ''
    const match = meta.match(/filename="([^"]+)"/)
    if (match) filename = match[1]
  }
  return <CodeBlock className={className} filename={filename}>{code}</CodeBlock>
}

export const mdxComponents = {
  pre: Pre,
  code: (props: any) => {
    if (typeof props.children === 'string' && !props.className) {
      return <code className="text-accent bg-elevated px-1.5 py-0.5 rounded text-sm font-mono">{props.children}</code>
    }
    return <code {...props} />
  },
  a: (props: any) => {
    const isExternal = typeof props.href === 'string' && props.href.startsWith('http')
    return (
      <a
        {...props}
        target={isExternal ? '_blank' : undefined}
        rel={isExternal ? 'noopener noreferrer' : undefined}
        className="text-accent hover:underline inline-flex items-center gap-0.5"
      >
        {props.children}
        {isExternal && <span className="text-xs">↗</span>}
      </a>
    )
  },
  blockquote: (props: any) => (
    <blockquote className="border-l-4 border-accent pl-4 py-2 my-4 bg-elevated/50 rounded-r-lg text-content-secondary italic" {...props} />
  ),
  img: (props: any) => (
    <img className="rounded-lg max-w-full my-4" {...props} />
  ),
  table: (props: any) => (
    <div className="overflow-x-auto my-6">
      <table className="w-full text-sm" {...props} />
    </div>
  ),
  th: (props: any) => <th className="p-2 text-left font-semibold text-content-primary border-b border-border" {...props} />,
  td: (props: any) => <td className="p-2 text-content-secondary border-b border-border" {...props} />,
  InfoBox,
  Warning,
  Success,
  Error,
  Button: MdxButton,
  Quiz,
  TrueFalseQuiz,
  FillInTheBlankQuiz,
  QuizGroup,
}

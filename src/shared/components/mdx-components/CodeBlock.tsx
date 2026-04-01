import { useState, type ReactElement } from 'react'
import { Highlight, type PrismTheme } from 'prism-react-renderer'

const dcsTheme: PrismTheme = {
  plain: {
    color: '#abb2bf',
    backgroundColor: '#0a0c10',
  },
  styles: [
    { types: ['comment', 'prolog', 'doctype', 'cdata'], style: { color: '#5c6370', fontStyle: 'italic' as const } },
    { types: ['punctuation'], style: { color: '#abb2bf' } },
    { types: ['property', 'tag', 'constant', 'symbol', 'deleted'], style: { color: '#e06c75' } },
    { types: ['boolean', 'number'], style: { color: '#d19a66' } },
    { types: ['selector', 'attr-name', 'string', 'char', 'builtin', 'inserted'], style: { color: '#98c379' } },
    { types: ['operator', 'entity', 'url'], style: { color: '#56b6c2' } },
    { types: ['atrule', 'attr-value', 'keyword'], style: { color: '#c678dd' } },
    { types: ['function', 'class-name'], style: { color: '#61afef' } },
    { types: ['regex', 'important', 'variable'], style: { color: '#e06c75' } },
    { types: ['namespace'], style: { color: '#e5c07b' } },
  ],
}
import { CopyButton } from './CopyButton'
import { FaFile } from 'react-icons/fa'
import { FiTerminal } from 'react-icons/fi'
import {
  SiRust, SiTypescript, SiJavascript, SiToml, SiMarkdown, SiDocker,
  SiNodedotjs, SiReact, SiGit, SiYarn, SiPnpm, SiBun,
} from 'react-icons/si'
import { VscJson } from 'react-icons/vsc'
import { PiCertificateFill } from 'react-icons/pi'
import { MdLock, MdTerminal } from 'react-icons/md'

function getFileIcon(filename: string): ReactElement {
  const nameMap: Record<string, ReactElement> = {
    'Cargo.toml': <SiRust className="w-3.5 h-3.5" />,
    'package.json': <SiNodedotjs className="w-3.5 h-3.5" />,
    'pnpm-lock.yaml': <SiPnpm className="w-3.5 h-3.5" />,
    'yarn.lock': <SiYarn className="w-3.5 h-3.5" />,
    'bun.lockb': <SiBun className="w-3.5 h-3.5" />,
    'Dockerfile': <SiDocker className="w-3.5 h-3.5" />,
    'LICENSE': <PiCertificateFill className="w-3.5 h-3.5" />,
    'Makefile': <FiTerminal className="w-3.5 h-3.5" />,
    'README.md': <SiMarkdown className="w-3.5 h-3.5" />,
    'Terminal': <MdTerminal className="w-3.5 h-3.5" />,
  }
  if (nameMap[filename]) return nameMap[filename]

  const ext = filename.split('.').pop()?.toLowerCase() ?? ''
  const extMap: Record<string, ReactElement> = {
    rs: <SiRust className="w-3.5 h-3.5" />,
    ts: <SiTypescript className="w-3.5 h-3.5" />,
    tsx: <SiReact className="w-3.5 h-3.5" />,
    js: <SiJavascript className="w-3.5 h-3.5" />,
    jsx: <SiReact className="w-3.5 h-3.5" />,
    json: <VscJson className="w-3.5 h-3.5" />,
    toml: <SiToml className="w-3.5 h-3.5" />,
    md: <SiMarkdown className="w-3.5 h-3.5" />,
    mdx: <SiMarkdown className="w-3.5 h-3.5" />,
    sh: <MdTerminal className="w-3.5 h-3.5" />,
    lock: <MdLock className="w-3.5 h-3.5" />,
  }
  if (ext.startsWith('git')) return <SiGit className="w-3.5 h-3.5" />
  return extMap[ext] ?? <FaFile className="w-3.5 h-3.5" />
}

interface Props {
  children: string
  className?: string
  filename?: string
}

export function CodeBlock({ children, className, filename }: Props) {
  const [isHovered, setIsHovered] = useState(false)
  const rawLang = className?.replace('language-', '') || 'jsx' // defaults to jsx for untagged blocks
  // Map common aliases to prism-supported language names
  const langMap: Record<string, string> = {
    sh: 'bash',
    shell: 'bash',
    js: 'javascript',
    ts: 'typescript',
    yml: 'yaml',
  }
  const language = langMap[rawLang] ?? rawLang
  const code = children.replace(/\n+$/, '').trim()

  return (
    <div
      className="border border-border rounded-lg overflow-hidden mb-6 last:mb-0 not-prose relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {filename ? (
        <div
          className="flex items-center gap-2 px-3 py-2 border-b border-border text-sm text-content-muted"
          style={{ backgroundColor: dcsTheme.plain.backgroundColor }}
        >
          {getFileIcon(filename)}
          <span className="font-mono text-xs font-semibold">{filename}</span>
          <div className="flex-1" />
          <CopyButton text={code} />
        </div>
      ) : (
        isHovered && (
          <div className={`absolute right-3 z-10 ${code.includes('\n') ? 'top-3' : 'top-1/2 -translate-y-1/2'}`}>
            <CopyButton text={code} />
          </div>
        )
      )}
      <Highlight theme={dcsTheme} code={code} language={language}>
        {({ style, tokens: rawTokens, getLineProps, getTokenProps }) => {
          const tokens = rawTokens
          return (
          <pre
            className="relative overflow-x-auto px-6 py-4 text-sm leading-relaxed [&::-webkit-scrollbar]:h-1.5 [&::-webkit-scrollbar-thumb]:rounded [&:hover::-webkit-scrollbar-thumb]:bg-content-faint"
            style={{ ...style, margin: 0, backgroundColor: dcsTheme.plain.backgroundColor }}
          >
            <code className={`flex flex-col ${filename ? '' : 'pr-12'}`}>
              {tokens.map((line, i) => (
                  <div key={i} {...getLineProps({ line })}>
                    {line.map((token, key) => (
                      <span key={key} {...getTokenProps({ token })} />
                    ))}
                  </div>
                ))}
            </code>
          </pre>
          )
        }}
      </Highlight>
    </div>
  )
}

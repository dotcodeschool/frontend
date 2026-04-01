import { useRef, useEffect, type ReactNode } from 'react'
import { Highlight, themes } from 'prism-react-renderer'
import { createRoot } from 'react-dom/client'

interface Props {
  children: ReactNode
  className?: string
}

/**
 * Wraps quiz explanation content and applies Prism syntax highlighting
 * to any <pre><code> blocks found after render.
 */
export function HighlightedExplanation({ children, className = '' }: Props) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!ref.current) return
    const codeBlocks = ref.current.querySelectorAll('pre > code')
    codeBlocks.forEach((codeEl) => {
      const pre = codeEl.parentElement
      if (!pre || pre.dataset.highlighted === 'true') return

      const code = codeEl.textContent?.trim() ?? ''
      const langClass = codeEl.className ?? ''
      const language = langClass.replace('language-', '') || 'jsx'

      // Create a container for the highlighted code
      const container = document.createElement('div')
      pre.replaceWith(container)
      pre.dataset.highlighted = 'true'

      const root = createRoot(container)
      root.render(
        <Highlight theme={themes.dracula} code={code} language={language}>
          {({ style, tokens: rawTokens, getLineProps, getTokenProps }) => {
            const tokens = rawTokens.filter((line, i) => {
              if (i < rawTokens.length - 1) return true
              return line.map(t => t.content).join('').trim().length > 0
            })
            return (
              <pre
                className="overflow-x-auto px-4 py-3 text-sm leading-relaxed rounded-lg my-2"
                style={{ ...style, margin: 0, backgroundColor: themes.dracula.plain.backgroundColor }}
              >
                <code>
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
      )
    })
  }, [children])

  return (
    <div
      ref={ref}
      className={`text-content-secondary [&_code]:text-accent [&_code]:bg-elevated [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded [&_code]:text-sm [&_code]:font-mono ${className}`}
    >
      {children}
    </div>
  )
}

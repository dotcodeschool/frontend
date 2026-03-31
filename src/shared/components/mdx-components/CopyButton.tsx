import { useState } from 'react'
import { FaCopy, FaCheck } from 'react-icons/fa'

interface Props {
  text: string
  className?: string
}

export function CopyButton({ text, className = '' }: Props) {
  const [copied, setCopied] = useState(false)

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 3000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  return (
    <button
      onClick={copy}
      className={`p-1.5 rounded transition-colors ${
        copied
          ? 'text-green-400 cursor-default'
          : 'text-content-faint hover:text-content-muted hover:bg-white/10'
      } ${className}`}
      aria-label={copied ? 'Copied!' : 'Copy code'}
    >
      {copied ? <FaCheck className="w-3.5 h-3.5" /> : <FaCopy className="w-3.5 h-3.5" />}
    </button>
  )
}

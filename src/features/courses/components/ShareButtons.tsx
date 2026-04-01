import { useState } from 'react'
import { FaTwitter, FaFacebook, FaLinkedin, FaLink, FaCheck, FaGithub } from 'react-icons/fa'

interface Props {
  title: string
  url: string
  githubEditUrl?: string
}

export default function ShareButtons({ title, url, githubEditUrl }: Props) {
  const [copied, setCopied] = useState(false)

  const shareLinks = [
    {
      icon: FaTwitter,
      label: 'Share on Twitter',
      href: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`,
    },
    {
      icon: FaFacebook,
      label: 'Share on Facebook',
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
    },
    {
      icon: FaLinkedin,
      label: 'Share on LinkedIn',
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
    },
  ]

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Fallback: do nothing if clipboard API unavailable
    }
  }

  return (
    <div className="flex items-center gap-3 pt-8 mt-8 border-t border-border">
      {/* Share icons */}
      <div className="flex items-center gap-1">
        {shareLinks.map(({ icon: Icon, label, href }) => (
          <a
            key={label}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            title={label}
            className="p-2 text-content-muted hover:text-content-secondary transition-colors rounded-md hover:bg-elevated"
          >
            <Icon className="text-sm" />
          </a>
        ))}
        <button
          onClick={handleCopyLink}
          title={copied ? 'Copied!' : 'Copy link'}
          className="p-2 text-content-muted hover:text-content-secondary transition-colors rounded-md hover:bg-elevated"
        >
          {copied ? <FaCheck className="text-sm text-success" /> : <FaLink className="text-sm" />}
        </button>
      </div>

      {/* Edit on GitHub */}
      {githubEditUrl && (
        <a
          href={githubEditUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="ml-auto flex items-center gap-1.5 text-xs text-content-muted hover:text-content-secondary transition-colors no-underline"
        >
          <FaGithub className="text-sm" />
          <span>Edit on GitHub</span>
        </a>
      )}
    </div>
  )
}

import type { ReactNode } from 'react'

interface Props {
  href?: string
  target?: string
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  children: ReactNode
  onClick?: () => void
}

const sizeClasses = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-5 py-2 text-sm',
  lg: 'px-8 py-3 text-base',
}

const variantClasses = {
  primary: 'bg-accent font-semibold hover:opacity-90',
  secondary: 'bg-elevated text-content-primary font-semibold hover:opacity-80',
  outline: 'border border-accent text-accent font-semibold hover:bg-accent hover:text-[var(--bg-base)]',
  ghost: 'text-accent font-semibold hover:bg-accent-bg',
}

export function MdxButton({ href, target, variant = 'primary', size = 'md', children, onClick }: Props) {
  const classes = `inline-block rounded-md transition-all my-4 no-underline ${sizeClasses[size]} ${variantClasses[variant]}`
  const needsLightText = variant === 'primary' || variant === 'outline'
  const inlineStyle = needsLightText ? { color: 'var(--bg-base)' } : undefined

  if (href) {
    return (
      <a href={href} target={target} rel={target === '_blank' ? 'noopener noreferrer' : undefined} className={classes} style={inlineStyle}>
        {children}
      </a>
    )
  }

  return (
    <button onClick={onClick} className={classes} style={inlineStyle}>
      {children}
    </button>
  )
}

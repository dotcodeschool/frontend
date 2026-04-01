import type { ReactNode, CSSProperties } from 'react'

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

const variantStyles: Record<string, { classes: string; style?: CSSProperties }> = {
  primary: { classes: 'bg-accent font-semibold hover:brightness-110', style: { color: 'var(--bg-base)' } },
  secondary: { classes: 'bg-elevated text-content-primary font-semibold hover:brightness-90' },
  outline: { classes: 'border font-semibold hover:brightness-90', style: { borderColor: 'var(--accent)', color: 'var(--accent)' } },
  ghost: { classes: 'text-accent font-semibold hover:bg-accent-bg' },
}

export function MdxButton({ href, target, variant = 'primary', size = 'md', children, onClick }: Props) {
  const { classes: variantCls, style: variantStyle } = variantStyles[variant] ?? variantStyles.primary
  const classes = `inline rounded-md transition-all my-2 no-underline cursor-pointer ${sizeClasses[size]} ${variantCls}`

  if (href) {
    return (
      <a href={href} target={target} rel={target === '_blank' ? 'noopener noreferrer' : undefined} className={classes} style={variantStyle}>
        {children}
      </a>
    )
  }

  return (
    <button onClick={onClick} className={classes} style={variantStyle}>
      {children}
    </button>
  )
}

import type { CSSProperties, ReactNode } from "react";

interface Props {
  href?: string;
  target?: string;
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  children: ReactNode;
  onClick?: () => void;
}

const sizeClasses = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-5 py-2 text-sm",
  lg: "px-8 py-3 text-base",
};

const variantStyles: Record<
  string,
  { classes: string; style?: CSSProperties }
> = {
  primary: {
    classes: "bg-accent font-semibold hover:brightness-110",
    style: { color: "var(--bg-base)" },
  },
  secondary: {
    classes:
      "bg-elevated text-content-primary font-semibold hover:brightness-90",
  },
  outline: {
    classes: "border font-semibold hover:brightness-90",
    style: { borderColor: "var(--accent)", color: "var(--accent)" },
  },
  ghost: { classes: "text-accent font-semibold hover:bg-accent-bg" },
};

export function MdxButton({
  href,
  target,
  variant = "primary",
  size = "md",
  children,
  onClick,
}: Props) {
  const { classes: variantCls, style: variantStyle } =
    variantStyles[variant] ?? variantStyles.primary;
  const classes = `inline-flex items-center rounded-md transition-all my-2 no-underline cursor-pointer [&>p]:m-0 [&>p]:inline ${sizeClasses[size]} ${variantCls}`;

  if (href) {
    const isExternal = target === "_blank" || href.startsWith("http");
    return (
      <a
        href={href}
        target={isExternal ? "_blank" : undefined}
        rel={isExternal ? "noreferrer" : undefined}
        className={`group ${classes}`}
        style={variantStyle}
      >
        {children}
        {isExternal ? (
          <svg
            className="inline h-3.5 w-3.5 ml-1.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M7 17L17 7" />
            <path d="M7 7h10v10" />
          </svg>
        ) : (
          <svg
            className="inline h-3.5 w-3.5 ml-1.5 transition-transform duration-300 group-hover:translate-x-0.5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M5 12h14" />
            <path d="M12 5l7 7-7 7" />
          </svg>
        )}
      </a>
    );
  }

  return (
    <button onClick={onClick} className={classes} style={variantStyle}>
      {children}
    </button>
  );
}

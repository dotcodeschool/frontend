type NavbarProps = {
  navLinks?: NavLink[];
  cta?: boolean;
  isLessonInterface?: boolean;
  feedbackUrl?: string;
};

type NavLink = {
  label: string;
  href: string;
};

export type { NavbarProps, NavLink };

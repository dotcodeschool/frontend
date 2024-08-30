export interface FeatureComponentProps {
  title: string | JSX.Element;
  description: string | JSX.Element;
  image: string;
  alt?: string;
  isImageFirst?: boolean;
  cta?: JSX.Element;
}

export type Module = {
  id: string;
  index: number;
  title: string;
  description: MDXRemoteSerializeResult;
  numOfLessons: number;
};

export interface ModuleListProps {
  modules: Module[];
}

export interface ModuleProps {
  module: Module;
  slug: string;
}

interface CoursePageProps {
  slug: string;
  title: string;
  author: Author;
  description: string;
  modules: Module[];
  tags: { language: string; level: string };
}

export interface SuccessPageProps {
  slug: string;
  course: string;
  lesson: string;
  totalLessonsInCourse: number;
}

type File = {
  fileName: string;
  code: string;
  language: string;
};

interface Files {
  source: File[];
  template: File[];
  solution: File[];
}

interface CourseModuleProps {
  courseId: string;
  lessonId: string;
  chapterId: string;
  mdxSource: MDXRemoteSerializeResult;
  files: Files;
  current: string;
  prev: string;
  next: string;
  chapters: any[];
  sections: any[];
  githubUrl: string;
}

interface NavLink {
  name: string;
  href: string;
}

interface NavbarProps {
  navLinks?: NavLink[];
  cta?: boolean;
  isLessonInterface?: boolean;
  lessonDetails?: {
    courseId: string;
    lessonId: string;
    chapterId: string;
    chapters: any[];
    githubUrl: string;
  };
}

interface SectionProps {
  courseId: string;
  section: {
    sectionIndex: number;
    title: string;
    lessons: any[];
  };
  current: string;
  isActive: boolean;
}

interface BottomNavbarProps {
  doesMatch?: boolean;
  isOpen?: boolean;
  courseId: string;
  lessonId: string;
  chapterId: string;
  current: string;
  prev?: string;
  next?: string;
  sections: any[];
  toggleAnswer?: () => void;
}

type File = {
  fileName: string;
  code: string;
  language: string;
};

interface setEditorContent {
  (newEditorContent: File[]): void;
}

export interface EditorTabsProps {
  showHints: boolean;
  isAnswerOpen: boolean;
  readOnly?: boolean;
  incorrectFiles: File[];
  solution: File[];
  editorContent: File[];
  isOpen: boolean;
  tabIndex: number;
  showDiff: boolean;
  setShowDiff: (showDiff: boolean) => void;
  setTabIndex: (index: number) => void;
  onOpen: () => void;
  onClose: () => void;
  setEditorContent: setEditorContent;
}

interface FullscreenEditorModalProps {
  isOpen: boolean;
  editorProps: EditorTabsProps;
}

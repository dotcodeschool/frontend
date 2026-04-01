import type { editor } from 'monaco-editor'

export const DCS_THEME_NAME = 'dcs-dark'

// Monaco token names vary by language. For Rust specifically, Monaco's built-in
// monarch tokenizer uses names like: keyword, type.identifier, identifier, etc.
// We define rules broadly to catch all variations.
export const dcsDarkTheme: editor.IStandaloneThemeData = {
  base: 'vs-dark',
  inherit: false,
  rules: [
    // Default text
    { token: '', foreground: 'abb2bf', background: '0a0c10' },

    // Comments
    { token: 'comment', foreground: '5c6370', fontStyle: 'italic' },
    { token: 'comment.line', foreground: '5c6370', fontStyle: 'italic' },
    { token: 'comment.block', foreground: '5c6370', fontStyle: 'italic' },
    { token: 'comment.content', foreground: '5c6370', fontStyle: 'italic' },

    // Strings
    { token: 'string', foreground: '98c379' },
    { token: 'string.quoted', foreground: '98c379' },
    { token: 'string.escape', foreground: '56b6c2' },

    // Numbers
    { token: 'number', foreground: 'd19a66' },
    { token: 'number.float', foreground: 'd19a66' },
    { token: 'number.hex', foreground: 'd19a66' },

    // Keywords — all forms Monaco might use
    { token: 'keyword', foreground: 'c678dd' },
    { token: 'keyword.control', foreground: 'c678dd' },
    { token: 'keyword.type', foreground: 'c678dd' },
    { token: 'keyword.type.rust', foreground: 'c678dd' },
    { token: 'keyword.other', foreground: 'c678dd' },
    { token: 'keyword.rust', foreground: 'c678dd' },
    { token: 'keyword.control.rust', foreground: 'c678dd' },

    // Types
    { token: 'type', foreground: 'e5c07b' },
    { token: 'type.identifier', foreground: 'e5c07b' },
    { token: 'type.identifier.rust', foreground: 'e5c07b' },
    { token: 'support.type', foreground: 'e5c07b' },
    { token: 'entity.name.type', foreground: 'e5c07b' },
    { token: 'class', foreground: 'e5c07b' },
    { token: 'struct', foreground: 'e5c07b' },

    // Functions
    { token: 'function', foreground: '61afef' },
    { token: 'entity.name.function', foreground: '61afef' },
    { token: 'support.function', foreground: '61afef' },
    { token: 'function.call', foreground: '61afef' },

    // Variables and identifiers
    { token: 'variable', foreground: 'e06c75' },
    { token: 'variable.parameter', foreground: 'e06c75' },
    { token: 'identifier', foreground: 'abb2bf' },

    // Operators and delimiters
    { token: 'operator', foreground: '56b6c2' },
    { token: 'operator.rust', foreground: '56b6c2' },
    { token: 'delimiter', foreground: 'abb2bf' },
    { token: 'delimiter.bracket', foreground: 'abb2bf' },
    { token: 'delimiter.parenthesis', foreground: 'abb2bf' },
    { token: 'delimiter.curly', foreground: 'abb2bf' },
    { token: 'delimiter.square', foreground: 'abb2bf' },
    { token: 'delimiter.angle', foreground: 'abb2bf' },

    // Constants
    { token: 'constant', foreground: 'd19a66' },
    { token: 'constant.language', foreground: 'd19a66' },

    // Attributes / annotations
    { token: 'annotation', foreground: 'e5c07b' },
    { token: 'attribute', foreground: 'e5c07b' },
    { token: 'attribute.name', foreground: 'e5c07b' },
    { token: 'metatag', foreground: 'e5c07b' },
    { token: 'meta', foreground: 'e5c07b' },

    // Tags (TOML sections, HTML)
    { token: 'tag', foreground: 'e06c75' },
    { token: 'metatag.content', foreground: 'e06c75' },

    // Namespace / module
    { token: 'namespace', foreground: 'e5c07b' },

    // Macros (Rust-specific)
    { token: 'macro', foreground: '56b6c2' },

    // Lifetime (Rust-specific)
    { token: 'lifetime', foreground: 'd19a66' },

    // --- Language-specific overrides ---

    // TOML
    { token: 'key', foreground: 'e06c75' },
    { token: 'string.key', foreground: 'e06c75' },

    // JSON
    { token: 'string.key.json', foreground: 'e06c75' },
    { token: 'string.value.json', foreground: '98c379' },

    // TypeScript / JavaScript
    { token: 'keyword.ts', foreground: 'c678dd' },
    { token: 'keyword.js', foreground: 'c678dd' },
    { token: 'type.identifier.ts', foreground: 'e5c07b' },
    { token: 'type.identifier.js', foreground: 'e5c07b' },

    // CSS
    { token: 'attribute.name.css', foreground: 'e06c75' },
    { token: 'attribute.value.css', foreground: '98c379' },
    { token: 'tag.css', foreground: 'e06c75' },

    // Markdown
    { token: 'keyword.md', foreground: 'e06c75' },
    { token: 'string.link.md', foreground: '61afef' },

    // Shell
    { token: 'keyword.shell', foreground: 'c678dd' },
    { token: 'variable.shell', foreground: 'e06c75' },
  ],
  colors: {
    'editor.background': '#0a0c10',
    'editor.foreground': '#abb2bf',
    'editor.lineHighlightBackground': '#1a1d2700',
    'editor.lineHighlightBorder': '#1a1d2700',
    'editor.selectionBackground': '#3e4451',
    'editor.inactiveSelectionBackground': '#3e445180',
    'editorCursor.foreground': '#61afef',
    'editorWhitespace.foreground': '#3b4048',
    'editorIndentGuide.background': '#3b404840',
    'editorIndentGuide.activeBackground': '#3b404880',
    'editorLineNumber.foreground': '#495162',
    'editorLineNumber.activeForeground': '#abb2bf',
    'editor.selectionHighlightBackground': '#3e445140',
    'editorBracketMatch.background': '#3e445180',
    'editorBracketMatch.border': '#61afef50',
    'scrollbarSlider.background': '#3b404840',
    'scrollbarSlider.hoverBackground': '#3b404880',
    'scrollbarSlider.activeBackground': '#3b4048c0',
    'editorWidget.background': '#111318',
    'editorWidget.border': '#1e2230',
    'editorSuggestWidget.background': '#111318',
    'editorSuggestWidget.border': '#1e2230',
    'editorSuggestWidget.selectedBackground': '#1a1d27',
    'editorHoverWidget.background': '#111318',
    'editorHoverWidget.border': '#1e2230',
    'editorGutter.background': '#0a0c10',
  },
}

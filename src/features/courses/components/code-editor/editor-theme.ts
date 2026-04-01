import type { editor } from 'monaco-editor'

export const DCS_THEME_NAME = 'dcs-dark'

export const dcsDarkTheme: editor.IStandaloneThemeData = {
  base: 'vs-dark',
  inherit: true,
  rules: [
    // Keywords (pub, fn, let, mut, use, struct, impl, mod, return, if, else, match, etc.)
    { token: 'keyword', foreground: 'c678dd' },
    { token: 'keyword.control', foreground: 'c678dd' },
    { token: 'keyword.operator', foreground: 'c678dd' },

    // Types and structs
    { token: 'type', foreground: 'e5c07b' },
    { token: 'type.identifier', foreground: 'e5c07b' },
    { token: 'support.type', foreground: 'e5c07b' },
    { token: 'entity.name.type', foreground: 'e5c07b' },

    // Functions
    { token: 'entity.name.function', foreground: '61afef' },
    { token: 'support.function', foreground: '61afef' },
    { token: 'function', foreground: '61afef' },

    // Variables and parameters
    { token: 'variable', foreground: 'e06c75' },
    { token: 'variable.parameter', foreground: 'e06c75' },
    { token: 'variable.other', foreground: 'e06c75' },
    { token: 'entity.name.variable', foreground: 'e06c75' },

    // Strings
    { token: 'string', foreground: '98c379' },
    { token: 'string.quoted', foreground: '98c379' },

    // Numbers
    { token: 'number', foreground: 'd19a66' },
    { token: 'constant.numeric', foreground: 'd19a66' },

    // Comments
    { token: 'comment', foreground: '5c6370', fontStyle: 'italic' },
    { token: 'comment.line', foreground: '5c6370', fontStyle: 'italic' },
    { token: 'comment.block', foreground: '5c6370', fontStyle: 'italic' },

    // Operators and punctuation
    { token: 'delimiter', foreground: 'abb2bf' },
    { token: 'delimiter.bracket', foreground: 'abb2bf' },
    { token: 'operator', foreground: '56b6c2' },

    // Constants
    { token: 'constant', foreground: 'd19a66' },
    { token: 'constant.language', foreground: 'd19a66' },

    // Macros and attributes
    { token: 'annotation', foreground: 'e5c07b' },
    { token: 'meta.attribute', foreground: 'e5c07b' },

    // Tags (for TOML, HTML, etc.)
    { token: 'tag', foreground: 'e06c75' },
    { token: 'metatag', foreground: 'e06c75' },

    // Default text
    { token: '', foreground: 'abb2bf' },

    // Identifiers
    { token: 'identifier', foreground: 'abb2bf' },

    // Namespace / module
    { token: 'namespace', foreground: 'e5c07b' },
  ],
  colors: {
    'editor.background': '#0a0c10',
    'editor.foreground': '#abb2bf',
    'editor.lineHighlightBackground': '#1a1d27',
    'editor.selectionBackground': '#3e4451',
    'editor.inactiveSelectionBackground': '#3e445180',
    'editorCursor.foreground': '#61afef',
    'editorWhitespace.foreground': '#3b4048',
    'editorIndentGuide.background': '#3b404880',
    'editorIndentGuide.activeBackground': '#3b4048',
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
  },
}

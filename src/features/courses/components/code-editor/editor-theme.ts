import type { editor } from 'monaco-editor'

export const DCS_THEME_NAME = 'dcs-dark'

// Monaco's built-in tokenizers produce limited token types:
// keyword, identifier, string, number, comment, delimiter, operator, type.identifier
// We style these to create a warm One Dark-inspired palette that works
// within Monaco's tokenization constraints.
export const dcsDarkTheme: editor.IStandaloneThemeData = {
  base: 'vs-dark',
  inherit: false,
  rules: [
    // Base text
    { token: '', foreground: 'abb2bf', background: '0a0c10' },
    { token: 'identifier', foreground: 'e06c75' },

    // Keywords: pub, fn, let, mut, struct, impl, use, mod, self, return, if, else, match, etc.
    { token: 'keyword', foreground: 'c678dd' },

    // Type identifiers: String, HashMap, Self, u128, etc.
    { token: 'type.identifier', foreground: 'e5c07b' },

    // Strings
    { token: 'string', foreground: '98c379' },
    { token: 'string.escape', foreground: '56b6c2' },

    // Numbers
    { token: 'number', foreground: 'd19a66' },
    { token: 'number.float', foreground: 'd19a66' },
    { token: 'number.hex', foreground: 'd19a66' },

    // Comments
    { token: 'comment', foreground: '5c6370', fontStyle: 'italic' },

    // Operators: =, +, -, *, ->, ::, &, etc.
    { token: 'operator', foreground: '56b6c2' },

    // Delimiters: {, }, (, ), [, ], <, >, ;, ,, .
    { token: 'delimiter', foreground: 'abb2bf' },
    { token: 'delimiter.bracket', foreground: 'abb2bf' },
    { token: 'delimiter.parenthesis', foreground: 'abb2bf' },
    { token: 'delimiter.curly', foreground: 'abb2bf' },
    { token: 'delimiter.square', foreground: 'abb2bf' },
    { token: 'delimiter.angle', foreground: 'abb2bf' },

    // Annotations / attributes: #[derive(Debug)]
    { token: 'annotation', foreground: 'e5c07b' },
    { token: 'attribute', foreground: 'e5c07b' },
    { token: 'metatag', foreground: 'e5c07b' },

    // Tags (TOML headers like [package], [dependencies])
    { token: 'tag', foreground: 'e06c75' },

    // Namespace
    { token: 'namespace', foreground: 'e5c07b' },

    // Lifetime 'a
    { token: 'lifetime', foreground: 'd19a66' },

    // Constants
    { token: 'constant', foreground: 'd19a66' },

    // --- TOML ---
    { token: 'key', foreground: 'e06c75' },
    { token: 'string.key', foreground: 'e06c75' },

    // --- JSON ---
    { token: 'string.key.json', foreground: 'e06c75' },
    { token: 'string.value.json', foreground: '98c379' },

    // --- TypeScript / JavaScript ---
    { token: 'keyword.ts', foreground: 'c678dd' },
    { token: 'keyword.js', foreground: 'c678dd' },
    { token: 'identifier.ts', foreground: 'e06c75' },
    { token: 'identifier.js', foreground: 'e06c75' },
    { token: 'type.identifier.ts', foreground: 'e5c07b' },
    { token: 'type.identifier.js', foreground: 'e5c07b' },

    // --- CSS ---
    { token: 'attribute.name.css', foreground: 'e06c75' },
    { token: 'attribute.value.css', foreground: '98c379' },
    { token: 'tag.css', foreground: 'e06c75' },

    // --- Markdown ---
    { token: 'keyword.md', foreground: 'e06c75' },
    { token: 'string.link.md', foreground: '61afef' },

    // --- Shell ---
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

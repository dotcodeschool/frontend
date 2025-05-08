/**
 * Determines the language for syntax highlighting based on file extension
 * @param fileName The name of the file
 * @returns The language identifier for the Monaco editor
 */
export const getLanguageFromFileName = (fileName: string): string => {
  const extension = fileName.split(".").pop()?.toLowerCase();

  switch (extension) {
    case "js":
      return "javascript";
    case "jsx":
      return "javascript";
    case "ts":
      return "typescript";
    case "tsx":
      return "typescript";
    case "html":
      return "html";
    case "css":
      return "css";
    case "json":
      return "json";
    case "md":
    case "mdx":
      return "markdown";
    case "py":
      return "python";
    case "rs":
      return "rust";
    case "toml":
      return "rust"; // Format TOML files as Rust
    case "go":
      return "go";
    case "java":
      return "java";
    case "c":
      return "c";
    case "cpp":
    case "cc":
      return "cpp";
    case "sh":
      return "shell";
    default:
      return "plaintext";
  }
};

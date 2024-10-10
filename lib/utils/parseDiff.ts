type DiffLine = string;

type Filename = string;

type FileContent = string[];

const isNewFile = (line: DiffLine): boolean => line.startsWith("diff --git");

const isRelevantLine = (line: DiffLine): boolean => {
  const relevantPrefixes = ["index", "---", "+++", "@@", "-", "+"];
  const isNonEmptyLine = line.trim() !== "";

  return relevantPrefixes.some(
    (prefix) => line.startsWith(prefix) || isNonEmptyLine,
  );
};

const extractFilename = (line: DiffLine): Filename => {
  const [, filename] = line.split(" ");

  return filename;
};

const processLine = (content: FileContent, line: DiffLine): FileContent => {
  if (isNewFile(line) || isRelevantLine(line)) {
    content.push(line);
  }

  return content;
};

const saveFile = (
  files: Record<string, string>,
  filename: Filename,
  content: FileContent,
): void => {
  if (filename && content.length > 0) {
    files[filename] = content.join("\n");
  }
};

export const parseDiff = (diff: string): Record<string, string> => {
  const files: Record<string, string> = {};
  const lines = diff.split("\n");
  let currentFile = "";
  let content: FileContent = [];

  for (const line of lines) {
    if (isNewFile(line)) {
      saveFile(files, currentFile, content);
      currentFile = extractFilename(line);
      content = [];
    }
    content = processLine(content, line);
  }

  saveFile(files, currentFile, content);

  return files;
};

import { getContentById } from "@/pages/api/get-content";

export async function fetchEntry(id: string) {
  const entry = await getContentById(id);
  if (!entry) {
    throw new Error(`Entry with id ${id} not found`);
  }
  return entry;
}

export async function fetchFile(
  file: any,
): Promise<{ fileName: string; code: string }> {
  if (typeof file !== "object" || !file.fields) {
    throw new Error("File is not an object or file.fields is null");
  }
  const { url, fileName } = file.fields.file;
  const response = await fetch(`https:${url}`);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return {
    fileName,
    code: await response.text(),
  };
}

export function parseDiff(diff: string) {
  const lines = diff.split("\n");
  let originalContent = "";
  let modifiedContent = "";
  // let currentFile = "";
  let inHunk = false;

  for (const line of lines) {
    if (line.startsWith("diff --git")) {
      // Start of a new file diff
      // currentFile = line.split(" ")[2];
      originalContent += line + "\n";
      modifiedContent += line + "\n";
    } else if (
      line.startsWith("index") ||
      line.startsWith("--- ") ||
      line.startsWith("+++ ")
    ) {
      // Ignore these lines
      continue;
    } else if (line.startsWith("@@ ")) {
      // Hunk header
      inHunk = true;
      originalContent += line + "\n";
      modifiedContent += line + "\n";
    } else if (inHunk) {
      // Content lines
      if (line.startsWith("-")) {
        originalContent += line + "\n";
      } else if (line.startsWith("+")) {
        modifiedContent += line + "\n";
      } else {
        originalContent += line + "\n";
        modifiedContent += line + "\n";
      }
    }
  }

  return { originalContent, modifiedContent };
}

import { getContentById } from "@/pages/api/get-content";

export async function fetchEntry(id: string) {
  const entry = await getContentById(id);
  if (!entry) {
    throw new Error(`Entry with id ${id} not found`);
  }
  return entry;
}

export async function fetchFile(file: any) {
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
  let inHunk = false;
  for (const line of lines) {
    if (
      line.startsWith("diff --git") ||
      line.startsWith("index") ||
      line.startsWith("--- ") ||
      line.startsWith("+++ ")
    ) {
      // Ignore these lines
    } else if (line.startsWith("@@ ")) {
      // Hunk header: add to both original and modified to maintain context
      inHunk = true;
      originalContent += line + "\n";
      modifiedContent += line + "\n";
    } else if (inHunk) {
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

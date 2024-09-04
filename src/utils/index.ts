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

// Validates and returns the lessons array
export function getSections(entry: any) {
  const sections = entry.fields.sections;
  if (!sections || !Array.isArray(sections) || sections.length === 0) {
    throw new Error(
      "Failed to fetch the entry from Contentful or sections array is null or empty",
    );
  }
  return sections;
}

// Maps lessons to modules
export function mapSectionsToLessons(sections: any[]) {
  return sections.map((section, index) => {
    if (!section) {
      throw new Error("Lesson is undefined");
    }
    return {
      section: `${index + 1}`,
      id: section.sys.id,
      title: section.fields.title,
      description: section.fields.description,
    };
  });
}

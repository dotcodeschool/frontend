import { IParsedDiff } from "@/app/lib/types/IParsedDiff";

export function parseDiff(diff: string): IParsedDiff {
  let currentFile = "";
  const files: { [key: string]: string } = {};
  let content = "";

  for (const line of diff.split("\n")) {
    if (line.startsWith("diff --git")) {
      if (currentFile) {
        files[currentFile] = content;
      }
      [, currentFile] = line.split(" ");
      content = `${line}\n`;
    } else if (line.startsWith("index")) {
      content += `${line}\n`;
    } else if (line.startsWith("--- ")) {
      content += `${line}\n`;
    } else if (line.startsWith("+++ ")) {
      content += `${line}\n`;
    } else if (line.startsWith("@@")) {
      content += `${line}\n`;
    } else if (line.startsWith("-")) {
      content += `${line}\n`;
    } else if (line.startsWith("+")) {
      content += `${line}\n`;
    } else {
      content += `${line}\n`;
    }
  }

  if (currentFile) {
    files[currentFile] = content;
  }

  return files;
}

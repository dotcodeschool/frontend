import { IParsedDiff } from "@/app/lib/types/IParsedDiff";
import {
  TypeCourseModuleFields,
  TypeCourseModuleSkeleton,
} from "../types/contentful";
import { getContentByType } from "@/app/lib/utils";
import { isNil } from "lodash";
import { notFound } from "next/navigation";
import { Entry } from "contentful";

export { getContentById, getContentByType } from "./get-content";

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

export async function getCourseData(
  courseSlug: string,
): Promise<TypeCourseModuleFields> {
  const res = await getContentByType<TypeCourseModuleSkeleton>("courseModule");
  const entry = res.items.find((item) => item.fields.slug === courseSlug);

  if (isNil(entry)) {
    notFound();
  } else {
    const typedEntry = entry as Entry<TypeCourseModuleSkeleton>;

    return typedEntry.fields as unknown as TypeCourseModuleFields;
  }
}

export function slugToTitleCase(slug: string): string {
  // Split the slug into words
  const words = slug.split("-");

  // Capitalize the first letter of each word and join them
  const titleCase = words
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");

  return titleCase;
}

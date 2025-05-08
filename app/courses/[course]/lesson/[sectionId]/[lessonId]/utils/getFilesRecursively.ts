import fs from "fs";
import path from "path";
import { TypeFile } from "@/lib/types";
import * as diffLib from "diff";

// Files to ignore
const IGNORED_FILES = [
  "Cargo.lock",
  // Hidden files
  ".gitignore",
  ".DS_Store",
  "target",
  "node_modules",
];

/**
 * Checks if a file should be ignored
 * @param fileName The name of the file to check
 * @returns True if the file should be ignored, false otherwise
 */
const shouldIgnoreFile = (fileName: string): boolean => {
  // Check if the file is in the ignored list
  if (IGNORED_FILES.includes(fileName)) {
    return true;
  }

  return false;
};

/**
 * Recursively reads all files from a directory
 * @param dir The directory to read files from
 * @param baseDir The base directory for creating relative paths
 * @returns An array of file paths relative to the baseDir
 */
export const getFilesRecursively = (dir: string, baseDir: string): string[] => {
  const files: string[] = [];

  // Read all files and directories in the current directory
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    // Skip hidden files/directories
    if (entry.name.startsWith(".")) {
      continue;
    }

    const fullPath = path.join(dir, entry.name);

    // Skip ignored files
    if (shouldIgnoreFile(entry.name)) {
      continue;
    }

    if (entry.isDirectory()) {
      // Recursively get files from subdirectories
      const subDirFiles = getFilesRecursively(fullPath, baseDir);
      files.push(...subDirFiles);
    } else if (entry.isFile()) {

      // Add file path relative to the baseDir
      const relativePath = path.relative(baseDir, fullPath);
      files.push(relativePath);
    }
  }

  return files;
};

/**
 * Determines which files to show for the current lesson based on changes from previous lesson
 * @param coursePath Path to the course directory
 * @param sectionId Current section ID
 * @param lessonId Current lesson ID
 * @param getLanguageFromFileName Function to determine language from filename
 * @returns Object containing source, template, and solution files to display
 */
export const getRelevantFiles = (
  coursePath: string,
  sectionId: string,
  lessonId: string,
  getLanguageFromFileName: (fileName: string) => string,
): {
  sourceFiles: TypeFile[] | null;
  templateFiles: TypeFile[] | null;
  solutionFiles: TypeFile[] | null;
  shouldShowEditor: boolean;
} => {
  try {
    // Base directory for files
    const filesDir = path.join(
      coursePath,
      "sections",
      sectionId,
      "lessons",
      lessonId,
      "files",
    );

    // Check if current lesson has files
    const hasSourceFiles = fs.existsSync(path.join(filesDir, "source"));
    const hasTemplateFiles = fs.existsSync(path.join(filesDir, "template"));
    const hasSolutionFiles = fs.existsSync(path.join(filesDir, "solution"));

    // If no files exist, don't show editor
    if (!hasSourceFiles && !hasTemplateFiles && !hasSolutionFiles) {
      return {
        sourceFiles: null,
        templateFiles: null,
        solutionFiles: null,
        shouldShowEditor: false,
      };
    }

    // Get all lessons in the current section to find previous lesson
    const sectionDir = path.join(coursePath, "sections", sectionId, "lessons");
    const lessons = fs
      .readdirSync(sectionDir)
      .filter(
        (dir) =>
          !dir.startsWith(".") &&
          fs.statSync(path.join(sectionDir, dir)).isDirectory(),
      )
      .sort(); // Sort to ensure correct order

    // Find the index of the current lesson
    const currentLessonIndex = lessons.indexOf(lessonId);

    // If this is the first lesson, show all files
    if (currentLessonIndex <= 0) {
      return loadAllFiles(filesDir, getLanguageFromFileName);
    }

    // Get the previous lesson ID
    const previousLessonId = lessons[currentLessonIndex - 1];
    const previousFilesDir = path.join(
      coursePath,
      "sections",
      sectionId,
      "lessons",
      previousLessonId,
      "files",
    );

    // Check what types of files the previous lesson had
    const prevHasSourceFiles = fs.existsSync(
      path.join(previousFilesDir, "source"),
    );
    const prevHasTemplateFiles = fs.existsSync(
      path.join(previousFilesDir, "template"),
    );
    const prevHasSolutionFiles = fs.existsSync(
      path.join(previousFilesDir, "solution"),
    );

    // If previous lesson had no files, show all current files
    if (!prevHasSourceFiles && !prevHasTemplateFiles && !prevHasSolutionFiles) {
      return loadAllFiles(filesDir, getLanguageFromFileName);
    }

    // Determine which files to compare based on the combination of file types
    let currentFilesToCompare: string = "";
    let previousFilesToCompare: string = "";

    if (hasSourceFiles) {
      currentFilesToCompare = "source";

      // For previous files, prefer solution over source
      if (prevHasSolutionFiles) {
        previousFilesToCompare = "solution";
      } else if (prevHasSourceFiles) {
        previousFilesToCompare = "source";
      } else if (prevHasTemplateFiles) {
        previousFilesToCompare = "template";
      }
    } else if (hasTemplateFiles) {
      currentFilesToCompare = "template";

      // For previous files, prefer solution over source
      if (prevHasSolutionFiles) {
        previousFilesToCompare = "solution";
      } else if (prevHasSourceFiles) {
        previousFilesToCompare = "source";
      } else if (prevHasTemplateFiles) {
        previousFilesToCompare = "template";
      }
    }

    // If we can't determine which files to compare, show all current files
    if (!currentFilesToCompare || !previousFilesToCompare) {
      return loadAllFiles(filesDir, getLanguageFromFileName);
    }

    // Get all files from current and previous lessons
    const currentDir = path.join(filesDir, currentFilesToCompare);
    const previousDir = path.join(previousFilesDir, previousFilesToCompare);

    // Get all files recursively, including those in subdirectories
    const currentFiles = getFilesRecursively(currentDir, currentDir);
    const previousFiles = getFilesRecursively(previousDir, previousDir);

    // Find files that are new or have changed
    const changedFilePaths = currentFiles.filter((filePath) => {
      const currentFilePath = path.join(currentDir, filePath);

      // If file doesn't exist in previous lesson, it's new
      if (!previousFiles.includes(filePath)) {
        console.log(`New file: ${filePath}`);
        return true;
      }

      // Compare file contents using diff
      const previousFilePath = path.join(previousDir, filePath);
      const currentContent = fs.readFileSync(currentFilePath, "utf8");
      const previousContent = fs.readFileSync(previousFilePath, "utf8");

      // Use diff to compare the files
      const changes = diffLib.diffLines(previousContent, currentContent);

      // If there are any added or removed lines, the file has changed
      const hasChanged = changes.some((part) => part.added || part.removed);

      if (hasChanged) {
        console.log(`Changed file: ${filePath}`);
        // Log the changes
        changes.forEach((part) => {
          if (part.added) {
            console.log(
              `Added: ${part.value.substring(0, 50)}${part.value.length > 50 ? "..." : ""}`,
            );
          }
          if (part.removed) {
            console.log(
              `Removed: ${part.value.substring(0, 50)}${part.value.length > 50 ? "..." : ""}`,
            );
          }
        });
      }

      return hasChanged;
    });

    console.log(`Changed files: ${changedFilePaths.length}`);
    console.log(`Current files: ${currentFiles.length}`);
    console.log(`Previous files: ${previousFiles.length}`);

    // If no files have changed, show all files (fallback)
    if (changedFilePaths.length === 0) {
      console.log("No files have changed, showing all files");
      return loadAllFiles(filesDir, getLanguageFromFileName);
    }

    // Load only the changed files
    return loadChangedFiles(
      filesDir,
      changedFilePaths,
      currentFilesToCompare,
      getLanguageFromFileName,
    );
  } catch (error) {
    console.error("Error determining relevant files:", error);
    // On error, try to load all files
    try {
      return loadAllFiles(
        path.join(
          coursePath,
          "sections",
          sectionId,
          "lessons",
          lessonId,
          "files",
        ),
        getLanguageFromFileName,
      );
    } catch (e) {
      console.error("Failed to load files as fallback:", e);
      return {
        sourceFiles: null,
        templateFiles: null,
        solutionFiles: null,
        shouldShowEditor: false,
      };
    }
  }
};

/**
 * Loads all files from source, template, and solution directories
 */
function loadAllFiles(
  filesDir: string,
  getLanguageFromFileName: (fileName: string) => string,
): {
  sourceFiles: TypeFile[] | null;
  templateFiles: TypeFile[] | null;
  solutionFiles: TypeFile[] | null;
  shouldShowEditor: boolean;
} {
  let sourceFiles = null;
  let templateFiles = null;
  let solutionFiles = null;

  // Load source files if they exist
  if (fs.existsSync(path.join(filesDir, "source"))) {
    const sourceDir = path.join(filesDir, "source");
    const sourceFilePaths = getFilesRecursively(sourceDir, sourceDir);

    sourceFiles = sourceFilePaths.map((filePath) => {
      const fullPath = path.join(sourceDir, filePath);
      // Use the relative path for display, but keep directory structure
      const displayPath = filePath.replace(/\\/g, "/"); // Normalize path separators for display

      return {
        fileName: displayPath, // Use relative path including subdirectories
        path: displayPath,
        code: fs.readFileSync(fullPath, "utf8"),
        language: getLanguageFromFileName(path.basename(filePath)),
      };
    });
  }

  // Load template files if they exist
  if (fs.existsSync(path.join(filesDir, "template"))) {
    const templateDir = path.join(filesDir, "template");
    const templateFilePaths = getFilesRecursively(templateDir, templateDir);

    templateFiles = templateFilePaths.map((filePath) => {
      const fullPath = path.join(templateDir, filePath);
      const displayPath = filePath.replace(/\\/g, "/");

      return {
        fileName: displayPath,
        path: displayPath,
        code: fs.readFileSync(fullPath, "utf8"),
        language: getLanguageFromFileName(path.basename(filePath)),
      };
    });
  }

  // Load solution files if they exist
  if (fs.existsSync(path.join(filesDir, "solution"))) {
    const solutionDir = path.join(filesDir, "solution");
    const solutionFilePaths = getFilesRecursively(solutionDir, solutionDir);

    solutionFiles = solutionFilePaths.map((filePath) => {
      const fullPath = path.join(solutionDir, filePath);
      const displayPath = filePath.replace(/\\/g, "/");

      return {
        fileName: displayPath,
        path: displayPath,
        code: fs.readFileSync(fullPath, "utf8"),
        language: getLanguageFromFileName(path.basename(filePath)),
      };
    });
  }

  return {
    sourceFiles,
    templateFiles,
    solutionFiles,
    shouldShowEditor: !!(sourceFiles || templateFiles),
  };
}

/**
 * Loads only the changed files from the specified directory
 */
function loadChangedFiles(
  filesDir: string,
  changedFilePaths: string[],
  fileType: string,
  getLanguageFromFileName: (fileName: string) => string,
): {
  sourceFiles: TypeFile[] | null;
  templateFiles: TypeFile[] | null;
  solutionFiles: TypeFile[] | null;
  shouldShowEditor: boolean;
} {
  let sourceFiles = null;
  let templateFiles = null;
  let solutionFiles = null;

  // Load only the changed files from the appropriate directory
  if (fileType === "source" && fs.existsSync(path.join(filesDir, "source"))) {
    const sourceDir = path.join(filesDir, "source");

    sourceFiles = changedFilePaths.map((filePath) => {
      const fullPath = path.join(sourceDir, filePath);
      const displayPath = filePath.replace(/\\/g, "/");

      return {
        fileName: displayPath,
        path: displayPath,
        code: fs.readFileSync(fullPath, "utf8"),
        language: getLanguageFromFileName(path.basename(filePath)),
      };
    });
  } else if (
    fileType === "template" &&
    fs.existsSync(path.join(filesDir, "template"))
  ) {
    const templateDir = path.join(filesDir, "template");

    templateFiles = changedFilePaths.map((filePath) => {
      const fullPath = path.join(templateDir, filePath);
      const displayPath = filePath.replace(/\\/g, "/");

      return {
        fileName: displayPath,
        path: displayPath,
        code: fs.readFileSync(fullPath, "utf8"),
        language: getLanguageFromFileName(path.basename(filePath)),
      };
    });

    // If we have template files, also load the corresponding solution files
    if (fs.existsSync(path.join(filesDir, "solution"))) {
      const solutionDir = path.join(filesDir, "solution");

      solutionFiles = changedFilePaths
        .map((filePath) => {
          // Check if the solution file exists
          const solutionPath = path.join(solutionDir, filePath);
          if (fs.existsSync(solutionPath)) {
            const displayPath = filePath.replace(/\\/g, "/");

            return {
              fileName: displayPath,
              path: displayPath,
              code: fs.readFileSync(solutionPath, "utf8"),
              language: getLanguageFromFileName(path.basename(filePath)),
            };
          }
          // If solution file doesn't exist, return null
          return null;
        })
        .filter(Boolean) as TypeFile[]; // Filter out null values
    }
  }

  return {
    sourceFiles,
    templateFiles,
    solutionFiles,
    shouldShowEditor: !!(sourceFiles || templateFiles),
  };
}

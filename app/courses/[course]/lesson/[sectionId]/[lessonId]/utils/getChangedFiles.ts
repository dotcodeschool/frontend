import path from "path";
import fs from "fs";
import { diffLines } from "diff";
import { getFilesRecursively } from "./getFilesRecursively";
import { getLanguageFromFileName } from "./getLanguageFromFileName";

type FileType = "source" | "template" | "solution";
type FileInfo = {
  fileName: string;
  path: string;
  code: string;
  language: string;
  hasChanges?: boolean;
  diffToHighlight?: Array<{
    value: string;
    added?: boolean;
    removed?: boolean;
  }>;
};

/**
 * Determines which files have changed between the current lesson and the previous lesson
 *
 * - For template/solution pairs: Compare solution files from previous lesson with template files of current lesson
 * - For source folders: Compare source files between current and previous lesson
 *
 * @param course The course slug
 * @param sectionId The current section ID
 * @param lessonId The current lesson ID
 * @param allLessons All lessons in the current section to determine previous lesson
 * @returns An object containing the changed files and information about changes
 */
export async function getChangedFiles(
  course: string,
  sectionId: string,
  lessonId: string,
  allLessons: { id: string; title: string }[],
): Promise<{
  sourceFiles: FileInfo[] | null;
  templateFiles: FileInfo[] | null;
  solutionFiles: FileInfo[] | null;
  shouldShowEditor: boolean;
}> {
  const coursePath = path.join(process.cwd(), "content/courses", course);
  const currentLessonPath = path.join(
    coursePath,
    "sections",
    sectionId,
    "lessons",
    lessonId,
    "files",
  );

  // Find the previous lesson in the section
  const currentLessonIndex = allLessons.findIndex((l) => l.id === lessonId);
  const prevLessonId =
    currentLessonIndex > 0 ? allLessons[currentLessonIndex - 1].id : null;

  // Initialize return values
  let sourceFiles: FileInfo[] | null = null;
  let templateFiles: FileInfo[] | null = null;
  let solutionFiles: FileInfo[] | null = null;
  let shouldShowEditor = false;

  // Check if this is the first lesson of the course
  // We'll assume it's the first lesson of the course if it's the first lesson of a section called "introduction"
  const isFirstLessonOfCourse = !prevLessonId && sectionId.toLowerCase() === "introduction";
  
  console.log(`Lesson ${lessonId} in section ${sectionId} - isFirstLessonOfCourse: ${isFirstLessonOfCourse}`);

  // If it's the first lesson of the course, return all files
  if (isFirstLessonOfCourse) {
    console.log(`First lesson of the course, returning all files`);
    return await loadAllLessonFiles(course, sectionId, lessonId);
  }
  
  // If there's no previous lesson in this section but it's not the first lesson of the course,
  // we should still compare with files from the previous section, but we don't have that information.
  // For now, we'll mark all files as changed since this is likely a transition between sections.
  if (!prevLessonId) {
    console.log(`First lesson of section ${sectionId} but not the first lesson of the course, marking all files as changed`);
    return await loadAllLessonFilesAsChanged(course, sectionId, lessonId);
  }

  const prevLessonPath = path.join(
    coursePath,
    "sections",
    sectionId,
    "lessons",
    prevLessonId,
    "files",
  );

  // Check which file types each lesson has
  const currentHasSource = fs.existsSync(
    path.join(currentLessonPath, "source"),
  );
  const currentHasTemplate = fs.existsSync(
    path.join(currentLessonPath, "template"),
  );
  const currentHasSolution = fs.existsSync(
    path.join(currentLessonPath, "solution"),
  );

  const prevHasSource = fs.existsSync(path.join(prevLessonPath, "source"));
  const prevHasTemplate = fs.existsSync(path.join(prevLessonPath, "template"));
  const prevHasSolution = fs.existsSync(path.join(prevLessonPath, "solution"));

  console.log(`Current lesson has: ${currentHasSource ? 'source' : ''} ${currentHasTemplate ? 'template' : ''} ${currentHasSolution ? 'solution' : ''}`);
  console.log(`Previous lesson has: ${prevHasSource ? 'source' : ''} ${prevHasTemplate ? 'template' : ''} ${prevHasSolution ? 'solution' : ''}`);

  // Handle source files in current lesson
  if (currentHasSource) {
    shouldShowEditor = true;
    
    // Case 1: Previous lesson has source files - direct comparison
    if (prevHasSource) {
      console.log(`Comparing source files between ${prevLessonId} and ${lessonId}`);
      sourceFiles = compareFiles(
        prevLessonPath,
        currentLessonPath,
        "source",
        "source",
        course,
        sectionId,
        prevLessonId,
        lessonId,
      );
    } 
    // Case 2: Previous lesson has solution files - compare with those
    else if (prevHasSolution) {
      console.log(`Comparing previous solution with current source files`);
      sourceFiles = compareFiles(
        prevLessonPath,
        currentLessonPath,
        "solution",
        "source",
        course,
        sectionId,
        prevLessonId,
        lessonId,
      );
    }
    // Case 3: Previous lesson has template files - compare with those
    else if (prevHasTemplate) {
      console.log(`Comparing previous template with current source files`);
      sourceFiles = compareFiles(
        prevLessonPath,
        currentLessonPath,
        "template",
        "source",
        course,
        sectionId,
        prevLessonId,
        lessonId,
      );
    }
    // Case 4: Previous lesson has no files - mark all as changed
    else {
      console.log(`Previous lesson has no files, marking all source files as changed`);
      sourceFiles = loadFilesFromDir(
        path.join(currentLessonPath, "source"),
        "source",
        course,
        sectionId,
        lessonId,
      );
      // Mark all as changed since they're new
      sourceFiles = sourceFiles.map((file) => ({ ...file, hasChanges: true }));
    }
  }

  // Handle template files in current lesson
  if (currentHasTemplate) {
    shouldShowEditor = true;
    
    // Case 1: Previous lesson has solution files - ideal comparison
    if (prevHasSolution) {
      console.log(`Comparing previous solution with current template files`);
      templateFiles = compareFiles(
        prevLessonPath,
        currentLessonPath,
        "solution",
        "template",
        course,
        sectionId,
        prevLessonId,
        lessonId,
      );
    }
    // Case 2: Previous lesson has source files - compare with those
    else if (prevHasSource) {
      console.log(`Comparing previous source with current template files`);
      templateFiles = compareFiles(
        prevLessonPath,
        currentLessonPath,
        "source",
        "template",
        course,
        sectionId,
        prevLessonId,
        lessonId,
      );
    }
    // Case 3: Previous lesson has template files - compare with those
    else if (prevHasTemplate) {
      console.log(`Comparing previous template with current template files`);
      templateFiles = compareFiles(
        prevLessonPath,
        currentLessonPath,
        "template",
        "template",
        course,
        sectionId,
        prevLessonId,
        lessonId,
      );
    }
    // Case 4: Previous lesson has no files - mark all as changed
    else {
      console.log(`Previous lesson has no files, marking all template files as changed`);
      templateFiles = loadFilesFromDir(
        path.join(currentLessonPath, "template"),
        "template",
        course,
        sectionId,
        lessonId,
      );
      // Mark all as changed since they're new
      templateFiles = templateFiles.map((file) => ({
        ...file,
        hasChanges: true,
      }));
    }
  }

  // Always load solution files if they exist for the current lesson
  if (currentHasSolution) {
    solutionFiles = loadFilesFromDir(
      path.join(currentLessonPath, "solution"),
      "solution",
      course,
      sectionId,
      lessonId,
    );
  }

  return {
    sourceFiles,
    templateFiles,
    solutionFiles,
    shouldShowEditor,
  };
}

/**
 * Compares files between two lessons and returns only those that have changed
 */
function compareFiles(
  prevLessonPath: string,
  currentLessonPath: string,
  prevType: FileType,
  currentType: FileType,
  course: string,
  sectionId: string,
  prevLessonId: string,
  currentLessonId: string,
): FileInfo[] {
  const prevDir = path.join(prevLessonPath, prevType);
  const currentDir = path.join(currentLessonPath, currentType);

  const prevFilePaths = getFilesRecursively(prevDir, prevDir);
  const currentFilePaths = getFilesRecursively(currentDir, currentDir);

  console.log(
    `Comparing ${prevFilePaths.length} files from ${prevType} with ${currentFilePaths.length} files from ${currentType}`,
  );

  // Process current files and check for changes
  const changedFiles: FileInfo[] = [];
  const allFiles: FileInfo[] = [];

  for (const filePath of currentFilePaths) {
    const fullPath = path.join(currentDir, filePath);
    const displayPath = filePath.replace(/\\/g, "/");
    const currentCode = fs.readFileSync(fullPath, "utf8");

    // Create the file info object that will be returned regardless of changes
    const fileInfo: FileInfo = {
      fileName: displayPath,
      path: `/content/courses/${course}/sections/${sectionId}/lessons/${currentLessonId}/files/${currentType}/${displayPath}`,
      code: currentCode,
      language: getLanguageFromFileName(path.basename(filePath)),
      hasChanges: false,
    };

    // Add to all files list
    allFiles.push(fileInfo);

    // Check if this file exists in the previous lesson
    const correspondingPrevPath = prevFilePaths.find((p) => p === filePath);

    if (correspondingPrevPath) {
      const prevFullPath = path.join(prevDir, correspondingPrevPath);
      const prevCode = fs.readFileSync(prevFullPath, "utf8");

      // Normalize line endings and trim whitespace before comparison
      const normalizedPrevCode = prevCode.replace(/\r\n/g, "\n").trim();
      const normalizedCurrentCode = currentCode.replace(/\r\n/g, "\n").trim();

      // Compare file contents with whitespace ignored
      const changes = diffLines(normalizedPrevCode, normalizedCurrentCode, {
        ignoreWhitespace: true,
      });

      const hasChanges = changes.some((part) => part.added || part.removed);

      if (hasChanges) {
        console.log(`File ${displayPath} has changes`);
        fileInfo.hasChanges = true;
        fileInfo.diffToHighlight = changes;
        changedFiles.push(fileInfo);
      } else {
        console.log(`File ${displayPath} has no changes`);
      }
    } else {
      // File is new in this lesson
      console.log(`File ${displayPath} is new`);
      fileInfo.hasChanges = true;
      changedFiles.push(fileInfo);
    }
  }

  console.log(
    `Found ${changedFiles.length} changed files out of ${currentFilePaths.length} total files`,
  );

  // If no files have changed, return only the changed files (empty array)
  if (changedFiles.length === 0) {
    console.log(`No changed files detected, returning empty array`);
    return changedFiles;
  }

  return changedFiles;
}

/**
 * Loads all files from a directory
 */
function loadFilesFromDir(
  dir: string,
  type: FileType,
  course: string,
  sectionId: string,
  lessonId: string,
): FileInfo[] {
  const filePaths = getFilesRecursively(dir, dir);

  return filePaths.map((filePath: string) => {
    const fullPath = path.join(dir, filePath);
    const displayPath = filePath.replace(/\\/g, "/");

    return {
      fileName: displayPath,
      path: `/content/courses/${course}/sections/${sectionId}/lessons/${lessonId}/files/${type}/${displayPath}`,
      code: fs.readFileSync(fullPath, "utf8"),
      language: getLanguageFromFileName(path.basename(filePath)),
    };
  });
}

/**
 * Loads all files for a lesson without comparison
 */
async function loadAllLessonFiles(
  course: string,
  sectionId: string,
  lessonId: string,
) {
  const coursePath = path.join(process.cwd(), "content/courses", course);
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

  let sourceFiles = null;
  let templateFiles = null;
  let solutionFiles = null;
  let shouldShowEditor = false;

  // Load source files if they exist
  if (hasSourceFiles) {
    sourceFiles = loadFilesFromDir(
      path.join(filesDir, "source"),
      "source",
      course,
      sectionId,
      lessonId,
    );
    shouldShowEditor = true;
  }

  // Load template files if they exist
  if (hasTemplateFiles) {
    templateFiles = loadFilesFromDir(
      path.join(filesDir, "template"),
      "template",
      course,
      sectionId,
      lessonId,
    );
    shouldShowEditor = true;
  }

  // Load solution files if they exist
  if (hasSolutionFiles) {
    solutionFiles = loadFilesFromDir(
      path.join(filesDir, "solution"),
      "solution",
      course,
      sectionId,
      lessonId,
    );
  }

  return {
    sourceFiles,
    templateFiles,
    solutionFiles,
    shouldShowEditor,
  };
}

/**
 * Loads all files for a lesson and marks them as changed
 */
async function loadAllLessonFilesAsChanged(
  course: string,
  sectionId: string,
  lessonId: string,
) {
  const coursePath = path.join(process.cwd(), "content/courses", course);
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

  let sourceFiles = null;
  let templateFiles = null;
  let solutionFiles = null;
  let shouldShowEditor = false;

  // Load source files if they exist and mark them as changed
  if (hasSourceFiles) {
    sourceFiles = loadFilesFromDir(
      path.join(filesDir, "source"),
      "source",
      course,
      sectionId,
      lessonId,
    );
    // Mark all as changed
    sourceFiles = sourceFiles.map((file) => ({ ...file, hasChanges: true }));
    shouldShowEditor = true;
  }

  // Load template files if they exist and mark them as changed
  if (hasTemplateFiles) {
    templateFiles = loadFilesFromDir(
      path.join(filesDir, "template"),
      "template",
      course,
      sectionId,
      lessonId,
    );
    // Mark all as changed
    templateFiles = templateFiles.map((file) => ({ ...file, hasChanges: true }));
    shouldShowEditor = true;
  }

  // Load solution files if they exist
  if (hasSolutionFiles) {
    solutionFiles = loadFilesFromDir(
      path.join(filesDir, "solution"),
      "solution",
      course,
      sectionId,
      lessonId,
    );
  }

  return {
    sourceFiles,
    templateFiles,
    solutionFiles,
    shouldShowEditor,
  };
}

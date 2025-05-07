import fs from "fs";
import path from "path";

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

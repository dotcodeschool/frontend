import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { CourseOverview } from '@/lib/types';

/**
 * Reads local course files from the content/courses directory
 * and returns them in the same format as the Contentful API
 */
export const getLocalCourses = async (): Promise<CourseOverview[]> => {
  const coursesDirectory = path.join(process.cwd(), 'content/courses');
  
  console.log('Looking for courses in:', coursesDirectory);
  
  // Skip if the directory doesn't exist
  if (!fs.existsSync(coursesDirectory)) {
    console.log('Courses directory does not exist');
    return [];
  }
  
  // Get all directories in the courses folder (excluding files and special directories)
  const allDirectories = fs.readdirSync(coursesDirectory, { withFileTypes: true });
  console.log('All directories in courses folder:', allDirectories.map(d => d.name));
  
  const courseDirectories = allDirectories
    .filter(dirent => 
      dirent.isDirectory() && 
      !dirent.name.startsWith('.') && 
      dirent.name !== 'course-template' // Skip the template directory
    )
    .map(dirent => dirent.name);
  
  console.log('Found course directories:', courseDirectories);
  
  const courses: CourseOverview[] = [];
  
  // Process each course directory
  for (const courseSlug of courseDirectories) {
    const courseDir = path.join(coursesDirectory, courseSlug);
    const mdxFilePath = path.join(courseDir, `${courseSlug}.mdx`);
    
    // Skip if the MDX file doesn't exist
    if (!fs.existsSync(mdxFilePath)) {
      continue;
    }
    
    // Read and parse the MDX file
    const fileContents = fs.readFileSync(mdxFilePath, 'utf8');
    const { data } = matter(fileContents);
    
    // Extract the required fields for CourseOverview
    const course: CourseOverview = {
      slug: data.slug || courseSlug,
      title: data.title || courseSlug,
      description: data.description || '',
      level: data.level || 'Beginner',
      language: data.language || 'Unknown',
      author: data.author || 'Unknown',
    };
    
    courses.push(course);
  }
  
  return courses;
};

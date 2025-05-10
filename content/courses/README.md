# Courses Directory

This directory contains all the educational courses for Dot Code School in MDX format.

## Purpose

The courses in this directory provide structured learning paths for various topics related to blockchain development, with a focus on the Polkadot ecosystem.

## Contributing

To contribute a course, follow these detailed steps:

1. **Fork the repository**: Go to [https://github.com/dotcodeschool/frontend](https://github.com/dotcodeschool/frontend) and click the "Fork" button in the top-right corner to create your own copy of the repository.

2. **Clone your fork**: Clone your forked repository to your local machine:
   ```bash
   git clone https://github.com/YOUR-USERNAME/frontend.git
   cd frontend
   ```

3. **Create a new branch**: Create a branch for your changes with a descriptive name:
   ```bash
   git checkout -b add-course-YOUR-COURSE-NAME
   ```

4. **Create your course**: 
   - Copy the [course template directory](https://github.com/dotcodeschool/frontend/tree/main/content/courses/course-template) to create a new course:
     ```bash
     cp -r content/courses/course-template content/courses/your-course-name
     ```
   - Rename the main MDX file to match your course slug:
     ```bash
     mv content/courses/your-course-name/course-template.mdx content/courses/your-course-name/your-course-name.mdx
     ```
   - Update the frontmatter metadata in the main course file
   - Add your sections and lessons following the structure outlined below

5. **Commit your changes**: Make commits with clear, descriptive messages:
   ```bash
   git add content/courses/your-course-name
   git commit -m "Add new course: Your Course Name"
   ```

6. **Push to your fork**: Upload your changes to your GitHub fork:
   ```bash
   git push origin add-course-YOUR-COURSE-NAME
   ```

7. **Create a pull request**: Go to [https://github.com/dotcodeschool/frontend/pulls](https://github.com/dotcodeschool/frontend/pulls) and click the "New pull request" button. Select your fork and branch, then click "Create pull request".

8. **Use the course PR template**: We provide a specialized template for course contributions:
   - [Use the course template](https://github.com/dotcodeschool/frontend/compare/main...main?template=course.md)
   - Or add `?template=course.md` to the PR URL

9. **Fill out the PR template**: Provide a clear description of your course and complete the checklist.

For more detailed instructions on course structure, formatting, and best practices, please refer to the [Course Contribution Guide](https://dotcodeschool.com/articles/course-contribution-guide).

## Directory Structure

Each course follows this hierarchical structure:

```
courses/course-slug/
├── course-slug.mdx           # Course metadata and description
└── sections/                 # Container for all course sections
    └── section-slug/         # A section of the course
        ├── section-slug.mdx  # Section metadata
        └── lessons/          # Container for all lessons in this section
            └── lesson-slug/  # A lesson directory
                ├── lesson-slug.mdx  # Lesson content
                └── files/    # Optional code files for the lesson
                    ├── template/ # Files with TODOs for learners
                    └── solution/ # Completed files for reference
```

## Examples

For examples of well-structured courses, see:
- [Course Template](https://github.com/dotcodeschool/frontend/tree/main/content/courses/course-template)
- [Substrate Kitties](https://github.com/dotcodeschool/frontend/tree/main/content/courses/substrate-kitties)

## Note

This README.md file is for documentation purposes only and will not be rendered on the website.

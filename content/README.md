# Dot Code School Content Directory

This directory contains all the educational content for Dot Code School, including articles, courses, and legal documents.

## Directory Structure

- **articles/** - Contains standalone articles and guides in MDX format
- **courses/** - Contains structured courses with sections and lessons
- **legal/** - Contains legal documents such as terms of service and privacy policy

## Contributing to Dot Code School

### Contributing Articles

Articles are written in MDX format, which allows you to combine Markdown with JSX components. Each article should be placed in the `articles/` directory as an MDX file with appropriate frontmatter metadata.

Basic article structure:
```
---
title: "Your Article Title"
description: "A concise description of your article"
tags: ["Tag1", "Tag2", "Tag3"]
category: "Category Name"
author: "Your Name"
date: "2025-05-15"
last_updated: "2025-05-15"
---

# Your Article Title

Article content goes here...
```

### Contributing Courses

Courses have a hierarchical structure with sections and lessons, all using MDX files with frontmatter for metadata (not JSON files).

Basic course structure:
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

## Detailed Guides

For comprehensive information on contributing to Dot Code School, please refer to our detailed guides:

- [Course Contribution Guide](https://dotcodeschool.com/articles/course-contribution-guide) - Complete instructions for creating and structuring courses
- [Author's Guide](https://dotcodeschool.com/articles/authors-guide) - Formatting guidelines, style recommendations, and best practices for writing educational content

## Style Guidelines

1. Use clear, concise language
2. Break complex concepts into smaller, digestible chunks
3. Include examples and code snippets where appropriate
4. Use headings to organize content (H2 for major sections, H3 for subsections)
5. Include images or diagrams when they help explain concepts
6. End tutorials with a summary and next steps

## Submission Process

1. **Fork the repository**: Go to [https://github.com/dotcodeschool/frontend](https://github.com/dotcodeschool/frontend) and click the "Fork" button in the top-right corner.

2. **Clone your fork**: Clone your forked repository to your local machine:
   ```bash
   git clone https://github.com/YOUR-USERNAME/frontend.git
   cd frontend
   ```

3. **Create a new branch**: Create a branch for your changes with a descriptive name:
   ```bash
   git checkout -b add-content-YOUR-CONTENT-NAME
   ```

4. **Create your content**: Follow the guidelines in our detailed guides to create your article or course.

5. **Commit your changes**: Make commits with clear, descriptive messages.

6. **Push to your fork**: Upload your changes to your GitHub fork:
   ```bash
   git push origin add-content-YOUR-CONTENT-NAME
   ```

7. **Create a pull request**: Go to [https://github.com/dotcodeschool/frontend/pulls](https://github.com/dotcodeschool/frontend/pulls) and click the "New pull request" button.

8. **Use the appropriate PR template**: We provide specialized templates for different types of contributions:
   - For articles: [Use the article template](https://github.com/dotcodeschool/frontend/compare/master...master?template=article.md)
   - For courses: [Use the course template](https://github.com/dotcodeschool/frontend/compare/master...master?template=course.md)
   - For other changes: The default template will be used automatically

9. **Fill out the PR template**: Provide a clear description of your contribution and complete the checklist.

10. **Respond to feedback**: Our reviewers may suggest changes to improve your content. Please respond to their feedback and make any necessary updates.

Thank you for contributing to Dot Code School!

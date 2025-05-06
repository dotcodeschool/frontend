# Course Template

This directory contains a template structure for creating new courses on Dot Code School. You can use this as a starting point for your own courses.

## How to Use This Template

### Option 1: Using the Helper Script

1. Navigate to the `course-template` directory in your terminal
2. Run the helper script with your desired course slug:
   ```
   ./create-course.sh your-course-slug
   ```
3. The script will create a new course directory with the proper structure
4. Follow the instructions provided by the script to customize your course

### Option 2: Manual Setup

1. Copy this entire `course-template` directory to create your new course
2. Rename the directory to your course slug (e.g., `javascript-basics`)
3. Rename `course-template.mdx` to match your course slug (e.g., `javascript-basics.mdx`)
4. Edit the course metadata and content in the renamed file
5. Customize the sections and lessons to fit your course content
6. Update all placeholder text (marked with `[brackets]`) with your actual content

## Template Structure

```
course-template/
├── course-template.mdx           # Course metadata and description
├── README.md                     # This file (can be deleted in your course)
└── sections/                     # Container for all course sections
    ├── getting-started/          # First section example
    │   ├── getting-started.mdx   # Section metadata
    │   └── lessons/              # Container for lessons in this section
    │       ├── introduction/     # First lesson example
    │       │   └── introduction.mdx  # Lesson content
    │       └── setup-environment/    # Second lesson example
    │           ├── setup-environment.mdx  # Lesson content
    │           └── files/        # Optional code files for the lesson
    │               └── source/   # Example of source directory pattern
    │                   └── hello.js  # Example source file
    └── core-concepts/            # Second section example
        ├── core-concepts.mdx     # Section metadata
        └── lessons/              # Container for lessons in this section
            └── variables/        # Lesson example with template/solution
                ├── variables.mdx # Lesson content
                └── files/        # Code files for the lesson
                    ├── template/ # Files with TODOs for learners
                    │   └── variables.js  # Example template file
                    └── solution/ # Completed files for reference
                        └── variables.js  # Example solution file
```

## File Types

This template demonstrates two patterns for including code files in your lessons:

1. **Source Directory**: Used in the `setup-environment` lesson to show the final state of files after an action is taken, without requiring the learner to implement anything themselves.

2. **Template/Solution Directories**: Used in the `variables` lesson to provide both a starting point with TODOs (template) and a completed implementation (solution) for hands-on exercises.

Choose the appropriate pattern based on the goals of each lesson.

## Customization

Feel free to add more sections and lessons as needed for your course. You can also customize the structure to better fit your specific content, but try to maintain the general organization pattern for consistency across courses.

## Metadata Fields

### Course Metadata

The course metadata file (e.g., `course-template.mdx`) includes several important fields:

- `slug`: Unique identifier for the course (should match directory name)
- `title`: Display title for the course
- `author`: Your name or organization
- `author_url`: Link to your GitHub profile or website
- `description`: A concise description of the course content
- `level`: Difficulty level (Beginner, Intermediate, or Advanced)
- `language`: Programming language(s) used in the course
- `github_url`: Repository URL (if applicable)
- `tags`: Array of relevant keywords
- `prerequisites`: Array of required knowledge or skills
- `what_youll_learn`: Array of key concepts or skills covered
- `estimated_time`: Approximate hours to complete the course
- `last_updated`: Date when the course was last updated (format: "YYYY-MM-DD")

### Lesson Metadata

Each lesson should include the following metadata:

- `slug`: Unique identifier for the lesson
- `title`: Display title for the lesson
- `order`: Numeric order within the section
- `last_updated`: Date when the lesson was last updated (format: "YYYY-MM-DD")

The `last_updated` field is important for both courses and lessons as it helps users know when the content was last revised, which is particularly valuable for technical content that may need regular updates.

## For More Information

Refer to the [Course Contribution Guide](../../articles/course-contribution-guide) for detailed instructions on creating and formatting your course content.

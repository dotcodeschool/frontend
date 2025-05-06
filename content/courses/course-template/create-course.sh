#!/bin/bash

# Script to create a new course from the course-template

# Check if a course name was provided
if [ $# -eq 0 ]; then
    echo "Usage: ./create-course.sh <course-slug>"
    echo "Example: ./create-course.sh javascript-basics"
    exit 1
fi

# Get the course slug from the command line argument
COURSE_SLUG=$1

# Get the current directory
CURRENT_DIR=$(pwd)

# Check if we're in the course-template directory
if [[ $CURRENT_DIR != */content/courses/course-template ]]; then
    echo "Error: This script must be run from the content/courses/course-template directory"
    exit 1
fi

# Define the parent directory (one level up)
PARENT_DIR=$(dirname "$CURRENT_DIR")

# Define the target directory
TARGET_DIR="$PARENT_DIR/$COURSE_SLUG"

# Check if the target directory already exists
if [ -d "$TARGET_DIR" ]; then
    echo "Error: A course with the slug '$COURSE_SLUG' already exists at $TARGET_DIR"
    exit 1
fi

# Create the new course directory
echo "Creating new course: $COURSE_SLUG"
cp -r "$CURRENT_DIR" "$TARGET_DIR"

# Rename the course metadata file
mv "$TARGET_DIR/course-template.mdx" "$TARGET_DIR/$COURSE_SLUG.mdx"

# Remove the create-course.sh script from the new course
rm "$TARGET_DIR/create-course.sh"

echo "Course created successfully at $TARGET_DIR"
echo ""
echo "Next steps:"
echo "1. Edit $TARGET_DIR/$COURSE_SLUG.mdx to update the course metadata"
echo "2. Customize the sections and lessons to fit your course content"
echo "3. Update all placeholder text (marked with [brackets]) with your actual content"
echo ""
echo "See the README.md file in your new course directory for more information."

exit 0

# Articles Directory

This directory contains all the standalone articles and guides for Dot Code School in MDX format.

## Purpose

The articles in this directory serve various purposes:
- Educational guides and tutorials
- Documentation for platform features
- Author resources and contribution guides
- General information about blockchain development

## Contributing

To contribute an article, follow these detailed steps:

1. **Fork the repository**: Go to [https://github.com/dotcodeschool/frontend](https://github.com/dotcodeschool/frontend) and click the "Fork" button in the top-right corner to create your own copy of the repository.

2. **Clone your fork**: Clone your forked repository to your local machine:
   ```bash
   git clone https://github.com/YOUR-USERNAME/frontend.git
   cd frontend
   ```

3. **Create a new branch**: Create a branch for your changes with a descriptive name:
   ```bash
   git checkout -b add-article-YOUR-ARTICLE-NAME
   ```

4. **Create your article**: 
   - Duplicate the `_TEMPLATE.mdx` file in the `content/articles/` directory
   - Rename it to match your article title using kebab-case: `your-article-title.mdx`
   - Update the frontmatter metadata at the top of the file
   - Write your article content using MDX format

5. **Commit your changes**: Make commits with clear, descriptive messages:
   ```bash
   git add content/articles/your-article-title.mdx
   git commit -m "Add new article: Your Article Title"
   ```

6. **Push to your fork**: Upload your changes to your GitHub fork:
   ```bash
   git push origin add-article-YOUR-ARTICLE-NAME
   ```

7. **Create a pull request**: Go to [https://github.com/dotcodeschool/frontend/pulls](https://github.com/dotcodeschool/frontend/pulls) and click the "New pull request" button. Select your fork and branch, then click "Create pull request".

8. **Use the article PR template**: We provide a specialized template for article contributions:
   - [Use the article template](https://github.com/dotcodeschool/frontend/compare/main...main?template=article.md)
   - Or add `?template=article.md` to the PR URL

9. **Fill out the PR template**: Provide a clear description of your article and complete the checklist.

For more detailed instructions on article formatting and style guidelines, please refer to the [Author's Guide](https://dotcodeschool.com/articles/authors-guide).

## File Structure

Each article should be a single MDX file with the following structure:

```
---
title: "Your Article Title"
description: "A concise description of your article"
tags: ["Tag1", "Tag2", "Tag3"]
category: "Category Name"
author: "Your Name"
date: "YYYY-MM-DD"
last_updated: "YYYY-MM-DD"
# Additional optional metadata
---

# Your Article Title

Article content goes here...
```

## Examples

For examples of well-structured articles, see:
- [Author's Guide](https://github.com/dotcodeschool/frontend/blob/main/content/articles/authors-guide.mdx)
- [Course Contribution Guide](https://github.com/dotcodeschool/frontend/blob/main/content/articles/course-contribution-guide.mdx)

## Note

This README.md file is for documentation purposes only and will not be rendered on the website.

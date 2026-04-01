# Course Contribution

<!-- Pick ONE option below, expand it, and delete the others -->

<details>
<summary><strong>Option A: New Gittorial Course</strong></summary>

### Registry Entry

I've added my course to `config/registry.yaml` with:

- **Slug**: 
- **Repo**: 
- **Branch**: 
- **Title**: 
- **Author**: 
- **Level**: 
- **Language**: 

### Checklist

- [ ] Added entry to `config/registry.yaml`
- [ ] Gittorial repo is public on GitHub
- [ ] Gittorial branch has properly prefixed commits (`section:`, `template:`, `solution:`, `action:`)
- [ ] Included `overview` field in registry with course description
- [ ] Tested ingestion locally: `pnpm tsx scripts/ingest.ts --all`
- [ ] Content renders correctly: `pnpm dev`

</details>

<details>
<summary><strong>Option B: Update Existing Course Content</strong></summary>

For courses NOT on the whitelist (untrusted repos that require review).

### What Changed

<!-- Describe what was updated in the upstream gittorial repo -->

### Checklist

- [ ] Regenerated course content: `pnpm tsx scripts/ingest.ts --all`
- [ ] Reviewed the diff for unexpected changes
- [ ] No `readmeTitle` or other artifact files in the output
- [ ] Content renders correctly: `pnpm dev`

</details>

<details>
<summary><strong>Option C: New MDX Course (Manual)</strong></summary>

Adding a course written directly in MDX (not from a gittorial).

### Course Information

- **Title**: 
- **Level**: 
- **Language**: 
- **Estimated Time**: 

### Checklist

- [ ] Placed course in `content/courses/my-course-name/`
- [ ] Included all required frontmatter (slug, title, author, description, level, language)
- [ ] Follows directory structure (sections/lessons with MDX + files)
- [ ] Code examples are complete and functional
- [ ] Template and solution files match correctly
- [ ] Tested locally: `pnpm dev`

</details>

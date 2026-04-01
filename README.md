# Dot Code School

Interactive, in-browser tutorials that teach blockchain development by writing real code. Build state machines, NFT marketplaces, and multi-chain applications — one lesson at a time.

Built with [Astro](https://astro.build), React islands, Monaco Editor, and Tailwind CSS.

## Getting Started

```bash
pnpm install
pnpm dev
```

Open [http://localhost:4321](http://localhost:4321).

## Project Structure

```
src/
  pages/              # Astro pages (routes)
  features/           # Feature modules (courses, articles)
    courses/
      components/     # Course UI components
      lib/            # Data loaders
      types/          # TypeScript types
    articles/
      components/
      lib/
  shared/             # Shared components (Navbar, Footer, MDX)
  layouts/            # Page layouts
  styles/             # Global CSS
content/
  courses/            # Course MDX content
  articles/           # Article MDX content
public/               # Static assets
```

## Contributing Content

- **Articles**: Add `.mdx` files to `content/articles/`. See the [Author's Guide](https://dotcodeschool.com/articles/authors-guide).
- **Courses**: Add course directories to `content/courses/`. See the [Course Contribution Guide](https://dotcodeschool.com/articles/course-contribution-guide).

## Scripts

- `pnpm dev` — Start dev server
- `pnpm build` — Build static site
- `pnpm preview` — Preview production build
- `pnpm fmt` — Format code with Prettier

## Deployment

Deployed on [Vercel](https://vercel.com). Push to `master` to deploy.

## License

See [LICENSE](LICENSE).

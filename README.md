# Dot Code School

Dot Code School is an interactive online platform that teaches you how to build meaningful web3 applications using the Polkadot SDK. This project aims to onboard newcomer developers to build their own custom blockchain from zero to one hundred.

The tutorial builds upon the raw content written by [Shawn Tabrizi](https://github.com/shawntabrizi), available on the [rust-state-machine](https://github.com/shawntabrizi/rust-state-machine) repo.

![Interactive Learning Interface](https://github.com/iammasterbrucewayne/dotcodeschool/assets/93382017/7ce6282e-ab8c-45ed-bd4f-93699806595f)

## Table of Contents

- [Project Overview](#project-overview)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Setup](#environment-setup)
  - [Running the Project](#running-the-project)
- [Project Structure](#project-structure)
- [Contributing](#contributing)
  - [For Authors](#for-authors)
  - [For Developers](#for-developers)
- [Development Scripts](#development-scripts)
- [Deployment](#deployment)

## Project Overview

Dot Code School is a [Next.js](https://nextjs.org/) project that provides an interactive learning platform for blockchain development using the Polkadot SDK. The platform features:

- Interactive coding exercises
- Step-by-step tutorials
- Real-time feedback
- Progress tracking
- Community-contributed courses and articles

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or later)
- [pnpm](https://pnpm.io/) (v8 or later)
- [Git](https://git-scm.com/)

### Installation

1. Clone the repository:

```bash
git clone https://github.com/dotcodeschool/frontend.git
cd frontend
```

2. Install dependencies:

```bash
pnpm install
```

### Environment Setup

1. Copy the example environment file:

```bash
cp .env.local.example .env.local
```

2. Fill in the required environment variables in `.env.local`:

```env
# CMS: Contentful
CONTENTFUL_SPACE_ID="<your_contentful_space_id>"
CONTENTFUL_ENVIRONMENT="<your_contentful_environment>"
CONTENTFUL_ACCESS_TOKEN="<your_contentful_access_token>"

# Auth: AuthJS
AUTH_SECRET="<your_secret>"
AUTH_GITHUB_ID="<your_github_client_id>"
AUTH_GITHUB_SECRET="<your_github_client_secret>"

# DB: MongoDB
MONGODB_URI="<your_mongodb_uri>"
DATABASE_URL="<your_database_url>"
DB_NAME="<your_database_name>"

# DB: Redis
REDIS_URL="<your_redis_url>"

# Backend: https://github.com/dotcodeschool/backend
BACKEND_URL="<your_backend_url>"
```

### Running the Project

Start the development server:

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Project Structure

The project follows a standard Next.js structure with some additional directories:

```
frontend/
├── app/                  # Next.js app directory (pages, layouts, routes)
│   ├── api/              # API routes
│   ├── courses/          # Course pages and components
│   ├── articles/         # Article pages and components
│   └── settings/         # User settings pages
├── components/           # Shared React components
├── content/              # MDX content for courses and articles
│   ├── articles/         # Article content in MDX format
│   └── courses/          # Course content in MDX format
├── lib/                  # Utility functions and shared code
│   ├── api/              # API client code
│   ├── db/               # Database connections and models
│   ├── hooks/            # Custom React hooks
│   └── utils/            # Helper functions
├── public/               # Static assets
├── styles/               # Global styles
└── ui/                   # UI theme and styling utilities
```

## Contributing

We welcome contributions from both authors (content creators) and developers!

### For Authors

If you want to contribute content to Dot Code School, you can create articles or courses:

#### Contributing Articles

1. Read the [Author's Guide](https://dotcodeschool.com/articles/authors-guide) for detailed information on formatting and style guidelines.
2. Create a new MDX file in the `content/articles/` directory following the template provided in the guide.
3. Submit a pull request with your new article.

#### Contributing Courses

1. Read the [Course Contribution Guide](https://dotcodeschool.com/articles/course-contribution-guide) for detailed information on course structure and creation.
2. Follow the directory structure outlined in the guide to create your course content.
3. Test your course locally to ensure all code examples work correctly.
4. Submit a pull request with your new course.

### For Developers

If you want to contribute to the codebase:

1. Check the [Issues](https://github.com/dotcodeschool/frontend/issues) page for open tasks or create a new issue describing what you want to work on.
2. Fork the repository and create a new branch for your feature or bug fix.
3. Follow the coding standards and conventions used in the project:
   - Use TypeScript for all new code
   - Follow the ESLint and Prettier configurations
   - Write tests for new features when applicable
   - Use conventional commit messages (the project uses commitlint)
4. Submit a pull request with your changes.

#### Code Style and Linting

The project uses ESLint and Prettier for code formatting and linting. Before submitting a PR, make sure your code passes all checks:

```bash
# Run linting
pnpm lint

# Format code
pnpm fmt
```

#### Commit Guidelines

We use [Conventional Commits](https://www.conventionalcommits.org/) for commit messages. The project is set up with commitlint to enforce this standard. You can use the following command to create a properly formatted commit:

```bash
# Install commitizen globally if you haven't already
npm install -g commitizen

# Use commitizen for commits
git cz
```

## Development Scripts

The project includes several useful scripts:

- `pnpm dev`: Start the development server
- `pnpm build`: Build the project for production
- `pnpm start`: Start the production server
- `pnpm check`: Run ESLint to check for issues
- `pnpm lint`: Run ESLint and fix issues automatically
- `pnpm fmt`: Format code using Prettier
- `pnpm setup`: Set up Contentful and generate GraphQL types
- `pnpm gen`: Generate GraphQL types
- `pnpm sort`: Sort JSON files

## Deployment

The project is configured for deployment on [Vercel](https://vercel.com/). To deploy your own instance:

1. Push your code to a GitHub repository
2. Import the project into Vercel
3. Configure the environment variables
4. Deploy

For more details, see the [Next.js deployment documentation](https://nextjs.org/docs/deployment).

## License

This project is licensed under the terms of the [LICENSE](LICENSE) file included in the repository.

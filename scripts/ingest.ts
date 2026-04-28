import { execSync } from "child_process";
import {
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  rmSync,
  statSync,
  writeFileSync,
} from "fs";
import { convertGitorialToDotCodeSchool } from "gitorial-to-dotcodeschool/src/converter";
import yaml from "js-yaml";
import { join, resolve } from "path";

type RegistryEntry = {
  slug: string;
  repo: string;
  branch: string;
  title: string;
  author: string;
  author_url?: string;
  level?: string;
  language?: string;
  description?: string;
  order?: number;
  estimated_time?: number;
  prerequisites?: string[];
  overview?: string;
};

// Strict validation to prevent command injection via registry.yaml fields
const SAFE_SLUG = /^[a-zA-Z0-9_-]+$/;
const SAFE_REPO = /^[a-zA-Z0-9._-]+\/[a-zA-Z0-9._-]+$/;
const SAFE_BRANCH = /^[a-zA-Z0-9._/-]+$/;
const SAFE_TEXT = /^[^"\\`$]+$/; // No shell-significant characters
const SAFE_HASH = /^[a-f0-9]{6,40}$/;

function validateEntry(entry: RegistryEntry): void {
  if (!SAFE_SLUG.test(entry.slug))
    throw new Error(`Invalid slug: ${entry.slug}`);
  if (!SAFE_REPO.test(entry.repo))
    throw new Error(`Invalid repo: ${entry.repo}`);
  if (!SAFE_BRANCH.test(entry.branch))
    throw new Error(`Invalid branch: ${entry.branch}`);
  if (entry.title && !SAFE_TEXT.test(entry.title))
    throw new Error(`Invalid title: ${entry.title}`);
  if (entry.author && !SAFE_TEXT.test(entry.author))
    throw new Error(`Invalid author: ${entry.author}`);
}

const __dirname =
  import.meta.dirname ??
  new URL(".", import.meta.url).pathname.replace(/\/$/, "");
const ROOT = resolve(__dirname, "..");
const REGISTRY_PATH = join(ROOT, "config", "registry.yaml");
const WHITELIST_PATH = join(ROOT, "config", "whitelist.yaml");
const CONTENT_DIR = join(ROOT, "content", "courses");
const TMP_DIR = join(ROOT, ".ingestion-tmp");

type Whitelist = {
  trustedOwners: string[];
  trustedRepos: string[];
};

function loadWhitelist(): Whitelist {
  if (!existsSync(WHITELIST_PATH))
    return { trustedOwners: [], trustedRepos: [] };
  const raw = readFileSync(WHITELIST_PATH, "utf-8");
  const data = yaml.load(raw) as Whitelist | null;
  return {
    trustedOwners: data?.trustedOwners ?? [],
    trustedRepos: data?.trustedRepos ?? [],
  };
}

function isTrusted(entry: RegistryEntry, whitelist: Whitelist): boolean {
  const owner = entry.repo.split("/")[0];
  return (
    whitelist.trustedOwners.includes(owner) ||
    whitelist.trustedRepos.includes(entry.repo)
  );
}

function loadRegistry(): RegistryEntry[] {
  if (!existsSync(REGISTRY_PATH)) {
    console.log("No registry.yaml found, skipping ingestion.");
    return [];
  }

  const raw = readFileSync(REGISTRY_PATH, "utf-8");
  const entries = yaml.load(raw) as RegistryEntry[] | null;
  return entries ?? [];
}

function cloneRepo(entry: RegistryEntry): string {
  const cloneDir = join(TMP_DIR, entry.slug);

  if (existsSync(cloneDir)) {
    rmSync(cloneDir, { recursive: true });
  }

  console.log(`Cloning ${entry.repo}@${entry.branch}...`);
  execSync(
    `git clone --single-branch --branch ${entry.branch} https://github.com/${entry.repo}.git ${cloneDir}`,
    { stdio: "inherit" },
  );

  return cloneDir;
}

async function convertRepo(
  entry: RegistryEntry,
  cloneDir: string,
): Promise<void> {
  const outputDir = join(CONTENT_DIR, entry.slug);

  if (existsSync(outputDir)) {
    rmSync(outputDir, { recursive: true });
  }

  console.log(`Converting ${entry.slug}...`);

  await convertGitorialToDotCodeSchool({
    input: cloneDir,
    output: outputDir,
    branch: entry.branch,
    title: entry.title,
    author: entry.author,
    level: entry.level,
    language: entry.language,
    description: entry.description,
  });

  // The converter and overwriteCourseMdx both stamp today's date into
  // last_updated, which produces spurious daily diffs even when upstream
  // hasn't changed. Rewrite each lesson's last_updated to the date of its
  // commit_hash, and use the branch HEAD date for the course-level mdx.
  rewriteLessonDates(outputDir, cloneDir);
  overwriteCourseMdx(entry, outputDir, cloneDir);
}

// Returns YYYY-MM-DD for the given git ref in cloneDir, or null on failure.
// `ref` must be either "HEAD" or a SAFE_HASH-validated commit SHA.
function gitDate(cloneDir: string, ref: string): string | null {
  try {
    const date = execSync(
      `git -C "${cloneDir}" log -1 --format=%cs ${ref}`,
      { encoding: "utf-8", stdio: ["ignore", "pipe", "ignore"] },
    ).trim();
    return /^\d{4}-\d{2}-\d{2}$/.test(date) ? date : null;
  } catch {
    return null;
  }
}

function rewriteLessonDates(outputDir: string, cloneDir: string): void {
  function walk(dir: string): void {
    for (const name of readdirSync(dir)) {
      const full = join(dir, name);
      if (statSync(full).isDirectory()) {
        walk(full);
        continue;
      }
      if (!full.endsWith(".mdx")) continue;
      const content = readFileSync(full, "utf-8");
      const hashMatch = content.match(/^commit_hash:\s*([a-f0-9]+)\s*$/m);
      if (!hashMatch || !SAFE_HASH.test(hashMatch[1])) continue;
      const date = gitDate(cloneDir, hashMatch[1]);
      if (!date) continue;
      const updated = content.replace(
        /^last_updated:\s*"[^"]*"\s*(#.*)?$/m,
        `last_updated: "${date}"`,
      );
      if (updated !== content) writeFileSync(full, updated);
    }
  }
  walk(outputDir);
}

function overwriteCourseMdx(
  entry: RegistryEntry,
  outputDir: string,
  cloneDir: string,
): void {
  const mdxPath = join(outputDir, `${entry.slug}.mdx`);
  if (!existsSync(mdxPath)) return;

  // Read existing to get what_youll_learn (generated from section names)
  const existing = readFileSync(mdxPath, "utf-8");
  const whatYoullLearnMatch = existing.match(
    /what_youll_learn:\s*\[[\s\S]*?\]/,
  );
  const whatYoullLearn = whatYoullLearnMatch?.[0] ?? "what_youll_learn: []";

  // Fall back to the existing date if branch lookup fails, so we never
  // bake today's date in (which is what caused the daily-PR bug).
  const existingDateMatch = existing.match(
    /^last_updated:\s*"([^"]*)"/m,
  );
  const lastUpdated =
    gitDate(cloneDir, "HEAD") ?? existingDateMatch?.[1] ?? "";

  const frontmatter = [
    "---",
    entry.order != null ? `order: ${entry.order}` : null,
    `slug: ${entry.slug}`,
    `title: "${entry.title}"`,
    `author: ${entry.author}`,
    entry.author_url ? `author_url: ${entry.author_url}` : null,
    `description: ${entry.description ?? "A course converted from gitorial format."}`,
    `level: ${entry.level ?? "Beginner"}`,
    `language: ${entry.language ?? "Rust"}`,
    'tags: ["rust", "tutorial", "course"]',
    entry.prerequisites && entry.prerequisites.length > 0
      ? `prerequisites: ${JSON.stringify(entry.prerequisites)}`
      : "prerequisites: []",
    whatYoullLearn,
    entry.estimated_time != null
      ? `estimated_time: ${entry.estimated_time}`
      : null,
    `last_updated: "${lastUpdated}"`,
    "is_gitorial: true",
    `github_url: https://github.com/${entry.repo}`,
    "---",
  ]
    .filter((line) => line !== null)
    .join("\n");

  const body =
    entry.overview?.trim() ??
    `# ${entry.title}\n\nA course converted from gitorial format.`;

  writeFileSync(mdxPath, `${frontmatter}\n\n${body}\n`);
  console.log(`  Overwrote ${entry.slug}.mdx with registry metadata`);
}

function cleanup(): void {
  if (existsSync(TMP_DIR)) {
    rmSync(TMP_DIR, { recursive: true });
  }
}

async function main() {
  const allEntries = loadRegistry();

  if (allEntries.length === 0) {
    console.log("No courses to ingest.");
    return;
  }

  const whitelist = loadWhitelist();
  const ingestAll = process.argv.includes("--all");

  const entries = ingestAll
    ? allEntries
    : allEntries.filter((e) => isTrusted(e, whitelist));

  if (entries.length === 0) {
    console.log(
      `No trusted courses to ingest (${allEntries.length} total in registry). Use --all to ingest all.`,
    );
    return;
  }

  if (!ingestAll && entries.length < allEntries.length) {
    console.log(
      `Ingesting ${entries.length} trusted course(s), skipping ${allEntries.length - entries.length} untrusted.`,
    );
  }

  mkdirSync(TMP_DIR, { recursive: true });

  try {
    for (const entry of entries) {
      validateEntry(entry);
      const cloneDir = cloneRepo(entry);
      await convertRepo(entry, cloneDir);
      console.log(`✓ ${entry.slug} ingested successfully`);
    }
  } finally {
    cleanup();
  }

  console.log(`\nIngestion complete: ${entries.length} course(s) processed.`);
}

main().catch((err) => {
  console.error("Ingestion failed:", err);
  cleanup();
  process.exit(1);
});

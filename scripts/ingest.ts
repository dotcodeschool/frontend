import { readFileSync, existsSync, mkdirSync, rmSync } from 'fs'
import { execSync } from 'child_process'
import { resolve, join } from 'path'
import yaml from 'js-yaml'

type RegistryEntry = {
  slug: string
  repo: string
  branch: string
  title: string
  author: string
  level?: string
  language?: string
  description?: string
}

const __dirname = import.meta.dirname ?? new URL('.', import.meta.url).pathname.replace(/\/$/, '')
const ROOT = resolve(__dirname, '..')
const REGISTRY_PATH = join(ROOT, 'config', 'registry.yaml')
const CONTENT_DIR = join(ROOT, 'content', 'courses')
const TMP_DIR = join(ROOT, '.ingestion-tmp')
const CONVERTER_PATH = join(ROOT, '..', 'gitorial-to-dotcodeschool')

function loadRegistry(): RegistryEntry[] {
  if (!existsSync(REGISTRY_PATH)) {
    console.log('No registry.yaml found, skipping ingestion.')
    return []
  }

  const raw = readFileSync(REGISTRY_PATH, 'utf-8')
  const entries = yaml.load(raw) as RegistryEntry[] | null
  return entries ?? []
}

function cloneRepo(entry: RegistryEntry): string {
  const cloneDir = join(TMP_DIR, entry.slug)

  if (existsSync(cloneDir)) {
    rmSync(cloneDir, { recursive: true })
  }

  console.log(`Cloning ${entry.repo}@${entry.branch}...`)
  execSync(
    `git clone --depth 1 --branch ${entry.branch} https://github.com/${entry.repo}.git ${cloneDir}`,
    { stdio: 'inherit' }
  )

  return cloneDir
}

function convertRepo(entry: RegistryEntry, cloneDir: string): void {
  const outputDir = join(CONTENT_DIR, entry.slug)

  if (existsSync(outputDir)) {
    rmSync(outputDir, { recursive: true })
  }

  console.log(`Converting ${entry.slug}...`)

  const args = [
    `-i "${cloneDir}"`,
    `-o "${outputDir}"`,
    `-b ${entry.branch}`,
    entry.title ? `-t "${entry.title}"` : '',
    entry.author ? `-a "${entry.author}"` : '',
    entry.level ? `-l "${entry.level}"` : '',
    entry.language ? `-g "${entry.language}"` : '',
    entry.description ? `-d "${entry.description}"` : '',
  ].filter(Boolean).join(' ')

  execSync(`node ${join(CONVERTER_PATH, 'dist', 'cli.js')} ${args}`, {
    stdio: 'inherit',
  })
}

function cleanup(): void {
  if (existsSync(TMP_DIR)) {
    rmSync(TMP_DIR, { recursive: true })
  }
}

async function main() {
  const entries = loadRegistry()

  if (entries.length === 0) {
    console.log('No courses to ingest.')
    return
  }

  mkdirSync(TMP_DIR, { recursive: true })

  try {
    for (const entry of entries) {
      const cloneDir = cloneRepo(entry)
      convertRepo(entry, cloneDir)
      console.log(`✓ ${entry.slug} ingested successfully`)
    }
  } finally {
    cleanup()
  }

  console.log(`\nIngestion complete: ${entries.length} course(s) processed.`)
}

main().catch((err) => {
  console.error('Ingestion failed:', err)
  cleanup()
  process.exit(1)
})

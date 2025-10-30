import fs from 'fs'
import fsp from 'fs/promises'
import path from 'path'

const repoRoot = process.cwd()
const srcContentDir = path.resolve(repoRoot, 'content')
const outContentDir = path.resolve(repoRoot, 'public', 'content')
const outListDir = path.resolve(repoRoot, 'public', '__content', 'list')

async function ensureDir(dir) {
  await fsp.mkdir(dir, { recursive: true })
}

async function copyDir(src, dest) {
  await ensureDir(dest)
  const entries = await fsp.readdir(src, { withFileTypes: true })
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name)
    const destPath = path.join(dest, entry.name)
    if (entry.isDirectory()) {
      await copyDir(srcPath, destPath)
    } else {
      await fsp.copyFile(srcPath, destPath)
    }
  }
}

async function writeListJSON(type) {
  const typeDir = path.join(srcContentDir, type)
  try {
    const entries = await fsp.readdir(typeDir, { withFileTypes: true })
    const folders = entries.filter(e => e.isDirectory()).map(e => e.name)
    await ensureDir(outListDir)
    const outFile = path.join(outListDir, `${type}.json`)
    await fsp.writeFile(outFile, JSON.stringify({ items: folders }, null, 2), 'utf8')
  } catch (e) {
    // If the type directory doesn't exist, write an empty list to keep consumers happy
    await ensureDir(outListDir)
    const outFile = path.join(outListDir, `${type}.json`)
    await fsp.writeFile(outFile, JSON.stringify({ items: [] }, null, 2), 'utf8')
  }
}

async function main() {
  // Copy entire content directory to public/content for static hosting
  if (fs.existsSync(srcContentDir)) {
    await copyDir(srcContentDir, outContentDir)
  }
  // Generate static listing JSONs consumed by the app
  await writeListJSON('projects')
  await writeListJSON('papers')
  await writeListJSON('news')
}

main().catch((e) => {
  console.error('[export-content] failed:', e)
  process.exit(1)
})



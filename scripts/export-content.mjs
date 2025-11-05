// export-content.mjs
// 目的: content/ ディレクトリを public/ 配下にコピーし、一覧 JSON を生成してフロントが参照できるようにする
// 想定用途: デプロイやプレビュー前に実行し、静的ホスティング用のデータを整える

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
    // type ディレクトリが存在しない場合でも、空データを書き出して利用側のエラーを防ぐ
    await ensureDir(outListDir)
    const outFile = path.join(outListDir, `${type}.json`)
    await fsp.writeFile(outFile, JSON.stringify({ items: [] }, null, 2), 'utf8')
  }
}

async function main() {
  // 1. content/ を public/content にコピー（静的 Hosting 用）
  if (fs.existsSync(srcContentDir)) {
    await copyDir(srcContentDir, outContentDir)
  }
  // 2. projects/papers/news のフォルダ一覧 JSON を生成
  await writeListJSON('projects')
  await writeListJSON('papers')
  await writeListJSON('news')
}

main().catch((e) => {
  console.error('[export-content] failed:', e)
  process.exit(1)
})

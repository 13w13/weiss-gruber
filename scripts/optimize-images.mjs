import sharp from 'sharp'
import { readdir, mkdir } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import { join, extname, basename, relative } from 'node:path'

const VARIANTS = [400, 800, 1600]
const QUALITY = 80
const SOURCE_EXT = new Set(['.jpg', '.jpeg', '.png'])

const FOLDERS = [
  { src: 'images/vitraux', dst: 'images/vitraux-optimized' },
  { src: 'images/bio', dst: 'images/bio-optimized' },
]

async function processFile(srcPath, dstDir, rel) {
  const ext = extname(srcPath).toLowerCase()
  if (!SOURCE_EXT.has(ext)) return { created: 0, skipped: 0 }

  const base = basename(srcPath, ext)
  let created = 0
  let skipped = 0
  for (const width of VARIANTS) {
    const dstFile = join(dstDir, `${base}_${width}w.webp`)
    if (existsSync(dstFile)) {
      skipped++
      continue
    }
    await sharp(srcPath)
      .rotate()
      .resize({ width, withoutEnlargement: true })
      .webp({ quality: QUALITY })
      .toFile(dstFile)
    created++
  }
  if (created > 0) console.log(`  ${rel}: +${created} variant(s)`)
  return { created, skipped }
}

async function processDir(srcDir, dstDir, base = srcDir) {
  await mkdir(dstDir, { recursive: true })
  const entries = await readdir(srcDir, { withFileTypes: true })
  let created = 0
  let skipped = 0
  for (const entry of entries) {
    const srcPath = join(srcDir, entry.name)
    const dstPath = join(dstDir, entry.name)
    if (entry.isDirectory()) {
      const s = await processDir(srcPath, dstPath, base)
      created += s.created
      skipped += s.skipped
    } else if (entry.isFile()) {
      const rel = relative(base, srcPath)
      const s = await processFile(srcPath, dstDir, rel)
      created += s.created
      skipped += s.skipped
    }
  }
  return { created, skipped }
}

console.log(`Generating WebP variants at ${VARIANTS.join(', ')}px (q=${QUALITY})...`)
const t0 = Date.now()
let totalCreated = 0
let totalSkipped = 0
for (const f of FOLDERS) {
  if (!existsSync(f.src)) {
    console.log(`\n→ ${f.src}: skipped (does not exist)`)
    continue
  }
  console.log(`\n→ ${f.src} → ${f.dst}`)
  const s = await processDir(f.src, f.dst)
  totalCreated += s.created
  totalSkipped += s.skipped
}
const elapsed = ((Date.now() - t0) / 1000).toFixed(1)
console.log(`\nDone in ${elapsed}s: ${totalCreated} new variants, ${totalSkipped} cached.`)

/**
 * Image Import & Optimizer
 * ========================
 * Drop images into drop/[category]/ → this script auto-resizes,
 * compresses, and copies them to public/images/[category]/
 * then updates src/data/images.js so the site picks them up instantly.
 *
 * Usage:
 *   npm run import        (process once and exit)
 *   npm run import:watch  (watch drop/ and process on every new file)
 */

import sharp from 'sharp'
import chokidar from 'chokidar'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '..')
const DROP_DIR = path.join(ROOT, 'drop')
const OUT_DIR  = path.join(ROOT, 'public', 'images')
const DATA_FILE = path.join(ROOT, 'src', 'data', 'images.json')

// ── Per-category output specs ──────────────────────────────────────────────
const SPECS = {
  bio:          { width: 1200, height: 1600, fit: 'cover', quality: 88 },
  featured:     { width: 1200, height: 1600, fit: 'cover', quality: 88 },
  videography:  { width: 1400, height: 933,  fit: 'cover', quality: 82 },
  portraits:    { width: 900,  height: 1200, fit: 'cover', quality: 85 },
  automotive:   { width: 1400, height: 933,  fit: 'cover', quality: 85 },
  lifestyle:    { width: 1200, height: 900,  fit: 'cover', quality: 82 },
  events:       { width: 1400, height: 933,  fit: 'cover', quality: 82 },
  misc:         { width: 1200, height: 900,  fit: 'cover', quality: 82 },
}

const SUPPORTED_IMG = new Set(['.jpg', '.jpeg', '.png', '.webp', '.tiff', '.tif', '.heic', '.avif'])
const SUPPORTED_VID = new Set(['.mp4', '.mov', '.avi', '.mkv', '.webm'])
const SUPPORTED = new Set([...SUPPORTED_IMG, ...SUPPORTED_VID])

// ── Helpers ────────────────────────────────────────────────────────────────

function slug(filename) {
  return path.basename(filename, path.extname(filename))
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
}

function webPath(category, filename, isVideo = false) {
  return isVideo ? `/videos/${category}/${filename}` : `/images/${category}/${filename}`
}

const EMPTY_DATA = { bio: [], featured: [], videography: [], portraits: [], automotive: [], lifestyle: [], events: [], misc: [] }

/** Read current images.json — plain JSON, reliable parse */
function readData() {
  if (!fs.existsSync(DATA_FILE)) return { ...EMPTY_DATA }
  try {
    return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'))
  } catch {
    return { ...EMPTY_DATA }
  }
}

/** Write data back to images.json */
function writeData(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf8')
  console.log(`  ✓ Updated src/data/images.json`)
}

function titleFromSlug(s) {
  return s.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
}

// ── Core processor ─────────────────────────────────────────────────────────

async function processFile(filePath) {
  const ext = path.extname(filePath).toLowerCase()
  if (!SUPPORTED.has(ext)) return

  const parts = filePath.replace(DROP_DIR + path.sep, '').split(path.sep)
  if (parts.length < 2) return

  const category = parts[0]
  const spec = SPECS[category]
  if (!spec) {
    console.warn(`  ⚠ Unknown category folder: ${category} — skipping`)
    return
  }

  const outFilename = slug(parts[parts.length - 1]) + '.jpg'
  const outPath = path.join(OUT_DIR, category, outFilename)

  // Ensure output dir exists
  fs.mkdirSync(path.join(OUT_DIR, category), { recursive: true })

  console.log(`  → Processing ${parts[parts.length - 1]} (${category})...`)

  const isVideo = SUPPORTED_VID.has(ext)
  const fileSlug = slug(parts[parts.length - 1])

  try {
    if (isVideo) {
      // ── Video: copy as-is to public/videos/[category]/ ──────────────────
      const vidOutDir = path.join(ROOT, 'public', 'videos', category)
      fs.mkdirSync(vidOutDir, { recursive: true })
      const vidOutFilename = fileSlug + ext
      const vidOutPath = path.join(vidOutDir, vidOutFilename)
      fs.copyFileSync(filePath, vidOutPath)
      const stats = fs.statSync(vidOutPath)
      console.log(`  ✓ Copied → public/videos/${category}/${vidOutFilename} (${(stats.size / 1024 / 1024).toFixed(1)} MB)`)

      const data = readData()
      if (!data[category]) data[category] = []
      const existing = data[category].find(i => i.slug === fileSlug)
      if (!existing) {
        data[category].push({
          slug: fileSlug,
          src: webPath(category, vidOutFilename, true),
          type: 'video',
          title: titleFromSlug(fileSlug),
          role: defaultRole(category),
          year: String(new Date().getFullYear()),
        })
        writeData(data)
      }
    } else {
      // ── Image: resize + compress via sharp ──────────────────────────────
      await sharp(filePath)
        .rotate()  // auto-rotate based on EXIF orientation
        .resize(spec.width, spec.height, { fit: spec.fit, position: 'centre' })
        .jpeg({ quality: spec.quality, progressive: true, mozjpeg: true })
        .toFile(outPath)

      const stats = fs.statSync(outPath)
      console.log(`  ✓ Saved → public/images/${category}/${outFilename} (${(stats.size / 1024).toFixed(0)} KB)`)

      const data = readData()
      if (!data[category]) data[category] = []
      const existing = data[category].find(i => i.slug === fileSlug)
      if (!existing) {
        data[category].push({
          slug: fileSlug,
          src: webPath(category, outFilename),
          type: 'image',
          title: titleFromSlug(fileSlug),
          role: defaultRole(category),
          year: String(new Date().getFullYear()),
        })
        writeData(data)
      }
    }
  } catch (err) {
    console.error(`  ✗ Failed to process ${filePath}:`, err.message)
  }
}

function defaultRole(category) {
  const roles = {
    bio: '',
    featured: 'Featured',
    videography: 'Videography',
    portraits: 'Portrait Photography',
    automotive: 'Automotive Photography',
    lifestyle: 'Lifestyle Photography',
    events: 'Event Photography',
    misc: 'Photography',
  }
  return roles[category] || 'Photography'
}

// ── Scan existing drop folders (one-shot) ─────────────────────────────────

async function processHeroVideo() {
  const heroDir = path.join(DROP_DIR, 'hero')
  if (!fs.existsSync(heroDir)) return

  const files = fs.readdirSync(heroDir).filter(f => SUPPORTED_VID.has(path.extname(f).toLowerCase()))
  if (files.length === 0) return

  const file = files[0] // use first video found
  const ext = path.extname(file).toLowerCase()
  const outPath = path.join(ROOT, 'public', 'video', `hero${ext}`)
  fs.mkdirSync(path.join(ROOT, 'public', 'video'), { recursive: true })
  fs.copyFileSync(path.join(heroDir, file), outPath)
  const stats = fs.statSync(outPath)
  console.log(`  ✓ Hero video → public/video/hero${ext} (${(stats.size / 1024 / 1024).toFixed(1)} MB)`)
}

async function scanAll() {
  console.log('\n📂 Scanning drop/ folders...\n')
  let count = 0

  // Hero video (special case)
  await processHeroVideo()

  for (const category of Object.keys(SPECS)) {
    const dir = path.join(DROP_DIR, category)
    if (!fs.existsSync(dir)) continue

    const files = fs.readdirSync(dir).filter(f => SUPPORTED.has(path.extname(f).toLowerCase()))
    for (const file of files) {
      await processFile(path.join(dir, file))
      count++
    }
  }

  if (count === 0) {
    console.log('  No media found in drop/ folders. Add files and re-run.')
  } else {
    console.log(`\n✅ Done — ${count} file(s) processed.`)
  }
}

// ── Watch mode ────────────────────────────────────────────────────────────

function watchMode() {
  console.log('\n👁  Watching drop/ for new images... (Ctrl+C to stop)\n')

  const watcher = chokidar.watch(DROP_DIR, {
    ignored: /(^|[/\\])\../,
    persistent: true,
    ignoreInitial: false,
    awaitWriteFinish: { stabilityThreshold: 800, pollInterval: 100 },
  })

  watcher.on('add', async (filePath) => {
    const ext = path.extname(filePath).toLowerCase()
    if (SUPPORTED.has(ext)) {
      console.log(`\n🖼  New file detected: ${path.relative(ROOT, filePath)}`)
      await processFile(filePath)
    }
  })

  watcher.on('error', (err) => console.error('Watcher error:', err))
}

// ── Entry point ───────────────────────────────────────────────────────────

const args = process.argv.slice(2)
if (args.includes('--watch')) {
  watchMode()
} else {
  await scanAll()
}

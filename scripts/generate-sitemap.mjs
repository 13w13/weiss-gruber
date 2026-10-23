// Génère public/sitemap.xml à partir du CSV : pages du site + une entrée par fiche d'œuvre,
// en français (sans préfixe) et en anglais (/en).
// Lancé automatiquement avant chaque build (script "prebuild").
import fs from 'node:fs'
import path from 'node:path'
import Papa from 'papaparse'

const SITE_URL = 'https://www.weiss-gruber.art'
const LOCALE_PREFIXES = ['', '/en']
const root = process.cwd()
const today = new Date().toISOString().slice(0, 10)

const pages = [
  { loc: '/jeannette', changefreq: 'monthly', priority: '1.0' },
  { loc: '/jeannette/catalogue', changefreq: 'monthly', priority: '0.9' },
  { loc: '/jeannette/biography', changefreq: 'yearly', priority: '0.8' },
  { loc: '/jeannette/carte', changefreq: 'yearly', priority: '0.7' },
  { loc: '/jeannette/publications', changefreq: 'yearly', priority: '0.7' },
]

const csv = fs.readFileSync(path.join(root, 'vitraux_metadata.csv'), 'utf-8')
const { data } = Papa.parse(csv, { header: true, skipEmptyLines: true })
const works = data
  .filter((row) => row.id)
  .map((row) => ({ loc: `/jeannette/catalogue/${row.id}`, changefreq: 'yearly', priority: '0.6' }))

const urls = LOCALE_PREFIXES.flatMap((prefix) => [...pages, ...works].map((u) => ({ ...u, loc: `${prefix}${u.loc}` })))
  .map(({ loc, changefreq, priority }) => [
    '  <url>',
    `    <loc>${SITE_URL}${loc}</loc>`,
    `    <lastmod>${today}</lastmod>`,
    `    <changefreq>${changefreq}</changefreq>`,
    `    <priority>${priority}</priority>`,
    '  </url>',
  ].join('\n'))
  .join('\n')

const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`
fs.writeFileSync(path.join(root, 'public', 'sitemap.xml'), xml)
console.log(`sitemap.xml : (${pages.length} pages + ${works.length} fiches) × ${LOCALE_PREFIXES.length} langues`)

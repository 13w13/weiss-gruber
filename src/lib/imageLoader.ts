import type { ImageLoader } from 'next/image'

const VARIANTS = [400, 800, 1600] as const

const OPTIMIZED_PATTERN = /^(https?:\/\/[^/]+)\/(vitraux|bio)\/(.+)\.(jpe?g|png)$/i

/**
 * Next.js Image loader that maps an original Scaleway URL
 *   https://host/<vitraux|bio>/<name>.<ext>
 * to the closest pre-generated WebP variant
 *   https://host/<vitraux|bio>-optimized/<name>_<w>w.webp
 *
 * If the URL doesn't match (other folder, format, or absolute non-S3 URL),
 * the original is returned untouched.
 */
export const s3ImageLoader: ImageLoader = ({ src, width }) => {
  const match = src.match(OPTIMIZED_PATTERN)
  if (!match) return src
  const [, host, dir, name] = match
  const closest = VARIANTS.find((v) => v >= width) ?? VARIANTS[VARIANTS.length - 1]
  return `${host}/${dir}-optimized/${name}_${closest}w.webp`
}

import fs from 'fs';
import path from 'path';
import Papa from 'papaparse';
import type { GalleryImage, Vitrail } from '@/types/images';

// Lecture du CSV au build (getStaticProps uniquement : ce module utilise fs).
// Les œuvres sont triées par année ; à année égale, l'ordre du CSV est conservé.
export function getWorks(): Vitrail[] {
  const csvFilePath = path.join(process.cwd(), 'vitraux_metadata.csv');
  const csvFileContent = fs.readFileSync(csvFilePath, 'utf-8');
  const result = Papa.parse<Record<string, string>>(csvFileContent, {
    header: true,
    skipEmptyLines: true,
  });

  const works = result.data.map((row) => {
    let gallery_images: GalleryImage[] = [];
    if (row.gallery_images && row.gallery_images.trim().startsWith('[')) {
      try {
        gallery_images = JSON.parse(row.gallery_images);
      } catch (e) {
        console.error(`Erreur de parsing JSON pour l'œuvre ${row.id}:`, e);
      }
    }
    return { ...row, gallery_images } as unknown as Vitrail;
  });

  return works
    .map((work, i) => ({ work, i }))
    .sort((a, b) => (parseInt(a.work.year) || 0) - (parseInt(b.work.year) || 0) || a.i - b.i)
    .map(({ work }) => work);
}

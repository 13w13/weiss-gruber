import fs from 'fs';
import path from 'path';
import Papa from 'papaparse';
import type { GalleryImage, Vitrail } from '@/types/images';
import { UI } from '@/i18n/ui';
import type { Locale } from '@/i18n';

interface WorkTranslation {
  title?: string;
  location_in_building?: string;
  text?: string;
  gallery?: Record<string, { nom?: string; alt?: string }>;
}

function readTranslations(locale: Locale): Record<string, WorkTranslation> {
  if (locale === 'fr') return {};
  const file = path.join(process.cwd(), 'data', `works_${locale}.json`);
  if (!fs.existsSync(file)) return {};
  return JSON.parse(fs.readFileSync(file, 'utf-8'));
}

// Lecture du CSV au build (getStaticProps uniquement : ce module utilise fs).
// Les œuvres sont triées par année ; à année égale, l'ordre du CSV est conservé.
// Pour une autre langue que le français, les champs texte (title_fr, text_fr, alt_fr…)
// contiennent la traduction, ce qui évite de dupliquer les composants.
export function getWorks(locale: Locale = 'fr'): Vitrail[] {
  const csvFilePath = path.join(process.cwd(), 'vitraux_metadata.csv');
  const csvFileContent = fs.readFileSync(csvFilePath, 'utf-8');
  const result = Papa.parse<Record<string, string>>(csvFileContent, {
    header: true,
    skipEmptyLines: true,
  });
  const translations = readTranslations(locale);
  const buildingTypes = UI[locale].buildingTypes;

  const works = result.data.map((row) => {
    let gallery_images: GalleryImage[] = [];
    if (row.gallery_images && row.gallery_images.trim().startsWith('[')) {
      try {
        gallery_images = JSON.parse(row.gallery_images);
      } catch (e) {
        console.error(`Erreur de parsing JSON pour l'œuvre ${row.id}:`, e);
      }
    }
    const work = { ...row, gallery_images } as unknown as Vitrail;

    const tr = translations[work.id];
    if (locale !== 'fr') work.building_type = buildingTypes[work.building_type] ?? work.building_type;
    if (!tr) return work;
    return {
      ...work,
      title_fr: tr.title || work.title_fr,
      location_in_building: tr.location_in_building || work.location_in_building,
      text_fr: tr.text ?? work.text_fr,
      gallery_images: gallery_images.map((img) => {
        const g = tr.gallery?.[img.url];
        if (!g) return img;
        // Pas de clé à undefined : getStaticProps ne sait pas la sérialiser
        const localized: GalleryImage = { ...img, nom: g.nom || img.nom };
        if (g.alt) localized.alt_fr = g.alt;
        return localized;
      }),
    };
  });

  return works
    .map((work, i) => ({ work, i }))
    .sort((a, b) => (parseInt(a.work.year) || 0) - (parseInt(b.work.year) || 0) || a.i - b.i)
    .map(({ work }) => work);
}

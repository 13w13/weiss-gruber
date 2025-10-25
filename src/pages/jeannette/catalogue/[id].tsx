import { GetStaticPaths, GetStaticProps } from 'next';
import fs from 'fs';
import path from 'path';
import Papa from 'papaparse';
import { useRouter } from 'next/router';
import Image from 'next/image';
import Link from 'next/link';
import { Globe, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState, useEffect } from 'react';
import Lightbox from 'yet-another-react-lightbox';
import Zoom from 'yet-another-react-lightbox/plugins/zoom';
import 'yet-another-react-lightbox/styles.css';
import { Vitrail } from '@/types/images';

// Le composant pour la page de détail
export default function VitrailDetail({ work, prevId, nextId }: { work: Vitrail; prevId?: string | null; nextId?: string | null }) {
  const router = useRouter();
  const [language, setLanguage] = useState<'fr' | 'en'>('fr');
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' && prevId) {
        router.push(`/jeannette/catalogue/${prevId}`);
      } else if (e.key === 'ArrowRight' && nextId) {
        router.push(`/jeannette/catalogue/${nextId}`);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [prevId, nextId, router]);

  if (router.isFallback) {
    return <div>Chargement...</div>;
  }

  const slides = [
    { 
      src: `https://xrarrp4wrvauwge7.public.blob.vercel-storage.com/${work.main_image}`,
      alt: work.title_fr,
      title: work.title_fr
    },
    ...(work.gallery_images?.map(img => ({
      src: `https://xrarrp4wrvauwge7.public.blob.vercel-storage.com/${img.url}`,
      alt: img.alt_fr || work.title_fr,
      title: `${img.type}${img.credit ? ` (${img.credit})` : ''}`
    })) || [])
  ];

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <header className="fixed top-0 left-0 right-0 z-50 bg-white bg-opacity-90 backdrop-blur-sm border-b border-gray-200">
        <nav className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <Link href="/" className="text-xl font-semibold mr-6">
              Weiss-Gruber
            </Link>
            <Link href="/jeannette" className="flex items-center text-gray-700 hover:text-blue-600 transition-colors">
              Jeannette Weiss Gruber
            </Link>
          </div>
          <ul className="flex space-x-6">
            <li><Link href="/jeannette" className="hover:text-blue-600 transition-colors">Accueil</Link></li>
            <li><Link href="/jeannette/biography" className="hover:text-blue-600 transition-colors">Biographie</Link></li>
            <li><Link href="/jeannette/catalogue" className="text-blue-600">Catalogue Raisonné</Link></li>
            <li><Link href="/jeannette/exhibitions" className="hover:text-blue-600 transition-colors">Expositions</Link></li>
            <li>
              <button onClick={() => setLanguage(language === 'fr' ? 'en' : 'fr')} className="flex items-center hover:text-blue-600 transition-colors">
                <Globe className="w-4 h-4 mr-1" />
                {language.toUpperCase()}
              </button>
            </li>
          </ul>
        </nav>
      </header>

      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-light mb-4">{work.title_fr}</h1>
            <p className="text-lg text-gray-600 mb-4">{work.year} - {work.building_name}, {work.city}</p>

            <div className="mb-6 flex justify-between items-center">
              {prevId ? (
                <Link href={`/jeannette/catalogue/${prevId}`} className="inline-flex items-center text-gray-700 hover:text-blue-600 transition-colors">
                  <ChevronLeft className="w-4 h-4 mr-1" />
                  Précédent
                </Link>
              ) : (
                <span />
              )}
              {nextId && (
                <Link href={`/jeannette/catalogue/${nextId}`} className="inline-flex items-center text-gray-700 hover:text-blue-600 transition-colors">
                  Suivant
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Link>
              )}
            </div>

            <div className="relative h-96 md:h-[500px] mb-4 bg-gray-200 rounded-lg overflow-hidden cursor-pointer" onClick={() => setOpen(true)}>
              <Image
                src={`https://xrarrp4wrvauwge7.public.blob.vercel-storage.com/${work.main_image}`}
                alt={work.title_fr}
                layout="fill"
                className="object-contain"
                onError={(e) => { e.currentTarget.src = 'https://via.placeholder.com/800x500.png?text=Image+non+disponible'; }}
              />
            </div>

            <Lightbox
              open={open}
              close={() => setOpen(false)}
              slides={slides}
              plugins={[Zoom]}
            />

            {work.caption_fr && (
              <p className="mb-8 text-base text-gray-700 leading-relaxed">
                {work.caption_fr}
              </p>
            )}

            <div className="space-y-4 mb-12">
              {work.description_fr && (
                <p className="text-gray-800 leading-relaxed">
                  {work.description_fr}
                </p>
              )}
              <dl className="grid grid-cols-1 gap-y-3">
                <div>
                  <dt className="text-xs uppercase tracking-wide text-gray-500">Type d&apos;édifice</dt>
                  <dd className="text-gray-800">{work.building_type}</dd>
                </div>
                <div>
                  <dt className="text-xs uppercase tracking-wide text-gray-500">Département</dt>
                  <dd className="text-gray-800">{work.department}</dd>
                </div>
                <div>
                  <dt className="text-xs uppercase tracking-wide text-gray-500">Emplacement</dt>
                  <dd className="text-gray-800">{work.location_in_building}</dd>
                </div>
              </dl>
            </div>

            {work.gallery_images && work.gallery_images.length > 0 && (
              <div>
                <h2 className="text-2xl font-light mb-4">Galerie</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {work.gallery_images.map((image, index) => (
                    <div key={index} className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                      <Image
                        src={`https://xrarrp4wrvauwge7.public.blob.vercel-storage.com/${image.url}`}
                        alt={image.alt_fr || work.title_fr}
                        width={200}
                        height={150}
                        className="object-cover w-full h-32 cursor-pointer"
                        onClick={() => setOpen(true)} // Ouvre la lightbox sur l'image cliquée
                      />
                      <div className="p-2 text-sm bg-gray-50">
                        <p className="font-semibold">{image.type}</p>
                        {image.credit && <p className="mt-1 text-xs text-gray-400">Crédit photo : {image.credit}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      <footer className="bg-gray-100 py-8">
        <div className="container mx-auto px-4 text-center text-gray-600">
          <p>&copy; {new Date().getFullYear()} Weiss-Gruber Family Art. Tous droits réservés.</p>
        </div>
      </footer>
    </div>
  );
}

// Fonction pour lire et parser le CSV
const getWorks = () => {
  const csvFilePath = path.join(process.cwd(), 'vitraux_metadata.csv');
  const csvFileContent = fs.readFileSync(csvFilePath, 'utf-8');
  const result = Papa.parse(csvFileContent, {
    header: true,
    skipEmptyLines: true,
  });

  // Traitement pour parser la colonne gallery_images
  const works = (result.data as Record<string, string>[]).map(work => {
    let gallery_images = [];
    if (work.gallery_images && work.gallery_images.trim().startsWith('[')) {
      try {
        // Remplacer les doubles guillemets échappés par des guillemets simples pour un parsing JSON correct
        const cleanedJsonString = work.gallery_images.replace(/""/g, '"');
        gallery_images = JSON.parse(cleanedJsonString);
      } catch {
        console.error(`Erreur de parsing JSON pour l'œuvre ${work.id}:`, work.gallery_images);
      }
    }
    return { ...work, gallery_images };
  });

  return works as Vitrail[];
};

// Génère les chemins pour chaque œuvre
export const getStaticPaths: GetStaticPaths = async () => {
  const works = getWorks();
  const paths = works.map(work => ({
    params: { id: work.id },
  }));

  return {
    paths,
    fallback: false, // false signifie que toutes les routes sont pré-générées
  };
};

// Récupère les données pour une œuvre spécifique
export const getStaticProps: GetStaticProps = async ({ params }) => {
  const works = getWorks();
  const index = works.findIndex(w => w.id === params?.id);
  const work = index >= 0 ? works[index] : undefined;

  if (!work) {
    return { notFound: true };
  }

  const prevId = index > 0 ? works[index - 1].id : null;
  const nextId = index < works.length - 1 ? works[index + 1].id : null;

  return {
    props: {
      work,
      prevId,
      nextId,
    },
  };
};

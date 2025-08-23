import { GetStaticPaths, GetStaticProps } from 'next';
import fs from 'fs';
import path from 'path';
import Papa from 'papaparse';
import { useRouter } from 'next/router';
import Image from 'next/image';
import Link from 'next/link';
import { Globe } from 'lucide-react';
import { useState } from 'react';
import Lightbox from 'yet-another-react-lightbox';
import Zoom from 'yet-another-react-lightbox/plugins/zoom';
import 'yet-another-react-lightbox/styles.css';
import { Vitrail } from '@/types/images';

// Le composant pour la page de détail
export default function VitrailDetail({ work }: { work: Vitrail }) {
  const router = useRouter();
  const [language, setLanguage] = useState<'fr' | 'en'>('fr');
  const [open, setOpen] = useState(false);

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
            <p className="text-lg text-gray-600 mb-8">{work.year} - {work.building_name}, {work.city}</p>
            
            <div className="relative h-96 md:h-[500px] mb-8 bg-gray-200 rounded-lg overflow-hidden cursor-pointer" onClick={() => setOpen(true)}>
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

            <div className="prose max-w-none mb-12">
              <p>{work.description_fr}</p>
              <ul>
                <li><strong>Type d&apos;édifice:</strong> {work.building_type}</li>
                <li><strong>Département:</strong> {work.department}</li>
                <li><strong>Emplacement:</strong> {work.location_in_building}</li>
                <li><strong>Type d&apos;intervention:</strong> {work.type_of_work}</li>
                <li><strong>Thème:</strong> {work.theme}</li>
              </ul>
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
                        {image.credit && <p className="text-gray-500 italic">{image.credit}</p>}
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
  const works = (result.data as any[]).map(work => {
    let gallery_images = [];
    if (work.gallery_images && work.gallery_images.trim().startsWith('[')) {
      try {
        gallery_images = JSON.parse(work.gallery_images);
      } catch (e) {
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
  const work = works.find(w => w.id === params?.id);

  if (!work) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      work,
    },
  };
};

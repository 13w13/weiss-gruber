import { GetStaticProps } from 'next';
import dynamic from 'next/dynamic';
import fs from 'fs';
import path from 'path';
import Papa from 'papaparse';
import Link from 'next/link';
import { Vitrail, GalleryImage } from '@/types/images';

const ArtworksMap = dynamic(() => import('@/components/map/ArtworksMap'), { ssr: false });

function getWorks(): Vitrail[] {
  const csvFilePath = path.join(process.cwd(), 'vitraux_metadata.csv');
  const csvFileContent = fs.readFileSync(csvFilePath, 'utf-8');
  const result = Papa.parse(csvFileContent, { header: true, skipEmptyLines: true });

  const works = (result.data as Record<string, string>[]).map((work) => {
    let gallery_images: GalleryImage[] = [];
    if (work.gallery_images && work.gallery_images.trim().startsWith('[')) {
      try {
        const cleanedJsonString = work.gallery_images.replace(/""/g, '"');
        gallery_images = JSON.parse(cleanedJsonString) as GalleryImage[];
      } catch {
        console.error(`Erreur de parsing JSON pour l'œuvre ${work.id}:`, work.gallery_images);
      }
    }
    return { ...work, gallery_images } as unknown as Vitrail;
  });

  return works as Vitrail[];
}

export const getStaticProps: GetStaticProps = async () => {
  const works = getWorks();
  return { props: { works } };
};

export default function Carte({ works }: { works: Vitrail[] }) {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="fixed top-0 left-0 right-0 bg-white bg-opacity-90 backdrop-blur border-b z-50">
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
            <li><Link href="/jeannette/catalogue" className="hover:text-blue-600 transition-colors">Catalogue Raisonné</Link></li>
            <li><span className="text-blue-600">Carte</span></li>
            <li><Link href="/jeannette/exhibitions" className="hover:text-blue-600 transition-colors">Expositions</Link></li>
          </ul>
        </nav>
      </header>

      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-6xl">
          <h1 className="text-3xl md:text-4xl font-light mb-2">Carte des vitraux</h1>
          <p className="text-gray-600 mb-6">Parcourez les lieux où se trouvent les vitraux de Jeannette Weiss Gruber. Cliquez sur un point pour voir les images et ouvrir la fiche.</p>

          <ArtworksMap works={works} />
        </div>
      </main>

      <footer className="bg-gray-100 py-8 mt-auto">
        <div className="container mx-auto px-4 text-center text-gray-600">
          <p>&copy; {new Date().getFullYear()} Weiss-Gruber Family Art. Tous droits réservés.</p>
        </div>
      </footer>
    </div>
  );
}

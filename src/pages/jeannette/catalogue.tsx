import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Search } from 'lucide-react';
import { GetStaticProps } from 'next';
import fs from 'fs';
import path from 'path';
import Papa from 'papaparse';
import { Vitrail, GalleryImage } from '@/types/images';

// Interface représentant une ligne brute du CSV (champs sous forme de chaînes)
interface CsvRow {
  id: string;
  year: string;
  building_name: string;
  building_type: string;
  city: string;
  department: string;
  location_in_building: string;
  title_fr: string;
  main_image: string;
  caption_fr: string;
  photo_status: string;
  description_fr: string;
  gallery_images: string;
  maps_url: string;
  lat: string;
  lng: string;
}

// Le composant reçoit maintenant 'works' en tant que prop
export default function CatalogueRaisonne({ works }: { works: Vitrail[] }) {
  const [searchTerm, setSearchTerm] = useState('');

  // Static content for the page
  const content = {
    title: "Catalogue Raisonné de Jeannette Weiss Gruber",
    search: "Rechercher une œuvre...",
    footer: { rights: "All rights reserved." }
  };

  // La logique de filtrage utilise maintenant la prop 'works'
  const filteredWorks = works.filter(work =>
    (work.title_fr && work.title_fr.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (work.year && work.year.toString().includes(searchTerm)) ||
    (work.city && work.city.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (work.building_name && work.building_name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <header className="fixed top-0 left-0 right-0 z-50 bg-white bg-opacity-90 backdrop-blur-sm border-b border-gray-200">
        {/* Le code de la navigation reste identique */}
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
            <li><Link href="/jeannette/carte" className="hover:text-blue-600 transition-colors">Carte</Link></li>
            <li><Link href="/jeannette/publications" className="hover:text-blue-600 transition-colors">Publications</Link></li>
          </ul>
        </nav>
      </header>

      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-light mb-8 text-center">{content.title}</h1>
          
          <div className="mb-8">
            <div className="relative">
              <input
                type="text"
                placeholder={content.search}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md pl-10"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredWorks.map((work) => (
              <Link key={work.id} href={`/jeannette/catalogue/${work.id}`} className="block bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
                <div className="relative h-64 bg-gray-200">
                  {/* L'image sera connectée dans une prochaine étape */}
                  <Image
                    src={`https://weiss-gruber-jeanette.s3.fr-par.scw.cloud/vitraux/${work.main_image}`}
                    alt={work.title_fr}
                    width={400}
                    height={300}
                    className="object-cover w-full h-full"
                    onError={(e) => { e.currentTarget.src = 'https://via.placeholder.com/400x300.png?text=Image+non+disponible'; }}
                  />
                </div>
                <div className="p-4">
                  <h3 className="text-xl font-semibold mb-2">{work.title_fr}</h3>
                  <p className="text-gray-600">{work.year}</p>
                  <p className="text-gray-600">{`${work.building_name}, ${work.city}`}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>

      <footer className="bg-gray-100 py-8">
        <div className="container mx-auto px-4 text-center text-gray-600">
          <p>&copy; 2025 Weiss-Gruber. Tous droits réservés.</p>
        </div>
      </footer>
    </div>
  )
}

// getStaticProps lit les données du fichier CSV au moment de la construction
export const getStaticProps: GetStaticProps = async () => {
  const csvFilePath = path.join(process.cwd(), 'vitraux_metadata.csv');
  const csvFileContent = fs.readFileSync(csvFilePath, 'utf-8');

  const result = Papa.parse<CsvRow>(csvFileContent, {
    header: true,
    skipEmptyLines: true,
  });

  // Traitement pour parser la colonne gallery_images
    const works: Vitrail[] = result.data.map((row: CsvRow) => {
    let gallery_images: GalleryImage[] = [];
    if (row.gallery_images && row.gallery_images.trim().startsWith('[')) {
      try {
        gallery_images = JSON.parse(row.gallery_images);
      } catch (e) {
        console.error(`Erreur de parsing JSON pour l'œuvre ${row.id}:`, e);
      }
    }
    return {
      ...row,
      gallery_images,
    };
  });

  return {
    props: {
      works,
    },
  };
};
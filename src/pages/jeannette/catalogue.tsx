import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Search, ArrowUpDown, ArrowUp, ArrowDown, Camera } from 'lucide-react';
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
  text_fr: string;
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
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc'); // Par défaut décroissant

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

  // Tri par année
  const sortedWorks = [...filteredWorks].sort((a, b) => {
    const yearA = parseInt(a.year) || 0;
    const yearB = parseInt(b.year) || 0;
    return sortOrder === 'desc' ? yearB - yearA : yearA - yearB;
  });

  // Fonction pour compter les photos (image principale + galerie)
  const getPhotoCount = (work: Vitrail) => {
    const galleryCount = work.gallery_images?.length || 0;
    return 1 + galleryCount; // 1 pour l'image principale + galerie
  };

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur border-b border-gray-200">
        <nav className="container mx-auto px-2 md:px-4 py-3 md:py-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <Link href="/jeannette" className="text-base md:text-xl font-semibold">
              <span className="hidden sm:inline">Jeannette Weiss Gruber</span>
              <span className="inline sm:hidden">Jeannette WG</span>
            </Link>
            <ul className="flex flex-wrap gap-2 md:gap-6 text-xs md:text-base">
              <li><Link href="/jeannette" className="hover:text-blue-600 transition-colors whitespace-nowrap">Accueil</Link></li>
              <li><Link href="/jeannette/biography" className="hover:text-blue-600 transition-colors whitespace-nowrap"><span className="hidden md:inline">Biographie</span><span className="inline md:hidden">Bio</span></Link></li>
              <li><Link href="/jeannette/catalogue" className="text-blue-600 whitespace-nowrap"><span className="hidden md:inline">Catalogue Raisonné</span><span className="inline md:hidden">Catalogue</span></Link></li>
              <li><Link href="/jeannette/carte" className="hover:text-blue-600 transition-colors whitespace-nowrap">Carte</Link></li>
              <li><Link href="/jeannette/publications" className="hover:text-blue-600 transition-colors whitespace-nowrap"><span className="hidden md:inline">Publications</span><span className="inline md:hidden">Publi</span></Link></li>
            </ul>
          </div>
        </nav>
      </header>

      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-light mb-6 text-center">{content.title}</h1>
          
          {/* Texte explicatif */}
          <div className="max-w-3xl mx-auto mb-10 text-center">
            <p className="text-sm md:text-base text-gray-700 leading-relaxed mb-4">
              Les réalisations sont présentées par ordre chronologique décroissant. Cliquez sur une œuvre pour accéder à sa fiche détaillée avec images en grand format. Sur la fiche, utilisez les flèches du clavier ou les boutons de navigation pour passer d&apos;une œuvre à l&apos;autre. Un clic sur une image ouvre le mode plein écran avec zoom.
            </p>
            <p className="text-xs md:text-sm text-gray-600 italic">
              Ce catalogue recense les vitraux photographiés et documentés. Il ne constitue pas une liste exhaustive de l&apos;œuvre, mais présente les réalisations principales dont nous disposons d&apos;images de qualité.
            </p>
          </div>
          
          {/* Barre de recherche et tri */}
          <div className="mb-8 max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row gap-4 items-center">
              {/* Recherche */}
              <div className="relative flex-1 w-full">
                <input
                  type="text"
                  placeholder={content.search}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md pl-10"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>
              
              {/* Bouton de tri */}
              <button
                onClick={() => setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc')}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors whitespace-nowrap"
                title={sortOrder === 'desc' ? 'Trier du plus ancien au plus récent' : 'Trier du plus récent au plus ancien'}
              >
                {sortOrder === 'desc' ? (
                  <>
                    <ArrowDown className="w-4 h-4" />
                    <span className="text-sm">Plus récent</span>
                  </>
                ) : (
                  <>
                    <ArrowUp className="w-4 h-4" />
                    <span className="text-sm">Plus ancien</span>
                  </>
                )}
              </button>
            </div>
            
            {/* Compteur de résultats */}
            <div className="mt-4 text-center text-sm text-gray-600">
              {sortedWorks.length === works.length ? (
                <span>{works.length} réalisation{works.length > 1 ? 's' : ''}</span>
              ) : (
                <span>{sortedWorks.length} résultat{sortedWorks.length > 1 ? 's' : ''} sur {works.length}</span>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {sortedWorks.map((work) => (
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
                  {/* Badge nombre de photos */}
                  <div className="absolute top-2 right-2 bg-black/70 backdrop-blur-sm text-white px-2 py-1 rounded-md flex items-center gap-1 text-xs font-medium">
                    <Camera className="w-3 h-3" />
                    <span>{getPhotoCount(work)}</span>
                  </div>
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
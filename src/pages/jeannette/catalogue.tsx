import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ChevronDown, Globe, Search } from 'lucide-react'
import { GetStaticProps } from 'next';
import fs from 'fs';
import path from 'path';
import Papa from 'papaparse';
import { Vitrail } from '@/types/images';

// Définitions des types
type Language = 'fr' | 'en';

// ... (autres types pour le contenu statique de l'interface)
interface Nav { home: string; biography: string; catalogue: string; exhibitions: string; }
interface FamilyMembers { title: string; jeannette: string; frederic: string; camille: string; }
interface Filters { all: string; year: string; location: string; }
interface Footer { rights: string; }
interface ContentStructure { nav: Nav; familyMembers: FamilyMembers; title: string; search: string; filters: Filters; footer: Footer; }
interface Content { fr: ContentStructure; en: ContentStructure; }


// Le composant reçoit maintenant 'works' en tant que prop
export default function CatalogueRaisonne({ works }: { works: Vitrail[] }) {
  const [language, setLanguage] = useState<Language>('fr')
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')

  // Le contenu statique pour les textes de l'interface est conservé
  const content: Content = {
    fr: {
      nav: { home: "Accueil", biography: "Biographie", catalogue: "Catalogue Raisonné", exhibitions: "Expositions" },
      familyMembers: { title: "Artistes de la famille", jeannette: "Jeannette Weiss Gruber", frederic: "Frédéric Weiss", camille: "Camille Weiss" },
      title: "Catalogue Raisonné de Jeannette Weiss Gruber",
      search: "Rechercher une œuvre...",
      filters: { all: "Toutes les œuvres", year: "Année", location: "Lieu" },
      footer: { rights: "Tous droits réservés." }
    },
    en: {
      nav: { home: "Home", biography: "Biography", catalogue: "Catalogue Raisonné", exhibitions: "Exhibitions" },
      familyMembers: { title: "Family Artists", jeannette: "Jeannette Weiss Gruber", frederic: "Frédéric Weiss", camille: "Camille Weiss" },
      title: "Catalogue Raisonné of Jeannette Weiss Gruber",
      search: "Search for a work...",
      filters: { all: "All works", year: "Year", location: "Location" },
      footer: { rights: "All rights reserved." }
    }
  };

  const t: ContentStructure = content[language];

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
            <div className="relative">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center text-gray-700 hover:text-blue-600 transition-colors"
              >
                Jeannette Weiss Gruber
                <ChevronDown className="ml-1 h-4 w-4" />
              </button>
              {isDropdownOpen && (
                <div className="absolute top-full left-0 bg-white shadow-md rounded-md py-2 mt-1">
                  <Link href="/jeannette" className="block px-4 py-2 hover:bg-gray-100">{t.familyMembers.jeannette}</Link>
                  <Link href="/frederic" className="block px-4 py-2 hover:bg-gray-100">{t.familyMembers.frederic}</Link>
                  <Link href="/camille" className="block px-4 py-2 hover:bg-gray-100">{t.familyMembers.camille}</Link>
                </div>
              )}
            </div>
          </div>
          <ul className="flex space-x-6">
            <li><Link href="/jeannette" className="hover:text-blue-600 transition-colors">{t.nav.home}</Link></li>
            <li><Link href="/jeannette/biography" className="hover:text-blue-600 transition-colors">{t.nav.biography}</Link></li>
            <li><Link href="/jeannette/catalogue" className="text-blue-600">{t.nav.catalogue}</Link></li>
            <li><Link href="/jeannette/carte" className="hover:text-blue-600 transition-colors">Carte</Link></li>
            <li><Link href="/jeannette/exhibitions" className="hover:text-blue-600 transition-colors">{t.nav.exhibitions}</Link></li>
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
          <h1 className="text-4xl md:text-5xl font-light mb-8 text-center">{t.title}</h1>
          
          <div className="mb-8">
            <div className="relative">
              <input
                type="text"
                placeholder={t.search}
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
          <p>&copy; {new Date().getFullYear()} Weiss-Gruber Family Art. {t.footer.rights}</p>
        </div>
      </footer>
    </div>
  )
}

// getStaticProps lit les données du fichier CSV au moment de la construction
export const getStaticProps: GetStaticProps = async () => {
  const csvFilePath = path.join(process.cwd(), 'vitraux_metadata.csv');
  const csvFileContent = fs.readFileSync(csvFilePath, 'utf-8');

  const result = Papa.parse(csvFileContent, {
    header: true,
    skipEmptyLines: true,
  });

  // Traitement pour parser la colonne gallery_images
    const works = (result.data as Record<string, any>[]).map(work => {
    let gallery_images = [];
    if (typeof work.gallery_images === 'string' && work.gallery_images.trim().startsWith('[')) {
      try {
        gallery_images = JSON.parse(work.gallery_images);
      } catch (e) {
        console.error(`Erreur de parsing JSON pour l'œuvre ${work.id}:`, e);
        gallery_images = [];
      }
    }
    return { ...work, gallery_images };
  });

  return {
    props: {
      works: works,
    },
  };
};
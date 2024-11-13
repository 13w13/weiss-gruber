import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ChevronDown, Globe, Search } from 'lucide-react'

// Type definitions
type Language = 'fr' | 'en';

interface Nav {
  home: string;
  biography: string;
  catalogue: string;
  exhibitions: string;
}

interface FamilyMembers {
  title: string;
  jeannette: string;
  frederic: string;
  camille: string;
}

interface Work {
  id: number;
  title: string;
  year: number;
  location: string;
  image: string;
}

interface Filters {
  all: string;
  year: string;
  location: string;
}

interface Footer {
  rights: string;
}

interface ContentStructure {
  nav: Nav;
  familyMembers: FamilyMembers;
  title: string;
  search: string;
  filters: Filters;
  works: Work[];
  footer: Footer;
}

interface Content {
  fr: ContentStructure;
  en: ContentStructure;
}

export default function CatalogueRaisonne() {
  const [language, setLanguage] = useState<Language>('fr')
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')

  const content: Content = {
    fr: {
      nav: {
        home: "Accueil",
        biography: "Biographie",
        catalogue: "Catalogue Raisonné",
        exhibitions: "Expositions",
      },
      familyMembers: {
        title: "Artistes de la famille",
        jeannette: "Jeannette Weiss Gruber",
        frederic: "Frédéric Weiss",
        camille: "Camille Weiss"
      },
      title: "Catalogue Raisonné de Jeannette Weiss Gruber",
      search: "Rechercher une œuvre...",
      filters: {
        all: "Toutes les œuvres",
        year: "Année",
        location: "Lieu"
      },
      works: [
        { id: 1, title: "Vitrail de la Cathédrale Saint-Jean", year: 1969, location: "Lyon, France", image: "/api/placeholder/400/300" },
        { id: 2, title: "Rosace de l'Église Saint-Pierre", year: 1975, location: "Paris, France", image: "/api/placeholder/400/300" },
        { id: 3, title: "Vitraux de la Chapelle Notre-Dame", year: 1982, location: "Strasbourg, France", image: "/api/placeholder/400/300" },
        { id: 4, title: "Ensemble de la Cathédrale de Beauvais", year: 1985, location: "Beauvais, France", image: "/api/placeholder/400/300" },
        { id: 5, title: "Vitraux de l'Abbatiale Saint-Jean", year: 2001, location: "Saverne, France", image: "/api/placeholder/400/300" },
      ],
      footer: {
        rights: "Tous droits réservés."
      }
    },
    en: {
      nav: {
        home: "Home",
        biography: "Biography",
        catalogue: "Catalogue Raisonné",
        exhibitions: "Exhibitions",
      },
      familyMembers: {
        title: "Family Artists",
        jeannette: "Jeannette Weiss Gruber",
        frederic: "Frédéric Weiss",
        camille: "Camille Weiss"
      },
      title: "Catalogue Raisonné of Jeannette Weiss Gruber",
      search: "Search for a work...",
      filters: {
        all: "All works",
        year: "Year",
        location: "Location"
      },
      works: [
        { id: 1, title: "Stained Glass of Saint John's Cathedral", year: 1969, location: "Lyon, France", image: "/api/placeholder/400/300" },
        { id: 2, title: "Rose Window of Saint Peter's Church", year: 1975, location: "Paris, France", image: "/api/placeholder/400/300" },
        { id: 3, title: "Stained Glass of Notre-Dame Chapel", year: 1982, location: "Strasbourg, France", image: "/api/placeholder/400/300" },
        { id: 4, title: "Beauvais Cathedral Ensemble", year: 1985, location: "Beauvais, France", image: "/api/placeholder/400/300" },
        { id: 5, title: "Stained Glass of Saint John's Abbey", year: 2001, location: "Saverne, France", image: "/api/placeholder/400/300" },
      ],
      footer: {
        rights: "All rights reserved."
      }
    }
  }

  const t: ContentStructure = content[language]

  const filteredWorks = t.works.filter(work =>
    work.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    work.year.toString().includes(searchTerm) ||
    work.location.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <header className="fixed top-0 left-0 right-0 z-50 bg-white bg-opacity-90 backdrop-blur-sm border-b border-gray-200">
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
                  <Link href="/jeannette" className="block px-4 py-2 hover:bg-gray-100">
                    {t.familyMembers.jeannette}
                  </Link>
                  <Link href="/frederic" className="block px-4 py-2 hover:bg-gray-100">
                    {t.familyMembers.frederic}
                  </Link>
                  <Link href="/camille" className="block px-4 py-2 hover:bg-gray-100">
                    {t.familyMembers.camille}
                  </Link>
                </div>
              )}
            </div>
          </div>
          <ul className="flex space-x-6">
            <li><Link href="/jeannette" className="hover:text-blue-600 transition-colors">{t.nav.home}</Link></li>
            <li><Link href="/jeannette/biography" className="hover:text-blue-600 transition-colors">{t.nav.biography}</Link></li>
            <li><Link href="/jeannette/catalogue" className="text-blue-600">{t.nav.catalogue}</Link></li>
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
              <div key={work.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="relative h-64">
                  <Image
                    src={work.image}
                    alt={work.title}
                    width={400}
                    height={300}
                    className="object-cover"
                  />
                </div>
                <div className="p-4">
                  <h3 className="text-xl font-semibold mb-2">{work.title}</h3>
                  <p className="text-gray-600">{work.year}</p>
                  <p className="text-gray-600">{work.location}</p>
                </div>
              </div>
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

import Link from 'next/link'
import { ChevronDown, Globe } from 'lucide-react'
import { useState } from 'react'

// Simple bilingual support
type Language = 'fr' | 'en'

interface Nav {
  home: string
  biography: string
  catalogue: string
  publications: string
}

interface FamilyMembers {
  title: string
  jeannette: string
  frederic: string
  camille: string
}

interface Footer {
  rights: string
}

interface ContentStructure {
  nav: Nav
  familyMembers: FamilyMembers
  title: string
  intro: string
  publications: string[]
  footer: Footer
}

interface Content {
  fr: ContentStructure
  en: ContentStructure
}

export default function PublicationsPage() {
  const [language, setLanguage] = useState<Language>('fr')
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

  const content: Content = {
    fr: {
      nav: {
        home: 'Accueil',
        biography: 'Biographie',
        catalogue: 'Catalogue Raisonné',
        publications: 'Publications',
      },
      familyMembers: {
        title: 'Artistes de la famille',
        jeannette: 'Jeannette Weiss Gruber',
        frederic: 'Frédéric Weiss',
        camille: 'Camille Weiss',
      },
      title: 'Publications sur Jeannette Weiss Gruber',
      intro: "Sélection d'ouvrages et d'articles évoquant l'œuvre ou la carrière de Jeannette Weiss Gruber.",
      publications: [
        'Le vitrail, revue des métiers d’art, novembre 1982',
        'Un siècle de vitrail en Picardie, DRAC d’Amiens, 1989',
        'Le vitrail, Éditions du Cerf, Catherine Brissac, 1990',
        'Mains et merveilles : Les artisans de qualité à Paris, Clémence Vernet, 1992',
        'Les couleurs du ciel, Éditions Gaud, 2002',
        'Amiens : Les verrières de la cathédrale, Images du patrimoine de Picardie, 2003',
        'Revue du Musée des Confluences – série d’articles sur les travaux dans la cathédrale de Lyon : oct. 1999, nov. 1999, déc. 1999, fév. 2000 et été 2001',
      ],
      footer: { rights: 'Tous droits réservés.' },
    },
    en: {
      nav: {
        home: 'Home',
        biography: 'Biography',
        catalogue: 'Catalogue Raisonné',
        publications: 'Publications',
      },
      familyMembers: {
        title: 'Family Artists',
        jeannette: 'Jeannette Weiss Gruber',
        frederic: 'Frédéric Weiss',
        camille: 'Camille Weiss',
      },
      title: 'Publications about Jeannette Weiss Gruber',
      intro: 'Selection of books and articles mentioning the work or career of Jeannette Weiss Gruber.',
      publications: [
        'Le vitrail, Revue des Métiers d\'art, November 1982',
        'A Century of Stained Glass in Picardy, DRAC Amiens, 1989',
        'Le vitrail, Cerf Editions, Catherine Brissac, 1990',
        'Hands & Wonders, quality artisans in Paris, Clémence Vernet, 1992',
        'Colours of the Sky, Gaud Editions, 2002',
        'Amiens, the Cathedral\'s Windows, Picardy Heritage Images, 2003',
        'Musée des Confluences Review, series on the Lyon Cathedral works: Oct 1999 to Summer 2001',
      ],
      footer: { rights: 'All rights reserved.' },
    },
  }

  const t = content[language]

  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur border-b border-gray-200">
        <nav className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <Link href="/" className="text-xl font-semibold mr-6">Weiss-Gruber</Link>
            <div className="relative">
              <button onClick={() => setIsDropdownOpen(!isDropdownOpen)} className="flex items-center text-gray-700 hover:text-blue-600 transition-colors">
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
            <li><Link href="/jeannette/catalogue" className="hover:text-blue-600 transition-colors">{t.nav.catalogue}</Link></li>
            <li><Link href="/jeannette/carte" className="hover:text-blue-600 transition-colors">Carte</Link></li>
            <li><Link href="/jeannette/publications" className="text-blue-600">{t.nav.publications}</Link></li>
            <li>
              <button onClick={() => setLanguage(language === 'fr' ? 'en' : 'fr')} className="flex items-center hover:text-blue-600 transition-colors">
                <Globe className="w-4 h-4 mr-1" />
                {language.toUpperCase()}
              </button>
            </li>
          </ul>
        </nav>
      </header>

      {/* Main */}
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-6 md:px-4 max-w-xl">
          <h1 className="text-4xl md:text-5xl font-light mb-6 text-center">{t.title}</h1>
          <p className="text-center text-gray-700 mb-12">{t.intro}</p>

          <ul className="space-y-4 list-disc pl-5 text-gray-800">
            {t.publications.map((pub, idx) => (
              <li key={idx}>{pub}</li>
            ))}
          </ul>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-100 py-8">
        <div className="container mx-auto px-4 text-center text-gray-600">
          <p>&copy; {new Date().getFullYear()} Weiss-Gruber Family Art. {t.footer.rights}</p>
        </div>
      </footer>
    </div>
  )
}

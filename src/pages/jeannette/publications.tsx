import Link from 'next/link'
import { ChevronDown, Download } from 'lucide-react'
import { useState } from 'react'


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
      title: 'Publications et expositions de groupe sur le vitrail',
      intro: "Principales publications et expositions de groupe mentionnant l'œuvre de Jeannette Weiss Gruber.",
      publications: [
        'Premier salon du vitrail, Centre International du Vitrail, Chartres, 1980 – Catalogue et exposition',
        'Le vitrail, Revue des Métiers d\'Art, novembre 1982',
        'Le vitrail français contemporain, C.I.V., Chartres, Françoise Perrot, 1984 – Exposition au C.I.V.',
        'Vitraux, Chambre Syndicale des Maîtres Verriers, C.I.V., Chartres, 1986',
        'Un siècle de vitrail en Picardie, D.R.A.C. d\'Amiens, 1989',
        'Le vitrail, Éditions du Cerf, Catherine Brisac, 1990',
        'Mains et Merveilles : Les artisans de qualité à Paris, Clémence Vernet, 1992',
        'Le vitrail : Vocabulaire typologique et technique, L\'Inventaire général, Nicole Blondel, Nathalie Frachon, 1993',
        'Revues Confluences : 5 numéros avec mes créations dans la cathédrale de Lyon – oct. 1999, nov. 1999, déc. 1999, fév. 2000, été 2001',
        'La cathédrale de Beauvais, L\'Inventaire Image du Patrimoine, 2000',
        'Corpus vitrearum, News letters 48, 2001',
        'Les couleurs du ciel, Éditions Gaud, exposition Chartres (C.I.V.), 2002',
        'Amiens : Les verrières de la cathédrale, Images du Patrimoine de Picardie, 2003',
      ],
      footer: { rights: 'Tous droits réservés.' },
    },
    en: {
      nav: {
        home: 'Accueil',
        biography: 'Biographie',
        catalogue: 'Catalogue Raisonné',
        publications: 'Publications',
      },
      familyMembers: {
        title: 'Family Artists',
        jeannette: 'Jeannette Weiss Gruber',
        frederic: 'Frédéric Weiss',
        camille: 'Camille Weiss',
      },
      title: 'Publications and Group Exhibitions on Stained Glass',
      intro: 'Main publications and group exhibitions featuring the work of Jeannette Weiss Gruber.',
      publications: [
        'First Stained Glass Salon, International Center of Stained Glass, Chartres, 1980 – Catalog and exhibition',
        'Le vitrail, Revue des Métiers d\'Art, November 1982',
        'Contemporary French Stained Glass, C.I.V., Chartres, Françoise Perrot, 1984 – Exhibition at C.I.V.',
        'Vitraux, Master Glassmakers Union, C.I.V., Chartres, 1986',
        'A Century of Stained Glass in Picardy, D.R.A.C. Amiens, 1989',
        'Le vitrail, Cerf Editions, Catherine Brisac, 1990',
        'Hands & Wonders: Quality Artisans in Paris, Clémence Vernet, 1992',
        'Stained Glass: Typological and Technical Vocabulary, General Inventory, Nicole Blondel, Nathalie Frachon, 1993',
        'Confluences Magazine: 5 issues featuring my creations in Lyon Cathedral – Oct. 1999, Nov. 1999, Dec. 1999, Feb. 2000, Summer 2001',
        'Beauvais Cathedral, Inventory Heritage Images, 2000',
        'Corpus vitrearum, News letters 48, 2001',
        'Colors of the Sky, Gaud Editions, Chartres exhibition (C.I.V.), 2002',
        'Amiens: The Cathedral\'s Windows, Picardy Heritage Images, 2003',
      ],
      footer: { rights: 'All rights reserved.' },
    },
  }

  const t = content.fr

  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur border-b border-gray-200">
        <nav className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <Link href="/jeannette" className="text-xl font-semibold mr-6">Weiss-Gruber</Link>
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

          <div className="mt-12 text-center">
            <a 
              href="https://weiss-gruber-jeanette.s3.fr-par.scw.cloud/brochure%20vitrail.pdf" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 underline underline-offset-4 transition-colors"
            >
              <Download className="w-4 h-4" />
              Télécharger la plaquette PDF réalisée en 2005 référençant les œuvres préférées de Jeannette Weiss Gruber
            </a>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-100 py-8">
        <div className="container mx-auto px-4 text-center text-gray-600">
          <p>&copy; {new Date().getFullYear()} Weiss-Gruber. Tous droits réservés.</p>
        </div>
      </footer>
    </div>
  )
}

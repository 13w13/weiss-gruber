import Link from 'next/link'
import { Download } from 'lucide-react'


interface Nav {
  home: string
  biography: string
  catalogue: string
  publications: string
}

interface Footer {
  rights: string
}

interface ContentStructure {
  nav: Nav
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
  const content: Content = {
    fr: {
      nav: {
        home: 'Accueil',
        biography: 'Biographie',
        catalogue: 'Catalogue Raisonné',
        publications: 'Publications',
      },
      title: 'Publications',
      intro: "Principales publications mentionnant l'œuvre de Jeannette Weiss Gruber.",
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
          <Link href="/jeannette" className="text-xl font-semibold">Jeannette Weiss Gruber</Link>
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
        <div className="container mx-auto px-6 md:px-8 max-w-6xl">
          <h1 className="text-4xl md:text-5xl font-light mb-4 text-center">{t.title}</h1>
          <p className="text-center text-gray-600 mb-16 text-lg">{t.intro}</p>

          {/* Publications list with better spacing */}
          <div className="bg-gray-50 rounded-lg p-8 md:p-10 mb-20">
            <ul className="space-y-3 text-gray-800 max-w-4xl mx-auto">
              {t.publications.map((pub, idx) => (
                <li key={idx} className="flex items-start gap-3 leading-relaxed">
                  <span className="text-blue-600 mt-1.5 flex-shrink-0">•</span>
                  <span className="text-base">{pub}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Section Monuments Historiques */}
          <div className="border-t border-gray-200 pt-16">
            <p className="text-center text-gray-600 mb-12 italic max-w-3xl mx-auto text-lg">
              Ce site présente uniquement les œuvres préférées de Jeannette Weiss Gruber. Elle a cependant participé à de nombreuses réalisations dont voici une liste non exhaustive :
            </p>
            
            <div className="grid md:grid-cols-2 gap-6 text-gray-800">
              <div className="bg-white border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow">
                <h3 className="font-semibold text-lg mb-2 text-gray-900">Église Saint Jean Baptiste de Sceaux <span className="text-sm font-normal text-gray-500">(Haut-de-Seine)</span></h3>
                <p className="text-sm text-gray-700">1955. Rosace de la façade.</p>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow">
                <h3 className="font-semibold text-lg mb-2 text-gray-900">Collégiale de Mantes <span className="text-sm font-normal text-gray-500">(Yvelines)</span></h3>
                <p className="text-sm text-gray-700">1960. Triplet de la façade sous la rosace du XIIIᵉ siècle.</p>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow">
                <h3 className="font-semibold text-lg mb-2 text-gray-900">Église de Saint Crépin aux Bois</h3>
                <p className="text-sm text-gray-700">1964. Deux baies du chœur.</p>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow">
                <h3 className="font-semibold text-lg mb-2 text-gray-900">Église de Pierrefonds <span className="text-sm font-normal text-gray-500">(Oise)</span></h3>
                <p className="text-sm text-gray-700">1965. Trois baies du chœur.</p>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow">
                <h3 className="font-semibold text-lg mb-2 text-gray-900">Église de Caudebec-en-Caux <span className="text-sm font-normal text-gray-500">(Seine-Maritime)</span></h3>
                <p className="text-sm text-gray-700">1966. Baie axe du chœur.</p>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow">
                <h3 className="font-semibold text-lg mb-2 text-gray-900">Cathédrale Primatiale Saint Jean de Lyon <span className="text-sm font-normal text-gray-500">(Rhône)</span></h3>
                <p className="text-sm text-gray-700 mb-1">1969. Baie est de la chapelle de la Vierge.</p>
                <p className="text-sm text-gray-700 mb-1">1970. Baie sud de la chapelle de la Vierge. Pour la 2ᵉ baie : maquette et carton grandeur.</p>
                <p className="text-sm text-gray-700">1978-79. Deux baies nord de la chapelle Saint Joseph.</p>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow">
                <h3 className="font-semibold text-lg mb-2 text-gray-900">Église Saint Étienne de Beauvais <span className="text-sm font-normal text-gray-500">(Oise)</span></h3>
                <p className="text-sm text-gray-700 mb-1">1981. Baie du bas coté du chœur est.</p>
                <p className="text-sm text-gray-700 mb-1">1984. Compléments de vitraux dépareillés du XVIᵉ siècle dans deux baies bas coté sud.</p>
                <p className="text-sm text-gray-700 mb-1">1988. Une baie bas côté nord.</p>
                <p className="text-sm text-gray-700">1989. Compléments de vitraux dépareillés du XVIᵉ et XIXᵉ siècle dans une baie bas coté sud.</p>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow">
                <h3 className="font-semibold text-lg mb-2 text-gray-900">Église de Kerfeunten <span className="text-sm font-normal text-gray-500">(Finistère)</span></h3>
                <p className="text-sm text-gray-700 mb-1">1981. Une baie de la nef nord.</p>
                <p className="text-sm text-gray-700">1984. Seconde baie de la nef nord.</p>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow">
                <h3 className="font-semibold text-lg mb-2 text-gray-900">Église d&apos;Etioles <span className="text-sm font-normal text-gray-500">(Essonne)</span></h3>
                <p className="text-sm text-gray-700 mb-1">1981. Un vitrail de façade.</p>
                <p className="text-sm text-gray-700">Un vitrail dans la nef nord.</p>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow">
                <h3 className="font-semibold text-lg mb-2 text-gray-900">Chapelle de Villecroze <span className="text-sm font-normal text-gray-500">(Var)</span></h3>
                <p className="text-sm text-gray-700">1982. Cinq petits vitraux et un oculus.</p>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow">
                <h3 className="font-semibold text-lg mb-2 text-gray-900">Église de Darmannes <span className="text-sm font-normal text-gray-500">(Haute-Marne)</span></h3>
                <p className="text-sm text-gray-700 mb-1">1984. Quatre vitraux de la nef.</p>
                <p className="text-sm text-gray-700 mb-1">1984. Deux vitraux dans le transept.</p>
                <p className="text-sm text-gray-700">1985. Cinq baies dans le chœur.</p>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow">
                <h3 className="font-semibold text-lg mb-2 text-gray-900">Cathédrale de Beauvais <span className="text-sm font-normal text-gray-500">(Oise)</span></h3>
                <p className="text-sm text-gray-700">1985. Une baie dans une chapelle sud du transept. 25 m² de création pour accompagner deux donateurs du XVᵉ.</p>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow">
                <h3 className="font-semibold text-lg mb-2 text-gray-900">Église de Champagne sur Oise <span className="text-sm font-normal text-gray-500">(Oise)</span></h3>
                <p className="text-sm text-gray-700 mb-1">1986. Douze vitraux dans la nef.</p>
                <p className="text-sm text-gray-700 mb-1">Une baie dans un portail de la nef sud.</p>
                <p className="text-sm text-gray-700 mb-1">Deux baies dans les bras du transept nord et sud.</p>
                <p className="text-sm text-gray-700">Une petite rosace de façade.</p>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow">
                <h3 className="font-semibold text-lg mb-2 text-gray-900">Église de Pont Sainte Maxence <span className="text-sm font-normal text-gray-500">(Oise)</span></h3>
                <p className="text-sm text-gray-700 mb-1">1987. Deux baies de la nef sud en alternance avec Gilles ROUSVOAL.</p>
                <p className="text-sm text-gray-700 mb-1">1988. Une baie de la nef nord.</p>
                <p className="text-sm text-gray-700">1988. Une petite rosace de façade.</p>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow">
                <h3 className="font-semibold text-lg mb-2 text-gray-900">Église Notre Dame de Niort</h3>
                <p className="text-sm text-gray-700">1991. Baie du chœur. Création de compléments et restauration pour accompagner un arbre de Jessé du XVᵉ remanié au XVIIᵉ et au XIXᵉ.</p>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow">
                <h3 className="font-semibold text-lg mb-2 text-gray-900">Cathédrale d&apos;Amiens <span className="text-sm font-normal text-gray-500">(Somme)</span></h3>
                <p className="text-sm text-gray-700 mb-2">Réaménagement des restes de vitraux de deux baies du chœur dans trois baies de la chapelle Saint François d&apos;Assise.</p>
                <p className="text-sm text-gray-700 mb-1">1991. Première baie.</p>
                <p className="text-sm text-gray-700 mb-1">1993. Seconde baie.</p>
                <p className="text-sm text-gray-700">1997. Troisième baie.</p>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow">
                <h3 className="font-semibold text-lg mb-2 text-gray-900">Église de l&apos;Enclos Paroissial de la Martyre <span className="text-sm font-normal text-gray-500">(Finistère)</span></h3>
                <p className="font-medium text-sm text-gray-900 mt-2">Nef nord</p>
                <p className="text-sm text-gray-700 mb-1">1994. Compléments de l&apos;arbre de Jessé du XVIᵉ Breton.</p>
                <p className="text-sm text-gray-700 mb-1">1994. Cinq baies en harmonie avec l&apos;arbre de Jessé.</p>
                <p className="text-sm text-gray-700 mb-2">1994. Oculus de façade.</p>
                <p className="font-medium text-sm text-gray-900 mt-2">Nef sud</p>
                <p className="text-sm text-gray-700 mb-1">1996. Deux baies.</p>
                <p className="text-sm text-gray-700">1996. Deux vitraux et un réseau.</p>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow">
                <h3 className="font-semibold text-lg mb-2 text-gray-900">Église Abbatiale de Saint Jean de Saverne <span className="text-sm font-normal text-gray-500">(Bas-Rhin)</span></h3>
                <p className="text-sm text-gray-700">2001. Dix-huit vitraux dans les nefs nord et sud.</p>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow">
                <h3 className="font-semibold text-lg mb-2 text-gray-900">Église de Jouy le Comte <span className="text-sm font-normal text-gray-500">(Val d&apos;Oise)</span></h3>
                <p className="text-sm text-gray-700">2001. Une baie dans une chapelle sud.</p>
              </div>
            </div>
          </div>

          <div className="mt-16 text-center">
            <a 
              href="https://weiss-gruber-jeanette.s3.fr-par.scw.cloud/brochure%20vitrail.pdf" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 px-6 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-md hover:shadow-lg"
            >
              <Download className="w-5 h-5" />
              <span className="font-medium">Télécharger la plaquette PDF (2005)</span>
            </a>
            <p className="text-sm text-gray-500 mt-3">Référençant les œuvres préférées de Jeannette Weiss Gruber</p>
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

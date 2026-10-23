import { Download } from 'lucide-react'
import { IMAGE_BASE_URL } from '@/lib/images'
import { useLocale } from '@/i18n'
import PageMeta from '@/components/layout/PageMeta'
import SiteHeader from '@/components/layout/SiteHeader'
import SiteFooter from '@/components/layout/SiteFooter'

interface ContentStructure {
  metaDescription: string
  title: string
  intro: string
  publications: string[]
  worksIntro: string
  brochure: string
  brochureCaption: string
}

type Line = { fr: string; en: string; heading?: boolean }

// Réalisations : les noms d'édifices restent en français, les descriptions sont traduites
const MONUMENTS: { name: string; dept?: string; lines: Line[] }[] = [
  { name: 'Église Saint Jean Baptiste de Sceaux', dept: 'Haut-de-Seine', lines: [
    { fr: '1955. Rosace de la façade.', en: '1955. Façade rose window.' },
  ] },
  { name: 'Collégiale de Mantes', dept: 'Yvelines', lines: [
    { fr: '1960. Triplet de la façade sous la rosace du XIIIᵉ siècle.', en: '1960. Façade triplet beneath the 13th-century rose window.' },
  ] },
  { name: 'Église de Saint Crépin aux Bois', lines: [
    { fr: '1964. Deux baies du chœur.', en: '1964. Two choir windows.' },
  ] },
  { name: 'Église de Pierrefonds', dept: 'Oise', lines: [
    { fr: '1965. Trois baies du chœur.', en: '1965. Three choir windows.' },
  ] },
  { name: 'Église de Caudebec-en-Caux', dept: 'Seine-Maritime', lines: [
    { fr: '1966. Baie axiale du chœur.', en: '1966. Axial choir window.' },
  ] },
  { name: 'Cathédrale Primatiale Saint Jean de Lyon', dept: 'Rhône', lines: [
    { fr: '1969. Baie est de la chapelle de la Vierge.', en: '1969. East window of the Lady Chapel.' },
    { fr: '1970. Baie sud de la chapelle de la Vierge. Pour la 2ᵉ baie : maquette et carton grandeur.', en: '1970. South window of the Lady Chapel. For the second window: maquette and full-size cartoon.' },
    { fr: '1978-79. Deux baies nord de la chapelle Saint Joseph.', en: '1978–79. Two north windows of the Chapel of Saint Joseph.' },
  ] },
  { name: 'Église Saint Étienne de Beauvais', dept: 'Oise', lines: [
    { fr: '1981. Baie du bas coté du chœur est.', en: '1981. Window in the east choir aisle.' },
    { fr: '1984. Compléments de vitraux dépareillés du XVIᵉ siècle dans deux baies bas coté sud.', en: '1984. Infills for mismatched 16th-century stained glass in two south-aisle windows.' },
    { fr: '1988. Une baie bas côté nord.', en: '1988. One north-aisle window.' },
    { fr: '1989. Compléments de vitraux dépareillés du XVIᵉ et XIXᵉ siècle dans une baie bas coté sud.', en: '1989. Infills for mismatched 16th- and 19th-century stained glass in one south-aisle window.' },
  ] },
  { name: 'Église de Kerfeunten', dept: 'Finistère', lines: [
    { fr: '1981. Une baie de la nef nord.', en: '1981. One window in the north nave.' },
    { fr: '1984. Seconde baie de la nef nord.', en: '1984. Second window in the north nave.' },
  ] },
  { name: "Église d'Etioles", dept: 'Essonne', lines: [
    { fr: '1981. Un vitrail de façade.', en: '1981. One façade window.' },
    { fr: 'Un vitrail dans la nef nord.', en: 'One window in the north nave.' },
  ] },
  { name: 'Chapelle de Villecroze', dept: 'Var', lines: [
    { fr: '1982. Cinq petits vitraux et un oculus.', en: '1982. Five small windows and an oculus.' },
  ] },
  { name: 'Église de Darmannes', dept: 'Haute-Marne', lines: [
    { fr: '1984. Quatre vitraux de la nef.', en: '1984. Four nave windows.' },
    { fr: '1984. Deux vitraux dans le transept.', en: '1984. Two windows in the transept.' },
    { fr: '1985. Cinq baies dans le chœur.', en: '1985. Five windows in the choir.' },
  ] },
  { name: 'Cathédrale de Beauvais', dept: 'Oise', lines: [
    { fr: '1985. Une baie dans une chapelle sud du transept. 25 m² de création pour accompagner deux donateurs du XVᵉ.', en: '1985. One window in a south transept chapel: 25 m² of new glass accompanying two 15th-century donor figures.' },
  ] },
  { name: 'Église de Champagne sur Oise', dept: 'Oise', lines: [
    { fr: '1986. Douze vitraux dans la nef.', en: '1986. Twelve windows in the nave.' },
    { fr: 'Une baie dans un portail de la nef sud.', en: 'One window in a south nave doorway.' },
    { fr: 'Deux baies dans les bras du transept nord et sud.', en: 'Two windows in the north and south transept arms.' },
    { fr: 'Une petite rosace de façade.', en: 'A small façade rose window.' },
  ] },
  { name: 'Église de Pont Sainte Maxence', dept: 'Oise', lines: [
    { fr: '1987. Deux baies de la nef sud en alternance avec Gilles ROUSVOAL.', en: '1987. Two south nave windows, alternating with Gilles ROUSVOAL.' },
    { fr: '1988. Une baie de la nef nord.', en: '1988. One north nave window.' },
    { fr: '1988. Une petite rosace de façade.', en: '1988. A small façade rose window.' },
  ] },
  { name: 'Église Notre Dame de Niort', lines: [
    { fr: '1991. Baie du chœur. Création de compléments et restauration pour accompagner un arbre de Jessé du XVᵉ remanié au XVIIᵉ et au XIXᵉ.', en: '1991. Choir window. New infills and restoration accompanying a 15th-century Tree of Jesse reworked in the 17th and 19th centuries.' },
  ] },
  { name: "Cathédrale d'Amiens", dept: 'Somme', lines: [
    { fr: "Réaménagement des restes de vitraux de deux baies du chœur dans trois baies de la chapelle Saint François d'Assise.", en: 'Rearrangement of the surviving glass from two choir windows into three windows of the Chapel of Saint Francis of Assisi.' },
    { fr: '1991. Première baie.', en: '1991. First window.' },
    { fr: '1993. Seconde baie.', en: '1993. Second window.' },
    { fr: '1997. Troisième baie.', en: '1997. Third window.' },
  ] },
  { name: "Église de l'Enclos Paroissial de la Martyre", dept: 'Finistère', lines: [
    { fr: 'Nef nord', en: 'North nave', heading: true },
    { fr: "1994. Compléments de l'arbre de Jessé du XVIᵉ Breton.", en: '1994. Infills for the 16th-century Breton Tree of Jesse.' },
    { fr: "1994. Cinq baies en harmonie avec l'arbre de Jessé.", en: '1994. Five windows in harmony with the Tree of Jesse.' },
    { fr: '1994. Oculus de façade.', en: '1994. Façade oculus.' },
    { fr: 'Nef sud', en: 'South nave', heading: true },
    { fr: '1996. Deux baies.', en: '1996. Two windows.' },
    { fr: '1996. Deux vitraux et un réseau.', en: '1996. Two windows and a tracery.' },
  ] },
  { name: 'Église Abbatiale de Saint Jean de Saverne', dept: 'Bas-Rhin', lines: [
    { fr: '2001. Dix-huit vitraux dans les nefs nord et sud.', en: '2001. Eighteen windows in the north and south naves.' },
  ] },
  { name: 'Église de Jouy le Comte', dept: "Val d'Oise", lines: [
    { fr: '2001. Une baie dans une chapelle sud.', en: '2001. One window in a south chapel.' },
  ] },
]

export default function PublicationsPage() {
  const content: Record<'fr' | 'en', ContentStructure> = {
    fr: {
      metaDescription: 'Principales publications mentionnant l’œuvre de Jeannette Weiss Gruber, peintre-verrier (1934–2026).',
      title: 'Publications',
      intro: "Principales publications mentionnant l'œuvre de Jeannette Weiss Gruber.",
      worksIntro: 'Ce site présente uniquement les œuvres préférées de Jeannette Weiss Gruber. Elle a cependant participé à de nombreuses réalisations dont voici une liste non exhaustive :',
      brochure: 'Télécharger la plaquette PDF (2005)',
      brochureCaption: 'Référençant les œuvres préférées de Jeannette Weiss Gruber',
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
    },
    en: {
      metaDescription: 'Main publications mentioning the work of Jeannette Weiss Gruber, stained-glass painter (1934–2026).',
      title: 'Publications',
      intro: 'Main publications mentioning the work of Jeannette Weiss Gruber.',
      worksIntro: 'This site presents only the works Jeannette Weiss Gruber considered her favorites. She nevertheless took part in many other projects; here is a non-exhaustive list:',
      brochure: 'Download the PDF brochure (2005)',
      brochureCaption: 'Listing the works Jeannette Weiss Gruber considered her favorites',
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
    },
  }

  const locale = useLocale()
  const t = content[locale]

  return (
    <div className="min-h-screen flex flex-col bg-white text-gray-900">
      <PageMeta
        title={t.title}
        description={t.metaDescription}
        path="/jeannette/publications"
      />
      <SiteHeader />

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
              {t.worksIntro}
            </p>

            <div className="grid md:grid-cols-2 gap-6 text-gray-800">
              {MONUMENTS.map((m) => (
                <div key={m.name} className="bg-white border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow">
                  <h3 className="font-semibold text-lg mb-2 text-gray-900">
                    {m.name} {m.dept && <span className="text-sm font-normal text-gray-500">({m.dept})</span>}
                  </h3>
                  {m.lines.map((line, i) => (
                    line.heading
                      ? <p key={i} className="font-medium text-sm text-gray-900 mt-2">{line[locale]}</p>
                      : <p key={i} className="text-sm text-gray-700 mb-1">{line[locale]}</p>
                  ))}
                </div>
              ))}
            </div>
          </div>

          <div className="mt-16 text-center">
            <a 
              href={`${IMAGE_BASE_URL}/brochure%20vitrail.pdf`} 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 px-6 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-md hover:shadow-lg"
            >
              <Download className="w-5 h-5" />
              <span className="font-medium">{t.brochure}</span>
            </a>
            <p className="text-sm text-gray-500 mt-3">{t.brochureCaption}</p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <SiteFooter />
    </div>
  )
}

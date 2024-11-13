import Image from 'next/image'
import Link from 'next/link'
import { ChevronDown, Globe } from 'lucide-react'
import { useState } from 'react'

// Add type definitions
type Language = 'fr' | 'en';

interface Section {
  title: string;
  content: string[];
}

interface FamilyMembers {
  title: string;
  jeannette: string;
  frederic: string;
  camille: string;
}

interface Nav {
  home: string;
  biography: string;
  catalogue: string;
  exhibitions: string;
}

interface FamilyLegacy {
  title: string;
  content: string;
}

interface Footer {
  rights: string;
}

interface ContentStructure {
  nav: Nav;
  familyMembers: FamilyMembers;
  title: string;
  sections: Section[];
  familyLegacy: FamilyLegacy;
  footer: Footer;
}

interface Content {
  fr: ContentStructure;
  en: ContentStructure;
}

export default function BiographyPage() {
  const [language, setLanguage] = useState<Language>('fr')
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

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
      title: "Biographie de Jeannette Weiss Gruber",
      sections: [
        {
          title: "Jeunesse et Famille",
          content: [
            "Née le 1er juillet 1934 à Paris, Jeannette Weiss Gruber était destinée à une vie dans l'art. Elle est la fille de Jean-Jacques Gruber et la petite-fille de Jacques Gruber, tous deux maîtres verriers renommés. Ce riche héritage artistique allait façonner sa future carrière et sa vision artistique.",
            "En 1959, Jeannette épouse Bernard Weiss, après quoi elle commence à signer ses œuvres JWG, devenant professionnellement connue sous le nom de Jeannette Weiss Gruber."
          ]
        },
        {
          title: "Parcours Artistique",
          content: [
            "La carrière de Jeannette dans le vitrail commence en 1955 lorsqu'elle crée sa première œuvre pour l'Église Saint Jean Baptiste de Sceaux. De 1954 à 1969, elle travaille dans l'atelier Jacques Gruber, perfectionnant ses compétences et développant son style unique.",
            "En 1969, Jeannette fait un détour créatif au Québec, où elle explore de nouvelles expressions artistiques, notamment avec ses peintures sur aluminium, connues sous le nom d'\"aluchromies\". Cette période d'expérimentation dure jusqu'en 1973.",
            "À son retour à Paris en 1973, Jeannette commence à enseigner l'histoire de l'art à l'École américaine tout en poursuivant son travail dans le vitrail. En 1980, elle établit son propre atelier à la Villa d'Alésia, où elle créera nombre de ses œuvres les plus importantes."
          ]
        },
        {
          title: "Style Artistique et Technique",
          content: [
            "Jeannette Weiss Gruber est connue pour ses techniques innovantes et sa capacité à intégrer harmonieusement ses œuvres dans leur cadre architectural. Elle est connue pour utiliser des peignes et des éponges (depuis 1958) ou des pinceaux, selon les circonstances. Cette technique a notamment été utilisée dans la création de deux vitraux pour la chapelle Saint Joseph de la cathédrale primatiale Saint Jean de Lyon en 1978.",
            "Le blanc et le bleu sont ses couleurs préférées dans le vitrail. Fait intéressant, elle utilise des jumelles à l'envers pour imaginer le résultat final dans le bâtiment.",
            "Selon Aymerick Zublena, qui lui a remis la Médaille de la Restauration en 2001, \"Son objectif est d'insérer ses créations dans différents édifices en s'imprégnant du cadre architectural et de la lumière, avec une recherche d'harmonie et d'équilibre avec les autres vitraux lorsqu'ils existent, tout en évitant les pastiches.\""
          ]
        }
      ],
      familyLegacy: {
        title: "L'Héritage Artistique Weiss-Gruber",
        content: "Jeannette Weiss Gruber fait partie d'une lignée d'artistes talentueux. Sa famille comprend également Frédéric Weiss, un peintre renommé, et Camille Weiss, une sculptrice accomplie. Chacun a contribué de manière unique au monde de l'art, perpétuant un héritage créatif exceptionnel."
      },
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
      title: "Biography of Jeannette Weiss Gruber",
      sections: [
        {
          title: "Youth and Family",
          content: [
            "Born on July 1, 1934, in Paris, Jeannette Weiss Gruber was destined for a life in art. She is the daughter of Jean-Jacques Gruber and the granddaughter of Jacques Gruber, both renowned master glassmakers. This rich artistic heritage would shape her future career and artistic vision.",
            "In 1959, Jeannette married Bernard Weiss, after which she began signing her works as JWG, becoming professionally known as Jeannette Weiss Gruber."
          ]
        },
        {
          title: "Artistic Journey",
          content: [
            "Jeannette's career in stained glass began in 1955 when she created her first work for the Church of Saint John the Baptist in Sceaux. From 1954 to 1969, she worked in the Jacques Gruber workshop, honing her skills and developing her unique style.",
            "In 1969, Jeannette took a creative detour to Quebec, where she explored new artistic expressions, notably with her paintings on aluminum, known as \"aluchromies\". This period of experimentation lasted until 1973.",
            "Upon her return to Paris in 1973, Jeannette began teaching art history at the American School while continuing her work in stained glass. In 1980, she established her own workshop at Villa d'Alésia, where she would create many of her most important works."
          ]
        },
        {
          title: "Artistic Style and Technique",
          content: [
            "Jeannette Weiss Gruber is known for her innovative techniques and ability to harmoniously integrate her works into their architectural setting. She is known to use combs and sponges (since 1958) or brushes, depending on the circumstances. This technique was notably used in the creation of two stained glass windows for the Saint Joseph chapel of the Primatial Cathedral of Saint John in Lyon in 1978.",
            "White and blue are her favorite colors in stained glass. Interestingly, she uses binoculars backwards to imagine the final result in the building.",
            "According to Aymerick Zublena, who presented her with the Restoration Medal in 2001, \"Her goal is to insert her creations into different buildings by immersing herself in the architectural setting and light, seeking harmony and balance with other stained glass windows when they exist, while avoiding pastiches.\""
          ]
        }
      ],
      familyLegacy: {
        title: "The Weiss-Gruber Artistic Legacy",
        content: "Jeannette Weiss Gruber is part of a lineage of talented artists. Her family also includes Frédéric Weiss, a renowned painter, and Camille Weiss, an accomplished sculptor. Each has contributed uniquely to the art world, perpetuating an exceptional creative heritage."
      },
      footer: {
        rights: "All rights reserved."
      }
    }
  }

  const t: ContentStructure = content[language]

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
            <li><Link href="/jeannette/biography" className="text-blue-600">{t.nav.biography}</Link></li>
            <li><Link href="/jeannette/catalogue" className="hover:text-blue-600 transition-colors">{t.nav.catalogue}</Link></li>
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
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
              {t.sections.map((section, index) => (
                <section key={index} className="mb-12">
                  <h2 className="text-2xl font-semibold mb-4">{section.title}</h2>
                  {section.content.map((paragraph, pIndex) => (
                    <p key={pIndex} className="mb-4">
                      {paragraph}
                    </p>
                  ))}
                </section>
              ))}
              <section className="mb-12">
                <h2 className="text-2xl font-semibold mb-4">{t.familyLegacy.title}</h2>
                <p className="mb-4">{t.familyLegacy.content}</p>
              </section>
            </div>
            <div className="md:col-span-1">
              <div className="sticky top-24">
                <h3 className="text-xl font-semibold mb-4">Galerie d'Œuvres</h3>
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="relative aspect-w-4 aspect-h-3 bg-gray-200 rounded-lg overflow-hidden">
                      <Image
                        src={`/api/placeholder/${400}/${320}`}
                        alt={`Œuvre ${i}`}
                        width={400}
                        height={320}
                        className="object-cover"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
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

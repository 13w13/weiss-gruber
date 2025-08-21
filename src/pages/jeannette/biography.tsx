import Image from 'next/image'
import Link from 'next/link'
import { ChevronDown, Globe } from 'lucide-react'
import { useState } from 'react'

type Language = 'fr';

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
}

export default function BiographyPage() {
  const [language] = useState<Language>('fr')
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
          title: "Biographie",
          content: [
            "Jeannette Weiss Gruber (née le 1er juillet 1934 à Paris) est une peintre-verrier française. Issue d&apos;une lignée d&apos;artistes verriers, elle perpétue une tradition familiale d&apos;excellence dans l&apos;art du vitrail.",
            "Fille du peintre-verrier Jean-Jacques Gruber et petite-fille de Jacques Gruber, figure majeure de l&apos;École de Nancy, elle s&apos;inscrit dans la continuité d&apos;un savoir-faire familial tout en développant son propre langage artistique."
          ]
        },
        {
          title: "Formation et Carrière",
          content: [
            "De 1954 à 1969, Jeannette Weiss Gruber exerce son art au sein de l&apos;atelier Jacques Gruber, où elle développe sa technique et affine sa vision artistique. En 1959, suite à son mariage avec Bernard Weiss, elle adopte la signature JWG qui caractérisera désormais ses œuvres.",
            "De 1969 à 1973, l&apos;artiste effectue un séjour au Québec, période durant laquelle elle explore de nouvelles expressions artistiques, notamment à travers ses &apos;aluchromies&apos; (peintures sur aluminium). Cette expérience enrichit sa pratique du vitrail et influence son approche de la lumière.",
            "À son retour à Paris en 1973, elle conjugue création et transmission en enseignant l&apos;histoire de l&apos;art à l&apos;École américaine. En 1980, elle établit son propre atelier à la Villa d&apos;Alésia, lieu de création de nombreuses œuvres majeures."
          ]
        },
        {
          title: "Technique et Approche Artistique",
          content: [
            "La pratique de Jeannette Weiss Gruber se caractérise par une recherche constante d&apos;innovation technique au service de l&apos;intégration architecturale. Dès 1958, elle développe une technique distinctive utilisant peignes et éponges, parfois complétée par l&apos;usage de blaireaux et de pinceaux selon les projets.",
            "Sa méthodologie inclut une approche unique de visualisation : l&apos;utilisation de jumelles à l&apos;envers pour anticiper l&apos;effet final des vitraux dans leur contexte architectural. Cette technique originale lui permet d&apos;optimiser l&apos;intégration de ses œuvres dans leur environnement.",
            "Comme le souligne Aymerick Zublena lors de la remise de la Médaille de la Restauration en 2001 : &apos;Son objectif est d&apos;insérer ses créations dans les différents édifices en s&apos;imprégnant du cadre architectural et de la lumière, avec une recherche d&apos;harmonie et d&apos;équilibre avec les autres vitraux quand ils existent, tout en évitant les pastiches.&apos;"
          ]
        },
        {
          title: "Œuvres Majeures",
          content: [
            "Ses réalisations les plus significatives comprennent :",
            "• 1960 : Collégiale de Mantes (Yvelines) - Création du triplet de la façade sous la rosace du XIIIe siècle",
            "• 1969 : Cathédrale Primatiale Saint Jean de Lyon (Rhône) - Réalisation de la baie est de la chapelle de la Vierge",
            "• 1985 : Cathédrale de Beauvais (Oise) - Création d'une verrière de 25 m² dans une chapelle sud du transept",
            "• 1991 : Église Notre-Dame de Niort (Deux-Sèvres) - Restauration et création de compléments pour un arbre de Jessé du XVe siècle",
            "• 2001 : Église Abbatiale de Saint Jean de Saverne (Bas-Rhin) - Ensemble de dix-huit vitraux dans les nefs nord et sud"
          ]
        },
        {
          title: "Reconnaissance",
          content: [
            "En 2001, la Fondation Académie d&apos;Architecture lui décerne la Médaille de la Restauration, reconnaissant l&apos;excellence de son travail dans la création et la restauration de vitraux. Cette distinction souligne sa contribution exceptionnelle à la préservation et au renouvellement de l&apos;art du vitrail en France."
          ]
        }
      ],
      familyLegacy: {
        title: "L&apos;Héritage Artistique Weiss-Gruber",
        content: "Jeannette Weiss Gruber s&apos;inscrit dans une lignée d&apos;artistes d&apos;exception. Son œuvre témoigne de la perpétuation et du renouvellement d&apos;une tradition familiale dans l&apos;art du vitrail, tout en apportant une vision contemporaine à cet art séculaire."
      },
      footer: {
        rights: "Tous droits réservés."
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
              <button className="flex items-center hover:text-blue-600 transition-colors">
                <Globe className="w-4 h-4 mr-1" />
                FR
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
                    <p key={pIndex} className="mb-4 text-justify">
                      {paragraph}
                    </p>
                  ))}
                </section>
              ))}
              <section className="mb-12">
                <h2 className="text-2xl font-semibold mb-4">{t.familyLegacy.title}</h2>
                <p className="mb-4 text-justify">{t.familyLegacy.content}</p>
              </section>
            </div>
            <div className="md:col-span-1">
              <div className="sticky top-24">
                <h3 className="text-xl font-semibold mb-4">Galerie d&apos;Œuvres</h3>
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="relative aspect-w-4 aspect-h-3 bg-gray-200 rounded-lg overflow-hidden">
                      <Image
                        src={`/api/placeholder/400/300`}
                        alt={`Œuvre ${i}`}
                        width={400}
                        height={300}
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
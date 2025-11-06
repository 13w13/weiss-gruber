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
  carte: string;
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
        carte: "Carte",
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
            "Jeannette Weiss-Gruber, née le 1ᵉʳ juillet 1934 à Paris, est une peintre-verrière française. Elle est la fille du maître-verrier Jean-Jacques Gruber et petite-fille de Jacques Gruber, figure de l’École de Nancy. Elle est la mère de Frédéric, Camille et François Weiss."
          ]
        },
        {
          title: "Formation et carrière",
          content: [
            "Dans l’atelier paternel, elle commence à peindre enfant. À 11 ans, une pierre de 30 kg écrase sa main droite, réimplantée après douze heures de train ; cela n’entame pas sa vocation : « para-artiste », dit-elle, elle forge une gestuelle singulière.",
            "De 1954 à 1969, elle travaille à l’atelier de son père, où elle affine sa technique. En 1959, à la suite de son mariage avec Bernard Weiss, elle adopte la signature JWG. La reconnaissance lui est d’abord difficile au sein de l’atelier familial, dominé par la figure du père et du frère.",
            "En 1969, elle part au Québec avec son mari et ses enfants (1969-1973) et développe ses recherches dans la compréhension de la lumière. Invitée par les usines Alcan, elle expérimente l’aluminium oxydé et des pigments issus de la teinture lainière : naissent ses aluchromies (peintures sur aluminium).",
            "De retour à Paris en 1973, elle enseigne l’histoire de l’art à l’École américaine. En 1980, elle reprend une partie de l’atelier familial à la Villa d’Alésia, d’où sortent de nombreuses œuvres."
          ]
        },
        {
          title: "Technique, éthique de travail et approche",
          content: [
            "Dès 1958, elle met au point une méthode combinant peignes et éponges, complétée selon les projets par blaireaux et pinceaux — procédé employé notamment pour les deux baies de la chapelle Saint-Joseph de la cathédrale primatiale Saint-Jean de Lyon (1978). Le blanc et le bleu sont ses couleurs de prédilection.",
            "Contrairement à son père, qui travaillait à la lampe en intérieur, elle tient à travailler à la lumière du jour, seule condition — selon elle — pour juger honnêtement la matière et la vibration chromatique du verre. Elle privilégie le haut des vitraux, travaillant volontiers en tête d’échafaudage, là où l’œil se libère des contraintes narratives et où la composition respire davantage.",
            "Elle pratique aussi une visualisation originale : regarder ses cartons avec des jumelles à l’envers pour anticiper l’effet à distance in situ et optimiser l’insertion des vitraux dans l’édifice.",
            "Aymerick Zublena (Médaille de la Restauration, 2001) résume son intention : « Insérer ses créations en s’imprégnant du cadre architectural et de la lumière, dans une recherche d’harmonie avec les vitraux existants, en évitant tout pastiche. » Selon lui encore, de 1955 à aujourd’hui, elle navigue entre figuration, allusion et abstraction, privilégiant toujours le dialogue avec le contexte et les usagers.",
            "Jeannette dit: « Le vitrail est dans ma peau ; quand je fais mes cartons grandeur, la mise en plomb est déjà là. »"
          ]
        },
        {
          title: "Œuvres majeures",
          content: [
            "1960 — Collégiale de Mantes (Yvelines) : triplet de la façade sous la rosace du XIIIᵉ siècle.",
            "1969 — Cathédrale primatiale Saint-Jean de Lyon (Rhône) : baie est de la chapelle de la Vierge.",
            "1985 — Cathédrale de Beauvais (Oise) : verrière de 25 m² dans une chapelle sud du transept.",
            "1991 — Église Notre-Dame de Niort (Deux-Sèvres) : restauration et compléments d’un Arbre de Jessé du XVe siècle.",
            "2001 — Église abbatiale Saint-Jean de Saverne (Bas-Rhin) : ensemble de dix-huit vitraux dans les nefs nord et sud."
          ]
        },
        {
          title: "Donations et archives",
          content: [
            "Elle a procédé à de nombreuses donations liées à l’œuvre de son grand-père Jacques Gruber et à son propre atelier (cartons, maquettes, dossiers de restauration) à la Médiathèque de l’Architecture et du Patrimoine (Ministère de la Culture, 2005).",
            "Elle a également fait restaurer à ses frais le vitrail bombé situé au-dessus de la porte de l’atelier (ancien atelier Jacques Gruber) et l’a donné au Musée des Arts décoratifs (Paris). En 2022, elle y a déposé le vitrail des Mouettes.",
            "En 2012, une publication de Chantal Bouchon a contribué à documenter son corpus au sein des travaux sur le vitrail."
          ]
        },
        {
          title: "Réception et reconnaissance",
          content: [
            "Si son œuvre est saluée par des commanditaires et ses pairs, la reconnaissance institutionnelle et collégiale lui a longtemps semblé incomplète. Cette difficulté à se faire reconnaître — héritée en partie de sa place dans l’atelier familial et du contexte d’un milieu majoritairement masculin — a constitué une souffrance tout au long de sa vie. À plus de 90 ans, elle se réveille parfois la nuit de chagrin, occupée à ces sujets.",
            "En 2001, la Fondation de l’Académie d’Architecture lui décerne la Médaille de la Restauration, qui salue l’excellence de son œuvre en création et en restauration ainsi que sa contribution au renouvellement de l’art du vitrail en France."
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
            <li><Link href="/jeannette/carte" className="hover:text-blue-600 transition-colors">{t.nav.carte}</Link></li>
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
          
          <div className="max-w-4xl mx-auto">
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
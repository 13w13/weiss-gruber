import Image from 'next/image'
import Link from 'next/link'
import { ChevronRight, Globe } from 'lucide-react'
import { useState } from 'react'

// Type definitions
type Language = 'fr' | 'en';

interface Nav {
  biography: string;
  catalogue: string;
  exhibitions: string;
}

interface TimelineEvent {
  year: string;
  event: string;
}

interface FeaturedWork {
  title: string;
}

interface Section {
  title: string;
  description: string;
  link: string;
}

interface Hero {
  subtitle: string;
}

interface Intro {
  title: string;
  text: string;
}

interface FamilyLegacy {
  title: string;
  text: string;
}

interface Timeline {
  title: string;
  events: TimelineEvent[];
}

interface Footer {
  rights: string;
}

interface ContentStructure {
  nav: Nav;
  hero: Hero;
  intro: Intro;
  featuredWorks: {
    title: string;
    works: FeaturedWork[];
  };
  sections: Section[];
  timeline: Timeline;
  familyLegacy: FamilyLegacy;
  footer: Footer;
}

interface Content {
  fr: ContentStructure;
  en: ContentStructure;
}

export default function LandingPage() {
  const [language, setLanguage] = useState<Language>('fr')

  const content: Content = {
    fr: {
      nav: {
        biography: "Biographie",
        catalogue: "Catalogue Raisonné",
        exhibitions: "Expositions",
      },
      hero: {
        subtitle: "Artiste française renommée du vitrail (1934 - présent)"
      },
      intro: {
        title: "Un Héritage de Lumière et de Couleur",
        text: "Née le 1er juillet 1934 à Paris, Jeannette Weiss Gruber perpétue l'héritage artistique de sa famille. Fille de Jean-Jacques Gruber et petite-fille de Jacques Gruber, elle a apporté des contributions significatives à l'art du vitrail, créant des œuvres qui s'harmonisent avec leur environnement architectural tout en évitant le pastiche."
      },
      featuredWorks: {
        title: "Œuvres Phares",
        works: [
          { title: "Cathédrale Primatiale Saint Jean de Lyon (1969)" },
          { title: "Cathédrale de Beauvais (1985)" },
          { title: "Église Abbatiale de Saint Jean de Saverne (2001)" }
        ]
      },
      sections: [
        { 
          title: "Catalogue Raisonné", 
          description: "Explorez l'œuvre étendue de Jeannette Weiss Gruber, de ses premières créations en 1955 à ses chefs-d'œuvre ultérieurs",
          link: "En savoir plus"
        },
        { 
          title: "Historique des Expositions", 
          description: "Découvrez le parcours de l'artiste à travers ses expositions, y compris son séjour au Québec et son retour à Paris",
          link: "En savoir plus"
        }
      ],
      timeline: {
        title: "Parcours Artistique",
        events: [
          { year: "1934", event: "Naissance à Paris, France" },
          { year: "1955", event: "Première création de vitrail à l'Église Saint Jean Baptiste de Sceaux" },
          { year: "1959", event: "Mariage avec Bernard Weiss et début de signature des œuvres sous JWG" },
          { year: "1969", event: "Déménagement au Québec pour une période d'exploration artistique" },
          { year: "1973", event: "Retour à Paris et enseignement de l'histoire de l'art à l'École américaine" },
          { year: "1980", event: "Établissement de son atelier à la Villa d'Alésia" },
          { year: "2001", event: "Réception de la Médaille de la Restauration de l'Académie d'Architecture" }
        ]
      },
      familyLegacy: {
        title: "L'Héritage Artistique Weiss-Gruber",
        text: "Découvrez l'histoire d'une famille d'artistes exceptionnels, dont Jeannette Weiss Gruber est une représentante éminente."
      },
      footer: {
        rights: "Tous droits réservés."
      }
    },
    en: {
      nav: {
        biography: "Biography",
        catalogue: "Catalogue Raisonné",
        exhibitions: "Exhibitions",
      },
      hero: {
        subtitle: "Renowned French stained glass artist (1934 - present)"
      },
      intro: {
        title: "A Legacy of Light and Color",
        text: "Born on July 1, 1934, in Paris, Jeannette Weiss Gruber carries on her family's artistic legacy. Daughter of Jean-Jacques Gruber and granddaughter of Jacques Gruber, she has made significant contributions to the art of stained glass, creating works that harmonize with their architectural environment while avoiding pastiche."
      },
      featuredWorks: {
        title: "Featured Works",
        works: [
          { title: "Primatial Cathedral of Saint John in Lyon (1969)" },
          { title: "Beauvais Cathedral (1985)" },
          { title: "Abbey Church of Saint John in Saverne (2001)" }
        ]
      },
      sections: [
        { 
          title: "Catalogue Raisonné", 
          description: "Explore Jeannette Weiss Gruber's extensive body of work, from her early creations in 1955 to her later masterpieces",
          link: "Learn more"
        },
        { 
          title: "Exhibition History", 
          description: "Discover the artist's journey through her exhibitions, including her time in Quebec and return to Paris",
          link: "Learn more"
        }
      ],
      timeline: {
        title: "Artistic Journey",
        events: [
          { year: "1934", event: "Born in Paris, France" },
          { year: "1955", event: "First stained glass creation at Saint John the Baptist Church in Sceaux" },
          { year: "1959", event: "Marriage to Bernard Weiss and began signing works as JWG" },
          { year: "1969", event: "Moved to Quebec for a period of artistic exploration" },
          { year: "1973", event: "Return to Paris and teaching art history at the American School" },
          { year: "1980", event: "Establishment of her workshop at Villa d'Alésia" },
          { year: "2001", event: "Received the Restoration Medal from the Academy of Architecture" }
        ]
      },
      familyLegacy: {
        title: "The Weiss-Gruber Artistic Legacy",
        text: "Discover the story of an exceptional family of artists, of which Jeannette Weiss Gruber is a prominent representative."
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
          <Link href="/" className="text-xl font-semibold">
            Jeannette Weiss Gruber
          </Link>
          <ul className="flex space-x-6">
            <li><Link href="/jeannette/biography" className="hover:text-blue-600 transition-colors">{t.nav.biography}</Link></li>
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

      <main className="pt-16">
        <section className="relative h-screen">
          <div className="relative h-full w-full bg-gray-200">
            <Image
              src="/api/placeholder/1200/800"
              alt="Signature stained glass work by Jeannette Weiss Gruber"
              width={1200}
              height={800}
              className="object-cover"
            />
          </div>
          <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
            <div className="text-center">
              <h1 className="text-5xl md:text-7xl text-white font-light mb-6">
                Jeannette Weiss Gruber
              </h1>
              <p className="text-lg md:text-xl text-white font-light max-w-2xl mx-auto">
                {t.hero.subtitle}
              </p>
            </div>
          </div>
        </section>

        <section className="container mx-auto px-4 py-16 md:py-24">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-light mb-6">{t.intro.title}</h2>
            <p className="text-lg md:text-xl text-gray-700 leading-relaxed">
              {t.intro.text}
            </p>
          </div>
        </section>

        <section className="bg-gray-50 py-16 md:py-24">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-light mb-12 text-center">{t.featuredWorks.title}</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {t.featuredWorks.works.map((work, index) => (
                <div key={index} className="group relative">
                  <div className="aspect-w-3 aspect-h-4 bg-gray-200 rounded-lg overflow-hidden">
                    <Image
                      src={`/api/placeholder/400/500`}
                      alt={`Œuvre ${index + 1}`}
                      width={400}
                      height={500}
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-opacity flex items-center justify-center">
                      <span className="text-white text-lg font-semibold opacity-0 group-hover:opacity-100 transition-opacity text-center px-4">
                        {work.title}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="container mx-auto px-4 py-16 md:py-24">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {t.sections.map((item, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                <p className="text-gray-600 mb-4">{item.description}</p>
                <Link href={`/${item.title.toLowerCase().replace(' ', '-')}`} className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors">
                  {item.link} <ChevronRight className="ml-1 h-4 w-4" />
                </Link>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-gray-50 py-16 md:py-24">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-light mb-12 text-center">{t.timeline.title}</h2>
            <div className="relative">
              <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-px bg-gray-200"></div>
              {t.timeline.events.map((item, index) => (
                <div key={index} className={`flex items-center mb-8 ${index % 2 === 0 ? 'justify-start' : 'justify-end'}`}>
                  <div className={`w-5/12 ${index % 2 === 0 ? 'text-right pr-4' : 'text-left pl-4'}`}>
                    <h3 className="text-xl font-semibold">{item.year}</h3>
                    <p className="text-gray-600">{item.event}</p>
                  </div>
                  <div className="w-2 h-2 bg-blue-600 rounded-full z-10"></div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="container mx-auto px-4 py-16 md:py-24">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-light mb-6">{t.familyLegacy.title}</h2>
            <p className="text-lg md:text-xl text-gray-700 leading-relaxed">
              {t.familyLegacy.text}
            </p>
          </div>
        </section>
      </main>

      <footer className="bg-gray-100 py-8">
        <div className="container mx-auto px-4 text-center text-gray-600">
          <p>&copy; {new Date().getFullYear()} Weiss-Gruber Family Art. {t.footer.rights}</p>
        </div>
      </footer>
    </div>
  )
}

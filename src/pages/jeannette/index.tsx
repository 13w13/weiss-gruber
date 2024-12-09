import Image from 'next/image'
import Link from 'next/link'
import { ChevronRight, Globe } from 'lucide-react'
import { useState } from 'react'
import { FeaturedImage } from '@/components/images/FeaturedImage'

type Language = 'fr' | 'en';

interface ContentStructure {
  nav: {
    biography: string;
    catalogue: string;
    exhibitions: string;
  };
  hero: {
    subtitle: string;
  };
  intro: {
    title: string;
    text: string;
  };
  featuredWorks: {
    title: string;
    works: Array<{
      title: string;
      description: string;
      image: string;
    }>;
  };
  sections: Array<{
    title: string;
    description: string;
    link: string;
  }>;
  timeline: {
    title: string;
    events: Array<{
      year: string;
      event: string;
    }>;
  };
  familyLegacy: {
    title: string;
    text: string;
  };
  footer: {
    rights: string;
  };
}

interface Content {
  fr: ContentStructure;
  en: ContentStructure;
}

export default function JeannetteLandingPage() {
  const [language, setLanguage] = useState<Language>('fr')

  const content: Content = {
    fr: {
      nav: {
        biography: "Biographie",
        catalogue: "Catalogue Raisonné",
        exhibitions: "Expositions",
      },
      hero: {
        subtitle: "Peintre-verrier française (1934 - présent), créatrice de vitraux monumentaux"
      },
      intro: {
        title: "Une Vision Contemporaine du Vitrail",
        text: "Jeannette Weiss Gruber, peintre-verrier française née en 1934 à Paris, représente la troisième génération d'une lignée d'artistes verriers. Son œuvre se caractérise par une approche novatrice de l'intégration architecturale et une maîtrise exceptionnelle des techniques traditionnelles du vitrail, enrichies par une vision résolument contemporaine."
      },
      featuredWorks: {
        title: "Œuvres Majeures",
        works: [
          {
            title: "Cathédrale Primatiale Saint Jean de Lyon (1969)",
            description: "Création de la baie est de la chapelle de la Vierge, illustrant l'harmonie entre tradition et modernité.",
            image: "lyon-cathedral.jpg"
          },
          {
            title: "Cathédrale de Beauvais (1985)",
            description: "Réalisation d'une verrière monumentale de 25 m² dans le transept sud, dialogue subtil avec le patrimoine existant.",
            image: "beauvais-cathedral.jpg"
          },
          {
            title: "Église Abbatiale de Saint Jean de Saverne (2001)",
            description: "Ensemble remarquable de dix-huit vitraux, témoignage de la maturité artistique de la peintre-verrier.",
            image: "saverne-abbey.jpg"
          }
        ]
      },
      sections: [
        {
          title: "Catalogue Raisonné",
          description: "Documentation exhaustive de l'œuvre de Jeannette Weiss Gruber, de ses premières créations en 1955 à ses réalisations contemporaines, illustrant l'évolution de sa pratique artistique.",
          link: "Explorer le catalogue"
        },
        {
          title: "Parcours d'Expositions",
          description: "Chronologie des expositions et installations majeures, incluant la période d'expérimentation au Québec (1969-1973) et les réalisations monumentales en France.",
          link: "Découvrir le parcours"
        }
      ],
      timeline: {
        title: "Jalons d'une Carrière Exceptionnelle",
        events: [
          { year: "1934", event: "Naissance à Paris dans une famille de maîtres-verriers" },
          { year: "1955", event: "Première création majeure : vitraux de l'Église Saint Jean Baptiste de Sceaux" },
          { year: "1959", event: "Adoption de la signature JWG, marquant le début d'une identité artistique distinctive" },
          { year: "1969-1973", event: "Période d'innovation au Québec, développement des aluchromies" },
          { year: "1980", event: "Établissement de l'atelier personnel à la Villa d'Alésia, Paris" },
          { year: "2001", event: "Médaille de la Restauration de l'Académie d'Architecture, reconnaissance de l'excellence de son œuvre" }
        ]
      },
      familyLegacy: {
        title: "Un Héritage Artistique Perpétué",
        text: "L'œuvre de Jeannette Weiss Gruber s'inscrit dans la continuité de l'excellence artistique familiale, tout en apportant une contribution unique à l'art du vitrail contemporain. Sa pratique témoigne d'une parfaite maîtrise des techniques traditionnelles, enrichie par une vision moderne et personnelle de cet art séculaire."
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
        subtitle: "French stained glass artist (1934 - present), creator of monumental stained glass works"
      },
      intro: {
        title: "A Contemporary Vision of Stained Glass",
        text: "Jeannette Weiss Gruber, a French stained glass artist born in 1934 in Paris, represents the third generation of a lineage of glass artists. Her work is characterized by an innovative approach to architectural integration and exceptional mastery of traditional stained glass techniques, enriched by a resolutely contemporary vision."
      },
      featuredWorks: {
        title: "Major Works",
        works: [
          {
            title: "Primatial Cathedral of Saint John of Lyon (1969)",
            description: "Creation of the east bay of the Virgin's Chapel, illustrating the harmony between tradition and modernity.",
            image: "lyon-cathedral.jpg"
          },
          {
            title: "Beauvais Cathedral (1985)",
            description: "Creation of a monumental 25 m² stained glass window in the south transept, a subtle dialogue with the existing heritage.",
            image: "beauvais-cathedral.jpg"
          },
          {
            title: "Abbey Church of Saint John of Saverne (2001)",
            description: "Remarkable set of eighteen stained glass windows, testament to the artistic maturity of the glass painter.",
            image: "saverne-abbey.jpg"
          }
        ]
      },
      sections: [
        {
          title: "Catalogue Raisonné",
          description: "Comprehensive documentation of Jeannette Weiss Gruber's work, from her first creations in 1955 to her contemporary achievements, illustrating the evolution of her artistic practice.",
          link: "Explore the catalogue"
        },
        {
          title: "Exhibition Journey",
          description: "Chronology of major exhibitions and installations, including the experimental period in Quebec (1969-1973) and monumental achievements in France.",
          link: "Discover the journey"
        }
      ],
      timeline: {
        title: "Milestones of an Exceptional Career",
        events: [
          { year: "1934", event: "Born in Paris into a family of master glassmakers" },
          { year: "1955", event: "First major creation: stained glass windows for the Church of Saint John the Baptist in Sceaux" },
          { year: "1959", event: "Adoption of the JWG signature, marking the beginning of a distinctive artistic identity" },
          { year: "1969-1973", event: "Period of innovation in Quebec, development of aluchromies" },
          { year: "1980", event: "Establishment of personal studio at Villa d'Alésia, Paris" },
          { year: "2001", event: "Medal of Restoration from the Academy of Architecture, recognition of the excellence of her work" }
        ]
      },
      familyLegacy: {
        title: "A Perpetuated Artistic Heritage",
        text: "Jeannette Weiss Gruber's work is a continuation of the family's artistic excellence, while making a unique contribution to contemporary stained glass art. Her practice demonstrates perfect mastery of traditional techniques, enriched by a modern and personal vision of this secular art."
      },
      footer: {
        rights: "All rights reserved."
      }
    }
  }

  const t = content[language]

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
              <button onClick={() => setLanguage(lang => lang === 'fr' ? 'en' : 'fr')} className="flex items-center hover:text-blue-600 transition-colors">
                <Globe className="w-4 h-4 mr-1" />
                {language.toUpperCase()}
              </button>
            </li>
          </ul>
        </nav>
      </header>

      <main className="pt-16">
        <section className="relative h-screen">
          <div className="relative h-full w-full">
            <FeaturedImage
              artist="jeannette"
              imageName="hero.jpg"
              alt="Œuvre majeure de Jeannette Weiss Gruber"
              priority
              className="absolute inset-0 w-full h-full"
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
                    <FeaturedImage
                      artist="jeannette"
                      imageName={work.image}
                      alt={work.title}
                      className="transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-opacity flex items-center justify-center p-4">
                      <div className="text-white text-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <h3 className="text-lg font-semibold mb-2">{work.title}</h3>
                        <p className="text-sm">{work.description}</p>
                      </div>
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
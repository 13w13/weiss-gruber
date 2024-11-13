import Image from 'next/image'
import Link from 'next/link'
import { ChevronRight, Globe } from 'lucide-react'
import { useState } from 'react'

// Add type definitions
type Language = 'fr' | 'en';

interface ContentStructure {
  nav: {
    jeannette: string;
    frederic: string;
    camille: string;
  };
  hero: {
    title: string;
    subtitle: string;
  };
  intro: {
    title: string;
    text: string;
  };
  artists: Array<{
    name: string;
    description: string;
    link: string;
  }>;
  footer: {
    rights: string;
  };
}

interface Content {
  fr: ContentStructure;
  en: ContentStructure;
}

export default function MainLandingPage() {
  const [language, setLanguage] = useState<Language>('fr')

  const content: Content = {
    fr: {
      nav: {
        jeannette: "Jeannette Weiss Gruber",
        frederic: "Frédéric Weiss",
        camille: "Camille Weiss",
      },
      hero: {
        title: "L'Héritage Artistique Weiss-Gruber",
        subtitle: "Une famille d'artistes exceptionnels"
      },
      intro: {
        title: "Un Héritage de Créativité",
        text: "La famille Weiss-Gruber incarne une tradition artistique riche et variée, s'étendant sur plusieurs générations. De la maîtrise du vitrail à la peinture et à la sculpture, chaque membre apporte sa vision unique au monde de l'art."
      },
      artists: [
        {
          name: "Jeannette Weiss Gruber",
          description: "Maître verrier renommée, connue pour ses vitraux innovants et harmonieux.",
          link: "Découvrir l'œuvre de Jeannette"
        },
        {
          name: "Frédéric Weiss",
          description: "Peintre talentueux, explorant les frontières entre l'abstrait et le figuratif.",
          link: "Explorer l'art de Frédéric"
        },
        {
          name: "Camille Weiss",
          description: "Sculptrice visionnaire, créant des œuvres qui défient la perception.",
          link: "Voir les sculptures de Camille"
        }
      ],
      footer: {
        rights: "Tous droits réservés."
      }
    },
    en: {
      nav: {
        jeannette: "Jeannette Weiss Gruber",
        frederic: "Frédéric Weiss",
        camille: "Camille Weiss",
      },
      hero: {
        title: "The Weiss-Gruber Artistic Legacy",
        subtitle: "A family of exceptional artists"
      },
      intro: {
        title: "A Heritage of Creativity",
        text: "The Weiss-Gruber family embodies a rich and varied artistic tradition, spanning several generations. From mastery in stained glass to painting and sculpture, each member brings their unique vision to the art world."
      },
      artists: [
        {
          name: "Jeannette Weiss Gruber",
          description: "Renowned master glassmaker, known for her innovative and harmonious stained glass works.",
          link: "Discover Jeannette's work"
        },
        {
          name: "Frédéric Weiss",
          description: "Talented painter, exploring the boundaries between abstract and figurative art.",
          link: "Explore Frédéric's art"
        },
        {
          name: "Camille Weiss",
          description: "Visionary sculptor, creating works that challenge perception.",
          link: "View Camille's sculptures"
        }
      ],
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
            Weiss-Gruber
          </Link>
          <ul className="flex space-x-6">
            <li><Link href="/jeannette" className="hover:text-blue-600 transition-colors">{t.nav.jeannette}</Link></li>
            <li><Link href="/frederic" className="hover:text-blue-600 transition-colors">{t.nav.frederic}</Link></li>
            <li><Link href="/camille" className="hover:text-blue-600 transition-colors">{t.nav.camille}</Link></li>
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
              alt="Weiss-Gruber family artworks"
              layout="fill"
              objectFit="cover"
              priority
            />
          </div>
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="text-center">
              <h1 className="text-5xl md:text-7xl text-white font-light tracking-wide mb-6">
                {t.hero.title}
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {t.artists.map((artist, index) => (
                <div key={index} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                  <h3 className="text-xl font-semibold mb-2">{artist.name}</h3>
                  <p className="text-gray-600 mb-4">{artist.description}</p>
                  <Link href={`/${artist.name.split(' ')[0].toLowerCase()}`} className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors">
                    {artist.link} <ChevronRight className="ml-1 h-4 w-4" />
                  </Link>
                </div>
              ))}
            </div>
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

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ChevronDown, Globe } from 'lucide-react'

// Type definitions
type Language = 'fr' | 'en';

interface Nav {
  home: string;
  biography: string;
  catalogue: string;
  exhibitions: string;
}

interface FamilyMembers {
  title: string;
  jeannette: string;
  frederic: string;
  camille: string;
}

interface Exhibition {
  title: string;
  date: string;
  location: string;
  description: string;
  image: string;
}

interface Footer {
  rights: string;
}

interface ContentStructure {
  nav: Nav;
  familyMembers: FamilyMembers;
  title: string;
  upcoming: string;
  past: string;
  exhibitions: Exhibition[];
  footer: Footer;
}

interface Content {
  fr: ContentStructure;
  en: ContentStructure;
}

export default function ExhibitionsPage() {
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
      title: "Expositions de Jeannette Weiss Gruber",
      upcoming: "Expositions à venir",
      past: "Expositions passées",
      exhibitions: [
        {
          title: "Rétrospective : Lumière et Couleur",
          date: "15 septembre - 30 novembre 2024",
          location: "Musée d'Art Moderne, Paris",
          description: "Une exposition rétrospective célébrant la carrière de Jeannette Weiss Gruber, mettant en lumière ses œuvres les plus emblématiques.",
          image: "/api/placeholder/400/300"
        },
        {
          title: "L'Art du Vitrail Contemporain",
          date: "5 mars - 20 juin 2023",
          location: "Musée des Beaux-Arts, Lyon",
          description: "Une exposition collective présentant les innovations dans l'art du vitrail, avec une section dédiée aux créations de Jeannette Weiss Gruber.",
          image: "/api/placeholder/400/300"
        },
        {
          title: "Héritage et Modernité",
          date: "10 octobre - 15 décembre 2022",
          location: "Galerie Nationale, Strasbourg",
          description: "Une exploration de l'influence de l'héritage familial sur l'œuvre de Jeannette Weiss Gruber et son approche moderne du vitrail.",
          image: "/api/placeholder/400/300"
        }
      ],
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
      title: "Exhibitions of Jeannette Weiss Gruber",
      upcoming: "Upcoming Exhibitions",
      past: "Past Exhibitions",
      exhibitions: [
        {
          title: "Retrospective: Light and Color",
          date: "September 15 - November 30, 2024",
          location: "Museum of Modern Art, Paris",
          description: "A retrospective exhibition celebrating the career of Jeannette Weiss Gruber, highlighting her most iconic works.",
          image: "/api/placeholder/400/300"
        },
        {
          title: "The Art of Contemporary Stained Glass",
          date: "March 5 - June 20, 2023",
          location: "Museum of Fine Arts, Lyon",
          description: "A collective exhibition presenting innovations in the art of stained glass, with a section dedicated to the creations of Jeannette Weiss Gruber.",
          image: "/api/placeholder/400/300"
        },
        {
          title: "Heritage and Modernity",
          date: "October 10 - December 15, 2022",
          location: "National Gallery, Strasbourg",
          description: "An exploration of the influence of family heritage on Jeannette Weiss Gruber's work and her modern approach to stained glass.",
          image: "/api/placeholder/400/300"
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
            <li><Link href="/jeannette/biography" className="hover:text-blue-600 transition-colors">{t.nav.biography}</Link></li>
            <li><Link href="/jeannette/catalogue" className="hover:text-blue-600 transition-colors">{t.nav.catalogue}</Link></li>
            <li><Link href="/jeannette/exhibitions" className="text-blue-600">{t.nav.exhibitions}</Link></li>
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
          
          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-4">{t.upcoming}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {t.exhibitions.slice(0, 1).map((exhibition, index) => (
                <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden">
                  <div className="relative h-48">
                    <Image
                      src={exhibition.image}
                      alt={exhibition.title}
                      width={400}
                      height={300}
                      className="object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="text-xl font-semibold mb-2">{exhibition.title}</h3>
                    <p className="text-gray-600 mb-2">{exhibition.date}</p>
                    <p className="text-gray-600 mb-2">{exhibition.location}</p>
                    <p className="text-sm">{exhibition.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">{t.past}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {t.exhibitions.slice(1).map((exhibition, index) => (
                <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden">
                  <div className="relative h-48">
                    <Image
                      src={exhibition.image}
                      alt={exhibition.title}
                      width={400}
                      height={300}
                      className="object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="text-xl font-semibold mb-2">{exhibition.title}</h3>
                    <p className="text-gray-600 mb-2">{exhibition.date}</p>
                    <p className="text-gray-600 mb-2">{exhibition.location}</p>
                    <p className="text-sm">{exhibition.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
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

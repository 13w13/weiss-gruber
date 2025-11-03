import Link from 'next/link'
import Image from 'next/image'
import { ChevronRight, X } from 'lucide-react'
import { useState } from 'react'

// Static images (relative to project root)
import heroImg from '../../../images/frontpage/main.jpg'
import beauvaisImg from '../../../images/frontpage/1985_beauvais_cathedrale_principal.png'
import taralonRecto from '../../../images/frontpage/taralon-recto.jpg'
import taralonVerso from '../../../images/frontpage/taralon-verso.jpg'

export default function JeannetteFrontPage() {
  const [lightboxImage, setLightboxImage] = useState<string | null>(null)
  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur border-b border-gray-200">
        <nav className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="text-xl font-semibold">
            Jeannette Weiss Gruber
          </Link>
          <ul className="flex space-x-6">
            <li><Link href="/jeannette/biography" className="hover:text-blue-600 transition-colors">Biographie</Link></li>
            <li><Link href="/jeannette/catalogue" className="hover:text-blue-600 transition-colors">Catalogue</Link></li>
            <li><Link href="/jeannette/carte" className="hover:text-blue-600 transition-colors">Carte</Link></li>
            <li><Link href="/jeannette/exhibitions" className="hover:text-blue-600 transition-colors">Expositions</Link></li>
          </ul>
        </nav>
      </header>

      <main className="pt-16">
        {/* Hero */}
        <section className="relative h-[90vh]">
          <Image src={heroImg} alt="Jeannette peignant" fill priority className="object-cover" />
          <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-center px-4">
            <h1 className="text-5xl md:text-7xl text-white font-light mb-6">Jeannette Weiss Gruber</h1>
            <p className="text-lg md:text-2xl text-white font-light">Peintre-verrier née en 1934</p>
          </div>
        </section>

        {/* Citations */}
        <section className="bg-white py-16 md:py-24">
          <div className="max-w-3xl mx-auto px-4 space-y-12 text-center">
            <blockquote className="italic text-2xl text-gray-800 leading-relaxed">
              « J&apos;ai beaucoup admiré la lumière que mon grand-père obtenait avec trois superpositions de verre et la gravure. Contrai­rement à lui, amoureuse du vitrail, j&apos;ai cherché la lumière avec mon travail de la grisaille. »
            </blockquote>
            <blockquote className="italic text-2xl text-gray-800 leading-relaxed">
              « À 11 ans, j&apos;ai reçu une pierre de 30 kg sur la main droite… Après douze heures de train, la main a été remise de travers sur le poignet. Donc je suis une para-artiste. »
            </blockquote>
          </div>
        </section>

        {/* Oeuvre Beauvais */}
        <section className="bg-black py-16 md:py-24">
          <div className="container mx-auto px-4 flex justify-center">
            <div className="w-full max-w-4xl group relative rounded-lg overflow-hidden shadow-2xl">
              <Image 
                src={beauvaisImg} 
                alt="Baie Beauvais 1985" 
                className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width: 1024px) 100vw, 80vw"
              />
            </div>
          </div>
        </section>

        {/* Recensement Taralon */}
        <section className="bg-gray-50 py-16 md:py-24">
          <div className="container mx-auto px-4 text-center">
            <p className="text-2xl text-gray-700 leading-relaxed max-w-3xl mx-auto mb-10">
              A réalisé des vitraux dans l&apos;atelier familial d&apos;après ses maquettes, ses cartons colorés et la peinture à la grisaille toujours à la lumière du jour. Ses créations ont été recensées par Jean Taralon :
            </p>
            <div className="flex justify-center gap-8">
              <button onClick={() => setLightboxImage(taralonRecto.src)} className="cursor-pointer transform hover:scale-105 transition-transform">
                <Image src={taralonRecto} alt="Taralon recto" className="rounded shadow-lg" width={400} height={560} />
              </button>
              <button onClick={() => setLightboxImage(taralonVerso.src)} className="cursor-pointer transform hover:scale-105 transition-transform">
                <Image src={taralonVerso} alt="Taralon verso" className="rounded shadow-lg" width={400} height={560} />
              </button>
            </div>
          </div>
        </section>

        {/* Technique & inspirations */}
        <section className="bg-blue-50 py-16 md:py-24">
          <div className="max-w-4xl mx-auto px-4 text-2xl text-gray-800 leading-relaxed space-y-6">
            <p>
              Dès 1958, Jeannette Weiss-Gruber utilise, selon les besoins, peignes et éponges, blaireaux et pinceaux — un ensemble de techniques qu’elle mobilise notamment pour les deux baies de la chapelle Saint-Joseph de la cathédrale primatiale Saint-Jean de Lyon, achevées en 1978.
            </p>
            <p>Le blanc et le bleu sont ses couleurs de prédilection dans le vitrail.</p>
            <p>Pour anticiper l’effet in situ, elle observe ses œuvres avec des jumelles à l&apos;envers, afin d’en imaginer la lecture à distance dans l’édifice.</p>
          </div>
        </section>

        {/* Citation Zublena */}
        <section className="container mx-auto px-4 py-16 md:py-24">
          <div className="bg-white border border-gray-200 rounded-lg shadow-md p-8 md:p-12 max-w-3xl mx-auto">
            <blockquote className="italic text-xl text-gray-800 space-y-4">
              <p>
                « Son objectif est d&apos;insérer ses créations dans les différents édifices en s&apos;imprégnant du cadre architectural et de la lumière, avec une recherche d&apos;harmonie et d&apos;équilibre avec les autres vitraux quand ils existent, tout en évitant les pastiches. »
              </p>
              <p>
                « Depuis ses premières créations en 1955 et jusqu&apos;à maintenant, Jeannette Weiss Gruber a toujours, suivant l&apos;environnement et sa propre sensibilité, été alternativement figurative, allusive ou abstraite, privilégiant son interprétation de l&apos;insertion dans le contexte et le dialogue avec les utilisateurs. »
              </p>
              <footer className="mt-4 text-right font-medium">— Aymerick Zublena, 2001</footer>
            </blockquote>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 md:py-24 bg-gray-100 text-center">
          <h2 className="text-3xl md:text-4xl font-light mb-8">Explorer l&apos;œuvre de Jeannette Weiss Gruber</h2>
          <div className="flex flex-col sm:flex-row justify-center gap-6">
            <Link href="/jeannette/catalogue" className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700 transition">
              Catalogue Raisonné <ChevronRight className="ml-2 w-4 h-4" />
            </Link>
            <Link href="/jeannette/carte" className="inline-flex items-center justify-center px-6 py-3 bg-white border border-blue-600 text-blue-700 rounded hover:bg-blue-50 transition">
              Parcours sur la Carte <ChevronRight className="ml-2 w-4 h-4" />
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-100 py-8 text-center text-gray-600 text-sm">
        &copy; {new Date().getFullYear()} Weiss-Gruber Family Art. Tous droits réservés.
      </footer>

      {lightboxImage && (
        <div 
          className="fixed inset-0 z-[100] bg-black/80 flex items-center justify-center p-4 backdrop-blur-sm"
          onClick={() => setLightboxImage(null)}
        >
          <button 
            className="absolute top-4 right-4 text-white hover:text-gray-300"
            onClick={() => setLightboxImage(null)}
          >
            <X size={32} />
          </button>
          <div className="relative max-w-full max-h-full">
            <Image 
              src={lightboxImage} 
              alt="Fiche Taralon en grand" 
              width={800} 
              height={1100} 
              className="object-contain max-w-full max-h-[90vh]"
            />
          </div>
        </div>
      )}
    </div>
  )
}

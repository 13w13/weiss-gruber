import Link from 'next/link'
import Image from 'next/image'
import { ChevronRight, X } from 'lucide-react'
import { useEffect, useState, type ReactNode } from 'react'
import { useLocale } from '@/i18n'
import { CONTACT_EMAIL } from '@/lib/site'
import PageMeta from '@/components/layout/PageMeta'
import YouTubeEmbed from '@/components/media/YouTubeEmbed'

// Static images (relative to project root)
import heroImg from '../../../images/frontpage/main.jpg'
import beauvaisImg from '../../../images/frontpage/1985_beauvais_cathedrale_principal.png'
import taralonRecto from '../../../images/frontpage/taralon-recto.jpg'
import taralonVerso from '../../../images/frontpage/taralon-verso.jpg'
import SiteHeader from '@/components/layout/SiteHeader'
import SiteFooter from '@/components/layout/SiteFooter'

const INTERVIEW_ID = 'Wlh5VD3t_pQ'

const extLink = (href: string, label: string) => (
  <a href={href} className="underline" target="_blank" rel="noopener noreferrer">{label}</a>
)

const CONTENT = {
  fr: {
    metaTitle: 'Jeannette Weiss Gruber — Peintre-verrier (1934–2026)',
    metaDescription: 'Catalogue raisonné, biographie, carte des vitraux et interview de Jeannette Weiss Gruber (1934–2026), peintre-verrier.',
    heroAlt: 'Jeannette peignant',
    heroSubtitle: 'Peintre-verrier',
    quotes: [
      '« J\'ai beaucoup admiré la lumière que mon grand-père obtenait avec trois superpositions de verre et la gravure. Contrai­rement à lui, amoureuse du vitrail, j\'ai cherché la lumière avec mon travail de la grisaille. »',
      '« À 11 ans, j\'ai reçu une pierre de 30 kg sur la main droite… Après douze heures de train, la main a été remise de travers sur le poignet. Donc je suis une para-artiste. »',
    ],
    interviewLabel: 'Interview',
    interviewTitle: 'Une vie dans le vitrail',
    interviewNote: 'Vidéo publiée par François Weiss sur YouTube. Elle ne se charge qu\'au clic.',
    openOnYoutube: 'Ouvrir sur YouTube',
    beauvaisAlt: 'Baie Beauvais 1985',
    beauvaisTitle: 'Une baie dans une chapelle sud du transept',
    beauvaisLink: 'Voir la fiche de l\'œuvre',
    taralonText: 'Jeannette Weiss Gruber a réalisé des vitraux dans l\'atelier familial d\'après ses maquettes, ses cartons colorés et la peinture à la grisaille toujours à la lumière du jour. Ses créations ont été recensées par Jean Taralon :',
    taralonRecto: { aria: 'Agrandir la fiche Taralon (recto)', alt: 'Taralon recto' },
    taralonVerso: { aria: 'Agrandir la fiche Taralon (verso)', alt: 'Taralon verso' },
    taralonDialog: 'Fiche Taralon agrandie',
    taralonLarge: 'Fiche Taralon en grand',
    close: 'Fermer',
    technique: [
      'Dès 1958, Jeannette Weiss Gruber utilise, selon les besoins, peignes et éponges, blaireaux et pinceaux — un ensemble de techniques qu’elle mobilise notamment pour les deux baies de la chapelle Saint-Joseph de la cathédrale primatiale Saint-Jean de Lyon, achevées en 1978.',
      'Le blanc et le bleu sont ses couleurs de prédilection dans le vitrail.',
      'Pour anticiper l’effet in situ, elle observe ses œuvres avec des jumelles à l\'envers, afin d’en imaginer la lecture à distance dans l’édifice.',
    ],
    medalTitle: 'Médaille de la restauration 2001 - Fondation Académie d\'Architecture',
    medalQuotes: [
      '« Son objectif est d\'insérer ses créations dans les différents édifices en s\'imprégnant du cadre architectural et de la lumière, avec une recherche d\'harmonie et d\'équilibre avec les autres vitraux quand ils existent, tout en évitant les pastiches. »',
      '« Depuis ses premières créations en 1955 et jusqu\'à maintenant, Jeannette Weiss Gruber a toujours, suivant l\'environnement et sa propre sensibilité, été alternativement figurative, allusive ou abstraite, privilégiant son interprétation de l\'insertion dans le contexte et le dialogue avec les utilisateurs. »',
    ],
    timelineTitle: 'Son Chemin',
    timeline: [
      ['1934', 'Naissance à Paris'],
      ['1952', 'Début de carrière dans l\'atelier familial, Villa d\'Alesia'],
      ['1969', 'Départ au Québec'],
      ['1973', 'Retour à Paris'],
      ['1980', 'Ouverture de l\'atelier au 10 Villa d\'Alésia'],
      ['2003', 'Fermeture de l\'atelier'],
      ['2026', 'Décès à Paris'],
    ],
    about: [
      'Jeannette Weiss Gruber a consacré sa vie au vitrail. Elle peignait sur le verre en cherchant sa propre lumière, sa grisaille, en dialogue constant avec les vitraux anciens et l’architecture des édifices.',
      'Ce site est né d’une expérience personnelle : le désir de pouvoir reconnaître, comprendre et identifier le travail de ma grand-mère. En rassemblant ses œuvres, j’ai voulu apprendre à distinguer son style, sa manière de poser la grisaille, son geste singulier, pour ensuite les reconnaître dans les églises. J’espère que le visiteur, en parcourant ce site, pourra à son tour se familiariser avec ce langage et, un jour, dire face à une baie : « Ça, c’est un vitrail de Jeannette Weiss Gruber. »',
      'La forme numérique offre ici une qualité de regard particulière : l’écran, par la lumière même des pixels, restitue quelque chose de la transparence du vitrail que le papier fige et ternit souvent. On voit mieux certaines nuances, certains détails de matière, même si, bien sûr, rien ne remplace l’expérience du vitrail dans l’édifice. Certaines photographies restent de qualité inégale, mais elles ont été conservées pour documenter au mieux l’ensemble.',
      'L’art du vitrail lui-même demeure en France à la fois présent et méconnu. Nous y sommes sensibles, parfois, comme à une simple « beauté » de lumière dans une église mais le métier de maître et peintre-verrier reste largement ignoré du grand public, peu exposé, peu documenté. Les noms des artistes sont rarement connus et la transmission de cet art passe encore trop peu par des lieux d’exposition ou des ressources accessibles.',
      'Il y a pourtant quelque chose de profondément mystérieux dans le vitrail, en dehors de toute confession religieuse : une lumière venue du dehors qui, en traversant le verre peint, semble réveiller autre chose que de simples couleurs. Le vitrail est une ouverture où le dehors s’allume autrement, une lumière insaisissable qui fait passage — un peu comme le regard d’une personne qui, sans que l’on sache pourquoi, nous touche et nous interroge.',
      'Ce catalogue raisonné reste une démarche partielle et auto-déclarative : les informations proviennent des archives et des déclarations de Jeannette Weiss Gruber elle-même, prises comme vraies. Il peut comporter des imprécisions, des oublis ou des approximations, et ne prétend pas couvrir l’intégralité de l’œuvre.',
      <>Ce site s’appuie également sur le remarquable travail photographique de Denis Krieger — consultable sur {extLink('https://www.mesvitrauxfavoris.fr/index.htm', 'son site dédié')} — qui contribue à combler le déficit de documentation numérique autour de l’art du vitrail en France.</>,
    ] as ReactNode[],
    copyright: 'Sauf mention contraire, les photographies sont la propriété de J.E.C. Gruber Weiss. Toute reproduction, diffusion ou utilisation, même partielle, est interdite sans autorisation préalable.',
    code: <>Le code de ce site est {extLink('https://github.com/13w13/weiss-gruber', 'open source')} sous licence CC0 (domaine public), co-développé avec LLMs, et peut être réutilisé sans demande d&apos;autorisation.</>,
    signature: 'Son petit-fils. Contact :',
    ctaTitle: 'Explorer l\'œuvre de Jeannette Weiss Gruber',
    ctaCatalogue: 'Catalogue Raisonné',
    ctaMap: 'Parcours sur la Carte',
  },
  en: {
    metaTitle: 'Jeannette Weiss Gruber — Stained-glass painter (1934–2026)',
    metaDescription: 'Catalogue raisonné, biography, map of the stained-glass windows and interview of Jeannette Weiss Gruber (1934–2026), stained-glass painter.',
    heroAlt: 'Jeannette painting',
    heroSubtitle: 'Stained-glass painter',
    quotes: [
      '“I greatly admired the light my grandfather achieved with three superimposed layers of glass and engraving. Unlike him, being in love with stained glass, I sought light through my work in grisaille.”',
      '“When I was 11, a 30 kg stone fell on my right hand… After twelve hours on a train, the hand was set back crooked on the wrist. So I am a para-artist.”',
    ],
    interviewLabel: 'Interview',
    interviewTitle: 'A life in stained glass',
    interviewNote: 'Video in French, published by François Weiss on YouTube. It only loads when you click.',
    openOnYoutube: 'Open on YouTube',
    beauvaisAlt: 'Beauvais window, 1985',
    beauvaisTitle: 'A window in a south transept chapel',
    beauvaisLink: 'View the work’s page',
    taralonText: 'Jeannette Weiss Gruber made her stained-glass windows in the family workshop from her own maquettes and colored cartoons, always painting the grisaille in daylight. Her creations were recorded by Jean Taralon:',
    taralonRecto: { aria: 'Enlarge the Taralon record card (front)', alt: 'Taralon record card, front' },
    taralonVerso: { aria: 'Enlarge the Taralon record card (back)', alt: 'Taralon record card, back' },
    taralonDialog: 'Enlarged Taralon record card',
    taralonLarge: 'Taralon record card, enlarged',
    close: 'Close',
    technique: [
      'From 1958, Jeannette Weiss Gruber used combs and sponges, badger brushes and paintbrushes as each project required — a set of techniques she drew on notably for the two windows of the Chapel of Saint Joseph in the primatial Cathedral of Saint-Jean in Lyon, completed in 1978.',
      'White and blue were her favorite colors in stained glass.',
      'To anticipate the effect in situ, she looked at her work through binoculars turned the wrong way round, to imagine how it would read from a distance inside the building.',
    ],
    medalTitle: 'Médaille de la Restauration 2001 – Fondation de l’Académie d’Architecture',
    medalQuotes: [
      '“Her aim is to set her creations into each building by steeping herself in the architectural setting and the light, seeking harmony and balance with the other windows where they exist, while avoiding pastiche.”',
      '“From her first creations in 1955 to the present day, Jeannette Weiss Gruber has always, depending on the setting and her own sensibility, been by turns figurative, allusive or abstract, favoring her own reading of how a work fits into its context and its dialogue with the people who use the building.”',
    ],
    timelineTitle: 'Her Path',
    timeline: [
      ['1934', 'Born in Paris'],
      ['1952', 'Began her career in the family workshop, Villa d’Alésia'],
      ['1969', 'Moved to Quebec'],
      ['1973', 'Returned to Paris'],
      ['1980', 'Opened her workshop at 10 Villa d’Alésia'],
      ['2003', 'Closed the workshop'],
      ['2026', 'Died in Paris'],
    ],
    about: [
      'Jeannette Weiss Gruber devoted her life to stained glass. She painted on glass in search of her own light, her own grisaille, in constant dialogue with old windows and with the architecture of the buildings.',
      'This site grew out of a personal experience: the wish to be able to recognize, understand and identify my grandmother’s work. By bringing her works together, I wanted to learn to distinguish her style, the way she laid down grisaille, her singular gesture, so as to recognize them later in churches. I hope that visitors, as they browse this site, will in turn become familiar with this language and one day be able to say, standing before a window: “That is a stained-glass window by Jeannette Weiss Gruber.”',
      'The digital form offers a particular quality of looking: through the very light of its pixels, the screen restores something of the transparency of stained glass that paper often freezes and dulls. Certain nuances and details of texture can be seen better, even though, of course, nothing replaces the experience of a window in its building. Some photographs are of uneven quality, but they have been kept to document the whole as fully as possible.',
      'In France, the art of stained glass itself remains both present and little known. We are sometimes sensitive to it as a simple “beauty” of light in a church, but the craft of the master glassmaker and stained-glass painter remains largely unknown to the general public, rarely exhibited and poorly documented. The artists’ names are seldom known, and this art is still too rarely passed on through exhibition venues or accessible resources.',
      'And yet there is something deeply mysterious about stained glass, beyond any religious faith: a light from outside which, passing through painted glass, seems to awaken something more than mere colors. A stained-glass window is an opening where the outside lights up differently, an elusive light that becomes a passage — a little like the gaze of someone who, without our knowing why, moves us and questions us.',
      'This catalogue raisonné remains a partial, self-declared undertaking: the information comes from the archives and statements of Jeannette Weiss Gruber herself, taken as true. It may contain inaccuracies, omissions or approximations, and does not claim to cover her entire body of work.',
      <>This site also draws on the remarkable photographic work of Denis Krieger — available on {extLink('https://www.mesvitrauxfavoris.fr/index.htm', 'his dedicated website')} — which helps make up for the lack of digital documentation on the art of stained glass in France.</>,
    ] as ReactNode[],
    copyright: 'Unless otherwise stated, the photographs are the property of J.E.C. Gruber Weiss. Any reproduction, distribution or use, even partial, is prohibited without prior permission.',
    code: <>The code of this site is {extLink('https://github.com/13w13/weiss-gruber', 'open source')} under the CC0 license (public domain), co-developed with LLMs, and may be reused without asking for permission.</>,
    signature: 'Her grandson. Contact:',
    ctaTitle: 'Explore the work of Jeannette Weiss Gruber',
    ctaCatalogue: 'Catalogue raisonné',
    ctaMap: 'Explore the map',
  },
}

export default function JeannetteFrontPage() {
  const c = CONTENT[useLocale()]
  const [lightboxImage, setLightboxImage] = useState<string | null>(null)

  // Échap ferme l'agrandissement des fiches Taralon
  useEffect(() => {
    if (!lightboxImage) return
    const onKeyDown = (e: KeyboardEvent) => { if (e.key === 'Escape') setLightboxImage(null) }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [lightboxImage])

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <PageMeta
        title={c.metaTitle}
        description={c.metaDescription}
        path="/jeannette"
      />
      {/* Header */}
      <SiteHeader />

      <main className="pt-14 md:pt-16">
        {/* Hero */}
        <section className="relative h-[70vh] sm:h-[80vh] md:h-[90vh]">
          <Image src={heroImg} alt={c.heroAlt} fill priority className="object-cover" />
          <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-center px-4">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl text-white font-light mb-4 md:mb-6">Jeannette Weiss Gruber</h1>
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-white font-light">{c.heroSubtitle} (1934&nbsp;&ndash;&nbsp;2026)</p>
          </div>
          <div className="absolute bottom-2 sm:bottom-4 right-2 sm:right-4 text-white text-xs sm:text-sm opacity-70">
            Photo © Jean-Luc Vallet
          </div>
        </section>

        {/* Citations */}
        <section className="bg-white py-12 md:py-16 lg:py-24">
          <div className="max-w-3xl mx-auto px-4 space-y-8 md:space-y-12 text-center">
            {c.quotes.map((quote) => (
              <blockquote key={quote} className="italic text-lg md:text-xl lg:text-2xl text-gray-800 leading-relaxed">
                {quote}
              </blockquote>
            ))}
            <p className="text-base md:text-lg text-gray-700 font-medium">Jeannette Weiss Gruber</p>
          </div>
        </section>

        {/* Interview */}
        <section id="interview" className="bg-gray-950 py-12 md:py-20 scroll-mt-16">
          <div className="max-w-4xl mx-auto px-4">
            <p className="text-xs uppercase tracking-widest text-gray-400 mb-2 text-center">{c.interviewLabel}</p>
            <h2 className="text-2xl md:text-4xl font-light text-white text-center mb-6 md:mb-10">{c.interviewTitle}</h2>
            <YouTubeEmbed id={INTERVIEW_ID} title="Jeannette Weiss-Gruber, Une vie dans le vitrail" />
            <p className="mt-3 text-xs md:text-sm text-gray-400 text-center">
              {c.interviewNote}{' '}
              <a href={`https://www.youtube.com/watch?v=${INTERVIEW_ID}`} target="_blank" rel="noopener noreferrer" className="underline hover:text-white">{c.openOnYoutube}</a>
            </p>
          </div>
        </section>

        {/* Oeuvre Beauvais */}
        <section className="bg-black py-16 md:py-24">
          <div className="container mx-auto px-4 flex justify-center">
            <div className="w-full max-w-4xl text-center">
              <div className="group relative rounded-lg overflow-hidden shadow-2xl mb-4">
              <Image
                src={beauvaisImg}
                alt={c.beauvaisAlt}
                className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width: 1024px) 100vw, 80vw"
              />
              </div>
              <div className="text-gray-300 text-lg">
                <p>{c.beauvaisTitle}</p>
                <p className="text-base text-gray-400">1985 - Cathédrale Saint-Pierre de Beauvais, Beauvais</p>
                <Link href="/jeannette/catalogue/jw_1985_beauvais_04" className="mt-4 inline-flex items-center text-sm text-gray-200 underline underline-offset-4 hover:text-white">
                  {c.beauvaisLink} <ChevronRight className="ml-1 w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Recensement Taralon */}
        <section className="bg-gray-50 py-12 md:py-16 lg:py-24">
          <div className="container mx-auto px-4 text-center">
            <p className="text-base md:text-xl lg:text-2xl text-gray-700 leading-relaxed max-w-3xl mx-auto mb-8 md:mb-10">
              {c.taralonText}
            </p>
            <div className="flex flex-col sm:flex-row justify-center items-center gap-6 md:gap-8">
              <button onClick={() => setLightboxImage(taralonRecto.src)} aria-label={c.taralonRecto.aria} className="cursor-pointer transform hover:scale-105 transition-transform">
                <Image src={taralonRecto} alt={c.taralonRecto.alt} className="rounded shadow-lg" width={300} height={420} />
              </button>
              <button onClick={() => setLightboxImage(taralonVerso.src)} aria-label={c.taralonVerso.aria} className="cursor-pointer transform hover:scale-105 transition-transform">
                <Image src={taralonVerso} alt={c.taralonVerso.alt} className="rounded shadow-lg" width={300} height={420} />
              </button>
            </div>
          </div>
        </section>

        {/* Technique & inspirations */}
        <section className="bg-blue-50 py-12 md:py-16 lg:py-24">
          <div className="max-w-4xl mx-auto px-4 text-base md:text-xl lg:text-2xl text-gray-800 leading-relaxed space-y-4 md:space-y-6">
            {c.technique.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
          </div>
        </section>

        {/* Citation Zublena */}
        <section className="container mx-auto px-4 py-12 md:py-16 lg:py-24">
          <div className="bg-white border border-gray-200 rounded-lg shadow-md p-6 md:p-8 lg:p-12 max-w-3xl mx-auto text-center">
            <h3 className="text-lg md:text-xl lg:text-2xl font-semibold text-gray-800 mb-4 md:mb-6">{c.medalTitle}</h3>
            <blockquote className="italic text-base md:text-lg lg:text-xl text-gray-800 space-y-3 md:space-y-4 text-left">
              {c.medalQuotes.map((quote) => <p key={quote}>{quote}</p>)}
              <footer className="mt-4 text-right font-medium">— Aymerick Zublena, 2001</footer>
            </blockquote>
          </div>
        </section>

        {/* Timeline */}
        <section className="bg-gray-50 py-12 md:py-16 lg:py-24">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-light text-center mb-10 md:mb-16">{c.timelineTitle}</h2>
            <div className="relative max-w-2xl mx-auto">
              <div className="absolute left-2.5 top-2 h-full w-0.5 bg-gray-300" aria-hidden="true"></div>
              <div className="space-y-12">
                {c.timeline.map(([year, label]) => (
                  <div key={year} className="relative pl-10">
                    <div className="absolute left-0 top-1 w-5 h-5 bg-gray-800 rounded-full border-4 border-gray-50"></div>
                    <p className="text-xl font-bold text-gray-800">{year}</p>
                    <p className="text-lg text-gray-600">{label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* À propos */}
        <section className="py-10 md:py-14 bg-white text-left border-y border-gray-200">
          <div className="container mx-auto px-4 space-y-6 text-base text-gray-800 leading-relaxed max-w-4xl">
            {c.about.map((paragraph, i) => <p key={i}>{paragraph}</p>)}

            <p className="text-sm text-gray-600 italic">{c.copyright}</p>

            <p className="text-sm text-gray-600">{c.code}</p>

            <p className="mt-6 text-sm text-gray-600">{c.signature} <a href={`mailto:${CONTACT_EMAIL}`} className="underline">{CONTACT_EMAIL}</a></p>
          </div>
        </section>

        {/* CTA */}
        <section className="py-12 md:py-16 lg:py-24 bg-gray-100 text-center">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-light mb-6 md:mb-8 px-4">{c.ctaTitle}</h2>
          <div className="flex flex-col sm:flex-row justify-center gap-6">
            <Link href="/jeannette/catalogue" className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700 transition">
              {c.ctaCatalogue} <ChevronRight className="ml-2 w-4 h-4" />
            </Link>
            <Link href="/jeannette/carte" className="inline-flex items-center justify-center px-6 py-3 bg-white border border-blue-600 text-blue-700 rounded hover:bg-blue-50 transition">
              {c.ctaMap} <ChevronRight className="ml-2 w-4 h-4" />
            </Link>
          </div>
        </section>


      </main>

      {/* Footer */}
      <SiteFooter />

      {lightboxImage && (
        <div
          className="fixed inset-0 z-[1200] bg-black/80 flex items-center justify-center p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-label={c.taralonDialog}
          onClick={() => setLightboxImage(null)}
        >
          <button
            className="absolute top-4 right-4 text-white hover:text-gray-300"
            aria-label={c.close}
            onClick={() => setLightboxImage(null)}
          >
            <X size={32} />
          </button>
          <div className="relative max-w-full max-h-full">
            <Image
              src={lightboxImage}
              alt={c.taralonLarge}
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

import Image from 'next/image'
import Lightbox from 'yet-another-react-lightbox'
import Zoom from 'yet-another-react-lightbox/plugins/zoom'
import 'yet-another-react-lightbox/styles.css'
import { useState } from 'react'
import { IMAGE_BASE_URL } from '@/lib/images'
import { s3ImageLoader } from '@/lib/imageLoader'
import { useLocale } from '@/i18n'
import PageMeta from '@/components/layout/PageMeta'
import SiteHeader from '@/components/layout/SiteHeader'
import SiteFooter from '@/components/layout/SiteFooter'


interface Section {
  title: string;
  content: string[];
}

interface ContentStructure {
  metaDescription: string;
  title: string;
  sections: Section[];
}

const content: Record<'fr' | 'en', ContentStructure> = {
  fr: {
    metaDescription: "Biographie de Jeannette Weiss Gruber (1934–2026), peintre-verrier formée dans l’atelier familial de la Villa d’Alésia à Paris.",
    title: "Biographie de Jeannette Weiss Gruber",
    sections: [
      {
        title: "Biographie",
        content: [
          "Jeannette Weiss Gruber, née le 1ᵉʳ juillet 1934 à Paris et morte le 7 juin 2026 dans cette même ville, est une peintre-verrier française. Elle est la fille du maître-verrier Jean-Jacques Gruber et la petite-fille de Jacques Gruber, figure de l’École de Nancy. Elle est la mère de Frédéric, Camille et François Weiss."
        ]
      },
      {
        title: "Formation et carrière",
        content: [
          "Dans l’atelier familial, elle côtoie très tôt des vitraux anciens, cachés et conservés sous l’autorité de son père durant la guerre, puis déposés au château de Champs-sur-Marne à la Libération. Certains seront replacés sur site. À dix ans, elle se promet de faire « plus joli » que les vitraux de l’atelier.",
          "À onze ans, une pierre de 30 kg écrase sa main droite : réimplantée après douze heures de train, la main est sauvée mais le poignet reste un peu de travers. « Para-artiste », dit-elle ; elle se forge une gestuelle singulière.",
          "Après la guerre, elle assiste à la repose des vitraux de Chartres, non pollués, avec ses amies d’enfance ; à dix-huit ans, elle découvre émerveillée l’Arbre de Jessé (Le Prince) au pavillon de Marsan, ainsi que des vitraux de Chagall pour Hadassah. Elle admire les vitraux des grands peintres, particulièrement ceux de Miró à Senlis.",
          "De 1954 à 1969, elle travaille dans l’atelier familial, où elle a le privilège de voir de près des vitraux anciens en restauration. La reconnaissance lui est d’abord difficile au sein de l’atelier familial, dominé par la figure du père et du frère.",
          "En 1969, elle part au Québec avec son mari et ses enfants (1969-1973) et travaille la lumière comme elle travaillait la grisaille sur ses vitraux. Demandée par les usines Alcan, elle expérimente l’aluminium oxydé et des pigments issus de la teinture lainière : naissent ses aluchromies (peintures sur aluminium).",
          "De retour à Paris en 1973, elle enseigne l’histoire de l’art pour une école américaine. La même année, elle reçoit le diplôme des Arts et Métiers pour la coupe et le montage des vitraux. En 1980, elle reprend une partie de l’atelier familial à la villa d’Alésia. Elle adopte la signature JWG. Elle se fait aider pour le montage, la coupe du verre et la pose par d'anciennes élèves qu'elle a connues au Métier d'Art et par deux maîtres-verriers. "
        ]
      },
      {
        title: "Technique et approche",
        content: [
          "Dès 1958, elle met au point une méthode combinant peignes et éponges, complétée selon les projets par blaireaux et pinceaux — procédé employé notamment pour les deux baies de la chapelle Saint-Joseph de la cathédrale primatiale Saint-Jean de Lyon (1978). Le blanc et le bleu sont ses couleurs de prédilection, avec un travail attentif de la grisaille.",
          "Elle tient à travailler à la lumière du jour, seule condition — selon elle — pour juger honnêtement la matière et la vibration chromatique du verre. Elle s'exprime plus librement en hauteur, là où il y a moins de contraintes. ",
          "Elle pratique aussi une visualisation originale : regarder ses vitraux avec des jumelles à l’envers pour anticiper l’effet à distance in situ et optimiser l’insertion des vitraux dans l’édifice.",
          "Pour elle, les trois quarts de son travail, c’étaient ses yeux.",
          "Aymeric Zublena (Médaille de la Restauration, 2001) résume son intention : « Insérer ses créations en s’imprégnant du cadre architectural et de la lumière, dans une recherche d’harmonie avec les vitraux existants, en évitant tout pastiche. » Selon lui encore, de 1955 à aujourd’hui, elle navigue entre figuration, allusion et abstraction, privilégiant toujours le dialogue avec le contexte et le public.",
          "Jeannette dit : « Le vitrail est dans ma peau ; quand je fais mes cartons grandeur, la mise en plomb est déjà là (pour ma mise en place sur calque). »"
        ]
      },
      {
        title: "Donations et archives",
        content: [
          "Elle a procédé à de nombreuses donations liées à l’œuvre de son grand-père Jacques Gruber et à son propre atelier (cartons, maquettes, dossiers des situations pour les monuments historiques et dossiers de restauration) à la Médiathèque de l’Architecture et du Patrimoine (Ministère de la Culture, 2005).",
          "Elle a également fait restaurer le vitrail bombé situé au-dessus de la porte intérieure de l’atelier (ancien atelier Jacques Gruber) et l’a donné au Musée des Arts décoratifs (Paris). En 2022, elle y a déposé le vitrail des Mouettes."
        ]
      },
      {
        title: "Réception et reconnaissance",
        content: [
          "Elle apprécie la reconnaissance des DRACS, des inspecteurs en monuments historiques et des architectes en chef et de ses amies historiennes du vitrail qui l'ont vue travailler. À plus de 90 ans, il lui arrivait encore de se réveiller la nuit, préoccupée par ces sujets.",
          "En 2001, la Fondation de l’Académie d’Architecture lui décerne la Médaille de la Restauration, qui salue l’excellence de son œuvre en création et en restauration ainsi que sa contribution au renouvellement de l’art du vitrail en France."
        ]
      },
      {
        title: "Hommage",
        content: [
          "Jeannette Weiss Gruber s’est éteinte le 7 juin 2026 à Paris, à la Maison médicale Jeanne Garnier, entourée de ses enfants, à l’âge de 91 ans.",
          "Une cérémonie en son hommage s’est tenue le jeudi 18 juin 2026, sous la coupole du Père-Lachaise, où ses proches et ses pairs ont rendu hommage à sa mémoire de peintre et maître-verrier, d’historienne de l’art et de femme aimante."
        ]
      }
    ],
  },
  en: {
    metaDescription: "Biography of Jeannette Weiss Gruber (1934–2026), stained-glass painter trained in the family workshop at the Villa d’Alésia in Paris.",
    title: "Biography of Jeannette Weiss Gruber",
    sections: [
      {
        title: "Biography",
        content: [
          "Jeannette Weiss Gruber, born on July 1, 1934, in Paris and died in the same city on June 7, 2026, was a French stained-glass painter. She was the daughter of the master glassmaker Jean-Jacques Gruber and the granddaughter of Jacques Gruber, a leading figure of the École de Nancy. She was the mother of Frédéric, Camille and François Weiss."
        ]
      },
      {
        title: "Training and career",
        content: [
          "In the family workshop she grew up among old stained-glass windows, hidden and kept safe under her father’s authority during the war, then stored at the Château de Champs-sur-Marne at the Liberation. Some were later reinstalled on site. At the age of ten, she promised herself she would make windows “prettier” than those in the workshop.",
          "At eleven, a 30 kg stone crushed her right hand. Reattached after a twelve-hour train journey, the hand was saved, but the wrist remained slightly crooked. “A para-artist,” she would say; she developed a way of working all her own.",
          "After the war, with her childhood friends, she watched the Chartres windows being reinstalled, still free of pollution. At eighteen, she was enthralled by the Tree of Jesse (Le Prince) at the Pavillon de Marsan, and by Chagall’s windows for Hadassah. She admired the stained glass of the great painters, especially Miró’s windows in Senlis.",
          "From 1954 to 1969 she worked in the family workshop, where she had the privilege of seeing old windows up close while they were being restored. Recognition was hard to come by at first in a family workshop dominated by her father and her brother.",
          "In 1969 she moved to Quebec with her husband and children (1969–1973), where she worked with light just as she worked grisaille on her windows. At the request of the Alcan plants, she experimented with oxidized aluminum and pigments used for dyeing wool: this gave birth to her aluchromies (paintings on aluminum).",
          "Back in Paris in 1973, she taught art history for an American school. The same year, she received the Arts et Métiers diploma in cutting and assembling stained glass. In 1980 she took over part of the family workshop at the Villa d’Alésia and adopted the signature JWG. For assembly, glass cutting and installation, she was helped by former students she had known at the Métier d’Art and by two master glassmakers."
        ]
      },
      {
        title: "Technique and approach",
        content: [
          "From 1958 she developed a method combining combs and sponges, complemented by badger brushes and paintbrushes depending on the project, a process used notably for the two windows of the Chapel of Saint Joseph in the primatial Cathedral of Saint-Jean in Lyon (1978). White and blue were her favorite colors, with careful work in grisaille.",
          "She insisted on working in daylight, the only condition, in her view, for judging honestly the texture and chromatic vibration of the glass. She expressed herself more freely high up in a window, where there are fewer constraints.",
          "She also had an original way of visualizing her work: looking at her windows through binoculars turned the wrong way round, to anticipate how they would read from a distance in situ and to fit them better into the building.",
          "For her, three quarters of her work was in her eyes.",
          "Aymeric Zublena (Médaille de la Restauration, 2001) sums up her intent: “To set her creations in place by steeping herself in the architectural setting and the light, seeking harmony with the existing windows while avoiding any pastiche.” According to him, from 1955 to the present day she moved between figuration, allusion and abstraction, always favoring dialogue with the context and the public.",
          "Jeannette said: “Stained glass is in my skin; when I make my full-size cartoons, the leading is already there (for my layout on tracing paper).”"
        ]
      },
      {
        title: "Donations and archives",
        content: [
          "She made numerous donations relating to the work of her grandfather Jacques Gruber and to her own workshop (cartoons, maquettes, site files for the Historic Monuments and restoration files) to the Médiathèque de l’Architecture et du Patrimoine (Ministry of Culture, 2005).",
          "She also had the curved stained-glass window above the workshop’s inner door (the former Jacques Gruber workshop) restored and donated it to the Musée des Arts décoratifs in Paris. In 2022 she deposited the Seagulls window there."
        ]
      },
      {
        title: "Reception and recognition",
        content: [
          "She valued the recognition of the DRACs, the inspectors of Historic Monuments, the chief architects and her friends, historians of stained glass, who had watched her work. Past the age of 90, she still sometimes woke at night, preoccupied by these matters.",
          "In 2001 the Fondation de l’Académie d’Architecture awarded her the Médaille de la Restauration, honoring the excellence of her work in creation and restoration and her contribution to the renewal of stained-glass art in France."
        ]
      },
      {
        title: "Tribute",
        content: [
          "Jeannette Weiss Gruber passed away on June 7, 2026, in Paris, at the Maison médicale Jeanne Garnier, surrounded by her children, at the age of 91.",
          "A ceremony in her honor was held on Thursday, June 18, 2026, under the dome of Père-Lachaise, where her family, friends and peers paid tribute to her memory as a painter and master glassmaker, an art historian and a loving woman."
        ]
      }
    ],
  },
}

// Images placées à côté d'un paragraphe (section, paragraphe), identiques dans les deux langues
interface ImagePlacement {
  section: number;
  paragraph: number;
  file: string;
  align: 'left' | 'right' | 'center';
  caption: { fr: string; en: string };
}

const IMAGES: ImagePlacement[] = [
  { section: 0, paragraph: 0, file: 'photo_miminette_bio_1.jpg', align: 'right', caption: { fr: 'Photo de Jeannette Weiss Gruber', en: 'Photo of Jeannette Weiss Gruber' } },
  { section: 1, paragraph: 0, file: 'photo_miminette_bio_atelier.jpg', align: 'left', caption: { fr: 'Atelier, 10 villa d’Alésia', en: 'The workshop, 10 Villa d’Alésia' } },
  { section: 1, paragraph: 2, file: 'photo_miminette_bio_miro.jpg', align: 'left', caption: { fr: 'Vitraux de Miró, chapelle Saint-Frambourg, Senlis', en: 'Miró’s windows, Chapelle Saint-Frambourg, Senlis' } },
  { section: 1, paragraph: 4, file: 'alu_6.jpg', align: 'right', caption: { fr: 'Article québécois sur son travail', en: 'Quebec newspaper article about her work' } },
  { section: 1, paragraph: 5, file: 'photo_miminette_bio_4.png', align: 'right', caption: { fr: 'Début du carton de la verrière voisine de l’Arbre de Jessé', en: 'Early stage of the cartoon for the window next to the Tree of Jesse' } },
  { section: 2, paragraph: 2, file: 'photo_miminette_bio_5.png', align: 'right', caption: { fr: 'Jeannette au travail sur les médaillons de la cathédrale d’Amiens', en: 'Jeannette at work on the medallions of Amiens Cathedral' } },
  { section: 2, paragraph: 5, file: 'photo_miminette_bio_3.png', align: 'left', caption: { fr: 'Travail sur le carton de l’Arbre de Jessé, in situ', en: 'Working on the Tree of Jesse cartoon, in situ' } },
  { section: 4, paragraph: 1, file: 'photo_miminette_bio_6.jpg', align: 'center', caption: { fr: 'Jeannette marche', en: 'Jeannette walking' } },
];

// Toutes les images de la visionneuse (la signature n'apparaît que dans la visionneuse)
const LIGHTBOX_IMAGES = [...IMAGES.map((img) => img.file), 'photo_miminette_bio_signature.jpg'];

export default function BiographyPage() {
  const locale = useLocale()
  const t = content[locale]

  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const lightboxSlides = LIGHTBOX_IMAGES.map((f) => ({ src: `${IMAGE_BASE_URL}/bio/${f}` }));
  const openImage = (file: string) => {
    const idx = LIGHTBOX_IMAGES.indexOf(file);
    if (idx >= 0) { setLightboxIndex(idx); setLightboxOpen(true); }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white text-gray-900">
      <PageMeta
        title={locale === 'en' ? 'Biography' : 'Biographie'}
        description={t.metaDescription}
        path="/jeannette/biography"
      />
      <SiteHeader />

      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-light mb-8 text-center">{t.title}</h1>

          <div className="max-w-5xl lg:max-w-6xl mx-auto">
            {t.sections.map((section, index) => (
              <section
                key={index}
                className={`${index !== 0 ? 'border-t border-gray-200 pt-12' : ''} space-y-8`}
              >
                <h2 className="text-3xl font-serif leading-tight mb-4">{section.title}</h2>
                {section.content.map((paragraph, pIndex) => {
                    const mapping = IMAGES.find((m) => m.section === index && m.paragraph === pIndex);
                    const caption = mapping?.caption[locale];
                    const isCenter = mapping?.align === 'center';
                    const containerClasses = isCenter
                      ? 'mb-8'
                      : `mb-8 md:grid md:grid-cols-[minmax(0,1fr)_24rem] 2xl:grid-cols-[minmax(0,1fr)_28rem] md:gap-6 md:items-center space-y-4 md:space-y-0`;

                    return (
                      <div key={pIndex} className={containerClasses}>
                        <p className={`text-justify text-lg leading-relaxed ${mapping?.align === 'left' ? 'md:order-2' : ''} ${pIndex === 0 ? 'first-letter:text-5xl first-letter:font-bold first-letter:float-left first-letter:mr-1' : ''}`}>{paragraph}</p>
                        {mapping && !isCenter && (
                          <figure className={`md:row-span-full ${mapping.align === 'left' ? 'md:order-1' : 'md:order-2'}`}>
                            <Image
                              onClick={() => openImage(mapping.file)}
                              src={`${IMAGE_BASE_URL}/bio/${mapping.file}`}
                              alt={caption ?? ''}
                              width={500}
                              height={375}
                              priority={index === 0 && pIndex === 0}
                              sizes="(min-width: 1280px) 28rem, (min-width: 768px) 24rem, 100vw"
                              className="cursor-zoom-in rounded-lg shadow-md w-full"
                              loader={s3ImageLoader}
                            />
                            {caption && (
                              <figcaption className="mt-2 text-sm italic text-gray-500">{caption}</figcaption>
                            )}
                          </figure>
                        )}

                        {isCenter && mapping && (
                          <div className="mt-6 flex justify-center">
                            <Image
                              onClick={() => openImage(mapping.file)}
                              src={`${IMAGE_BASE_URL}/bio/${mapping.file}`}
                              alt={caption ?? ''}
                              width={800}
                              height={600}
                              className="cursor-zoom-in rounded-lg shadow-md object-contain w-full max-w-2xl"
                              loader={s3ImageLoader}
                              />
                          </div>
                        )}
                        {isCenter && caption && (
                          <p className="mt-2 text-sm italic text-gray-500 text-center max-w-2xl mx-auto">{caption}</p>
                        )}
                      </div>
                    );
                  })}
              </section>
            ))}
          </div>
        </div>
      </main>

      {/* Lightbox pour les images bio */}
      <Lightbox
        open={lightboxOpen}
        close={() => setLightboxOpen(false)}
        slides={lightboxSlides}
        plugins={[Zoom]}
        index={lightboxIndex}
      />

      <SiteFooter />
    </div>
  )
}

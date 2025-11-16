import { GetStaticPaths, GetStaticProps } from 'next';
import fs from 'fs';
import path from 'path';
import Papa from 'papaparse';
import { useRouter } from 'next/router';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, MapPin } from 'lucide-react';
import { useState, useEffect } from 'react';
import type { Plugin } from 'yet-another-react-lightbox';
import Lightbox from 'yet-another-react-lightbox';
import Zoom from 'yet-another-react-lightbox/plugins/zoom';
import Captions from 'yet-another-react-lightbox/plugins/captions';
import Thumbnails from 'yet-another-react-lightbox/plugins/thumbnails';
import 'yet-another-react-lightbox/styles.css';
import 'yet-another-react-lightbox/plugins/captions.css';
import 'yet-another-react-lightbox/plugins/thumbnails.css';
import { Vitrail } from '@/types/images';

interface CsvRow {
  id: string;
  year: string;
  building_name: string;
  building_type: string;
  city: string;
  department: string;
  location_in_building: string;
  title_fr: string;
  main_image: string;
  caption_fr: string;
  photo_status: string;
  description_fr: string;
  gallery_images: string;
  maps_url: string;
  lat: string;
  lng: string;
}


// Le composant pour la page de détail
export default function VitrailDetail({ work, prevId, nextId, nextMainImage }: { work: Vitrail; prevId?: string | null; nextId?: string | null; nextMainImage?: string | null }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [showFullText, setShowFullText] = useState(false);
  const [showFullAlt, setShowFullAlt] = useState(false);

  // Prefetch hero of next artwork for instant loading (client only)
  useEffect(() => {
    if (typeof window !== 'undefined' && nextMainImage) {
      const img = new window.Image();
      img.src = `https://weiss-gruber-jeanette.s3.fr-par.scw.cloud/vitraux/${nextMainImage}`;
    }
  }, [nextMainImage]);

  // Show navigation hint for 4 seconds each time lightbox opens
  useEffect(() => {
    if (open) {
      setShowHint(true);
      const t = setTimeout(() => setShowHint(false), 4000);
      return () => clearTimeout(t);
    }
  }, [open]);

  // Use new text_fr field, or fallback to merged caption_fr + description_fr for backward compatibility
  const fullText = work.text_fr || [work.caption_fr, work.description_fr].filter(Boolean).join(' ');
  const hasLongText = fullText.length > 80;

  // Build slides once per render (needs to be before effects that depend on it)
  const slides = [
    { 
      src: `https://weiss-gruber-jeanette.s3.fr-par.scw.cloud/vitraux/${work.main_image}`,
      alt: work.title_fr,
      title: work.title_fr,
      description: '' // We'll handle text display separately
    },
    ...(work.gallery_images?.map(img => ({
      src: `https://weiss-gruber-jeanette.s3.fr-par.scw.cloud/vitraux/${img.url}`,
      alt: img.alt_fr || img.nom || work.title_fr,
      description: '' // Keep gallery items without text overlay
    })) || [])
  ];

  // Map each slide to its metadata for caption display
  const slideMetadata = [
    {
      isMainImage: true,
      text: fullText,
      hasLongText: hasLongText,
      nom: null,
      alt_fr: null,
      hasLongAlt: false,
      credit: null
    },
    ...(work.gallery_images?.map(img => ({
      isMainImage: false,
      text: null,
      hasLongText: false,
      nom: img.nom,
      alt_fr: img.alt_fr || null,
      hasLongAlt: (img.alt_fr?.length || 0) > 80,
      credit: img.credit || null
    })) || [])
  ];

  // Get metadata for current slide
  const currentMeta = slideMetadata[index] || slideMetadata[0];

  // Reset text expansion when slide changes
  useEffect(() => {
    setShowFullText(false);
    setShowFullAlt(false);
  }, [index]);

  // Lightbox keydown handler - navigate to next/prev artwork at boundaries
  useEffect(() => {
    if (!open) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' && index === slides.length - 1 && nextId) {
        e.preventDefault();
        router.push(`/jeannette/catalogue/${nextId}`);
      } else if (e.key === 'ArrowLeft' && index === 0 && prevId) {
        e.preventDefault();
        router.push(`/jeannette/catalogue/${prevId}`);
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open, index, slides.length, prevId, nextId, router]);

  // Page-level keydown handler (when lightbox is closed)
  useEffect(() => {
    if (open) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' && prevId) {
        router.push(`/jeannette/catalogue/${prevId}`);
      } else if (e.key === 'ArrowRight' && nextId) {
        router.push(`/jeannette/catalogue/${nextId}`);
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open, prevId, nextId, router]);

  if (router.isFallback) {
    return <div>Chargement...</div>;
  }



  // Build plugin list dynamically
  const plugins: Plugin[] = [Zoom, Captions];
  // Counter is now displayed in custom footer, not as a plugin
  if (slides.length > 4) plugins.push(Thumbnails);

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <header className="fixed top-0 left-0 right-0 z-50 bg-white bg-opacity-90 backdrop-blur-sm border-b border-gray-200">
        <nav className="container mx-auto px-2 md:px-4 py-3 md:py-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2 md:gap-4">
              <Link href="/" className="text-lg md:text-xl font-semibold">
                <span className="hidden sm:inline">Weiss-Gruber</span>
                <span className="inline sm:hidden">WG</span>
              </Link>
              <Link href="/jeannette" className="text-sm md:text-base text-gray-700 hover:text-blue-600 transition-colors">
                <span className="hidden sm:inline">Jeannette Weiss Gruber</span>
                <span className="inline sm:hidden">Jeannette</span>
              </Link>
            </div>
            <ul className="flex flex-wrap gap-2 md:gap-4 text-xs md:text-base">
              <li><Link href="/jeannette" className="hover:text-blue-600 transition-colors whitespace-nowrap">Accueil</Link></li>
              <li><Link href="/jeannette/biography" className="hover:text-blue-600 transition-colors whitespace-nowrap"><span className="hidden md:inline">Biographie</span><span className="inline md:hidden">Bio</span></Link></li>
              <li><Link href="/jeannette/catalogue" className="text-blue-600 whitespace-nowrap"><span className="hidden md:inline">Catalogue Raisonné</span><span className="inline md:hidden">Catalogue</span></Link></li>
              <li><Link href="/jeannette/carte" className="hover:text-blue-600 transition-colors whitespace-nowrap">Carte</Link></li>
              <li><Link href="/jeannette/exhibitions" className="hover:text-blue-600 transition-colors whitespace-nowrap"><span className="hidden md:inline">Expositions</span><span className="inline md:hidden">Expo</span></Link></li>
            </ul>
          </div>
        </nav>
      </header>

      <main className="pt-20 md:pt-24 pb-12 md:pb-16">
        <div className="container mx-auto px-3 md:px-4">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-2xl md:text-4xl lg:text-5xl font-light mb-3 md:mb-4">{work.title_fr}</h1>
            <p className="text-base md:text-lg text-gray-600 mb-4">{work.year} - {work.building_name}, {work.city}</p>

            <div className="mb-4 md:mb-6 flex justify-between items-center text-sm md:text-base">
              {prevId ? (
                <Link href={`/jeannette/catalogue/${prevId}`} className="inline-flex items-center text-gray-700 hover:text-blue-600 transition-colors">
                  <ChevronLeft className="w-4 h-4 mr-1" />
                  Précédent
                </Link>
              ) : (
                <span />
              )}
              {nextId && (
                <Link href={`/jeannette/catalogue/${nextId}`} className="inline-flex items-center text-gray-700 hover:text-blue-600 transition-colors">
                  Suivant
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Link>
              )}
            </div>

                        <div className="relative h-64 sm:h-80 md:h-96 lg:h-[500px] mb-4 bg-gray-200 rounded-lg overflow-hidden cursor-pointer" onClick={() => { setIndex(0); setOpen(true); }}>
              <Image
                src={`https://weiss-gruber-jeanette.s3.fr-par.scw.cloud/vitraux/${work.main_image}`}
                alt={work.title_fr}
                fill
                sizes="(max-width: 768px) 90vw, (max-width: 1280px) 70vw, 1024px"
                priority
                placeholder="blur"
                blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR4nGP8zwADAAMBAQAYXP4AAAAASUVORK5CYII="
                className="object-contain"
                onError={(e) => { (e.currentTarget as HTMLImageElement).src = 'https://via.placeholder.com/800x500.png?text=Image+non+disponible'; }}
              />
            </div>

            <Lightbox
                open={open}
                close={() => {
                  setOpen(false);
                  setShowFullText(false); // Reset text expansion when closing
                }}
                index={index}
                slides={slides}
                plugins={plugins}
                zoom={{
                  maxZoomPixelRatio: 3,
                  zoomInMultiplier: 2,
                  doubleTapDelay: 300,
                  doubleClickDelay: 300,
                  doubleClickMaxStops: 2,
                  keyboardMoveDistance: 50,
                  wheelZoomDistanceFactor: 100,
                  pinchZoomDistanceFactor: 100,
                  scrollToZoom: true
                }}
                captions={{
                  showToggle: false,
                  descriptionTextAlign: 'start',
                  descriptionMaxLines: 0 // Disable default captions, we'll use custom overlay
                }}
                thumbnails={{
                  position: 'top',
                  width: 120,
                  height: 80,
                  border: 1,
                  borderRadius: 4,
                  padding: 0,
                  gap: 16,
                  showToggle: false
                }}
                on={{ 
                  view: ({ index: idx }) => {
                    setIndex(idx);
                  },
                  // Navigate to next/prev artwork when swiping beyond gallery bounds
                  navigateTo: ({ index: targetIdx }) => {
                    if (targetIdx < 0 && prevId) {
                      // Swiped left from first image -> go to previous artwork
                      router.push(`/jeannette/catalogue/${prevId}`);
                      return;
                    }
                    if (targetIdx >= slides.length && nextId) {
                      // Swiped right from last image -> go to next artwork
                      router.push(`/jeannette/catalogue/${nextId}`);
                      return;
                    }
                  }
                }}
                render={{
                  slideHeader: () => null,
                  iconClose: () => (
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="18" y1="6" x2="6" y2="18"></line>
                      <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                  ),
                  slideFooter: () => (
                    <div 
                      className="yarl__slide_footer" 
                      style={{ 
                        position: 'fixed',
                        bottom: 0,
                        left: 0,
                        right: 0,
                        backgroundColor: '#000',
                        borderTop: '1px solid rgba(255,255,255,0.1)',
                        padding: window.innerWidth < 768 ? '12px 16px' : '20px 24px',
                        zIndex: 1000,
                        pointerEvents: 'auto',
                        minHeight: window.innerWidth < 768 ? '160px' : 'auto',
                        maxHeight: (showFullText || showFullAlt) ? 'min(65vh, 500px)' : (window.innerWidth < 768 ? '240px' : '180px'),
                        overflowY: (showFullText || showFullAlt) ? 'auto' : 'auto',
                        transition: 'max-height 0.3s ease'
                      }}
                      onClick={(e: React.MouseEvent) => e.stopPropagation()}
                    >
                      <div style={{ maxWidth: '1024px', margin: '0 auto' }}>
                        {/* Header with title, metadata, and image counter - always visible */}
                        <div style={{ marginBottom: (currentMeta.text || currentMeta.nom) ? '12px' : '0' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '4px' }}>
                            <h3 style={{ color: 'white', fontSize: window.innerWidth < 768 ? '16px' : '18px', fontWeight: '600', margin: 0, lineHeight: '1.3' }}>{work.title_fr}</h3>
                            <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: window.innerWidth < 768 ? '12px' : '13px', fontWeight: '500', marginLeft: '12px', flexShrink: 0 }}>
                              {index + 1}/{slides.length}
                            </span>
                          </div>
                          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: window.innerWidth < 768 ? '12px' : '13px', margin: 0, lineHeight: '1.4' }}>
                            {work.building_name || 'Sans localisation'}{work.city ? `, ${work.city}` : ''}{work.year ? ` (${work.year})` : ''}
                          </p>
                        </div>

                        {/* For gallery images: show nom as title */}
                        {currentMeta.nom && (
                          <div style={{ marginBottom: '6px' }}>
                            <h4 style={{ color: 'white', fontSize: window.innerWidth < 768 ? '14px' : '16px', fontWeight: '500', margin: 0, lineHeight: '1.3' }}>{currentMeta.nom}</h4>
                          </div>
                        )}
                        
                        {/* Main image: show text_fr description */}
                        {currentMeta.text && (
                          <div style={{ color: 'rgba(255,255,255,0.9)', fontSize: '14px', lineHeight: '1.6' }}>
                            {showFullText ? (
                              <div style={{ paddingRight: '8px' }}>
                                <p style={{ whiteSpace: 'pre-line' }}>{currentMeta.text}</p>
                                <div
                                  role="button"
                                  tabIndex={0}
                                  onClick={(e: React.MouseEvent) => {
                                    e.stopPropagation();
                                    setShowFullText(false);
                                  }}
                                  onKeyDown={(e: React.KeyboardEvent) => {
                                    if (e.key === 'Enter' || e.key === ' ') {
                                      e.preventDefault();
                                      setShowFullText(false);
                                    }
                                  }}
                                  style={{ 
                                    marginTop: '12px',
                                    color: 'rgb(147, 197, 253)',
                                    textDecoration: 'underline',
                                    fontSize: '12px',
                                    fontWeight: '500',
                                    cursor: 'pointer',
                                    display: 'inline-block',
                                    userSelect: 'none'
                                  }}
                                >
                                  Voir moins
                                </div>
                              </div>
                            ) : (
                              <div>
                                <p style={{ 
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                  display: '-webkit-box',
                                  WebkitLineClamp: window.innerWidth < 768 ? 3 : 2,
                                  WebkitBoxOrient: 'vertical',
                                  fontSize: window.innerWidth < 768 ? '13px' : '14px',
                                  lineHeight: '1.5'
                                }}>{currentMeta.text}</p>
                                {currentMeta.hasLongText && (
                                  <div
                                    role="button"
                                    tabIndex={0}
                                    onClick={(e: React.MouseEvent) => {
                                      e.stopPropagation();
                                      setShowFullText(true);
                                    }}
                                    onKeyDown={(e: React.KeyboardEvent) => {
                                      if (e.key === 'Enter' || e.key === ' ') {
                                        e.preventDefault();
                                        setShowFullText(true);
                                      }
                                    }}
                                    style={{ 
                                      marginTop: '8px',
                                      color: 'rgb(147, 197, 253)',
                                      textDecoration: 'underline',
                                      fontSize: '12px',
                                      fontWeight: '500',
                                      cursor: 'pointer',
                                      display: 'inline-block',
                                      userSelect: 'none'
                                    }}
                                  >
                                    Lire plus
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        )}

                        {/* Gallery images: show alt_fr description */}
                        {currentMeta.alt_fr && (
                          <div style={{ color: 'rgba(255,255,255,0.9)', fontSize: '14px', lineHeight: '1.6', marginBottom: '8px' }}>
                            {showFullAlt ? (
                              <div style={{ paddingRight: '8px' }}>
                                <p style={{ margin: 0, whiteSpace: 'pre-line' }}>{currentMeta.alt_fr}</p>
                                {currentMeta.hasLongAlt && (
                                  <div
                                    role="button"
                                    tabIndex={0}
                                    onClick={(e: React.MouseEvent) => {
                                      e.stopPropagation();
                                      setShowFullAlt(false);
                                    }}
                                    onKeyDown={(e: React.KeyboardEvent) => {
                                      if (e.key === 'Enter' || e.key === ' ') {
                                        e.preventDefault();
                                        setShowFullAlt(false);
                                      }
                                    }}
                                    style={{ 
                                      marginTop: '8px',
                                      color: 'rgb(147, 197, 253)',
                                      textDecoration: 'underline',
                                      fontSize: '12px',
                                      fontWeight: '500',
                                      cursor: 'pointer',
                                      display: 'inline-block',
                                      userSelect: 'none'
                                    }}
                                  >
                                    Voir moins
                                  </div>
                                )}
                              </div>
                            ) : (
                              <div>
                                <p style={{ 
                                  margin: 0,
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                  display: '-webkit-box',
                                  WebkitLineClamp: window.innerWidth < 768 ? 3 : 2,
                                  WebkitBoxOrient: 'vertical',
                                  fontSize: window.innerWidth < 768 ? '13px' : '14px',
                                  lineHeight: '1.5'
                                }}>{currentMeta.alt_fr}</p>
                                {currentMeta.hasLongAlt && (
                                  <div
                                    role="button"
                                    tabIndex={0}
                                    onClick={(e: React.MouseEvent) => {
                                      e.stopPropagation();
                                      setShowFullAlt(true);
                                    }}
                                    onKeyDown={(e: React.KeyboardEvent) => {
                                      if (e.key === 'Enter' || e.key === ' ') {
                                        e.preventDefault();
                                        setShowFullAlt(true);
                                      }
                                    }}
                                    style={{ 
                                      marginTop: '8px',
                                      color: 'rgb(147, 197, 253)',
                                      textDecoration: 'underline',
                                      fontSize: '12px',
                                      fontWeight: '500',
                                      cursor: 'pointer',
                                      display: 'inline-block',
                                      userSelect: 'none'
                                    }}
                                  >
                                    Lire plus
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        )}

                        {/* Gallery images: show photo credit */}
                        {currentMeta.credit && (
                          <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '12px', fontStyle: 'italic', marginTop: '8px' }}>
                            Photo : {currentMeta.credit}
                          </div>
                        )}
                      </div>
                    </div>
                  )
                }}
              />


              {showHint && (
                <div className="fixed top-20 left-1/2 -translate-x-1/2 bg-black/80 text-white px-5 py-3 rounded-lg text-sm select-none pointer-events-none animate-fade shadow-lg">
                  <div className="flex items-center gap-2">
                    <span>← →</span>
                    <span>Navigation</span>
                    <span className="mx-2">•</span>
                    <span>Molette : Zoom</span>
                    <span className="mx-2">•</span>
                    <span>Échap : Fermer</span>
                  </div>
                </div>
              )}


            {(work.text_fr || work.caption_fr) && (
              <p className="mb-6 md:mb-8 text-sm md:text-base text-gray-700 leading-relaxed">
                {work.text_fr || work.caption_fr}
              </p>
            )}

            <div className="space-y-3 md:space-y-4 mb-8 md:mb-12">
              {!work.text_fr && work.description_fr && (
                <p className="text-gray-800 leading-relaxed">
                  {work.description_fr}
                </p>
              )}
              <dl className="grid grid-cols-1 gap-y-3">
                <div>
                  <dt className="text-xs uppercase tracking-wide text-gray-500">Lieu</dt>
                  <dd className="text-gray-800">
                    {work.maps_url ? (
                      <a href={work.maps_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center text-blue-700 hover:text-blue-900 underline underline-offset-2">
                        <MapPin className="w-4 h-4 mr-1" />
                        {work.building_name}, {work.city}
                      </a>
                    ) : (
                      <span>{work.building_name}, {work.city}</span>
                    )}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs uppercase tracking-wide text-gray-500">Type d&apos;édifice</dt>
                  <dd className="text-gray-800">{work.building_type}</dd>
                </div>
                <div>
                  <dt className="text-xs uppercase tracking-wide text-gray-500">Département</dt>
                  <dd className="text-gray-800">{work.department}</dd>
                </div>
                <div>
                  <dt className="text-xs uppercase tracking-wide text-gray-500">Emplacement</dt>
                  <dd className="text-gray-800">{work.location_in_building}</dd>
                </div>
              </dl>
            </div>

            {work.gallery_images && work.gallery_images.length > 0 && (
              <div>
                <h2 className="text-xl md:text-2xl font-light mb-3 md:mb-4">Galerie</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
                  {work.gallery_images.map((image, index) => (
                    <div key={index} className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                      <Image
                        src={`https://weiss-gruber-jeanette.s3.fr-par.scw.cloud/vitraux/${image.url}`}
                        alt={image.alt_fr || work.title_fr}
                        width={200}
                        height={150}
                        sizes="200px"
                        quality={60}
                        placeholder="blur"
                        blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR4nGP8zwADAAMBAQAYXP4AAAAASUVORK5CYII="
                        className="object-cover w-full h-32 cursor-pointer"
                        onClick={() => { setIndex(index + 1); setOpen(true); }}
                      />
                      <div className="p-2 text-sm bg-gray-50">
                        <p className="font-semibold">{image.nom}</p>
                        {image.alt_fr && <p className="mt-1 text-xs text-gray-500">{image.alt_fr}</p>}
                        {image.credit && <p className="mt-1 text-xs text-gray-400">Crédit photo : {image.credit}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      <footer className="bg-gray-100 py-8">
        <div className="container mx-auto px-4 text-center text-gray-600">
          <p>&copy; {new Date().getFullYear()} Weiss-Gruber. Tous droits réservés.</p>
        </div>
      </footer>
    </div>
  );
}

// Fonction pour lire et parser le CSV
const getWorks = () => {
  const csvFilePath = path.join(process.cwd(), 'vitraux_metadata.csv');
  const csvFileContent = fs.readFileSync(csvFilePath, 'utf-8');
  const result = Papa.parse<CsvRow>(csvFileContent, {
    header: true,
    skipEmptyLines: true,
  });

  // Traitement pour parser la colonne gallery_images
          const works = result.data.map(work => {
    let gallery_images = [];
    if (typeof work.gallery_images === 'string' && work.gallery_images.trim().startsWith('[')) {
      try {
        gallery_images = JSON.parse(work.gallery_images);
      } catch (e) {
        console.error(`Erreur de parsing JSON pour l'œuvre ${work.id}:`, e);
        gallery_images = [];
      }
    }
    return { ...work, gallery_images };
  });

  return works as Vitrail[];
};

// Génère les chemins pour chaque œuvre
export const getStaticPaths: GetStaticPaths = async () => {
  const works = getWorks();
  const paths = works.map(work => ({
    params: { id: work.id },
  }));

  return {
    paths,
    fallback: false, // false signifie que toutes les routes sont pré-générées
  };
};

// Récupère les données pour une œuvre spécifique
export const getStaticProps: GetStaticProps = async ({ params }) => {
  const works = getWorks();
  const index = works.findIndex(w => w.id === params?.id);
  const work = index >= 0 ? works[index] : undefined;

  if (!work) {
    return { notFound: true };
  }

    const prevId = index > 0 ? works[index - 1].id : null;
  const nextId = index < works.length - 1 ? works[index + 1].id : null;
  const nextMainImage = nextId ? works[index + 1].main_image : null;

  return {
    props: {
      work,
      prevId,
      nextId,
      nextMainImage,
    },
  };
};

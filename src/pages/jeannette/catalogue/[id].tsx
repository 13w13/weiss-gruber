import { GetStaticPaths, GetStaticProps } from 'next';
import { useRouter } from 'next/router';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, MapPin, Map as MapIcon } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import type { Plugin } from 'yet-another-react-lightbox';
import Lightbox from 'yet-another-react-lightbox';
import Zoom from 'yet-another-react-lightbox/plugins/zoom';
import Captions from 'yet-another-react-lightbox/plugins/captions';
import Thumbnails from 'yet-another-react-lightbox/plugins/thumbnails';
import 'yet-another-react-lightbox/styles.css';
import 'yet-another-react-lightbox/plugins/captions.css';
import 'yet-another-react-lightbox/plugins/thumbnails.css';
import { Vitrail } from '@/types/images';
import { IMAGE_BASE_URL } from '@/lib/images';
import { s3ImageLoader } from '@/lib/imageLoader';
import { getWorks } from '@/lib/works';
import { SITE_URL } from '@/lib/site';
import PageMeta from '@/components/layout/PageMeta'
import SiteHeader from '@/components/layout/SiteHeader'
import SiteFooter from '@/components/layout/SiteFooter'

// Le composant pour la page de détail
interface Neighbour { id: string; title: string; year: string }

export default function VitrailDetail({ work, prev, next, nextMainImage, position, total }: {
  work: Vitrail;
  prev: Neighbour | null;
  next: Neighbour | null;
  nextMainImage?: string | null;
  position: number;
  total: number;
}) {
  const prevId = prev?.id ?? null;
  const nextId = next?.id ?? null;
  const router = useRouter();
  const touchStart = useRef<{ x: number; y: number } | null>(null);
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [showFullText, setShowFullText] = useState(false);
  const [showFullAlt, setShowFullAlt] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Prefetch hero of next artwork for instant loading (client only)
  useEffect(() => {
    if (typeof window !== 'undefined' && nextMainImage) {
      const img = new window.Image();
      img.src = `${IMAGE_BASE_URL}/vitraux/${nextMainImage}`;
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

  // Detect mobile to switch between Captions plugin and custom footer
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Auto-open lightbox if ?lightbox=true in URL (for mobile navigation)
  useEffect(() => {
    if (router.query.lightbox === 'true') {
      setOpen(true);
      setIndex(0);
      // Clean URL after opening
      router.replace(`/jeannette/catalogue/${router.query.id}`, undefined, { shallow: true });
    }
  }, [router]);

  // Use new text_fr field, or fallback to merged caption_fr + description_fr for backward compatibility
  const fullText = work.text_fr || [work.caption_fr, work.description_fr].filter(Boolean).join(' ');
  const hasLongText = fullText.length > 80;

  // Métadonnées de partage et données structurées pour les moteurs de recherche
  const pageUrl = `${SITE_URL}/jeannette/catalogue/${work.id}`;
  const ogImage = s3ImageLoader({ src: `${IMAGE_BASE_URL}/vitraux/${work.main_image}`, width: 1600 });
  const summary = `Vitrail de Jeannette Weiss Gruber, ${work.year} — ${work.building_name}, ${work.city}.${fullText ? ` ${fullText}` : ''}`;
  const metaDescription = summary.length > 160 ? `${summary.slice(0, 157).replace(/\s+\S*$/, '')}…` : summary;
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'VisualArtwork',
    name: work.title_fr,
    artform: 'Vitrail',
    dateCreated: work.year,
    url: pageUrl,
    image: ogImage,
    description: metaDescription,
    creator: { '@type': 'Person', name: 'Jeannette Weiss Gruber', birthDate: '1934', deathDate: '2026', url: `${SITE_URL}/jeannette` },
  };

  // Build slides once per render (needs to be before effects that depend on it)
  const slides = [
    { 
      src: `${IMAGE_BASE_URL}/vitraux/${work.main_image}`,
      alt: work.title_fr,
      title: work.title_fr,
      description: '' // We'll handle text display separately
    },
    ...(work.gallery_images?.map(img => ({
      src: `${IMAGE_BASE_URL}/vitraux/${img.url}`,
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

  // Glisser horizontalement sur la page (hors plein écran) pour passer à l'œuvre voisine
  const onTouchStart = (e: React.TouchEvent) => {
    const t = e.touches[0];
    touchStart.current = { x: t.clientX, y: t.clientY };
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    const start = touchStart.current;
    touchStart.current = null;
    if (!start || open) return;
    const t = e.changedTouches[0];
    const dx = t.clientX - start.x;
    const dy = t.clientY - start.y;
    if (Math.abs(dx) < 70 || Math.abs(dx) < Math.abs(dy) * 1.5) return;
    if (dx < 0 && nextId) router.push(`/jeannette/catalogue/${nextId}`);
    if (dx > 0 && prevId) router.push(`/jeannette/catalogue/${prevId}`);
  };

  if (router.isFallback) {
    return <div>Chargement...</div>;
  }



  // Slides with captions for mobile
  const slidesWithCaptions = [
    {
      src: `${IMAGE_BASE_URL}/vitraux/${work.main_image}`,
      alt: work.title_fr,
      title: `${work.title_fr} (1/${slides.length})`,
      description: `${work.building_name || 'Sans localisation'}${work.city ? `, ${work.city}` : ''}${work.year ? ` (${work.year})` : ''}\n\n${work.title_fr}\n\n${fullText || ''}`
    },
    ...(work.gallery_images?.map((img, idx) => {
      // Pour les galeries : titre principal + localisation, puis nom de l'image comme sous-titre
      let desc = `${work.building_name || 'Sans localisation'}${work.city ? `, ${work.city}` : ''}${work.year ? ` (${work.year})` : ''}`;
      if (img.nom) desc += `\n\n${img.nom}`; // Nom de l'image comme sous-titre
      if (img.alt_fr) desc += `\n\n${img.alt_fr}`; // Description
      if (img.credit) desc += `\n\nPhoto : ${img.credit}`; // Crédit
      
      return {
        src: `${IMAGE_BASE_URL}/vitraux/${img.url}`,
        alt: img.alt_fr || img.nom || work.title_fr,
        title: `${work.title_fr} (${idx + 2}/${slides.length})`, // Toujours le titre principal du vitrail
        description: desc
      };
    }) || [])
  ];

  // Build plugin list dynamically
  const plugins: Plugin[] = [Zoom, Captions];
  // Counter is now displayed in custom footer, not as a plugin
  if (slides.length > 4) plugins.push(Thumbnails);

  return (
    <div className="min-h-screen flex flex-col bg-white text-gray-900">
      <PageMeta
        title={`${work.title_fr} (${work.year}) — ${work.building_name}, ${work.city}`}
        description={metaDescription}
        path={`/jeannette/catalogue/${work.id}`}
        image={ogImage}
        type="article"
        jsonLd={jsonLd}
      />
      <SiteHeader />

      <main className="pt-20 md:pt-24 pb-24 md:pb-16" onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
        <div className="container mx-auto px-3 md:px-4">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-2xl md:text-4xl lg:text-5xl font-light mb-3 md:mb-4">{work.title_fr}</h1>
            <p className="text-base md:text-lg text-gray-600 mb-4">{work.year} - {work.building_name}, {work.city}</p>

            <nav className="hidden md:flex mb-6 justify-between items-center gap-4" aria-label="Œuvres voisines">
              {prev ? (
                <Link href={`/jeannette/catalogue/${prev.id}`} className="inline-flex items-center min-h-11 pr-3 text-gray-700 hover:text-blue-700 transition-colors">
                  <ChevronLeft className="w-5 h-5 mr-1 flex-shrink-0" />
                  <span><span className="block text-xs text-gray-500">Précédent · {prev.year}</span>{prev.title}</span>
                </Link>
              ) : <span />}
              <span className="text-sm text-gray-500 whitespace-nowrap">{position} / {total}</span>
              {next ? (
                <Link href={`/jeannette/catalogue/${next.id}`} className="inline-flex items-center min-h-11 pl-3 text-right text-gray-700 hover:text-blue-700 transition-colors">
                  <span><span className="block text-xs text-gray-500">Suivant · {next.year}</span>{next.title}</span>
                  <ChevronRight className="w-5 h-5 ml-1 flex-shrink-0" />
                </Link>
              ) : <span />}
            </nav>

                        <div className="relative h-64 sm:h-80 md:h-96 lg:h-[500px] mb-4 bg-gray-200 rounded-lg overflow-hidden cursor-pointer" onClick={() => { setIndex(0); setOpen(true); }}>
              <Image
                src={`${IMAGE_BASE_URL}/vitraux/${work.main_image}`}
                alt={work.title_fr}
                fill
                sizes="(max-width: 768px) 90vw, (max-width: 1280px) 70vw, 1024px"
                priority
                className="object-contain"
                loader={s3ImageLoader}
              />
            </div>

            <Lightbox
                open={open}
                close={() => {
                  setOpen(false);
                  setShowFullText(false); // Reset text expansion when closing
                }}
                index={index}
                slides={isMobile ? slidesWithCaptions : slides}
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
                  descriptionMaxLines: 8
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
                  }
                }}
                render={{
                  slideHeader: () => isMobile ? (
                    <>
                      {/* Compteur de photos en haut à droite */}
                      <div style={{
                        position: 'absolute',
                        top: 'calc(env(safe-area-inset-top, 0px) + 16px)',
                        right: '160px',
                        zIndex: 1001,
                        pointerEvents: 'none'
                      }}>
                        <div style={{
                          backgroundColor: 'rgba(0, 0, 0, 0.6)',
                          backdropFilter: 'blur(8px)',
                          WebkitBackdropFilter: 'blur(8px)',
                          padding: '6px 12px',
                          borderRadius: '20px',
                          color: 'white',
                          fontSize: '14px',
                          fontWeight: '500',
                          border: '1px solid rgba(255,255,255,0.2)'
                        }}>
                          {index + 1} / {slides.length}
                        </div>
                      </div>
                      
                      {/* Bouton "Vitrail suivant" sur la dernière image si nextId existe */}
                      {index === slides.length - 1 && nextId && (
                        <div style={{
                          position: 'absolute',
                          top: 'calc(env(safe-area-inset-top, 0px) + 100px)',
                          left: '16px',
                          zIndex: 1001,
                          pointerEvents: 'auto'
                        }}>
                          <button
                            onClick={(e: React.MouseEvent) => {
                              e.stopPropagation();
                              router.push(`/jeannette/catalogue/${nextId}?lightbox=true`);
                            }}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '6px',
                              padding: '8px 12px',
                              backgroundColor: 'rgba(147, 197, 253, 0.95)',
                              backdropFilter: 'blur(8px)',
                              WebkitBackdropFilter: 'blur(8px)',
                              border: 'none',
                              borderRadius: '20px',
                              color: '#000',
                              fontSize: '13px',
                              fontWeight: '600',
                              cursor: 'pointer',
                              boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                              transition: 'all 0.2s ease'
                            }}
                          >
                            <span>Vitrail suivant</span>
                            <ChevronRight style={{ width: '16px', height: '16px' }} />
                          </button>
                        </div>
                      )}
                    </>
                  ) : null,
                  iconClose: () => (
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="18" y1="6" x2="6" y2="18"></line>
                      <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                  ),
                  slideFooter: () => isMobile ? null : (
                    <div 
                      className="yarl__slide_footer"
                      style={{ 
                        position: 'fixed',
                        bottom: 0,
                        left: 0,
                        right: 0,
                        zIndex: 1000,
                        pointerEvents: 'auto',
                        display: 'flex',
                        flexDirection: 'column',
                      }}
                      onClick={(e: React.MouseEvent) => e.stopPropagation()}
                    >
                      <div
                        style={{ 
                          background: 'linear-gradient(to top, rgba(0,0,0,0.95), rgba(0,0,0,0.88))',
                          backdropFilter: 'blur(12px)',
                          WebkitBackdropFilter: 'blur(12px)',
                          borderTop: '1px solid rgba(255,255,255,0.1)',
                          padding: window.innerWidth < 640 ? '12px 14px' : (window.innerWidth < 768 ? '14px 18px' : '20px 24px'),
                          paddingBottom: `calc(${window.innerWidth < 640 ? '12px' : (window.innerWidth < 768 ? '14px' : '20px')} + env(safe-area-inset-bottom, 0px))`,
                          boxSizing: 'border-box',
                          overflowY: 'auto',
                          overflowX: 'hidden',
                          overscrollBehavior: 'contain',
                          touchAction: 'pan-y',
                          flex: '1 1 auto',
                          minHeight: 'fit-content',
                          transition: 'max-height 0.3s ease'
                        }}
                      >
                      <div style={{ maxWidth: '1024px', margin: '0 auto' }}>
                        {/* Header with title, metadata, and image counter - always visible */}
                        <div style={{ marginBottom: (currentMeta.text || currentMeta.nom) ? (window.innerWidth < 640 ? '8px' : '12px') : '0' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: window.innerWidth < 640 ? '2px' : '4px' }}>
                            <h3 style={{ color: 'white', fontSize: window.innerWidth < 640 ? '14px' : (window.innerWidth < 768 ? '16px' : '18px'), fontWeight: '600', margin: 0, lineHeight: '1.2' }}>{work.title_fr}</h3>
                            <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: window.innerWidth < 640 ? '11px' : (window.innerWidth < 768 ? '12px' : '13px'), fontWeight: '500', marginLeft: '8px', flexShrink: 0 }}>
                              {index + 1}/{slides.length}
                            </span>
                          </div>
                          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: window.innerWidth < 640 ? '11px' : (window.innerWidth < 768 ? '12px' : '13px'), margin: 0, lineHeight: '1.3' }}>
                            {work.building_name || 'Sans localisation'}{work.city ? `, ${work.city}` : ''}{work.year ? ` (${work.year})` : ''}
                          </p>
                        </div>

                        {/* For gallery images: show nom as title */}
                        {currentMeta.nom && (
                          <div style={{ marginBottom: window.innerWidth < 640 ? '4px' : '6px' }}>
                            <h4 style={{ color: 'white', fontSize: window.innerWidth < 640 ? '13px' : (window.innerWidth < 768 ? '14px' : '16px'), fontWeight: '500', margin: 0, lineHeight: '1.2' }}>{currentMeta.nom}</h4>
                          </div>
                        )}
                        
                        {/* Main image: show text_fr description */}
                        {currentMeta.text && (
                          <div style={{ color: 'rgba(255,255,255,0.9)', fontSize: window.innerWidth < 640 ? '12px' : '14px', lineHeight: '1.5' }}>
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
                                  lineHeight: '1.5',
                                  wordBreak: 'break-word',
                                  hyphens: 'auto'
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
                          <div style={{ color: 'rgba(255,255,255,0.9)', fontSize: window.innerWidth < 640 ? '12px' : '14px', lineHeight: '1.5', marginBottom: window.innerWidth < 640 ? '6px' : '8px' }}>
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
                                  lineHeight: '1.5',
                                  wordBreak: 'break-word',
                                  hyphens: 'auto'
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
                          <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: window.innerWidth < 640 ? '11px' : '12px', fontStyle: 'italic', marginTop: window.innerWidth < 640 ? '4px' : '8px' }}>
                            Photo : {currentMeta.credit}
                          </div>
                        )}

                        {/* Navigation inter-vitraux (mobile/tablette uniquement) */}
                        {window.innerWidth < 1024 && (
                          <div style={{ marginTop: window.innerWidth < 640 ? '10px' : '16px', paddingTop: window.innerWidth < 640 ? '8px' : '12px', borderTop: '1px solid rgba(255,255,255,0.1)', display: 'flex', justifyContent: 'space-between', gap: window.innerWidth < 640 ? '8px' : '12px' }}>
                            {index === 0 && prevId ? (
                              <button
                                onClick={(e: React.MouseEvent) => {
                                  e.stopPropagation();
                                  router.push(`/jeannette/catalogue/${prevId}`);
                                }}
                                style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: window.innerWidth < 640 ? '4px' : '6px',
                                  padding: window.innerWidth < 640 ? '8px 12px' : '10px 16px',
                                  backgroundColor: 'rgba(255,255,255,0.1)',
                                  border: '1px solid rgba(255,255,255,0.2)',
                                  borderRadius: '6px',
                                  color: 'white',
                                  fontSize: window.innerWidth < 640 ? '12px' : '14px',
                                  fontWeight: '500',
                                  cursor: 'pointer',
                                  transition: 'all 0.2s ease',
                                  flex: 1
                                }}
                                onMouseEnter={(e) => {
                                  e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.15)';
                                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.3)';
                                }}
                                onMouseLeave={(e) => {
                                  e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)';
                                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)';
                                }}
                              >
                                <ChevronLeft style={{ width: '16px', height: '16px' }} />
                                <span>Vitrail précédent</span>
                              </button>
                            ) : (
                              <div style={{ flex: 1 }} />
                            )}
                            
                            {index === slides.length - 1 && nextId ? (
                              <button
                                onClick={(e: React.MouseEvent) => {
                                  e.stopPropagation();
                                  router.push(`/jeannette/catalogue/${nextId}`);
                                }}
                                style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: window.innerWidth < 640 ? '4px' : '6px',
                                  padding: window.innerWidth < 640 ? '8px 12px' : '10px 16px',
                                  backgroundColor: 'rgba(255,255,255,0.1)',
                                  border: '1px solid rgba(255,255,255,0.2)',
                                  borderRadius: '6px',
                                  color: 'white',
                                  fontSize: window.innerWidth < 640 ? '12px' : '14px',
                                  fontWeight: '500',
                                  cursor: 'pointer',
                                  transition: 'all 0.2s ease',
                                  flex: 1,
                                  justifyContent: 'flex-end'
                                }}
                                onMouseEnter={(e) => {
                                  e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.15)';
                                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.3)';
                                }}
                                onMouseLeave={(e) => {
                                  e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)';
                                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)';
                                }}
                              >
                                <span>Vitrail suivant</span>
                                <ChevronRight style={{ width: '16px', height: '16px' }} />
                              </button>
                            ) : (
                              <div style={{ flex: 1 }} />
                            )}
                          </div>
                        )}
                      </div>
                      </div>
                    </div>
                  )
                }}
              />


              {showHint && (
                <div className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-black/80 text-white px-5 py-3 rounded-lg text-sm select-none pointer-events-none animate-fade shadow-lg z-50">
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
                    {work.lat && work.lng && (
                      <Link href={`/jeannette/carte?oeuvre=${work.id}`} className="ml-3 inline-flex items-center text-sm text-gray-600 hover:text-blue-700 underline underline-offset-2">
                        <MapIcon className="w-4 h-4 mr-1" />
                        Voir sur la carte
                      </Link>
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
                        src={`${IMAGE_BASE_URL}/vitraux/${image.url}`}
                        alt={image.alt_fr || work.title_fr}
                        loader={s3ImageLoader}
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

      {/* Navigation fixe sur mobile : grands boutons faciles à toucher */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-[1050] bg-white/95 backdrop-blur border-t border-gray-200 pb-[env(safe-area-inset-bottom)]" aria-label="Œuvres voisines">
        <div className="flex items-stretch h-14">
          {prev ? (
            <Link href={`/jeannette/catalogue/${prev.id}`} className="flex-1 flex items-center gap-1 px-3 text-gray-800 active:bg-gray-100">
              <ChevronLeft className="w-5 h-5 flex-shrink-0" />
              <span className="text-sm">Précédent</span>
            </Link>
          ) : <span className="flex-1" />}
          <span className="flex items-center px-2 text-xs text-gray-500">{position} / {total}</span>
          {next ? (
            <Link href={`/jeannette/catalogue/${next.id}`} className="flex-1 flex items-center justify-end gap-1 px-3 text-gray-800 active:bg-gray-100">
              <span className="text-sm">Suivant</span>
              <ChevronRight className="w-5 h-5 flex-shrink-0" />
            </Link>
          ) : <span className="flex-1" />}
        </div>
      </nav>

      <SiteFooter />
      {/* Réserve la place de la barre fixe pour que le pied de page reste lisible */}
      <div className="md:hidden h-14" aria-hidden="true" />
    </div>
  );
}

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

  const neighbour = (w?: Vitrail) => (w ? { id: w.id, title: w.title_fr, year: w.year } : null);
  const nextWork = works[index + 1];

  return {
    props: {
      work,
      prev: neighbour(works[index - 1]),
      next: neighbour(nextWork),
      nextMainImage: nextWork?.main_image ?? null,
      position: index + 1,
      total: works.length,
    },
  };
};

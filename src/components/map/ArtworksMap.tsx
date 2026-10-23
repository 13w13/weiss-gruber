import { useEffect, useMemo, useRef, useState, type RefObject } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { MapContainer, TileLayer, Marker, Popup, Polyline, Tooltip, useMap } from 'react-leaflet';
import 'leaflet.fullscreen/Control.FullScreen.css';
import 'leaflet.fullscreen';
import Image from 'next/image';
import L from 'leaflet';
import { Search } from 'lucide-react';
import type { Vitrail } from '@/types/images';
import { IMAGE_BASE_URL } from '@/lib/images';
import { s3ImageLoader } from '@/lib/imageLoader';
import { decadeOf, matchesQuery } from '@/lib/text';
import OtherVitrailLink from '@/components/layout/OtherVitrailLink';
import { useT } from '@/i18n';

// Couleurs de verre par décennie : cobalt, émeraude, améthyste, jaune d'argent, rubis, opalescent
const GLASS: Record<number, string> = {
  1950: '#1f4e9c',
  1960: '#2f7d5b',
  1970: '#6b4c9a',
  1980: '#c8962e',
  1990: '#a3263a',
  2000: '#5f8fb8',
};
const LEAD = '#2a2a2a';
const glassFor = (year?: string) => GLASS[decadeOf(year) ?? 0] ?? '#7a7a7a';

// Option ajoutée par leaflet.fullscreen, absente des types de react-leaflet
const FULLSCREEN_OPTION = { fullscreenControl: true } as Record<string, unknown>;

// Une œuvre appartient à l'Europe si elle est à l'est de -30° de longitude (sinon : Québec)
const isEurope = (p: Place) => p.lng > -30;

interface Place {
  key: string;
  lat: number;
  lng: number;
  building_name: string;
  city: string;
  department: string;
  works: Vitrail[];
}

type View = 'europe' | 'quebec' | 'all';

const placeLocality = (p: Place) => [p.city, p.department].filter(Boolean).join(', ');
const placeYears = (p: Place) => p.works.map((w) => w.year).join(', ');

function workImages(work: Vitrail) {
  const s3Base = `${IMAGE_BASE_URL}/vitraux/`;
  const list: { src: string; alt: string }[] = [];
  if (work.main_image) list.push({ src: `${s3Base}${work.main_image}`, alt: work.title_fr });
  for (const g of work.gallery_images ?? []) {
    if (g?.url) list.push({ src: g.url.startsWith('http') ? g.url : `${s3Base}${g.url}`, alt: g.alt_fr || work.title_fr });
  }
  return list;
}

function PlacePopup({ place }: { place: Place }) {
  const t = useT();
  const [selected, setSelected] = useState(0);
  const [idx, setIdx] = useState(0);
  const work = place.works[Math.min(selected, place.works.length - 1)];
  const images = useMemo(() => workImages(work), [work]);

  useEffect(() => setIdx(0), [selected]);

  const mapsHref = work.maps_url?.trim() || `https://www.google.com/maps?q=${place.lat},${place.lng}`;

  return (
    <div className="w-60 sm:w-64">
      <p className="text-[15px] leading-snug text-gray-900">{place.building_name}</p>
      <p className="text-xs text-gray-500 mb-2.5">{placeLocality(place)}</p>

      {place.works.length > 1 ? (
        <ul className="mb-2.5 max-h-28 sm:max-h-40 overflow-y-auto border-y border-gray-200 divide-y divide-gray-100" aria-label={t.map.worksInBuilding}>
          {place.works.map((w, i) => (
            <li key={w.id}>
              <button
                type="button"
                aria-pressed={i === selected}
                onClick={() => setSelected(i)}
                className={`w-full text-left text-xs py-1.5 pl-2 border-l-2 ${i === selected ? '' : 'border-transparent text-gray-600 hover:text-gray-900'}`}
                style={i === selected ? { borderLeftColor: glassFor(w.year) } : undefined}
              >
                <span className="tabular-nums font-semibold text-gray-900">{w.year}</span>{' '}
                <span className="text-gray-800">{w.title_fr}</span>
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-xs text-gray-700 mb-2.5"><span className="tabular-nums font-semibold">{work.year}</span> {work.title_fr}</p>
      )}

      {images.length > 0 && (
        <div>
          <div className="relative w-full h-28 sm:h-36 bg-gray-100 overflow-hidden">
            <Image src={images[idx].src} alt={images[idx].alt} fill sizes="256px" className="object-cover" loader={s3ImageLoader} />
          </div>
          {images.length > 1 && (
            <div className="mt-1.5 flex items-center justify-between text-xs">
              <button type="button" onClick={() => setIdx((i) => (i - 1 + images.length) % images.length)} className="py-1 pr-2 text-gray-700 hover:text-gray-950">‹ {t.common.previous}</button>
              <span className="tabular-nums text-gray-500">{idx + 1}/{images.length}</span>
              <button type="button" onClick={() => setIdx((i) => (i + 1) % images.length)} className="py-1 pl-2 text-gray-700 hover:text-gray-950">{t.common.next} ›</button>
            </div>
          )}
        </div>
      )}

      <div className="mt-2.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs">
        <Link href={`/jeannette/catalogue/${work.id}`} className="font-semibold underline underline-offset-2" style={{ color: GLASS[1950] }}>{t.common.seeWork}</Link>
        <a href={mapsHref} target="_blank" rel="noreferrer noopener" className="!text-gray-600 underline underline-offset-2 hover:!text-gray-900">{t.common.openInMaps}</a>
      </div>
    </div>
  );
}

// Cabochon de verre serti de plomb ; un chiffre quand l'édifice compte plusieurs réalisations
function markerIcon(color: string, count: number) {
  const size = count > 1 ? 26 : 18;
  return L.divIcon({
    className: '',
    html: `<span class="wg-glass" style="--glass:${color};width:${size}px;height:${size}px">${count > 1 ? count : ''}</span>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
    popupAnchor: [0, -size / 2],
  });
}

function boundsOf(places: Place[]) {
  return L.latLngBounds(places.map((p) => L.latLng(p.lat, p.lng)));
}

// Pilote la carte : cadrage quand les filtres changent, zoom molette au clic, centrage sur un lieu demandé
function MapController({ fit, focus, markers }: {
  fit: { places: Place[]; token: string };
  focus: { key: string; token: number } | null;
  markers: RefObject<Record<string, L.Marker | null>>;
}) {
  const map = useMap();

  useEffect(() => {
    if (!fit.places.length) return;
    map.fitBounds(boundsOf(fit.places), { padding: [28, 28], maxZoom: 12 });
  }, [map, fit.token]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!focus) return;
    const marker = markers.current[focus.key];
    if (!marker) return;
    const zoom = Math.max(map.getZoom(), 12);
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      map.setView(marker.getLatLng(), zoom);
      marker.openPopup();
    } else {
      map.flyTo(marker.getLatLng(), zoom, { duration: 0.8 });
      map.once('moveend', () => marker.openPopup());
    }
  }, [map, focus, markers]);

  useEffect(() => {
    map.scrollWheelZoom.disable();
    const enable = () => map.scrollWheelZoom.enable();
    const disable = () => map.scrollWheelZoom.disable();
    map.on('click', enable);
    map.on('mouseout', disable);
    return () => {
      map.off('click', enable);
      map.off('mouseout', disable);
    };
  }, [map]);

  return null;
}

export default function ArtworksMap({ works }: { works: Vitrail[] }) {
  const t = useT();
  const router = useRouter();
  const mapWrapperRef = useRef<HTMLDivElement>(null);
  const markerRefs = useRef<Record<string, L.Marker | null>>({});

  const [colorMap, setColorMap] = useState(false);
  const [showPath, setShowPath] = useState(true);
  const [query, setQuery] = useState('');
  const [view, setView] = useState<View>('europe');
  const [focus, setFocus] = useState<{ key: string; token: number } | null>(null);
  const [activeKey, setActiveKey] = useState<string | null>(null);
  const [canHover, setCanHover] = useState(false);

  useEffect(() => setCanHover(window.matchMedia('(hover: hover)').matches), []);

  // Regroupe les œuvres par édifice (mêmes coordonnées)
  const { places, unlocated } = useMemo(() => {
    const byKey = new Map<string, Place>();
    const without: Vitrail[] = [];
    for (const w of works) {
      const lat = parseFloat(w.lat ?? '');
      const lng = parseFloat(w.lng ?? '');
      if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
        without.push(w);
        continue;
      }
      const key = `${lat.toFixed(4)},${lng.toFixed(4)}`;
      const place = byKey.get(key) ?? { key, lat, lng, building_name: w.building_name, city: w.city, department: w.department, works: [] };
      place.works.push(w);
      byKey.set(key, place);
    }
    return { places: Array.from(byKey.values()), unlocated: without };
  }, [works]);

  // Décennies sélectionnées, gardées dans l'URL (?decades=1960,1980)
  const selectedDecades = useMemo(() => {
    const q = router.query.decades;
    return typeof q === 'string' ? q.split(',').map((s) => parseInt(s, 10)).filter((n) => !Number.isNaN(n)) : [];
  }, [router.query.decades]);

  const toggleDecade = (d: number) => {
    const next = selectedDecades.includes(d) ? selectedDecades.filter((x) => x !== d) : [...selectedDecades, d].sort();
    const q = { ...router.query } as Record<string, string | string[]>;
    if (next.length) q.decades = next.join(','); else delete q.decades;
    router.replace({ pathname: router.pathname, query: q }, undefined, { shallow: true, scroll: false });
  };

  const decades = useMemo(() => {
    const s = new Set<number>();
    for (const w of works) {
      const d = decadeOf(w.year);
      if (d !== undefined) s.add(d);
    }
    return Array.from(s).sort((a, b) => a - b);
  }, [works]);

  const workMatches = (w: Vitrail) => {
    const d = decadeOf(w.year);
    const decadeOk = selectedDecades.length === 0 || (d !== undefined && selectedDecades.includes(d));
    return decadeOk && matchesQuery(query, [w.building_name, w.city, w.department, w.title_fr, w.year, w.building_type]);
  };

  const filteredPlaces = useMemo(() => {
    return places
      .map((p) => ({ ...p, works: p.works.filter(workMatches) }))
      .filter((p) => p.works.length > 0)
      .sort((a, b) => (parseInt(a.works[0].year) || 0) - (parseInt(b.works[0].year) || 0));
  }, [places, selectedDecades, query]); // eslint-disable-line react-hooks/exhaustive-deps

  const filtering = selectedDecades.length > 0 || query.trim().length > 0;

  // Lieux à cadrer selon la vue choisie ; si la vue est vide après filtrage, on cadre tous les résultats
  const fit = useMemo(() => {
    let target = filteredPlaces;
    if (view !== 'all') {
      const inView = filteredPlaces.filter((p) => (view === 'europe' ? isEurope(p) : !isEurope(p)));
      if (inView.length) target = inView;
    }
    return { places: target, token: `${view}|${selectedDecades.join(',')}|${query}` };
  }, [filteredPlaces, view, selectedDecades, query]);

  const icons = useMemo(
    () => Object.fromEntries(filteredPlaces.map((p) => [p.key, markerIcon(glassFor(p.works[0].year), p.works.length)])),
    [filteredPlaces],
  );

  // Parcours chronologique des lieux de la vue affichée, tracé comme une ligne de plomb
  // (en vue France, pas de lignes qui partent vers le Québec hors du cadre)
  const path = useMemo(() => {
    const inView = view === 'all' ? filteredPlaces : filteredPlaces.filter((p) => (view === 'europe' ? isEurope(p) : !isEurope(p)));
    const pts = (inView.length ? inView : filteredPlaces)
      .flatMap((p) => p.works.map((w) => ({ year: parseInt(w.year) || 0, lat: p.lat, lng: p.lng })))
      .sort((a, b) => a.year - b.year);
    const line: [number, number][] = [];
    for (const p of pts) {
      const last = line[line.length - 1];
      if (!last || last[0] !== p.lat || last[1] !== p.lng) line.push([p.lat, p.lng]);
    }
    return line;
  }, [filteredPlaces, view]);

  // ?oeuvre=<id> : ouvre directement le lieu de cette œuvre
  useEffect(() => {
    const id = router.query.oeuvre;
    if (typeof id !== 'string') return;
    const place = places.find((p) => p.works.some((w) => w.id === id));
    if (!place) return;
    const timer = setTimeout(() => {
      setActiveKey(place.key);
      setFocus({ key: place.key, token: Date.now() });
    }, 400);
    return () => clearTimeout(timer);
  }, [router.query.oeuvre, places]);

  const focusPlace = (key: string) => {
    // Sur mobile la carte est au-dessus de la liste : on la ramène à l'écran
    if (window.matchMedia('(max-width: 1023px)').matches) {
      mapWrapperRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    setActiveKey(key);
    setFocus({ key, token: Date.now() });
  };

  const views: [View, string][] = [['europe', t.map.viewFrance], ['quebec', t.map.viewQuebec], ['all', t.map.viewAll]];

  return (
    <div className="wg-map" data-grisaille={!colorMap}>
      {/* Mobile : réglages, carte, index. Ordinateur : carte à gauche sur toute la hauteur, réglages et index à droite */}
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_23rem] xl:grid-cols-[minmax(0,1fr)_25rem] lg:gap-x-10 lg:gap-y-6 lg:items-start">
        {/* Recherche, décennies (légende et filtre à la fois) et cadrage */}
        <div className="space-y-5 lg:col-start-2 lg:row-start-1">
          <div className="relative">
            <Search className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" aria-hidden="true" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t.map.searchPlaceholder}
              aria-label={t.map.searchLabel}
              className="w-full h-11 pl-7 pr-2 bg-transparent border-0 border-b border-gray-300 focus:border-gray-900 focus:outline-none text-base placeholder:text-gray-400"
            />
          </div>

          <div>
            <div className="grid grid-cols-6 gap-2" role="group" aria-label={t.catalogue.decadeFilter}>
              {decades.map((d) => {
                const active = selectedDecades.includes(d);
                const dimmed = selectedDecades.length > 0 && !active;
                return (
                  <button
                    key={d}
                    type="button"
                    aria-pressed={active}
                    onClick={() => toggleDecade(d)}
                    className={`group flex flex-col items-stretch pt-1 pb-1 text-left transition-opacity ${dimmed ? 'opacity-35 hover:opacity-80' : ''}`}
                  >
                    <span className="wg-pane block h-3.5" style={{ ['--glass' as string]: GLASS[d] ?? '#7a7a7a' }} data-active={active} aria-hidden="true" />
                    <span className={`mt-1.5 text-[13px] tabular-nums ${active ? 'text-gray-950 font-semibold' : 'text-gray-600 group-hover:text-gray-900'}`}>{d}</span>
                  </button>
                );
              })}
            </div>
            <p className="mt-1.5 text-xs leading-relaxed text-gray-500">{t.map.legend}</p>
          </div>

        </div>

        <div ref={mapWrapperRef} className="relative h-[60vh] lg:h-[calc(100vh-6.5rem)] lg:sticky lg:top-20 lg:self-start lg:col-start-1 lg:row-start-1 lg:row-span-3 border border-gray-300">
          <MapContainer center={[46.6, 2.5]} zoom={6} style={{ height: '100%', width: '100%' }} {...FULLSCREEN_OPTION}>
            <TileLayer attribution="&copy; OpenStreetMap contributors" url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

            <MapController fit={fit} focus={focus} markers={markerRefs} />

            {showPath && path.length >= 2 && (
              <Polyline positions={path} pathOptions={{ color: LEAD, weight: 1.5, opacity: 0.6, dashArray: '1 5', lineCap: 'round' }} />
            )}

            {filteredPlaces.map((place) => (
              <Marker
                key={place.key}
                position={[place.lat, place.lng]}
                icon={icons[place.key]}
                ref={(m) => { markerRefs.current[place.key] = m; }}
                eventHandlers={{ click: () => setActiveKey(place.key) }}
              >
                {canHover && (
                  <Tooltip direction="top" offset={[0, -10]} opacity={1}>
                    {place.building_name} ({placeYears(place)})
                  </Tooltip>
                )}
                <Popup>
                  <PlacePopup place={place} />
                </Popup>
              </Marker>
            ))}
          </MapContainer>

          <label className="absolute bottom-6 left-2 z-[500] inline-flex items-center gap-2 bg-white/95 border border-gray-400 px-2.5 py-1.5 text-xs text-gray-800 cursor-pointer select-none">
            <input type="checkbox" checked={colorMap} onChange={(e) => setColorMap(e.target.checked)} className="w-3.5 h-3.5 accent-gray-800" />
            {t.map.colorMap}
          </label>

          {filtering && filteredPlaces.length === 0 && (
            <div className="absolute inset-0 z-[500] flex items-center justify-center pointer-events-none">
              <p className="bg-white/95 border border-gray-300 px-4 py-2 text-sm text-gray-700">{t.map.noMatch}</p>
            </div>
          )}
        </div>

        {/* Cadrage et parcours : sous la carte sur mobile */}
        <div className="-mt-2 lg:mt-0 lg:col-start-2 lg:row-start-2 flex flex-wrap items-center justify-between gap-x-5 gap-y-1">
          <div role="group" aria-label={t.map.frame} className="flex gap-5 text-sm">
            {views.map(([v, label]) => (
              <button
                key={v}
                type="button"
                aria-pressed={view === v}
                onClick={() => setView(v)}
                className={`h-9 border-b-2 ${view === v ? 'border-gray-900 text-gray-950' : 'border-transparent text-gray-500 hover:text-gray-900'}`}
              >
                {label}
              </button>
            ))}
          </div>
          <label className="inline-flex items-center gap-2 h-9 text-sm text-gray-700 cursor-pointer select-none">
            <input type="checkbox" checked={showPath} onChange={(e) => setShowPath(e.target.checked)} className="w-4 h-4 accent-gray-800" />
            {t.map.path}
          </label>
        </div>

        {/* Index des lieux, synchronisé avec la carte */}
        <section className="lg:col-start-2 lg:row-start-3" aria-labelledby="liste-lieux">
          <h2 id="liste-lieux" className="text-lg font-light text-gray-900 mb-2">
            {t.map.places(filteredPlaces.length)}
            {filtering && <span className="text-gray-500">{t.map.matching(filteredPlaces.length)}</span>}
          </h2>
          <ul className="border-t border-gray-300">
            {filteredPlaces.map((place) => {
              const active = activeKey === place.key;
              return (
                <li key={place.key} className="border-b border-gray-200">
                  <button
                    type="button"
                    onClick={() => focusPlace(place.key)}
                    aria-current={active ? 'true' : undefined}
                    className={`w-full text-left grid grid-cols-[3.5rem_minmax(0,1fr)] gap-x-3 py-3 pl-2 border-l-[3px] transition-colors hover:bg-gray-50 ${active ? 'bg-gray-50' : 'border-transparent'}`}
                    style={active ? { borderLeftColor: glassFor(place.works[0].year) } : undefined}
                  >
                    <span className="flex items-center gap-2 tabular-nums text-sm text-gray-900 pt-0.5">
                      <span className="wg-glass wg-glass--sm" style={{ ['--glass' as string]: glassFor(place.works[0].year) }} aria-hidden="true" />
                      {place.works[0].year}
                    </span>
                    <span>
                      <span className="block text-gray-950 leading-snug">{place.building_name}</span>
                      <span className="block text-sm text-gray-500">
                        {placeLocality(place)}
                        {place.works.length > 1 && <>, {place.works.length} {t.common.works(place.works.length)} ({placeYears(place)})</>}
                      </span>
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>

          {unlocated.length > 0 && (
            <p className="mt-4 text-sm text-gray-600">
              {t.map.unlocated}{' '}
              {unlocated.map((w, i) => (
                <span key={w.id}>
                  {i > 0 && ', '}
                  <Link href={`/jeannette/catalogue/${w.id}`} className="underline underline-offset-2 hover:text-gray-950">{w.title_fr} ({w.year}, {w.city})</Link>
                </span>
              ))}
              .
            </p>
          )}

          <OtherVitrailLink className="mt-4" />
        </section>
      </div>

      <style jsx global>{`
        /* Fond en grisaille : la carte s'efface pour laisser la couleur aux vitraux */
        .wg-map[data-grisaille='true'] .leaflet-tile-pane {
          filter: grayscale(1) contrast(0.7) brightness(1.12);
        }
        .wg-map .leaflet-container {
          background: #eceae6;
          font: inherit;
        }

        /* Cabochon de verre serti de plomb */
        .wg-glass {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border-radius: 9999px;
          border: 2px solid ${LEAD};
          background:
            radial-gradient(circle at 34% 30%, rgba(255, 255, 255, 0.75) 0 14%, rgba(255, 255, 255, 0) 38%),
            radial-gradient(circle at 50% 50%, var(--glass) 0 55%, color-mix(in srgb, var(--glass) 70%, #000) 100%);
          color: #fff;
          font: 600 11px/1 Arial, Helvetica, sans-serif;
          text-shadow: 0 1px 1px rgba(0, 0, 0, 0.6);
          transition: box-shadow 0.15s ease-out;
        }
        .leaflet-marker-icon:hover .wg-glass,
        .leaflet-marker-icon:focus-visible .wg-glass {
          box-shadow: 0 0 0 5px color-mix(in srgb, var(--glass) 30%, transparent);
        }
        .wg-glass--sm {
          width: 10px;
          height: 10px;
          border-width: 1.5px;
          flex-shrink: 0;
        }

        /* Bande des décennies : petits panneaux de verre sertis */
        .wg-pane {
          border: 1.5px solid ${LEAD};
          background: linear-gradient(180deg, color-mix(in srgb, var(--glass) 70%, #fff) 0%, var(--glass) 60%, color-mix(in srgb, var(--glass) 80%, #000) 100%);
        }
        .wg-pane[data-active='true'] {
          box-shadow: 0 0 0 3px color-mix(in srgb, var(--glass) 25%, transparent);
        }

        /* Bulles et commandes Leaflet sobres */
        .wg-map .leaflet-popup-content-wrapper {
          border-radius: 2px;
          border: 1px solid ${LEAD};
          box-shadow: 0 6px 18px rgba(0, 0, 0, 0.18);
        }
        .wg-map .leaflet-popup-content {
          margin: 14px 16px 12px;
        }
        .wg-map .leaflet-popup-tip {
          box-shadow: none;
        }
        .wg-map .leaflet-bar {
          border: 1px solid #9a9a9a;
          border-radius: 2px;
          box-shadow: none;
        }
        .wg-map .leaflet-bar a {
          border-radius: 0 !important;
          color: ${LEAD};
        }
        .wg-map .leaflet-tooltip {
          border-radius: 2px;
          border: 1px solid ${LEAD};
          box-shadow: none;
          font-size: 12px;
        }

        @media (prefers-reduced-motion: reduce) {
          .wg-glass { transition: none; }
        }
      `}</style>
    </div>
  );
}

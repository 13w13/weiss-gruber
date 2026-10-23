import { useEffect, useMemo, useRef, useState, type RefObject } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { MapContainer, TileLayer, Marker, Popup, Polyline, Tooltip, useMap } from 'react-leaflet';
import 'leaflet.fullscreen/Control.FullScreen.css';
import 'leaflet.fullscreen';
import Image from 'next/image';
import L from 'leaflet';
import { ChevronLeft, ChevronRight, Pause, Play, Search, X } from 'lucide-react';
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

// Losange de verre (comme les vitreries losangées en grisaille), en aplat ;
// un chiffre quand l'édifice compte plusieurs réalisations
function markerIcon(color: string, count: number) {
  const side = count > 1 ? 20 : 13;
  const box = Math.ceil(side * Math.SQRT2) + 2;
  return L.divIcon({
    className: 'wg-marker',
    html: `<span class="wg-quarry" style="--glass:${color};--side:${side}px"><span>${count > 1 ? count : ''}</span></span>`,
    iconSize: [box, box],
    iconAnchor: [box / 2, box / 2],
    popupAnchor: [0, -box / 2],
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

interface JourneyStep {
  work: Vitrail;
  place: Place;
}

// Voyage chronologique : temps passé sur chaque œuvre après le vol, et durée du vol
const JOURNEY_DWELL_MS = 2600;
const journeyFlightSeconds = (from: JourneyStep | undefined, to: JourneyStep) =>
  from && L.latLng(from.place.lat, from.place.lng).distanceTo(L.latLng(to.place.lat, to.place.lng)) > 1_000_000 ? 2.6 : 1.6;
const prefersReducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Caméra du voyage : vole vers l'œuvre courante ; à la sortie du voyage, recadre l'ensemble
function JourneyCamera({ step, previous, active, fitPlaces }: {
  step: JourneyStep | undefined;
  previous: JourneyStep | undefined;
  active: boolean;
  fitPlaces: Place[];
}) {
  const map = useMap();
  const wasActive = useRef(false);

  useEffect(() => {
    if (active && step) {
      map.closePopup();
      const target = L.latLng(step.place.lat, step.place.lng);
      if (prefersReducedMotion()) map.setView(target, 9);
      else map.flyTo(target, 9, { duration: journeyFlightSeconds(previous, step), easeLinearity: 0.2 });
    } else if (!active && wasActive.current && fitPlaces.length) {
      map.fitBounds(boundsOf(fitPlaces), { padding: [28, 28], maxZoom: 12 });
    }
    wasActive.current = active;
  }, [map, active, step]); // eslint-disable-line react-hooks/exhaustive-deps

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
  const [journey, setJourney] = useState<{ index: number; playing: boolean } | null>(null);
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

  // Étapes du voyage : les œuvres localisées et affichées, dans l'ordre chronologique du catalogue
  const steps = useMemo<JourneyStep[]>(() => {
    const placeOf = new Map<string, Place>();
    for (const p of filteredPlaces) for (const w of p.works) placeOf.set(w.id, p);
    return works.filter((w) => placeOf.has(w.id)).map((w) => ({ work: w, place: placeOf.get(w.id) as Place }));
  }, [works, filteredPlaces]);

  // Un changement de filtre arrête le voyage
  useEffect(() => setJourney(null), [selectedDecades, query]);

  // Lecture automatique : étape suivante après le vol et un temps d'arrêt ; pause à la dernière œuvre
  useEffect(() => {
    if (!journey?.playing) return;
    if (journey.index >= steps.length - 1) {
      setJourney((j) => (j ? { ...j, playing: false } : j));
      return;
    }
    const flight = prefersReducedMotion() ? 0 : journeyFlightSeconds(steps[journey.index - 1], steps[journey.index]) * 1000;
    const timer = setTimeout(() => setJourney((j) => (j && j.playing ? { ...j, index: j.index + 1 } : j)), flight + JOURNEY_DWELL_MS);
    return () => clearTimeout(timer);
  }, [journey, steps]);

  // État des points pendant le voyage : déjà visités, courant, à venir (estompés)
  useEffect(() => {
    const current = journey ? steps[journey.index]?.place.key : undefined;
    const visited = new Set(journey ? steps.slice(0, journey.index + 1).map((s) => s.place.key) : []);
    for (const p of filteredPlaces) {
      const el = markerRefs.current[p.key]?.getElement();
      if (!el) continue;
      if (!journey) el.removeAttribute('data-journey');
      else el.setAttribute('data-journey', p.key === current ? 'current' : visited.has(p.key) ? 'visited' : 'future');
    }
  }, [journey, steps, filteredPlaces]);

  // Tracé du voyage : il s'allonge à chaque étape
  const journeyPath = useMemo(() => {
    const line: [number, number][] = [];
    if (!journey) return line;
    for (const st of steps.slice(0, journey.index + 1)) {
      const last = line[line.length - 1];
      if (!last || last[0] !== st.place.lat || last[1] !== st.place.lng) line.push([st.place.lat, st.place.lng]);
    }
    return line;
  }, [journey, steps]);

  const pauseJourney = () => setJourney((j) => (j ? { ...j, playing: false } : j));
  const goToStep = (index: number) =>
    setJourney((j) => ({ index: Math.max(0, Math.min(steps.length - 1, index)), playing: j?.playing ?? false }));
  const togglePlay = () =>
    setJourney((j) => (j ? { index: !j.playing && j.index >= steps.length - 1 ? 0 : j.index, playing: !j.playing } : j));
  const currentStep = journey ? steps[journey.index] : undefined;

  const focusPlace = (key: string) => {
    pauseJourney();
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
                    <span className="wg-pane block h-2.5" style={{ ['--glass' as string]: GLASS[d] ?? '#7a7a7a' }} data-active={active} aria-hidden="true" />
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
            <JourneyCamera step={currentStep} previous={journey ? steps[journey.index - 1] : undefined} active={!!journey} fitPlaces={fit.places} />

            {journey && journeyPath.length >= 2 && (
              <Polyline positions={journeyPath} pathOptions={{ color: LEAD, weight: 2, opacity: 0.75, lineCap: 'round', lineJoin: 'round' }} />
            )}

            {!journey && showPath && path.length >= 2 && (
              <Polyline positions={path} pathOptions={{ color: LEAD, weight: 1.5, opacity: 0.6, dashArray: '1 5', lineCap: 'round' }} />
            )}

            {filteredPlaces.map((place) => (
              <Marker
                key={place.key}
                position={[place.lat, place.lng]}
                icon={icons[place.key]}
                ref={(m) => { markerRefs.current[place.key] = m; }}
                eventHandlers={{ click: () => { setActiveKey(place.key); pauseJourney(); } }}
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

          <label className="absolute top-2 right-2 z-[1000] inline-flex items-center gap-2 bg-white/95 border border-gray-400 px-2.5 py-1.5 text-xs text-gray-800 cursor-pointer select-none">
            <input type="checkbox" checked={colorMap} onChange={(e) => setColorMap(e.target.checked)} className="w-3.5 h-3.5 accent-gray-800" />
            {t.map.colorMap}
          </label>

          {/* Carte de l'œuvre courante pendant le voyage */}
          {journey && currentStep && (
            <div key={journey.index} className="wg-journey-card absolute left-2 right-2 sm:right-auto sm:w-80 bottom-[60px] z-[1000] flex gap-3 bg-white border border-gray-400 p-2.5 shadow-md" aria-live="polite">
              {currentStep.work.main_image && (
                <div className="relative w-16 h-16 flex-shrink-0 bg-gray-100 overflow-hidden">
                  <Image src={`${IMAGE_BASE_URL}/vitraux/${currentStep.work.main_image}`} alt="" fill sizes="64px" className="object-cover" loader={s3ImageLoader} />
                </div>
              )}
              <div className="min-w-0">
                <p className="text-lg leading-none font-semibold tabular-nums" style={{ color: glassFor(currentStep.work.year) }}>{currentStep.work.year}</p>
                <p className="mt-1 text-sm leading-snug text-gray-900">{currentStep.work.title_fr}</p>
                <p className="text-xs text-gray-500 truncate">{currentStep.place.building_name}, {currentStep.place.city}</p>
                <Link href={`/jeannette/catalogue/${currentStep.work.id}`} className="text-xs underline underline-offset-2 text-gray-800 hover:text-gray-950">{t.common.seeWork}</Link>
              </div>
            </div>
          )}

          {/* Barre du voyage : lancement, lecture, étapes */}
          <div className="absolute bottom-0 inset-x-0 z-[1000] h-[52px] flex items-center gap-0.5 px-1.5 bg-white/95 border-t border-gray-300">
            {!journey ? (
              <button type="button" onClick={() => steps.length && setJourney({ index: 0, playing: true })} disabled={!steps.length} className="inline-flex items-center gap-2 h-10 px-3 text-sm font-medium text-gray-900 hover:bg-gray-100 disabled:opacity-40">
                <Play className="w-4 h-4" fill="currentColor" aria-hidden="true" />
                {t.map.journeyStart(steps[0]?.work.year ?? '', steps[steps.length - 1]?.work.year ?? '')}
              </button>
            ) : (
              <>
                <button type="button" onClick={togglePlay} aria-label={journey.playing ? t.map.pause : t.map.play} className="inline-flex items-center justify-center w-10 h-10 text-gray-900 hover:bg-gray-100">
                  {journey.playing ? <Pause className="w-4 h-4" fill="currentColor" /> : <Play className="w-4 h-4" fill="currentColor" />}
                </button>
                <button type="button" onClick={() => goToStep(journey.index - 1)} disabled={journey.index === 0} aria-label={t.map.prevStep} className="inline-flex items-center justify-center w-9 h-10 text-gray-800 hover:bg-gray-100 disabled:opacity-30">
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button type="button" onClick={() => goToStep(journey.index + 1)} disabled={journey.index >= steps.length - 1} aria-label={t.map.nextStep} className="inline-flex items-center justify-center w-9 h-10 text-gray-800 hover:bg-gray-100 disabled:opacity-30">
                  <ChevronRight className="w-5 h-5" />
                </button>
                <div className="flex-1 flex items-end gap-[2px] h-4 mx-2" role="group" aria-label={t.map.steps}>
                  {steps.map((st, i) => (
                    <button
                      key={st.work.id}
                      type="button"
                      onClick={() => goToStep(i)}
                      aria-label={`${st.work.year}, ${st.work.title_fr}`}
                      aria-current={i === journey.index ? 'step' : undefined}
                      className="wg-step flex-1 h-2.5"
                      data-state={i === journey.index ? 'current' : i < journey.index ? 'visited' : 'future'}
                      style={{ ['--glass' as string]: glassFor(st.work.year) }}
                    />
                  ))}
                </div>
                <span className="w-11 text-right text-xs tabular-nums text-gray-600">{journey.index + 1}/{steps.length}</span>
                <button type="button" onClick={() => setJourney(null)} aria-label={t.map.exitJourney} className="inline-flex items-center justify-center w-9 h-10 text-gray-700 hover:bg-gray-100">
                  <X className="w-4 h-4" />
                </button>
              </>
            )}
          </div>

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
                      <span className="wg-quarry wg-quarry--sm" style={{ ['--glass' as string]: glassFor(place.works[0].year) }} aria-hidden="true" />
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

        /* Losange de verre en aplat, cerné d'un trait sombre */
        .wg-marker {
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .wg-quarry {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: var(--side);
          height: var(--side);
          background: var(--glass);
          border: 1.5px solid rgba(20, 20, 20, 0.85);
          border-radius: 2px;
          transform: rotate(45deg);
          box-shadow: 0 1px 2px rgba(0, 0, 0, 0.18);
          transition:
            transform 0.3s cubic-bezier(0.23, 1, 0.32, 1),
            box-shadow 0.3s cubic-bezier(0.23, 1, 0.32, 1),
            opacity 0.3s ease;
        }
        .wg-marker[data-journey='future'] .wg-quarry {
          opacity: 0.25;
        }
        .wg-marker[data-journey='current'] .wg-quarry {
          transform: rotate(45deg) scale(1.4);
          box-shadow: 0 0 0 6px color-mix(in srgb, var(--glass) 30%, transparent);
        }
        .wg-map .leaflet-bottom {
          bottom: 52px;
        }
        .wg-step {
          background: var(--glass);
          border: 1px solid rgba(20, 20, 20, 0.85);
          transform-origin: center bottom;
          transition: opacity 0.2s ease, transform 0.2s cubic-bezier(0.23, 1, 0.32, 1);
        }
        .wg-step[data-state='future'] {
          opacity: 0.3;
        }
        .wg-step[data-state='current'] {
          transform: scaleY(1.6);
        }
        .wg-quarry > span {
          transform: rotate(-45deg);
          color: #fff;
          font: 700 11px/1 Arial, Helvetica, sans-serif;
          letter-spacing: -0.02em;
        }
        /* Survol réservé aux souris : au toucher, un faux survol resterait affiché */
        @media (hover: hover) and (pointer: fine) {
          .leaflet-marker-icon:hover .wg-quarry {
            transform: rotate(45deg) scale(1.18);
            box-shadow: 0 0 0 4px color-mix(in srgb, var(--glass) 28%, transparent);
          }
        }
        .leaflet-marker-icon:focus-visible .wg-quarry {
          transform: rotate(45deg) scale(1.18);
          box-shadow: 0 0 0 4px color-mix(in srgb, var(--glass) 28%, transparent);
        }
        .wg-quarry--sm {
          --side: 8px;
          border-width: 1px;
          flex-shrink: 0;
          box-shadow: none;
        }

        /* Bande des décennies : aplats cernés du même trait */
        .wg-pane {
          background: var(--glass);
          border: 1px solid rgba(20, 20, 20, 0.85);
          border-radius: 1px;
        }
        .wg-pane[data-active='true'] {
          box-shadow: 0 0 0 3px color-mix(in srgb, var(--glass) 28%, transparent);
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

        /* Mouvement réduit : les états restent lisibles, sans déplacement ni agrandissement animé */
        @media (prefers-reduced-motion: reduce) {
          .wg-quarry,
          .wg-step {
            transition: opacity 0.2s ease;
          }
        }
      `}</style>
    </div>
  );
}

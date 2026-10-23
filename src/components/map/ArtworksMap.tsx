import { useEffect, useMemo, useRef, useState, type RefObject } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { MapContainer, TileLayer, Marker, Popup, Polyline, CircleMarker, Tooltip, useMap } from 'react-leaflet';
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
import JourneyPanel from '@/components/map/JourneyPanel';
import { LIFE_MILESTONES, excerpt, orderJourney, stepLatLng, type InterviewQuote, type JourneyStep } from '@/lib/journey';
import { optimizedImageUrl } from '@/lib/imageLoader';
import interviewQuotes from '../../../data/interview_quotes.json';
import { useLocale, useT } from '@/i18n';

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

// Voyage chronologique : rythme et déplacements de la caméra
const JOURNEY_ZOOM = 9;
const LIFE_COLOR = '#4b4b4b';
const HINT_KEY = 'wg-journey-hint-v1';
const prefersReducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const QUOTES = interviewQuotes as InterviewQuote[];

// Durée du déplacement entre deux étapes : aucun, glissé court, ou vol (plus long au-dessus de l'Atlantique)
const GLIDE_MS = 1600; // glissé entre lieux proches
const FLIGHT_MS = 2400; // vol au-delà de 250 km
const OCEAN_MS = 3600; // traversée de l'Atlantique

function journeyMoveMs(from: [number, number] | null, to: [number, number] | null) {
  if (!to) return 0;
  if (!from) return FLIGHT_MS;
  const d = L.latLng(from).distanceTo(L.latLng(to));
  if (d < 1) return 0;
  if (d < 250_000) return GLIDE_MS;
  return d > 1_000_000 ? OCEAN_MS : FLIGHT_MS;
}

// Arc souple entre deux lieux (courbe de Bézier quadratique, toujours bombée du même côté)
function curvePoints(a: [number, number], b: [number, number], n = 48, bend = 0.2): [number, number][] {
  const [lat1, lng1] = a;
  const [lat2, lng2] = b;
  const ctrlLat = (lat1 + lat2) / 2 + (lng2 - lng1) * bend;
  const ctrlLng = (lng1 + lng2) / 2 - (lat2 - lat1) * bend;
  const pts: [number, number][] = [];
  for (let i = 0; i <= n; i++) {
    const t = i / n;
    const u = 1 - t;
    pts.push([u * u * lat1 + 2 * u * t * ctrlLat + t * t * lat2, u * u * lng1 + 2 * u * t * ctrlLng + t * t * lng2]);
  }
  return pts;
}

// Suite de lieux reliés par des arcs
function curvedPath(points: [number, number][]): [number, number][] {
  const out: [number, number][] = [];
  for (let i = 1; i < points.length; i++) out.push(...curvePoints(points[i - 1], points[i]).slice(i === 1 ? 0 : 1));
  return out;
}

// Accélération puis ralentissement doux, pour le dessin du tracé
const easeInOutCubic = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

// Tronçon en cours : il se dessine de l'ancien lieu vers le nouveau, à la couleur de verre de la décennie,
// avec un halo léger et une perle en tête de trait. Mis à jour image par image sans repasser par React.
function JourneySegment({ from, to, color, durationMs }: {
  from: [number, number];
  to: [number, number];
  color: string;
  durationMs: number;
}) {
  const lineRef = useRef<L.Polyline | null>(null);
  const glowRef = useRef<L.Polyline | null>(null);
  const tipRef = useRef<L.CircleMarker | null>(null);
  const points = useMemo(() => curvePoints(from, to, 64), [from, to]);
  const initial = useMemo(() => points.slice(0, 2), [points]);

  useEffect(() => {
    const apply = (k: number) => {
      const count = Math.max(2, Math.round(k * (points.length - 1)) + 1);
      const part = points.slice(0, count);
      lineRef.current?.setLatLngs(part);
      glowRef.current?.setLatLngs(part);
      tipRef.current?.setLatLng(part[part.length - 1]);
    };
    const hideTip = () => tipRef.current?.setStyle({ opacity: 0, fillOpacity: 0 });
    if (prefersReducedMotion()) {
      apply(1);
      hideTip();
      return;
    }
    tipRef.current?.setStyle({ opacity: 1, fillOpacity: 1 });
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / durationMs);
      apply(easeInOutCubic(t));
      if (t < 1) raf = requestAnimationFrame(tick);
      else hideTip();
    };
    apply(0);
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [points, durationMs]);

  return (
    <>
      <Polyline ref={glowRef} positions={initial} interactive={false} pathOptions={{ color, weight: 10, opacity: 0.16, lineCap: 'round', lineJoin: 'round' }} />
      <Polyline ref={lineRef} positions={initial} interactive={false} pathOptions={{ color, weight: 2.5, opacity: 0.95, lineCap: 'round', lineJoin: 'round' }} />
      <CircleMarker ref={tipRef} center={initial[0]} radius={4} interactive={false} pathOptions={{ color: '#fff', weight: 1.5, fillColor: color, fillOpacity: 1 }} />
    </>
  );
}

// Temps d'arrêt : assez pour lire, plus long quand il y a du texte, plafonné
const journeyDwellMs = (textLength: number) => Math.min(10_000, Math.max(3500, 3500 + textLength * 22));

// Caméra du voyage. Sur mobile, la carte d'information couvre le bas : le lieu est décalé vers le haut.
// Glissé simple entre lieux proches (pas de rechargement de tuiles), vol seulement pour les longues distances.
function JourneyCamera({ target, previous, active, offsetY, fitPlaces }: {
  target: [number, number] | null;
  previous: [number, number] | null;
  active: boolean;
  offsetY: number;
  fitPlaces: Place[];
}) {
  const map = useMap();
  const wasActive = useRef(false);

  useEffect(() => {
    const timer = setTimeout(() => map.invalidateSize({ pan: false }), 0);
    return () => clearTimeout(timer);
  }, [map, active]);

  useEffect(() => {
    if (active && target) {
      map.closePopup();
      const center = map.unproject(map.project(L.latLng(target), JOURNEY_ZOOM).add([0, offsetY]), JOURNEY_ZOOM);
      const move = journeyMoveMs(previous, target);
      if (prefersReducedMotion()) map.setView(center, JOURNEY_ZOOM, { animate: false });
      else if (move === GLIDE_MS && map.getZoom() === JOURNEY_ZOOM) map.panTo(center, { animate: true, duration: GLIDE_MS / 1000, easeLinearity: 0.2 });
      else if (move > 0 || map.getZoom() !== JOURNEY_ZOOM) map.flyTo(center, JOURNEY_ZOOM, { duration: Math.max(move, FLIGHT_MS) / 1000, easeLinearity: 0.2 });
    } else if (!active && wasActive.current && fitPlaces.length) {
      map.fitBounds(boundsOf(fitPlaces), { padding: [28, 28], maxZoom: 12 });
    }
    wasActive.current = active;
  }, [map, active, target?.[0], target?.[1]]); // eslint-disable-line react-hooks/exhaustive-deps

  return null;
}

// Repère d'une étape de vie (losange blanc cerné) : pas une œuvre, donc pas de couleur de décennie
const lifeIcon = L.divIcon({
  className: 'wg-marker',
  html: '<span class="wg-quarry wg-quarry--life" style="--side:12px"><span></span></span>',
  iconSize: [20, 20],
  iconAnchor: [10, 10],
});

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
  const [isDesktop, setIsDesktop] = useState(false);
  const locale = useLocale();

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px)');
    const update = () => setIsDesktop(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);
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

  // Étapes du voyage : œuvres localisées et affichées, plus les étapes de vie (sauf pendant une recherche),
  // dans l'ordre de orderJourney (années, proximité, séjour au Québec regroupé)
  const steps = useMemo<JourneyStep[]>(() => {
    const placeOf = new Map<string, Place>();
    for (const p of filteredPlaces) for (const w of p.works) placeOf.set(w.id, p);
    const workSteps: JourneyStep[] = works
      .filter((w) => placeOf.has(w.id))
      .map((w) => ({ kind: 'work', id: w.id, year: w.year, work: w, place: placeOf.get(w.id) as Place }));
    const decadeOk = (year: string) => selectedDecades.length === 0 || selectedDecades.includes(decadeOf(year) ?? -1);
    const lifeSteps: JourneyStep[] = query.trim()
      ? []
      : LIFE_MILESTONES.filter((m) => decadeOk(m.year)).map((m) => ({ kind: 'life', id: m.id, year: m.year, milestone: m }));
    return orderJourney([...lifeSteps, ...workSteps]);
  }, [works, filteredPlaces, selectedDecades, query]);

  const quoteFor = (step: JourneyStep | undefined) => (step ? QUOTES.find((q) => q.anchor === step.id) : undefined);
  const stepColor = (step: JourneyStep) => (step.kind === 'work' ? glassFor(step.year) : LIFE_COLOR);
  const stepTextLength = (step: JourneyStep) => {
    const quote = quoteFor(step);
    const body = step.kind === 'work' ? excerpt(step.work.text_fr, 320) : step.milestone.text[locale];
    return body.length + (quote ? quote[locale].length : 0);
  };

  // Dernière position connue jusqu'à l'étape i (une étape de vie sans lieu ne déplace pas la carte)
  const positionUpTo = (i: number): [number, number] | null => {
    for (let k = i; k >= 0; k--) {
      const ll = steps[k] && stepLatLng(steps[k]);
      if (ll) return ll;
    }
    return null;
  };

  // Un changement de filtre arrête le voyage
  useEffect(() => setJourney(null), [selectedDecades, query]);

  // Lecture automatique : étape suivante après le déplacement et un temps de lecture ; pause à la fin
  useEffect(() => {
    if (!journey?.playing) return;
    if (journey.index >= steps.length - 1) {
      setJourney((j) => (j ? { ...j, playing: false } : j));
      return;
    }
    const step = steps[journey.index];
    const move = prefersReducedMotion() ? 0 : journeyMoveMs(positionUpTo(journey.index - 1), stepLatLng(step));
    const timer = setTimeout(
      () => setJourney((j) => (j && j.playing ? { ...j, index: j.index + 1 } : j)),
      move + journeyDwellMs(stepTextLength(step)),
    );
    // Précharge l'image de l'étape suivante pendant l'arrêt, pour qu'elle s'affiche sans à-coup
    const next = steps[journey.index + 1];
    const nextImage = next && (next.kind === 'work'
      ? next.work.main_image && `${IMAGE_BASE_URL}/vitraux/${next.work.main_image}`
      : next.milestone.image && `${IMAGE_BASE_URL}/${next.milestone.image}`);
    if (nextImage) new window.Image().src = optimizedImageUrl(nextImage, 800);
    return () => clearTimeout(timer);
  }, [journey, steps]); // eslint-disable-line react-hooks/exhaustive-deps

  // État des points pendant le voyage : déjà visités, courant, à venir (estompés)
  useEffect(() => {
    const step = journey ? steps[journey.index] : undefined;
    const current = step?.kind === 'work' ? step.place.key : undefined;
    const visited = new Set(
      journey ? steps.slice(0, journey.index + 1).flatMap((st) => (st.kind === 'work' ? [st.place.key] : [])) : [],
    );
    for (const p of filteredPlaces) {
      const el = markerRefs.current[p.key]?.getElement();
      if (!el) continue;
      if (!journey) el.removeAttribute('data-journey');
      else el.setAttribute('data-journey', p.key === current ? 'current' : visited.has(p.key) ? 'visited' : 'future');
    }
  }, [journey, steps, filteredPlaces]);

  // Tracé du voyage : il s'allonge à chaque étape qui a un lieu
  const journeyPath = useMemo(() => {
    const line: [number, number][] = [];
    if (!journey) return line;
    for (const st of steps.slice(0, journey.index + 1)) {
      const ll = stepLatLng(st);
      const last = line[line.length - 1];
      if (ll && (!last || last[0] !== ll[0] || last[1] !== ll[1])) line.push(ll);
    }
    return line;
  }, [journey, steps]);

  // Guide de première visite : affiché tant que le visiteur n'a ni lancé ni fermé l'invitation
  const [showHint, setShowHint] = useState(false);
  useEffect(() => {
    try {
      if (!window.localStorage.getItem(HINT_KEY)) setShowHint(true);
    } catch {
      setShowHint(true);
    }
  }, []);
  const dismissHint = () => {
    setShowHint(false);
    try {
      window.localStorage.setItem(HINT_KEY, '1');
    } catch {
      // stockage indisponible (navigation privée) : l'invitation reviendra, sans gravité
    }
  };
  const startJourney = () => {
    if (!steps.length) return;
    dismissHint();
    setJourney({ index: 0, playing: true });
  };

  // ?voyage=1 (lien depuis l'accueil) : lance le voyage dès l'arrivée
  useEffect(() => {
    if (router.query.voyage !== '1' || !steps.length) return;
    const timer = setTimeout(startJourney, 700);
    return () => clearTimeout(timer);
  }, [router.query.voyage, steps.length]); // eslint-disable-line react-hooks/exhaustive-deps

  const pauseJourney = () => setJourney((j) => (j ? { ...j, playing: false } : j));
  const goToStep = (index: number) =>
    setJourney((j) => ({ index: Math.max(0, Math.min(steps.length - 1, index)), playing: j?.playing ?? false }));
  const togglePlay = () =>
    setJourney((j) => (j ? { index: !j.playing && j.index >= steps.length - 1 ? 0 : j.index, playing: !j.playing } : j));
  const currentStep = journey ? steps[journey.index] : undefined;
  const currentLatLng = journey ? positionUpTo(journey.index) : null;
  const previousLatLng = journey ? positionUpTo(journey.index - 1) : null;
  const lifeMarker = currentStep?.kind === 'life' ? stepLatLng(currentStep) : null;
  // Tronçon à dessiner : de la position précédente à la nouvelle, quand le lieu change
  const segment = useMemo(() => {
    if (!previousLatLng || !currentLatLng) return null;
    if (previousLatLng[0] === currentLatLng[0] && previousLatLng[1] === currentLatLng[1]) return null;
    return { from: previousLatLng, to: currentLatLng };
  }, [previousLatLng?.[0], previousLatLng?.[1], currentLatLng?.[0], currentLatLng?.[1]]); // eslint-disable-line react-hooks/exhaustive-deps
  // Tracé déjà parcouru (sans le tronçon en cours de dessin), en arcs
  const journeyTrail = useMemo(
    () => curvedPath(segment ? journeyPath.slice(0, -1) : journeyPath),
    [journeyPath, segment],
  );
  const curvedStaticPath = useMemo(() => curvedPath(path), [path]);

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
        <div className={`space-y-5 lg:col-start-2 lg:row-start-1 ${journey && isDesktop ? 'hidden' : ''}`}>
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

        <div ref={mapWrapperRef} className={`relative ${journey && !isDesktop ? 'h-[78vh]' : 'h-[60vh]'} lg:h-[calc(100vh-6.5rem)] lg:sticky lg:top-20 lg:self-start lg:col-start-1 lg:row-start-1 lg:row-span-3 border border-gray-300`}>
          <MapContainer center={[46.6, 2.5]} zoom={6} style={{ height: '100%', width: '100%' }} {...FULLSCREEN_OPTION}>
            <TileLayer attribution="&copy; OpenStreetMap contributors" url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" updateWhenZooming={false} keepBuffer={4} />

            <MapController fit={fit} focus={focus} markers={markerRefs} />
            <JourneyCamera target={currentLatLng} previous={previousLatLng} active={!!journey} offsetY={isDesktop ? 0 : 190} fitPlaces={fit.places} />
            {lifeMarker && <Marker position={lifeMarker} icon={lifeIcon} interactive={false} keyboard={false} />}

            {journey && journeyTrail.length >= 2 && (
              <Polyline positions={journeyTrail} interactive={false} pathOptions={{ color: LEAD, weight: 1.5, opacity: 0.55, lineCap: 'round', lineJoin: 'round' }} />
            )}
            {journey && segment && currentStep && (
              <JourneySegment
                key={`${segment.from.join(',')}>${segment.to.join(',')}`}
                from={segment.from}
                to={segment.to}
                color={stepColor(currentStep)}
                durationMs={journeyMoveMs(segment.from, segment.to) + 600}
              />
            )}

            {!journey && showPath && path.length >= 2 && (
              <Polyline positions={curvedStaticPath} interactive={false} pathOptions={{ color: LEAD, weight: 1.5, opacity: 0.6, dashArray: '1 5', lineCap: 'round' }} />
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

          {/* Mobile : l'étape courante posée sur la carte, vitrail en grand */}
          {journey && currentStep && !isDesktop && (
            <div className="absolute left-2 right-2 bottom-[60px] z-[1000]">
              <JourneyPanel step={currentStep} quote={quoteFor(currentStep)} color={stepColor(currentStep)} variant="overlay" />
            </div>
          )}

          {/* Première visite : invitation à lancer le voyage */}
          {!journey && showHint && (
            <div className="wg-hint absolute left-2 bottom-[60px] z-[1000] max-w-[18rem] bg-white border border-gray-400 shadow-md p-3 pr-8" role="note">
              <p className="text-sm font-medium text-gray-950">{t.map.hintTitle}</p>
              <p className="mt-0.5 text-sm text-gray-600">{t.map.hintText(steps[0]?.year ?? '', steps[steps.length - 1]?.year ?? '')}</p>
              <button type="button" onClick={dismissHint} aria-label={t.map.hintClose} className="absolute top-1 right-1 inline-flex items-center justify-center w-8 h-8 text-gray-500 hover:text-gray-900">
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Barre du voyage : lancement, lecture, étapes */}
          <div className="absolute bottom-0 inset-x-0 z-[1000] h-[52px] flex items-center gap-0.5 px-1.5 bg-white/95 border-t border-gray-300">
            {!journey ? (
              <button type="button" onClick={startJourney} disabled={!steps.length} data-attention={showHint || undefined} className="wg-start inline-flex items-center gap-2 h-10 px-3 text-sm font-medium text-gray-900 hover:bg-gray-100 disabled:opacity-40">
                <Play className="w-4 h-4" fill="currentColor" aria-hidden="true" />
                {t.map.journeyStart(steps[0]?.year ?? '', steps[steps.length - 1]?.year ?? '')}
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
                      key={st.id}
                      type="button"
                      onClick={() => goToStep(i)}
                      aria-label={`${st.year}, ${st.kind === 'work' ? st.work.title_fr : st.milestone.title[locale]}`}
                      aria-current={i === journey.index ? 'step' : undefined}
                      className="wg-step flex-1 h-2.5"
                      data-state={i === journey.index ? 'current' : i < journey.index ? 'visited' : 'future'}
                      style={{ ['--glass' as string]: stepColor(st) }}
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
        <div className={`-mt-2 lg:mt-0 lg:col-start-2 lg:row-start-2 flex flex-wrap items-center justify-between gap-x-5 gap-y-1 ${journey && isDesktop ? 'hidden' : ''}`}>
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
        {/* Ordinateur : l'étape courante en grand dans la colonne de droite */}
        {journey && currentStep && isDesktop && (
          <div className="lg:col-start-2 lg:row-start-1 lg:row-span-3 lg:sticky lg:top-20 lg:self-start">
            <JourneyPanel step={currentStep} quote={quoteFor(currentStep)} color={stepColor(currentStep)} variant="panel" />
          </div>
        )}

        <section className={`lg:col-start-2 lg:row-start-3 ${journey && isDesktop ? 'hidden' : ''}`} aria-labelledby="liste-lieux">
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
        /* Filtre posé tuile par tuile (et non sur tout le calque) : moins coûteux pendant les déplacements */
        .wg-map[data-grisaille='true'] .leaflet-tile {
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
        .wg-quarry--life {
          background: #fff;
          border-width: 2px;
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

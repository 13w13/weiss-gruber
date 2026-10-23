import { useEffect, useMemo, useRef, useState, type RefObject } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { MapContainer, TileLayer, Marker, Popup, Polyline, Tooltip, useMap } from 'react-leaflet';
import 'leaflet.fullscreen/Control.FullScreen.css';
import 'leaflet.fullscreen';
import Image from 'next/image';
import L from 'leaflet';
import { Search, MapPin } from 'lucide-react';
import type { Vitrail } from '@/types/images';
import { IMAGE_BASE_URL } from '@/lib/images';
import { s3ImageLoader } from '@/lib/imageLoader';
import { decadeOf, matchesQuery } from '@/lib/text';
import OtherVitrailLink from '@/components/layout/OtherVitrailLink';

const DECADE_COLORS: Record<number, string> = {
  1950: '#2563eb',
  1960: '#059669',
  1970: '#a855f7',
  1980: '#f59e0b',
  1990: '#dc2626',
  2000: '#0ea5e9',
};
// Option ajoutée par leaflet.fullscreen, absente des types de react-leaflet
const FULLSCREEN_OPTION = { fullscreenControl: true } as Record<string, unknown>;

const colorFor = (year?: string) => DECADE_COLORS[decadeOf(year) ?? 0] ?? '#6b7280';

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
  const [selected, setSelected] = useState(0);
  const [idx, setIdx] = useState(0);
  const work = place.works[Math.min(selected, place.works.length - 1)];
  const images = useMemo(() => workImages(work), [work]);

  useEffect(() => setIdx(0), [selected]);

  const mapsHref = work.maps_url?.trim() || `https://www.google.com/maps?q=${place.lat},${place.lng}`;

  return (
    <div className="w-60 sm:w-64">
      <p className="text-sm text-gray-900 font-medium leading-snug">{place.building_name}</p>
      <p className="text-xs text-gray-600 mb-2">{[place.city, place.department].filter(Boolean).join(' · ')}</p>

      {place.works.length > 1 && (
        <ul className="mb-2 space-y-1 max-h-28 sm:max-h-40 overflow-y-auto" aria-label="Réalisations dans cet édifice">
          {place.works.map((w, i) => (
            <li key={w.id}>
              <button
                type="button"
                onClick={() => setSelected(i)}
                className={`w-full text-left text-xs px-2 py-1.5 rounded border ${i === selected ? 'border-blue-600 bg-blue-50 text-blue-800' : 'border-gray-200 hover:bg-gray-50 text-gray-800'}`}
              >
                <span className="font-semibold">{w.year}</span> — {w.title_fr}
              </button>
            </li>
          ))}
        </ul>
      )}
      {place.works.length === 1 && <p className="text-xs text-gray-700 mb-2"><span className="font-semibold">{work.year}</span> — {work.title_fr}</p>}

      {images.length > 0 && (
        <div>
          <div className="relative w-full h-28 sm:h-36 bg-gray-100 rounded overflow-hidden">
            <Image src={images[idx].src} alt={images[idx].alt} fill sizes="256px" className="object-cover" loader={s3ImageLoader} />
          </div>
          {images.length > 1 && (
            <div className="mt-2 flex items-center justify-between">
              <button type="button" onClick={() => setIdx((i) => (i - 1 + images.length) % images.length)} className="px-2 py-1 text-xs border rounded hover:bg-gray-50">Précédent</button>
              <span className="text-xs text-gray-500">{idx + 1} / {images.length}</span>
              <button type="button" onClick={() => setIdx((i) => (i + 1) % images.length)} className="px-2 py-1 text-xs border rounded hover:bg-gray-50">Suivant</button>
            </div>
          )}
        </div>
      )}

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <Link href={`/jeannette/catalogue/${work.id}`} className="text-xs bg-blue-600 !text-white px-2.5 py-1.5 rounded hover:bg-blue-700 transition">Voir la fiche</Link>
        <a href={mapsHref} target="_blank" rel="noreferrer noopener" className="text-xs border border-gray-800 !text-gray-900 px-2.5 py-1.5 rounded hover:bg-gray-50 transition">Ouvrir dans Maps</a>
      </div>
    </div>
  );
}

function markerIcon(color: string, count: number) {
  const size = count > 1 ? 30 : 24;
  return L.divIcon({
    className: '',
    html: `<span class="wg-marker" style="background:${color};width:${size}px;height:${size}px">${count > 1 ? count : ''}</span>`,
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
    map.fitBounds(boundsOf(fit.places), { padding: [32, 32], maxZoom: 12 });
  }, [map, fit.token]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!focus) return;
    const marker = markers.current[focus.key];
    if (!marker) return;
    map.flyTo(marker.getLatLng(), Math.max(map.getZoom(), 12), { duration: 0.8 });
    map.once('moveend', () => marker.openPopup());
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
  const router = useRouter();
  const mapWrapperRef = useRef<HTMLDivElement>(null);
  const markerRefs = useRef<Record<string, L.Marker | null>>({});

  const [basemap, setBasemap] = useState<'osm' | 'light'>('osm');
  const [showPath, setShowPath] = useState(true);
  const [query, setQuery] = useState('');
  const [view, setView] = useState<View>('europe');
  const [focus, setFocus] = useState<{ key: string; token: number } | null>(null);
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
    () => Object.fromEntries(filteredPlaces.map((p) => [p.key, markerIcon(colorFor(p.works[0].year), p.works.length)])),
    [filteredPlaces],
  );

  // Parcours chronologique des réalisations affichées
  const path = useMemo(() => {
    const pts = filteredPlaces
      .flatMap((p) => p.works.map((w) => ({ year: parseInt(w.year) || 0, lat: p.lat, lng: p.lng })))
      .sort((a, b) => a.year - b.year);
    const line: [number, number][] = [];
    for (const p of pts) {
      const last = line[line.length - 1];
      if (!last || last[0] !== p.lat || last[1] !== p.lng) line.push([p.lat, p.lng]);
    }
    return line;
  }, [filteredPlaces]);

  // ?oeuvre=<id> : ouvre directement le lieu de cette œuvre
  useEffect(() => {
    const id = router.query.oeuvre;
    if (typeof id !== 'string') return;
    const place = places.find((p) => p.works.some((w) => w.id === id));
    if (!place) return;
    const t = setTimeout(() => setFocus({ key: place.key, token: Date.now() }), 400);
    return () => clearTimeout(t);
  }, [router.query.oeuvre, places]);

  const focusPlace = (key: string) => {
    mapWrapperRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    setFocus({ key, token: Date.now() });
  };

  const chip = (active: boolean) =>
    `inline-flex items-center gap-1.5 px-3 h-9 rounded-full border text-sm whitespace-nowrap transition-colors ${active ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-800 border-gray-300 hover:bg-gray-50'}`;

  return (
    <div>
      {/* Outils au-dessus de la carte, pour ne pas la masquer sur mobile */}
      <div className="mb-3 space-y-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" aria-hidden="true" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Rechercher un lieu, une ville, une œuvre…"
            aria-label="Rechercher sur la carte"
            className="w-full h-11 pl-10 pr-3 border border-gray-300 rounded-md text-base"
          />
        </div>

        <div className="-mx-4 px-4 overflow-x-auto scrollbar-none">
          <div className="flex gap-2 w-max" role="group" aria-label="Filtrer par décennie">
            {decades.map((d) => {
              const active = selectedDecades.includes(d);
              return (
                <button key={d} type="button" aria-pressed={active} onClick={() => toggleDecade(d)} className={chip(active)}>
                  <span className="w-2.5 h-2.5 rounded-full border border-white/60" style={{ background: DECADE_COLORS[d] ?? '#6b7280' }} aria-hidden="true" />
                  {d}s
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 text-sm">
          <span className="text-gray-600">Cadrer :</span>
          {([['europe', 'France'], ['quebec', 'Québec'], ['all', 'Tout']] as [View, string][]).map(([v, label]) => (
            <button key={v} type="button" aria-pressed={view === v} onClick={() => setView(v)} className={chip(view === v)}>{label}</button>
          ))}
          <span className="mx-1 h-5 w-px bg-gray-300" aria-hidden="true" />
          <button type="button" aria-pressed={basemap === 'light'} onClick={() => setBasemap(basemap === 'osm' ? 'light' : 'osm')} className={chip(false)}>
            Fond {basemap === 'osm' ? 'clair' : 'détaillé'}
          </button>
          <label className="inline-flex items-center gap-2 h-9 px-2 cursor-pointer select-none">
            <input type="checkbox" checked={showPath} onChange={(e) => setShowPath(e.target.checked)} className="w-4 h-4" />
            Parcours chronologique
          </label>
        </div>
      </div>

      <div ref={mapWrapperRef} className="relative h-[55vh] md:h-[65vh] rounded-xl overflow-hidden border border-gray-200">
        <MapContainer center={[46.6, 2.5]} zoom={6} style={{ height: '100%', width: '100%' }} {...FULLSCREEN_OPTION}>
          {basemap === 'osm' ? (
            <TileLayer attribution="&copy; OpenStreetMap contributors" url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          ) : (
            <TileLayer attribution="&copy; OpenStreetMap contributors &copy; CARTO" url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png" />
          )}

          <MapController fit={fit} focus={focus} markers={markerRefs} />

          {showPath && path.length >= 2 && (
            <Polyline positions={path} pathOptions={{ color: '#3b82f6', weight: 3, opacity: 0.5 }} />
          )}

          {filteredPlaces.map((place) => (
            <Marker
              key={place.key}
              position={[place.lat, place.lng]}
              icon={icons[place.key]}
              ref={(m) => { markerRefs.current[place.key] = m; }}
            >
              {canHover && (
                <Tooltip direction="top" offset={[0, -12]} opacity={1}>
                  {place.building_name} — {place.works.map((w) => w.year).join(', ')}
                </Tooltip>
              )}
              <Popup>
                <PlacePopup place={place} />
              </Popup>
            </Marker>
          ))}
        </MapContainer>

        {filtering && filteredPlaces.length === 0 && (
          <div className="absolute inset-0 z-[500] flex items-center justify-center pointer-events-none">
            <p className="bg-white/90 backdrop-blur px-4 py-2 text-sm text-gray-700 rounded shadow">Aucune œuvre ne correspond à ces critères</p>
          </div>
        )}
      </div>

      {/* Liste des lieux, synchronisée avec la carte */}
      <section className="mt-8" aria-labelledby="liste-lieux">
        <h2 id="liste-lieux" className="text-xl md:text-2xl font-light mb-3">
          {filteredPlaces.length} lieu{filteredPlaces.length > 1 ? 'x' : ''}
          {filtering && <span className="text-base text-gray-500"> correspondant{filteredPlaces.length > 1 ? 's' : ''}</span>}
        </h2>
        <ul className="divide-y divide-gray-200 border-y border-gray-200">
          {filteredPlaces.map((place) => (
            <li key={place.key}>
              <button type="button" onClick={() => focusPlace(place.key)} className="w-full text-left flex items-start gap-3 py-3 px-1 hover:bg-gray-50">
                <span className="mt-1.5 w-3 h-3 rounded-full flex-shrink-0" style={{ background: colorFor(place.works[0].year) }} aria-hidden="true" />
                <span className="flex-1 min-w-0">
                  <span className="block font-medium text-gray-900">{place.building_name}</span>
                  <span className="block text-sm text-gray-600">
                    {[place.city, place.department].filter(Boolean).join(' · ')} — {place.works.map((w) => w.year).join(', ')}
                    {place.works.length > 1 && ` (${place.works.length} réalisations)`}
                  </span>
                </span>
                <MapPin className="w-4 h-4 mt-1 text-gray-400 flex-shrink-0" aria-hidden="true" />
              </button>
            </li>
          ))}
        </ul>

        {unlocated.length > 0 && (
          <p className="mt-4 text-sm text-gray-600">
            Sans localisation précise sur la carte :{' '}
            {unlocated.map((w, i) => (
              <span key={w.id}>
                {i > 0 && ', '}
                <Link href={`/jeannette/catalogue/${w.id}`} className="underline hover:text-blue-700">{w.title_fr} ({w.year}, {w.city})</Link>
              </span>
            ))}
            .
          </p>
        )}
        <OtherVitrailLink className="mt-4" />
      </section>

      <style jsx global>{`
        .wg-marker {
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 9999px;
          border: 2px solid #fff;
          box-shadow: 0 1px 4px rgba(0, 0, 0, 0.45);
          color: #fff;
          font: 600 12px/1 Arial, Helvetica, sans-serif;
        }
      `}</style>
    </div>
  );
}

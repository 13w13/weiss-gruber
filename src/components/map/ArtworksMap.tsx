import { useMemo, useState, type ComponentType, useEffect } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup, Polyline, useMap } from 'react-leaflet';
import Image from 'next/image';
import type { Vitrail } from '@/types/images';
import L from 'leaflet';

function PopupContent({ work }: { work: Vitrail }) {
  const images = useMemo(() => {
    const s3Base = 'https://weiss-gruber-jeanette.s3.fr-par.scw.cloud/vitraux/';
    const list: { src: string; alt: string }[] = [];
    if (work.main_image) list.push({ src: `${s3Base}${work.main_image}`, alt: work.title_fr });
    if (Array.isArray(work.gallery_images)) {
      for (const g of work.gallery_images) {
        if (g?.url) list.push({ src: g.url.startsWith('http') ? g.url : `${s3Base}${g.url}`, alt: g.alt_fr || work.title_fr });
      }
    }
    return list;
  }, [work]);

  const [idx, setIdx] = useState(0);
  const hasImages = images.length > 0;

  const next = () => setIdx((i) => (i + 1) % images.length);
  const prev = () => setIdx((i) => (i - 1 + images.length) % images.length);

  const mapsHref = useMemo(() => {
    if (work.maps_url && work.maps_url.trim().length > 0) return work.maps_url;
    if (work.lat && work.lng) return `https://www.google.com/maps?q=${work.lat},${work.lng}`;
    return undefined;
  }, [work]);

  return (
    <div className="w-64">
      <div className="mb-2">
        <p className="text-sm text-gray-800 mb-1 font-medium">{work.building_name}</p>
        <div className="flex flex-wrap gap-1 items-center text-[11px] text-gray-600">
          <span className="inline-flex items-center rounded-full bg-gray-100 px-2 py-0.5">{work.city}</span>
          {work.department && (
            <span className="inline-flex items-center rounded-full bg-gray-100 px-2 py-0.5">{work.department}</span>
          )}
          {work.year && (
            <span className="inline-flex items-center rounded-full bg-gray-100 px-2 py-0.5">{work.year}</span>
          )}
        </div>
        <p className="text-xs text-gray-600 mt-1">{work.title_fr}</p>
      </div>
      {hasImages && (
        <div>
          <div className="relative w-full h-36 bg-gray-100 rounded overflow-hidden">
            <Image
              src={images[idx].src}
              alt={images[idx].alt}
              fill
              sizes="256px"
              className="object-cover"
            />
          </div>
          {images.length > 1 && (
            <div className="mt-2 flex items-center justify-between">
              <button onClick={prev} className="px-2 py-1 text-xs border rounded hover:bg-gray-50">Précédent</button>
              <span className="text-xs text-gray-500">{idx + 1} / {images.length}</span>
              <button onClick={next} className="px-2 py-1 text-xs border rounded hover:bg-gray-50">Suivant</button>
            </div>
          )}
        </div>
      )}
      <div className="mt-3 flex items-center">
        <a href={`/jeannette/catalogue/${work.id}`} className="text-xs bg-white border border-blue-600 text-blue-700 px-2 py-1 rounded hover:bg-blue-50 transition">Voir la fiche</a>
        {mapsHref && (
          <>
            <span className="mx-2 text-gray-300">•</span>
            <a href={mapsHref} target="_blank" rel="noreferrer noopener" className="text-xs bg-white border border-gray-800 text-gray-900 px-2 py-1 rounded hover:bg-gray-50 transition">Ouvrir dans Maps</a>
          </>
        )}
      </div>
    </div>
  );
}

export default function ArtworksMap({ works }: { works: Vitrail[] }) {
  const points = useMemo(() => {
    const raw = works
      .map((w) => ({
        work: w,
        lat: w.lat ? parseFloat(w.lat) : undefined,
        lng: w.lng ? parseFloat(w.lng) : undefined,
        yearNum: w.year ? parseInt(String(w.year), 10) : Number.NaN,
      }))
      .filter((p) => Number.isFinite(p.lat) && Number.isFinite(p.lng)) as { work: Vitrail; lat: number; lng: number; yearNum: number; }[];
    raw.sort((a, b) => (a.yearNum || 0) - (b.yearNum || 0));
    return raw;
  }, [works]);

  const center = points.length > 0 ? [points[0].lat, points[0].lng] as [number, number] : [48.8566, 2.3522];

  const polyline: [number, number][] = points.map(p => [p.lat, p.lng]);

  const [basemap, setBasemap] = useState<'osm' | 'light'>('osm');

  const decadeColor = (y?: number) => {
    if (!y || !Number.isFinite(y)) return '#ef4444';
    const d = Math.floor(y / 10) * 10;
    const map: Record<number, string> = {
      1950: '#2563eb',
      1960: '#059669',
      1970: '#a855f7',
      1980: '#f59e0b',
      1990: '#dc2626',
      2000: '#0ea5e9',
    };
    return map[d] || '#6b7280';
  };

  const decades = useMemo(() => {
    const s = new Set<number>();
    for (const p of points) {
      if (Number.isFinite(p.yearNum)) s.add(Math.floor(p.yearNum / 10) * 10);
    }
    return Array.from(s).sort((a, b) => a - b);
  }, [points]);

  const MC = MapContainer as unknown as ComponentType<Record<string, unknown>>;
  const TL = TileLayer as unknown as ComponentType<Record<string, unknown>>;
  const CM = CircleMarker as unknown as ComponentType<Record<string, unknown>>;
  const PP = Popup as unknown as ComponentType<Record<string, unknown>>;
  const PL = Polyline as unknown as ComponentType<Record<string, unknown>>;

  function FitToBounds({ positions }: { positions: [number, number][] }) {
    const map = useMap();
    useEffect(() => {
      if (!positions.length) return;
      const bounds = L.latLngBounds(positions.map(([lat, lng]) => L.latLng(lat, lng)));
      map.fitBounds(bounds, { padding: [40, 40] });
    }, [map, positions]);
    return null;
  }

  return (
    <div className="relative">
      <MC center={center} zoom={6} style={{ height: '70vh', width: '100%', borderRadius: '0.75rem' }} scrollWheelZoom={true}>
        {basemap === 'osm' ? (
          <TL
            attribution='&copy; OpenStreetMap contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
        ) : (
          <TL
            attribution='&copy; OpenStreetMap contributors &copy; CARTO'
            url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          />
        )}

        <FitToBounds positions={polyline} />

        {polyline.length >= 2 && (
          <PL positions={polyline} pathOptions={{ color: '#3b82f6', weight: 3, opacity: 0.55 }} />
        )}

        {points.map(({ work, lat, lng, yearNum }) => {
          const color = decadeColor(yearNum);
          return (
            <CM key={work.id} center={[lat, lng]} radius={7} pathOptions={{ color, weight: 1, fillColor: color, fillOpacity: 0.95 }}>
              <PP>
                <PopupContent work={work} />
              </PP>
            </CM>
          );
        })}
      </MC>

      <div className="absolute top-3 right-3 z-[4000] flex flex-col items-end gap-2 pointer-events-auto">
        <div className="bg-white border border-gray-300 rounded shadow-2xl px-3 py-2 text-xs flex items-center gap-2">
          <span className="text-gray-700 font-medium">Fond</span>
          <button onClick={() => setBasemap('osm')} className={`px-2 py-0.5 rounded ${basemap==='osm' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'}`}>OSM</button>
          <button onClick={() => setBasemap('light')} className={`px-2 py-0.5 rounded ${basemap==='light' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'}`}>Light</button>
        </div>
        {decades.length > 0 && (
          <div className="bg-white border border-gray-300 rounded shadow-2xl px-3 py-2 text-xs">
            <div className="font-medium text-gray-800 mb-1">Décennies</div>
            <ul className="space-y-1">
              {decades.map(d => (
                <li key={d} className="flex items-center gap-2">
                  <span className="inline-block w-3 h-3 rounded-full" style={{ backgroundColor: decadeColor(d) }} />
                  <span>{d}s</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

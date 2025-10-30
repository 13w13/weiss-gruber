import { useMemo, useState, type ComponentType, useEffect } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup, Polyline, useMap, Tooltip } from 'react-leaflet';
import Image from 'next/image';
import type { Vitrail } from '@/types/images';
import L from 'leaflet';

function PopupContent({ work }: { work: Vitrail }) {
  const images = useMemo(() => {
    const base = 'https://xrarrp4wrvauwge7.public.blob.vercel-storage.com/';
    const list: { src: string; alt: string }[] = [];
    if (work.main_image) list.push({ src: `${base}${work.main_image}`, alt: work.title_fr });
    if (Array.isArray(work.gallery_images)) {
      for (const g of work.gallery_images) {
        if (g?.url) list.push({ src: `${base}${g.url}`, alt: g.alt_fr || work.title_fr });
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
        <p className="text-xs text-gray-600">{work.title_fr} - {work.year}</p>
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
      <div className="mt-3">
        <a href={`/jeannette/catalogue/${work.id}`} className="text-xs text-blue-700 hover:underline">Voir la fiche</a>
        {mapsHref && (
          <>
            <span className="mx-2 text-gray-300">•</span>
            <a href={mapsHref} target="_blank" rel="noreferrer noopener" className="text-xs text-blue-700 hover:underline">Ouvrir dans Maps</a>
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

  const MC = MapContainer as unknown as ComponentType<Record<string, unknown>>;
  const TL = TileLayer as unknown as ComponentType<Record<string, unknown>>;
  const CM = CircleMarker as unknown as ComponentType<Record<string, unknown>>;
  const PP = Popup as unknown as ComponentType<Record<string, unknown>>;
  const PL = Polyline as unknown as ComponentType<Record<string, unknown>>;
  const TT = Tooltip as unknown as ComponentType<Record<string, unknown>>;

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
    <MC center={center} zoom={6} style={{ height: '70vh', width: '100%', borderRadius: '0.75rem' }} scrollWheelZoom={true}>
      <TL
        attribution='&copy; OpenStreetMap'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <FitToBounds positions={polyline} />

      {polyline.length >= 2 && (
        <PL positions={polyline} pathOptions={{ color: '#3b82f6', weight: 3, opacity: 0.55 }} />
      )}

      {points.map(({ work, lat, lng }, i) => (
        <CM key={work.id} center={[lat, lng]} radius={7} pathOptions={{ color: '#ef4444', weight: 1, fillColor: '#ef4444', fillOpacity: 0.95 }}>
          <TT permanent direction="top" offset={[0, -8]} className="!bg-white/90 !text-gray-800 !border !border-gray-300 !rounded !px-1 !py-0.5 !text-[10px]">
            {i + 1}
          </TT>
          <PP>
            <PopupContent work={work} />
          </PP>
        </CM>
      ))}
    </MC>
  );
}

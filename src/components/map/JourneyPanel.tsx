import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Play } from 'lucide-react';
import { IMAGE_BASE_URL } from '@/lib/images';
import { s3ImageLoader } from '@/lib/imageLoader';
import { excerpt, formatTimestamp, interviewUrl, type InterviewQuote, type JourneyStep } from '@/lib/journey';
import { useLocale, useT } from '@/i18n';

interface ImageLayer {
  key: number;
  src: string | null;
  label: string;
  ready: boolean;
}

// Fondu enchaîné : l'image précédente reste affichée jusqu'à ce que la suivante soit chargée,
// puis la nouvelle apparaît par-dessus et l'ancienne est retirée. Sans image (étape de vie),
// l'année s'affiche en grand sur le fond sombre, pour que le cadre ne change jamais de taille.
function CrossfadeImage({ src, label, sizes }: { src: string | null; label: string; sizes: string }) {
  const nextKey = useRef(1);
  const [layers, setLayers] = useState<ImageLayer[]>(() => [{ key: 0, src, label, ready: !src }]);

  useEffect(() => {
    setLayers((current) => {
      const top = current[current.length - 1];
      if (top && top.src === src && top.label === label) return current;
      return [...current.slice(-1), { key: nextKey.current++, src, label, ready: !src }];
    });
  }, [src, label]);

  const markReady = (key: number) => setLayers((ls) => ls.map((l) => (l.key === key ? { ...l, ready: true } : l)));
  // Une fois la nouvelle couche apparue, les couches du dessous ne servent plus
  const dropBelow = (key: number) =>
    setLayers((ls) => {
      const i = ls.findIndex((l) => l.key === key);
      return i > 0 ? ls.slice(i) : ls;
    });

  return (
    <>
      {layers.map((layer) => (
        <div
          key={layer.key}
          className="wg-xfade absolute inset-0"
          data-ready={layer.ready}
          onTransitionEnd={(e) => {
            if (e.propertyName === 'opacity' && layer.ready) dropBelow(layer.key);
          }}
        >
          {layer.src ? (
            <Image
              src={layer.src}
              alt={layer.label}
              fill
              sizes={sizes}
              className="object-contain"
              loader={s3ImageLoader}
              onLoad={() => markReady(layer.key)}
              onError={() => markReady(layer.key)}
            />
          ) : (
            <span className="absolute inset-0 flex items-center justify-center text-6xl font-light tabular-nums text-white/25" aria-hidden="true">
              {layer.label}
            </span>
          )}
        </div>
      ))}
    </>
  );
}

// Présentation d'une étape du voyage : grand vitrail sur fond sombre, texte du catalogue ou de la biographie,
// citation de l'interview. `panel` : colonne de droite sur ordinateur ; `overlay` : carte posée sur la carte (mobile).
// Le composant reste monté d'une étape à l'autre : seule l'image passe en fondu et le texte change en douceur.
export default function JourneyPanel({ step, quote, color, variant }: {
  step: JourneyStep;
  quote?: InterviewQuote;
  color: string;
  variant: 'panel' | 'overlay';
}) {
  const t = useT();
  const locale = useLocale();
  const isWork = step.kind === 'work';
  const image = (isWork
    ? step.work.main_image && `${IMAGE_BASE_URL}/vitraux/${step.work.main_image}`
    : step.milestone.image && `${IMAGE_BASE_URL}/${step.milestone.image}`) || null;
  const title = isWork ? step.work.title_fr : step.milestone.title[locale];
  const subtitle = isWork ? `${step.place.building_name}, ${step.place.city}` : t.map.lifeLabel;
  const body = isWork ? excerpt(step.work.text_fr, variant === 'panel' ? 320 : 140) : step.milestone.text[locale];
  const panel = variant === 'panel';

  return (
    <article className={`wg-journey-card bg-white ${panel ? '' : 'border border-gray-400 shadow-md'}`} aria-live="polite">
      <div className={`relative w-full overflow-hidden bg-neutral-950 ${panel ? 'aspect-[4/3] max-h-[40vh]' : 'h-28'}`}>
        <CrossfadeImage src={image} label={image ? title : step.year} sizes={panel ? '(min-width: 1280px) 400px, 368px' : '100vw'} />
      </div>

      {/* Hauteur minimale pour que le panneau ne saute pas d'une étape à l'autre */}
      <div key={step.id} className={`wg-fade-text ${panel ? 'pt-4 min-h-[26rem]' : 'p-3 min-h-[12.5rem]'}`}>
        <p className={`font-semibold tabular-nums leading-none ${panel ? 'text-3xl' : 'text-xl'}`} style={{ color }}>{step.year}</p>
        <h3 className={`mt-1.5 text-gray-950 leading-snug ${panel ? 'text-xl' : 'text-base'}`}>{title}</h3>
        <p className="text-sm text-gray-500">{subtitle}</p>
        {body && <p className={`mt-2 text-gray-700 leading-relaxed ${panel ? 'text-[15px] line-clamp-5' : 'text-sm line-clamp-2'}`}>{body}</p>}

        {quote && (
          <figure className={`border-l-2 pl-3 ${panel ? 'mt-3' : 'mt-2'}`} style={{ borderColor: color }}>
            <blockquote className={`italic text-gray-800 leading-relaxed ${panel ? 'text-[15px] line-clamp-6' : 'text-sm line-clamp-2'}`}>
              « {quote[locale]} »
            </blockquote>
            <figcaption className="mt-1 text-xs text-gray-500">
              {t.map.quoteCredit}{' '}
              <a href={interviewUrl(quote.seconds)} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 underline underline-offset-2 hover:text-gray-900">
                <Play className="w-3 h-3" fill="currentColor" aria-hidden="true" />
                {t.map.listenAt(formatTimestamp(quote.seconds))}
              </a>
            </figcaption>
          </figure>
        )}

        {isWork && (
          <Link href={`/jeannette/catalogue/${step.work.id}`} className="mt-3 inline-block text-sm underline underline-offset-2 text-gray-800 hover:text-gray-950">
            {t.common.seeWork}
          </Link>
        )}
      </div>
    </article>
  );
}

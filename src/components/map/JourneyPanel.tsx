import Image from 'next/image';
import Link from 'next/link';
import { Play } from 'lucide-react';
import { IMAGE_BASE_URL } from '@/lib/images';
import { s3ImageLoader } from '@/lib/imageLoader';
import { excerpt, formatTimestamp, interviewUrl, type InterviewQuote, type JourneyStep } from '@/lib/journey';
import { useLocale, useT } from '@/i18n';

// Présentation d'une étape du voyage : grand vitrail sur fond sombre, texte du catalogue ou de la biographie,
// citation de l'interview. `panel` : colonne de droite sur ordinateur ; `overlay` : carte posée sur la carte (mobile).
export default function JourneyPanel({ step, quote, color, variant }: {
  step: JourneyStep;
  quote?: InterviewQuote;
  color: string;
  variant: 'panel' | 'overlay';
}) {
  const t = useT();
  const locale = useLocale();
  const isWork = step.kind === 'work';
  const image = isWork
    ? step.work.main_image && `${IMAGE_BASE_URL}/vitraux/${step.work.main_image}`
    : step.milestone.image && `${IMAGE_BASE_URL}/${step.milestone.image}`;
  const title = isWork ? step.work.title_fr : step.milestone.title[locale];
  const subtitle = isWork ? `${step.place.building_name}, ${step.place.city}` : t.map.lifeLabel;
  const body = isWork ? excerpt(step.work.text_fr, variant === 'panel' ? 320 : 140) : step.milestone.text[locale];
  const panel = variant === 'panel';

  return (
    <article className={`wg-journey-card bg-white ${panel ? '' : 'border border-gray-400 shadow-md'}`} aria-live="polite">
      {image && (
        <div className={`relative w-full bg-neutral-950 ${panel ? 'aspect-[4/3] max-h-[40vh]' : 'h-32'}`}>
          <Image src={image} alt={title} fill sizes={panel ? '(min-width: 1280px) 400px, 368px' : '100vw'} className="object-contain" loader={s3ImageLoader} />
        </div>
      )}
      <div className={panel ? 'pt-4' : 'p-3'}>
        <p className={`font-semibold tabular-nums leading-none ${panel ? 'text-3xl' : 'text-xl'}`} style={{ color }}>{step.year}</p>
        <h3 className={`mt-1.5 text-gray-950 leading-snug ${panel ? 'text-xl' : 'text-base'}`}>{title}</h3>
        <p className="text-sm text-gray-500">{subtitle}</p>
        {body && <p className={`mt-2 text-gray-700 leading-relaxed ${panel ? 'text-[15px] line-clamp-5' : 'text-sm line-clamp-3'}`}>{body}</p>}

        {quote && (
          <figure className={`border-l-2 pl-3 ${panel ? 'mt-3' : 'mt-2'}`} style={{ borderColor: color }}>
            <blockquote className={`italic text-gray-800 leading-relaxed ${panel ? 'text-[15px] line-clamp-6' : 'text-sm line-clamp-3'}`}>
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

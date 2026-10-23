import { useState } from 'react';
import Image from 'next/image';
import { Play } from 'lucide-react';

// Vignette cliquable : le lecteur YouTube (sans cookies) ne se charge qu'au clic,
// ce qui garde la page légère et n'envoie rien à YouTube avant que le visiteur le décide.
export default function YouTubeEmbed({ id, title }: { id: string; title: string }) {
  const [active, setActive] = useState(false);

  return (
    <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-black shadow-2xl">
      {active ? (
        <iframe
          className="absolute inset-0 w-full h-full"
          src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
        />
      ) : (
        <button type="button" onClick={() => setActive(true)} className="group absolute inset-0 w-full h-full" aria-label={`Lire la vidéo : ${title}`}>
          <Image
            src={`https://i.ytimg.com/vi/${id}/maxresdefault.jpg`}
            alt=""
            fill
            unoptimized
            sizes="(max-width: 1024px) 100vw, 896px"
            className="object-cover opacity-85 group-hover:opacity-100 transition-opacity"
          />
          <span className="absolute inset-0 flex items-center justify-center">
            <span className="flex items-center justify-center w-16 h-16 md:w-20 md:h-20 rounded-full bg-red-600 group-hover:bg-red-700 shadow-xl transition-colors">
              <Play className="w-8 h-8 md:w-10 md:h-10 text-white ml-1" fill="currentColor" aria-hidden="true" />
            </span>
          </span>
        </button>
      )}
    </div>
  );
}

// Étapes de vie du voyage chronologique, tirées de la biographie du site.
// Une étape sans coordonnées ne déplace pas la carte ; `image` est un chemin dans le bucket.

export interface LifeMilestone {
  id: string;
  year: string;
  lat?: number;
  lng?: number;
  image?: string;
  title: { fr: string; en: string };
  text: { fr: string; en: string };
}

const PARIS = { lat: 48.8566, lng: 2.3522 };
const VILLA_ALESIA = { lat: 48.8275, lng: 2.3235 };
const MONTREAL = { lat: 45.5017, lng: -73.5673 };

export const LIFE_MILESTONES: LifeMilestone[] = [
  {
    id: 'bio-1934-naissance', year: '1934', ...PARIS, image: 'bio/photo_miminette_bio_1.jpg',
    title: { fr: 'Naissance à Paris', en: 'Born in Paris' },
    text: {
      fr: 'Fille du maître-verrier Jean-Jacques Gruber et petite-fille de Jacques Gruber, figure de l’École de Nancy, elle grandit dans l’atelier familial.',
      en: 'Daughter of the master glassmaker Jean-Jacques Gruber and granddaughter of Jacques Gruber, a leading figure of the École de Nancy, she grew up in the family workshop.',
    },
  },
  {
    id: 'bio-1945-main', year: '1945',
    title: { fr: 'La main droite écrasée', en: 'A crushed right hand' },
    text: {
      fr: 'Enfant, elle a la main droite écrasée par une pierre de 30 kg. Réimplantée après douze heures de train, la main reste un peu de travers : « Para-artiste », dit-elle.',
      en: 'As a child, her right hand was crushed by a 30 kg stone. Reattached after a twelve-hour train journey, it stayed slightly crooked: “A para-artist,” she would say.',
    },
  },
  {
    id: 'bio-1952-atelier', year: '1952', ...VILLA_ALESIA, image: 'bio/photo_miminette_bio_atelier.jpg',
    title: { fr: 'L’atelier familial', en: 'The family workshop' },
    text: {
      fr: 'Elle commence sa carrière dans l’atelier familial de la Villa d’Alésia, où elle voit de près des vitraux anciens en restauration.',
      en: 'She began her career in the family workshop at the Villa d’Alésia, where she saw old stained glass up close during restoration.',
    },
  },
  {
    id: 'bio-1958-technique', year: '1958',
    title: { fr: 'Peignes et éponges', en: 'Combs and sponges' },
    text: {
      fr: 'Elle met au point sa technique : peignes et éponges, puis blaireaux et pinceaux, pour travailler la grisaille. Le blanc et le bleu sont ses couleurs de prédilection.',
      en: 'She developed her technique: combs and sponges, then badger brushes and paintbrushes, to work the grisaille. White and blue were her favorite colors.',
    },
  },
  {
    id: 'bio-1969-quebec', year: '1969', ...MONTREAL, image: 'vitraux/alu/alu_6.jpeg',
    title: { fr: 'Départ au Québec', en: 'Moving to Quebec' },
    text: {
      fr: 'Avec son mari et ses enfants, elle part au Québec (1969-1973). Pour les usines Alcan, elle invente ses aluchromies, des peintures sur aluminium.',
      en: 'With her husband and children she moved to Quebec (1969–1973). For the Alcan plants she invented her aluchromies, paintings on aluminum.',
    },
  },
  {
    id: 'bio-1973-retour', year: '1973', ...PARIS,
    title: { fr: 'Retour à Paris', en: 'Back in Paris' },
    text: {
      fr: 'Elle enseigne l’histoire de l’art pour une école américaine et obtient le diplôme des Arts et Métiers pour la coupe et le montage des vitraux.',
      en: 'She taught art history for an American school and received the Arts et Métiers diploma in cutting and assembling stained glass.',
    },
  },
  {
    id: 'bio-1980-atelier', year: '1980', ...VILLA_ALESIA, image: 'bio/photo_miminette_bio_signature.jpg',
    title: { fr: 'Son atelier, 10 Villa d’Alésia', en: 'Her own workshop, 10 Villa d’Alésia' },
    text: {
      fr: 'Elle reprend une partie de l’atelier familial et signe désormais JWG, aidée d’anciennes élèves et de deux maîtres-verriers.',
      en: 'She took over part of the family workshop and from then on signed JWG, helped by former students and two master glassmakers.',
    },
  },
  {
    id: 'bio-2001-medaille', year: '2001',
    title: { fr: 'Médaille de la Restauration', en: 'Médaille de la Restauration' },
    text: {
      fr: 'La Fondation de l’Académie d’Architecture salue l’excellence de son œuvre en création et en restauration.',
      en: 'The Fondation de l’Académie d’Architecture honored the excellence of her work in creation and restoration.',
    },
  },
  {
    id: 'bio-2003-fermeture', year: '2003', ...VILLA_ALESIA,
    title: { fr: 'Fermeture de l’atelier', en: 'The workshop closes' },
    text: {
      fr: 'Après plus de cinquante ans de vitrail, elle ferme l’atelier de la Villa d’Alésia.',
      en: 'After more than fifty years of stained glass, she closed the Villa d’Alésia workshop.',
    },
  },
  {
    id: 'bio-2026-hommage', year: '2026', ...PARIS, image: 'bio/photo_miminette_bio_6.jpg',
    title: { fr: 'Hommage', en: 'Tribute' },
    text: {
      fr: 'Jeannette Weiss Gruber s’éteint le 7 juin 2026 à Paris, à 91 ans. Une cérémonie lui rend hommage sous la coupole du Père-Lachaise.',
      en: 'Jeannette Weiss Gruber died in Paris on June 7, 2026, aged 91. A ceremony paid tribute to her under the dome of Père-Lachaise.',
    },
  },
];

// Extraits de l'interview filmée par son fils, rattachés à une œuvre (id du CSV) ou à une étape de vie
export interface InterviewQuote {
  anchor: string;
  seconds: number;
  fr: string;
  en: string;
}

export const INTERVIEW_ID = 'Wlh5VD3t_pQ';

export const interviewUrl = (seconds: number) => `https://www.youtube.com/watch?v=${INTERVIEW_ID}&t=${seconds}s`;

export const formatTimestamp = (seconds: number) => {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = String(seconds % 60).padStart(2, '0');
  return h ? `${h}:${String(m).padStart(2, '0')}:${s}` : `${m}:${s}`;
};

// Extrait court d'un texte, coupé à la fin d'un mot
export function excerpt(text: string | undefined, max = 300): string {
  const clean = (text ?? '').replace(/\s+/g, ' ').trim();
  if (clean.length <= max) return clean;
  return `${clean.slice(0, max).replace(/\s+\S*$/, '')}…`;
}

// Une étape du voyage : une œuvre localisée, ou une étape de vie
export interface JourneyPlace {
  key: string;
  lat: number;
  lng: number;
  building_name: string;
  city: string;
}

export type JourneyStep =
  | { kind: 'work'; id: string; year: string; work: import('@/types/images').Vitrail; place: JourneyPlace }
  | { kind: 'life'; id: string; year: string; milestone: LifeMilestone };

export function stepLatLng(step: JourneyStep): [number, number] | null {
  if (step.kind === 'work') return [step.place.lat, step.place.lng];
  return step.milestone.lat !== undefined && step.milestone.lng !== undefined ? [step.milestone.lat, step.milestone.lng] : null;
}

// Séjours : pendant ces années, le voyage reste sur place (les œuvres du séjour d'abord, dans l'ordre
// des années), puis montre ce qui a été fait ailleurs pendant la même période. Évite les allers-retours
// au-dessus de l'Atlantique pendant les années au Québec.
const STAYS = [
  { from: 1969, to: 1973, inRegion: (lat: number, lng: number) => lng < -30 },
];

const distanceKm = (a: [number, number], b: [number, number]) => {
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(b[0] - a[0]);
  const dLng = toRad(b[1] - a[1]);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(a[0])) * Math.cos(toRad(b[0])) * Math.sin(dLng / 2) ** 2;
  return 12742 * Math.asin(Math.sqrt(h));
};

// Ordre du voyage : par année ; à année égale, la vie d'abord puis l'œuvre la plus proche du lieu
// où l'on se trouve ; enfin, regroupement des séjours.
export function orderJourney(steps: JourneyStep[]): JourneyStep[] {
  const year = (s: JourneyStep) => parseInt(s.year) || 0;
  const chrono = steps
    .map((step, i) => ({ step, i }))
    .sort((a, b) => year(a.step) - year(b.step)
      || (a.step.kind === 'life' ? 0 : 1) - (b.step.kind === 'life' ? 0 : 1)
      || a.i - b.i)
    .map(({ step }) => step);

  // À année égale, enchaîner les œuvres par proximité
  const nearest: JourneyStep[] = [];
  let here: [number, number] | null = null;
  for (let k = 0; k < chrono.length;) {
    const y = year(chrono[k]);
    const group: JourneyStep[] = [];
    while (k < chrono.length && year(chrono[k]) === y) group.push(chrono[k++]);
    for (const life of group.filter((s) => s.kind === 'life')) {
      nearest.push(life);
      here = stepLatLng(life) ?? here;
    }
    const rest = group.filter((s) => s.kind === 'work');
    while (rest.length) {
      let best = 0;
      if (here) {
        let bestD = Infinity;
        rest.forEach((s, j) => {
          const ll = stepLatLng(s);
          const d = ll && here ? distanceKm(here, ll) : Infinity;
          if (d < bestD) { bestD = d; best = j; }
        });
      }
      const [next] = rest.splice(best, 1);
      nearest.push(next);
      here = stepLatLng(next) ?? here;
    }
  }

  // Séjours : sur place d'abord, puis ailleurs pendant la même période
  let ordered = nearest;
  for (const stay of STAYS) {
    const inStay = (s: JourneyStep) => year(s) >= stay.from && year(s) < stay.to;
    const first = ordered.findIndex(inStay);
    if (first < 0) continue;
    const segment = ordered.filter(inStay);
    const local = segment.filter((s) => {
      const ll = stepLatLng(s);
      return ll ? stay.inRegion(ll[0], ll[1]) : s.kind === 'life';
    });
    const elsewhere = segment.filter((s) => !local.includes(s));
    const outside = ordered.filter((s) => !inStay(s));
    ordered = [...outside.slice(0, first), ...local, ...elsewhere, ...outside.slice(first)];
  }
  return ordered;
}

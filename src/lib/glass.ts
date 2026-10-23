import { decadeOf } from '@/lib/text';

// Couleurs de verre par décennie : cobalt, émeraude, améthyste, jaune d'argent, rubis, opalescent.
// Utilisées par la carte, le voyage et les fiches d'œuvres.
export const GLASS: Record<number, string> = {
  1950: '#1f4e9c',
  1960: '#2f7d5b',
  1970: '#6b4c9a',
  1980: '#c8962e',
  1990: '#a3263a',
  2000: '#5f8fb8',
};

export const glassFor = (year?: string) => GLASS[decadeOf(year) ?? 0] ?? '#7a7a7a';

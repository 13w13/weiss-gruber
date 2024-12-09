// utils/artworks.ts
import { ArtworkImage } from '@/types/images';

export const getArtworkPath = (artwork: ArtworkImage, type: 'main' | 'detail' = 'main') => 
  `/images/${artwork.artist}/catalogue/${artwork.year}/${artwork.location}/${type}.jpg`;

export const getFeaturedImage = (artist: ArtistId, imageName: string) =>
  `/images/${artist}/featured/${imageName}`;
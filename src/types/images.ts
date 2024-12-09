// types/images.ts
export type ArtistId = 'jeannette' | 'frederic' | 'camille';
export type ArtworkCategory = 'vitrail' | 'peinture' | 'sculpture';

export interface ArtworkImage {
  id: string;
  artist: ArtistId;
  year: number;
  location: string;
  title: string;
  description: string;
  category: ArtworkCategory;
  dimensions?: string;
  images: {
    main: string;
    details?: string[];
  };
}
// types/images.ts
export type ArtistId = 'jeannette' | 'frederic' | 'camille';
export type ArtworkCategory = 'vitrail' | 'peinture' | 'sculpture';

export interface GalleryImage {
  url: string;
  type: string;
  credit?: string;
  alt_fr?: string;
  alt_en?: string;
}

export interface Vitrail {
  id: string;
  year: string;
  building_name: string;
  building_type: string;
  city: string;
  department: string;
  location_in_building: string;
  title_fr: string;
  main_image: string;
  caption_fr?: string;
  photo_status: string;
  description_fr: string;
  maps_url?: string;
  lat?: string;
  lng?: string;
  gallery_images?: GalleryImage[];
}

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
import Image from 'next/image'
import { ArtistId } from '@/types/images'

interface FeaturedImageProps {
  artist: ArtistId
  imageName: string
  alt: string
  priority?: boolean
  className?: string
}

export function FeaturedImage({ artist, imageName, alt, priority = false, className = '' }: FeaturedImageProps) {
  const imagePath = `/images/${artist}/${imageName}`

  return (
    <Image
      src={imagePath}
      alt={alt}
      fill
      priority={priority}
      className={`object-cover ${className}`}
    />
  )
}
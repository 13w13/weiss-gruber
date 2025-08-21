import Image from 'next/image'

interface FeaturedImageProps {
  src: string
  alt: string
  priority?: boolean
  className?: string
}

export function FeaturedImage({ src, alt, priority = false, className = '' }: FeaturedImageProps) {
  return (
    <Image
      src={src}
      alt={alt}
      fill
      priority={priority}
      className={`object-cover ${className}`}
    />
  )
}
import Image from 'next/image'

interface ProductImagesProps {
  imageUrl: string | null
  name: string
}

export function ProductImages({ imageUrl, name }: ProductImagesProps) {
  return (
    <div className="relative aspect-square bg-stone-100 rounded-xl overflow-hidden">
      {imageUrl ? (
        <Image
          src={imageUrl}
          alt={name}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 50vw"
          priority
        />
      ) : (
        <div className="absolute inset-0 flex flex-col items-center justify-center text-stone-300 gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-16 w-16"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          <span className="text-sm">Sin imagen</span>
        </div>
      )}
    </div>
  )
}

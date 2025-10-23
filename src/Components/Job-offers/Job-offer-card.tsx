"use client"

import type { JobOffer } from "@/app/lib/mock-data"
import { ImageCarousel } from "@/Components/Shared/ImageCarousel"
// MapPin is not used in this component

interface JobOfferCardProps {
  offer: JobOffer
  onClick: () => void
}

export function JobOfferCard({ offer, onClick }: JobOfferCardProps) {
  const images = offer.photos.length > 0 
    ? offer.photos 
    : ["/placeholder.svg?height=180&width=320&text=Oferta"]

  return (
    <button
      onClick={onClick}
      className="group relative w-full overflow-hidden rounded-xl border border-primary bg-white transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg"
    >
      <ImageCarousel 
        images={images} 
        alt={`Trabajo de ${offer.fixerName}`} 
      />
      <div className="absolute left-3 top-3 inline-flex items-center gap-2 rounded-full bg-white/90 px-3 py-1 text-xs text-slate-700 border border-gray-200 shadow-sm">
        <span className="font-medium text-blue-600">{offer.city}</span>
      </div>
      <div className="absolute right-3 top-3 rounded-xl bg-white/95 px-3 py-2 text-sm font-bold text-primary shadow-lg border border-primary/20">
        {offer.price} Bs
      </div>
      <div className="pointer-events-none absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/40 to-black/0 p-4">
        <div className="flex items-end justify-between">
          <div className="text-white">
            <div className="text-sm opacity-90">{offer.fixerName}</div>
            <div className="text-xs opacity-80">{offer.whatsapp}</div>
          </div>
          <div className="flex items-center gap-2 text-xs bg-gradient-to-r from-primary to-blue-600 px-3 py-1 rounded-full text-white font-medium">
            {offer.services[0]}
          </div>
        </div>
      </div>
    </button>
  )
}
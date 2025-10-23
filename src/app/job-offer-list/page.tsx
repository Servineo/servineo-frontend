"use client"

import { useState, useEffect, useMemo } from "react"
import { mockJobOfferService, type JobOffer } from "../lib/mock-data"
import { JobOfferCard } from "@/Components/Job-offers/Job-offer-card"
import { JobOfferModal } from "@/Components/Job-offers/Job-offer-modal"
import { List, Map } from "lucide-react"
import { SearchBar } from "@/Components/Shared/SearchBar"
import { FilterBar } from "@/Components/Shared/FilterBar"
import { Navbar } from "@/Components/Shared/Navbar"
import { MapView } from "@/Components/Job-offers/maps/MapView"

export default function JobOffersPage() {
  const [selectedOffer, setSelectedOffer] = useState<JobOffer | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [offers, setOffers] = useState<JobOffer[]>([])
  const [view, setView] = useState<"list" | "map">("map")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedFilters, setSelectedFilters] = useState<string[]>([])

  // Cargar ofertas al montar el componente
  useEffect(() => {
    const allOffers = mockJobOfferService.getOffers()
    setOffers(allOffers)
  }, [])

  const availableFilters = useMemo(() => {
    return Array.from(new Set(offers.flatMap((offer) => offer.tags)))
  }, [offers])

  const sortedOffers = useMemo(() => {
    return [...offers]
      .filter((offer) => {
        const matchesSearch =
          searchQuery === "" ||
          offer.fixerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          offer.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          offer.tags.some((tag) =>
            tag.toLowerCase().includes(searchQuery.toLowerCase())
          )

        const matchesFilters =
          selectedFilters.length === 0 ||
          selectedFilters.some((filter) => offer.tags.includes(filter))

        return matchesSearch && matchesFilters
      })
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
  }, [offers, searchQuery, selectedFilters])

  const handleFilterChange = (filter: string) => {
    setSelectedFilters((prev) =>
      prev.includes(filter)
        ? prev.filter((f) => f !== filter)
        : [...prev, filter]
    )
  }

  const handleCardClick = (offer: JobOffer) => {
    setSelectedOffer(offer)
    setIsModalOpen(true)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      <Navbar />
      
      <div className="flex justify-center container mx-auto py-2">
        <div className="flex justify-end">
          <div className="inline-flex items-center gap-2 bg-white backdrop-blur-lg border-2 border-primary rounded-xl p-1">
            <button
              onClick={() => setView("list")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                view === "list"
                  ? "bg-primary text-white shadow-lg shadow-blue-500/30"
                  : "text-blue-900 hover:bg-blue-50"
              }`}
            >
              <List className="w-4 h-4" />
              Lista
            </button>
            <button
              onClick={() => setView("map")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                view === "map"
                  ? "bg-primary text-white shadow-lg shadow-blue-500/30"
                  : "text-blue-900 hover:bg-blue-50"
              }`}
            >
              <Map className="w-4 h-4" />
              Mapa
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-col md:flex-row gap-4 mb-8 animate-fade-in">
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Buscar ofertas de trabajo..."
            disabled={false}
          />

          <FilterBar
            filters={availableFilters}
            selectedFilters={selectedFilters}
            onFilterChange={handleFilterChange}
            onClearFilters={() => setSelectedFilters([])}
            disabled={true}
          />
        </div> {/* ← faltaba cerrar este div */}

        {view === "list" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedOffers.map((offer, index) => (
              <div
                key={offer.id}
                className="animate-fade-in"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <JobOfferCard offer={offer} onClick={() => handleCardClick(offer)} />
              </div>
            ))}

            {sortedOffers.length === 0 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground">
                  No hay ofertas de trabajo disponibles
                </p>
              </div>
            )}
          </div>
        ) : (
          <div className="w-full min-h-[calc(100vh-16rem)] relative">
            <div className="absolute inset-0">
              <MapView
                offers={sortedOffers}
                onOfferClick={(offer) => {
                  setSelectedOffer(offer)
                  setIsModalOpen(true)
                }}
              />
            </div>
          </div>
        )}
      </div>

      <JobOfferModal
        offer={selectedOffer}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  )
}

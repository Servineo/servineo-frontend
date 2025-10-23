"use client"

import { useEffect, useRef, useState } from "react"
import { Card } from "@/Components/Card"

interface Location {
  lat: number
  lng: number
}

interface LocationStepProps {
  location: Location | null
  onLocationChange: (location: Location) => void
  error?: string
}

export function LocationStep({ location, onLocationChange, error }: LocationStepProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const [mapLoaded, setMapLoaded] = useState(false)
  const [manualLat, setManualLat] = useState(location?.lat.toString() || "")
  const [manualLng, setManualLng] = useState(location?.lng.toString() || "")

  useEffect(() => {
    // Load Leaflet CSS
    if (!document.getElementById("leaflet-css")) {
      const link = document.createElement("link")
      link.id = "leaflet-css"
      link.rel = "stylesheet"
      link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
      document.head.appendChild(link)
    }

    // Load Leaflet JS
    if (!window.L) {
      const script = document.createElement("script")
      script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"
      script.onload = () => setMapLoaded(true)
      document.body.appendChild(script)
    } else {
      setMapLoaded(true)
    }
  }, [])

  useEffect(() => {
    if (!mapLoaded || !mapRef.current) return

    const { L } = window

    // Initialize map centered on La Paz, Bolivia
    const map = L.map(mapRef.current).setView([-17.3895, -66.1568], 13)

    // Add OpenStreetMap tiles
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 19,
    }).addTo(map)

    let marker: L.Marker | null = null

    // Add existing marker if location exists
    if (location) {
      marker = L.marker([location.lat, location.lng]).addTo(map)
      map.setView([location.lat, location.lng], 15)
    }

    // Handle map clicks
    map.on("click", (e: L.LeafletEvent) => {
      const { lat, lng } = e.latlng

      // Remove old marker
      if (marker) {
        map.removeLayer(marker)
      }

      // Add new marker
      marker = L.marker([lat, lng]).addTo(map)

      // Update location
      onLocationChange({ lat, lng })
      setManualLat(lat.toFixed(6))
      setManualLng(lng.toFixed(6))
    })

    return () => {
      map.remove()
    }
  }, [mapLoaded, location, onLocationChange])

  const handleManualUpdate = () => {
    const lat = Number.parseFloat(manualLat)
    const lng = Number.parseFloat(manualLng)

    if (!isNaN(lat) && !isNaN(lng) && lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180) {
      onLocationChange({ lat, lng })
    }
  }

  return (
    <Card title="Registrar ubicación de trabajo">
      <div className="space-y-4">
        <div className="space-y-2">
          <p className="text-sm text-gray-700">Haz clic en el mapa para seleccionar tu ubicación de trabajo</p>
          <div ref={mapRef} className="h-80 w-full rounded-xl border border-gray-300 bg-gray-100" />
        </div>

        {location && (
          <div className="space-y-2 rounded-lg bg-blue-50 p-3">
            <p className="text-sm font-medium text-blue-900">Ubicación seleccionada:</p>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-xs text-primary">Latitud</label>
                <input
                  type="number"
                  step="0.000001"
                  value={manualLat}
                  onChange={(e) => setManualLat(e.target.value)}
                  className="w-full rounded-md border border-blue-200 bg-white px-2 py-1 text-sm"
                />
              </div>
              <div>
                <label className="text-xs text-primary">Longitud</label>
                <input
                  type="number"
                  step="0.000001"
                  value={manualLng}
                  onChange={(e) => setManualLng(e.target.value)}
                  className="w-full rounded-md border border-blue-200 bg-white px-2 py-1 text-sm"
                />
              </div>
            </div>
            <button
              type="button"
              onClick={handleManualUpdate}
              className="w-full rounded-md bg-primary px-3 py-1 text-sm text-white hover:bg-primary"
            >
              Actualizar ubicación
            </button>
          </div>
        )}

        {error && <p className="text-sm text-red-600">{error}</p>}
      </div>
    </Card>
  )
}

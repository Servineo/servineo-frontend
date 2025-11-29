"use client"

import { useCallback, useEffect, useRef, useState, useMemo } from "react"
import { Card } from "@/Components/Card"
import { Locate, ZoomIn, ZoomOut } from "lucide-react"
import type { Map, Marker, LeafletMouseEvent} from 'leaflet'
import 'leaflet/dist/leaflet.css'

interface Location {
  lat: number
  lng: number
}

interface LocationStepProps {
  location: Location | null
  onLocationChange: (location: Location) => void
  error?: string
}

type LeafletModule = typeof import('leaflet')

export function LocationStep({ location, onLocationChange, error }: LocationStepProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<Map | null>(null)
  const markerRef = useRef<Marker | null>(null)
  const [manualLat, setManualLat] = useState(location?.lat.toString() || "")
  const [manualLng, setManualLng] = useState(location?.lng.toString() || "")
  const [outOfBounds, setOutOfBounds] = useState(false)

  // Cochabamba bounds
  const COCHABAMBA_BOUNDS = useMemo(() => ({
    north: -17.2,
    south: -17.6,
    east: -65.8,
    west: -66.4
  }), [])

  // Check if location is within Cochabamba
  const isInCochabamba = useCallback((lat: number, lng: number): boolean => {
    return (
      lat >= COCHABAMBA_BOUNDS.south &&
      lat <= COCHABAMBA_BOUNDS.north &&
      lng >= COCHABAMBA_BOUNDS.west &&
      lng <= COCHABAMBA_BOUNDS.east
    )
  }, [COCHABAMBA_BOUNDS])

  // Handle map clicks
  const handleMapClick = useCallback((L: LeafletModule, map: Map, lat: number, lng: number) => {
    if (!isInCochabamba(lat, lng)) {
      setOutOfBounds(true)
      if (markerRef.current) {
        map.removeLayer(markerRef.current)
        markerRef.current = null
      }
      onLocationChange({ lat: 0, lng: 0 })
      setManualLat("")
      setManualLng("")
      return
    }

    setOutOfBounds(false)
    addMarker(L, map, lat, lng)
    onLocationChange({ lat, lng })
    setManualLat(lat.toFixed(6))
    setManualLng(lng.toFixed(6))
  }, [isInCochabamba, onLocationChange])

  // Add marker to map
  const addMarker = (L: LeafletModule, map: Map, lat: number, lng: number) => {
    if (markerRef.current) {
      map.removeLayer(markerRef.current)
    }

    const marker = L.marker([lat, lng], {
      icon: L.divIcon({
        className: "custom-marker",
        html: `
          <div class="relative">
            <div class="absolute inset-0 w-10 h-10 -left-1 -top-1 bg-primary/70 rounded-full animate-ping"></div>
            <div class="relative w-8 h-8 bg-primary rounded-full border-4 border-white shadow-2xl flex items-center justify-center">
              <svg class="w-4 h-4 text-white" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
              </svg>
            </div>
          </div>
        `,
        iconSize: [40, 40] as [number, number],
        iconAnchor: [20, 40] as [number, number],
      })
    }).addTo(map)

    markerRef.current = marker
  }

  // Initialize map
  useEffect(() => {
  if (typeof window === 'undefined' || !mapRef.current) return

  // Evitar inicialización múltiple
  if (mapInstanceRef.current) {
    return
  }

  const initMap = async () => {
    try {
      const L = await import('leaflet')
      
      // Verificar nuevamente por si el componente se desmontó durante la carga
      if (!mapRef.current) return
      
      // Crear el mapa solo si no existe
      if (!mapInstanceRef.current) {
        const map = L.map(mapRef.current, {
          zoomControl: false,
        }).setView([-17.3935, -66.157], 13)

        // Resto de la configuración del mapa...
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution: "© OpenStreetMap contributors",
          maxZoom: 19,
        }).addTo(map)

        // Configurar límites
        const bounds = L.latLngBounds(
          L.latLng(COCHABAMBA_BOUNDS.south, COCHABAMBA_BOUNDS.west),
          L.latLng(COCHABAMBA_BOUNDS.north, COCHABAMBA_BOUNDS.east)
        )
        map.setMaxBounds(bounds)
        map.on('drag', () => {
          map.panInsideBounds(bounds, { animate: false })
        })

        // Manejador de clics
        map.on("click", (e: LeafletMouseEvent) => {
          const { lat, lng } = e.latlng
          handleMapClick(L, map, lat, lng)
        })

        mapInstanceRef.current = map
      }

      // Si hay una ubicación, centrar el mapa
      if (location && isInCochabamba(location.lat, location.lng)) {
        addMarker(L, mapInstanceRef.current!, location.lat, location.lng)
      }
    } catch (error) {
      console.error("Error al inicializar el mapa:", error)
    }
  }

  initMap()

  // Función de limpieza
  return () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove()
      mapInstanceRef.current = null
    }
  }
}, [isInCochabamba, COCHABAMBA_BOUNDS, handleMapClick, location])

  const handleManualUpdate = useCallback(() => {
    const lat = Number.parseFloat(manualLat)
    const lng = Number.parseFloat(manualLng)

    if (!isNaN(lat) && !isNaN(lng) && isInCochabamba(lat, lng)) {
      setOutOfBounds(false)
      onLocationChange({ lat, lng })
      if (mapInstanceRef.current) {
        import('leaflet').then(L => {
          addMarker(L, mapInstanceRef.current!, lat, lng)
          mapInstanceRef.current!.setView([lat, lng], 15)
        })
      }
    } else {
      setOutOfBounds(true)
    }
  }, [manualLat, manualLng, isInCochabamba, onLocationChange])

  const handleLocateMe = useCallback(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords
          if (mapInstanceRef.current) {
            import('leaflet').then(L => {
              handleMapClick(L, mapInstanceRef.current!, latitude, longitude)
              mapInstanceRef.current!.setView([latitude, longitude], 15)
            })
          }
        },
        (error) => {
          console.error("Error getting location:", error)
        }
      )
    }
  }, [handleMapClick])

  const handleZoomIn = useCallback(() => {
    mapInstanceRef.current?.zoomIn()
  }, [])

  const handleZoomOut = useCallback(() => {
    mapInstanceRef.current?.zoomOut()
  }, [])

  return (
    <Card title="Ubicación de Trabajo" className="max-w-4xl mx-auto">
      <div className="space-y-4">
        <div className="space-y-2">
          <p className="text-sm text-gray-700">
            Haz clic en el mapa para seleccionar tu ubicación de trabajo <strong>solo en la región de Cochabamba</strong>
          </p>
          
      
          <div className="relative h-96 w-full rounded-xl overflow-hidden border border-gray-300">
            <div ref={mapRef} className="w-full h-full" />
            
            <div className="absolute top-4 right-4 flex flex-col gap-2 z-[1000]">
              <button
                onClick={handleLocateMe}
                className="p-2 bg-white/30 backdrop-blur-sm border border-gray-300 rounded-lg text-gray-700 hover:bg-white transition-all shadow-md"
                title="Ubicación actual"
              >
                <Locate className="w-5 h-5 text-primary" />
              </button>
              <button
                onClick={handleZoomIn}
                className="p-2 bg-white/30 backdrop-blur-sm border border-gray-300 rounded-lg text-gray-700 hover:bg-white transition-all shadow-md"
                title="Acercar"
              >
                <ZoomIn className="w-5 h-5 text-primary" />
              </button>
              <button
                onClick={handleZoomOut}
                className="p-2 bg-white/30 backdrop-blur-sm border border-gray-300 rounded-lg text-gray-700 hover:bg-white transition-all shadow-md"
                title="Alejar"
              >
                <ZoomOut className="w-5 h-5 text-primary" />
              </button>
            </div>
          </div>
        </div>

        {outOfBounds && (
          <div className="rounded-lg bg-red-50 p-3 border border-red-200">
            <p className="text-sm text-red-800 font-medium">Ubicación fuera de Cochabamba</p>
            <p className="text-xs text-red-700 mt-1">
              La ubicación seleccionada está fuera de la región de Cochabamba. Por favor, selecciona una ubicación dentro del departamento.
            </p>
          </div>
        )}

        <div className="space-y-2 rounded-lg bg-blue-50 p-4 border border-blue-200">
          <p className="text-sm font-medium text-blue-900">Coordenadas</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Latitud</label>
              <input
                type="number"
                step="0.000001"
                value={manualLat}
                onChange={(e) => setManualLat(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Ej: -17.3935"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Longitud</label>
              <input
                type="number"
                step="0.000001"
                value={manualLng}
                onChange={(e) => setManualLng(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Ej: -66.1570"
              />
            </div>
          </div>
          <button
            type="button"
            onClick={handleManualUpdate}
            className="mt-2 w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
          >
            Actualizar ubicación
          </button>
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}
      </div>
    </Card>
  )
}
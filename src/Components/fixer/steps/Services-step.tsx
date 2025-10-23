"use client"

import { Card } from "@/Components/Card"
import { PillButton } from "../Pill-button"
import { Plus, Edit2, Trash2, Wrench } from "lucide-react"

export interface Service {
  id: string
  name: string
  custom?: boolean
}

interface ServicesStepProps {
  services: Service[]
  selectedServiceIds: string[]
  onToggleService: (id: string) => void
  onAddCustomService: (name: string) => void
  onEditService: (id: string, name: string) => void
  onDeleteService: (id: string) => void
  error?: string
}

export function ServicesStep({
  services,
  selectedServiceIds,
  onToggleService,
  onAddCustomService,
  onEditService,
  onDeleteService,
  error,
}: ServicesStepProps) {
  const handleAddService = () => {
    const el = document.getElementById("newService") as HTMLInputElement | null
    if (el) {
      onAddCustomService(el.value)
      el.value = ""
    }
  }

  return (
    <Card title="Selecciona tus servicios">
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Wrench className="h-4 w-4" />
          <span>Selecciona los servicios que ofreces</span>
        </div>

        <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
          {services.map((s) => (
            <label
              key={s.id}
              className="flex items-center gap-2 rounded-full bg-gray-200 px-4 py-2 text-sm text-gray-900 hover:bg-gray-300 transition-colors cursor-pointer"
            >
              <input
                type="checkbox"
                checked={selectedServiceIds.includes(s.id)}
                onChange={() => onToggleService(s.id)}
                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-blue-500"
              />
              <span className="flex-1 truncate">{s.name}</span>
              {s.custom && (
                <span className="flex gap-2 text-xs">
                  <button
                    type="button"
                    className="text-primary hover:text-blue-800 transition-colors"
                    onClick={(e) => {
                      e.preventDefault()
                      const name = prompt("Editar servicio", s.name) || s.name
                      onEditService(s.id, name)
                    }}
                    title="Editar servicio"
                  >
                    <Edit2 className="h-3 w-3" />
                  </button>
                  <button
                    type="button"
                    className="text-red-600 hover:text-red-700 transition-colors"
                    onClick={(e) => {
                      e.preventDefault()
                      onDeleteService(s.id)
                    }}
                    title="Eliminar servicio"
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                </span>
              )}
            </label>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <input
            id="newService"
            placeholder="Añadir nuevo servicio"
            className="flex-1 rounded-full bg-gray-200 px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-400 transition-all"
          />
          <PillButton
            className="bg-primary text-white hover:bg-blue-800 flex items-center gap-2"
            onClick={handleAddService}
          >
            <Plus className="h-4 w-4" />
            Agregar
          </PillButton>
        </div>
        {error && <p className="text-sm text-red-600">{error}</p>}
      </div>
    </Card>
  )
}

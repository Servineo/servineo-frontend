"use client"

import { useState, useCallback, useEffect } from "react"
import { X, Upload, Sparkles } from "lucide-react"
import { JobOffer } from "@/app/lib/mock-data"
import Image from "next/image"
import { jobOfferSchema } from "@/app/lib/validations/Job-offer-Schemas"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { availableServices } from "@/app/lib/mock-data"
import { useFieldArray } from "react-hook-form"

type JobOfferFormData = z.infer<typeof jobOfferSchema>

interface FormattedJobOffer extends Omit<JobOfferFormData, 'services'> {
  services: { id: string; value: string }[];
  tags?: string[];
}

interface JobOfferFormProps {
  onSubmit: (data: FormattedJobOffer) => void
  onCancel: () => void
  defaultValues?: Partial<JobOffer>
  submitButtonText?: string
}

export default function JobOfferForm({
  onSubmit,
  onCancel,
  defaultValues = {},
  submitButtonText = "Publicar Oferta",
}: JobOfferFormProps) {
  const [photos, setPhotos] = useState<string[]>(defaultValues.photos || [])
  
  const {
    control,
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<JobOfferFormData>({
    resolver: zodResolver(jobOfferSchema),
    defaultValues: {
      description: defaultValues.description || "",
      city: defaultValues.city || "",
      services: defaultValues.services?.map(service => ({
        id: crypto.randomUUID(),
        value: service
      })) || [],
      price: defaultValues.price || 0,
    },
  })

  const { fields, append, remove } = useFieldArray({
    control,
    name: "services" as const,
    rules: { required: true, minLength: 1 }
  })

  const selectedServices = fields.map(field => field.value)
  const description = watch("description") || ""

  // Sincronizar fotos cuando cambien los valores por defecto
  useEffect(() => {
    if (defaultValues.photos) {
      setPhotos(defaultValues.photos)
    }
  }, [defaultValues.photos])

  const handleAddPhoto = useCallback(() => {
    if (photos.length >= 5) {
      alert("No puedes agregar más de 5 fotos")
      return
    }
    const photoUrl = `/placeholder.svg?height=300&width=400&query=work photo ${photos.length + 1}`
    setPhotos(prev => [...prev, photoUrl])
  }, [photos.length])

  const handleRemovePhoto = useCallback((index: number) => {
    setPhotos(prev => prev.filter((_, i) => i !== index))
  }, [])

  const handleServiceToggle = useCallback((service: string) => {
    const currentServices = fields || []
    const serviceIndex = currentServices.findIndex(item => item.value === service)
    
    if (serviceIndex === -1) {
      append({ id: crypto.randomUUID(), value: service })
    } else {
      remove(serviceIndex)
    }
  }, [fields, append, remove])

  const handleFormSubmit = (data: JobOfferFormData): void => {
    try {
      // Asegurarse de que hay al menos una foto
      if (photos.length === 0) {
        photos.push("/placeholder.svg?height=300&width=400&text=trabajo")
      }

      const formattedData: FormattedJobOffer = {
        ...data,
        photos,
        services: data.services.map(service => ({
          id: service.id || crypto.randomUUID(),
          value: service.value
        })),
        tags: data.services.map(service => service.value)
      }
      console.log('Enviando datos:', formattedData)
      onSubmit(formattedData)
    } catch (error) {
      console.error('Error al enviar el formulario:', error)
      alert('Hubo un error al publicar la oferta. Por favor, verifica todos los campos.')
    }
  }

  return (
    <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-2xl border-2 border-gray-200 animate-scale-in">
      <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            {defaultValues.id ? "Editar Oferta" : "Nueva Oferta de Trabajo"}
          </h2>
          <p className="text-sm text-gray-500 mt-1">Completa los detalles de tu oferta</p>
        </div>
        <button
          type="button"
          onClick={onCancel}
          className="p-2 hover:bg-gray-100 rounded-lg transition-all"
          aria-label="Cerrar formulario"
        >
          <X className="w-5 h-5 text-gray-500" />
        </button>
      </div>

       <form onSubmit={handleSubmit(handleFormSubmit)} className="p-6 space-y-6 overflow-y-auto max-h-[calc(90vh-100px)]">
        {/* Description */}
        <div className="animate-fade-in">
          <label className="block text-sm font-semibold mb-2 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-primary" />
            Descripción del trabajo *
          </label>
          <textarea
            {...register("description")}
            maxLength={100}
            rows={3}
            className="w-full px-4 py-3 border-2 border-border rounded-xl bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none"
            placeholder="Describe brevemente el trabajo que ofreces..."
          />
          {errors.description && (
            <p className="text-xs text-destructive mt-1">{errors.description.message}</p>
          )}
          <p className="text-xs text-muted-foreground mt-2 flex items-center justify-between">
            <span>Máximo 100 caracteres</span>
            <span className={description.length > 90 ? "text-destructive font-semibold" : ""}>
              {description.length}/100
            </span>
          </p>
        </div>

        {/* City */}
        <div className="animate-fade-in" style={{ animationDelay: "50ms" }}>
          <label className="block text-sm font-semibold mb-2">Ciudad *</label>
          <input
            {...register("city")}
            type="text"
            className="w-full px-4 py-3 border-2 border-border rounded-xl bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            placeholder="Ej: La Paz, Cochabamba, Santa Cruz..."
          />
          {errors.city && (
            <p className="text-xs text-destructive mt-1">{errors.city.message}</p>
          )}
        </div>

        {/* Price */}
        <div className="animate-fade-in" style={{ animationDelay: "75ms" }}>
          <label className="block text-sm font-semibold mb-2">Precio (en Bs) *</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">Bs.</span>
            <input
              {...register("price", { valueAsNumber: true })}
              type="number"
              min="0"
              step="0.01"
              className="w-full pl-10 pr-4 py-3 border-2 border-border rounded-xl bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              placeholder="Ej: 150.50"
            />
          </div>
          {errors.price && (
            <p className="text-xs text-destructive mt-1">{errors.price.message}</p>
          )}
        </div>

        {/* Services */}
        <div className="animate-fade-in" style={{ animationDelay: "100ms" }}>
          <label className="block text-sm font-semibold mb-3">Servicios que ofreces *</label>
          <div className="grid grid-cols-2 gap-3">
            {availableServices.map((service, index) => (
              <label
                key={service}
                className={`flex items-center gap-3 p-3 border-2 rounded-xl cursor-pointer transition-all ${
                  selectedServices.includes(service)
                    ? 'border-primary bg-primary/10'
                    : 'border-border hover:bg-muted hover:border-primary/50'
                }`}
                style={{ animationDelay: `${index * 30}ms` }}
              >
                <input
                  type="checkbox"
                  checked={selectedServices.includes(service)}
                  onChange={() => handleServiceToggle(service)}
                  className="w-4 h-4 accent-primary"
                />
                <span className="text-sm">{service}</span>
              </label>
            ))}
          </div>
          {errors.services && (
            <p className="text-xs text-destructive mt-2 flex items-center gap-1">
              Debes seleccionar al menos un servicio
            </p>
          )}
        </div>

        {/* Photos */}
        <div className="animate-fade-in" style={{ animationDelay: "150ms" }}>
          <label className="block text-sm font-semibold mb-3">Fotos del trabajo (máximo 5)</label>
          <div className="space-y-3">
            {photos.length < 5 && (
              <button
                type="button"
                onClick={handleAddPhoto}
                className="w-full flex items-center justify-center gap-3 p-6 border-2 border-dashed border-border rounded-xl hover:bg-muted hover:border-primary transition-all group"
              >
                <Upload className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                <span className="font-medium group-hover:text-primary transition-colors">Agregar foto</span>
              </button>
            )}

            {photos.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {photos.map((photo, index) => (
                  <div key={index} className="relative aspect-video rounded-xl overflow-hidden bg-muted group">
                    <div className="relative w-full h-full">
                      <Image
                        src={photo || "/placeholder.svg"}
                        alt={`Foto ${index + 1}`}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemovePhoto(index)}
                      className="absolute top-2 right-2 p-1.5 bg-destructive text-destructive-foreground rounded-lg opacity-0 group-hover:opacity-100 transition-all hover:scale-110"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
          <p className="text-xs text-muted-foreground mt-2">{photos.length}/5 fotos agregadas</p>
        </div>

        {/* Submit buttons */}
        <div className="flex gap-3 pt-4 animate-fade-in" style={{ animationDelay: "200ms" }}>
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 px-4 py-3 border-2 border-border rounded-xl hover:bg-muted transition-all font-semibold"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="flex-1 px-4 py-3 bg-gradient-to-r from-primary to-blue-600 text-primary-foreground rounded-xl hover:shadow-xl hover:shadow-primary/30 hover:scale-105 transition-all duration-300 font-bold"
          >
            {submitButtonText}
          </button>
        </div>
      </form>
    </div>
  )
}
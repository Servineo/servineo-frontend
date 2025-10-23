export interface JobOffer {
  id: string
  fixerId: string
  fixerName: string
  description: string
  tags: string[]
  whatsapp: string
  photos: string[]
  services: string[]
  price: number
  createdAt: Date
  city: string
  location: {
    lat: number
    lng: number
    address: string
  }
}

export interface Fixer {
  id: string
  name: string
  whatsapp: string
  services: string[]
}

// Mock de ubicación del usuario
export const userLocation = {
  lat: -17.3940,
  lng: -66.1474,
  address: "UMSS, Cochabamba, Bolivia",
}

// Mock de servicios disponibles
export const availableServices = [
  "Plomería",
  "Electricidad",
  "Carpintería",
  "Pintura",
  "Albañilería",
  "Jardinería",
  "Limpieza",
  "Reparación de electrodomésticos",
  "Instalación de pisos",
  "Techado",
]

// Mock de FIXER actual (simulando usuario logueado)
export const currentFixer: Fixer = {
  id: "fixer-001",
  name: "Juan Carlos Pérez",
  whatsapp: "+591 70341618",
  services: ["Plomería", "Electricidad", "Carpintería"],
}

// Mock de ofertas de trabajo iniciales
let _mockJobOffers: JobOffer[] = [
  {
    id: "offer-001",
    fixerId: "fixer-001",
    fixerName: "Ana Martínez",
    description:
      "Especialista en muebles a medida, puertas, ventanas y todo tipo de trabajos en madera. Más de 10 años de experiencia en carpintería fina.",
    tags: ["Carpintería", "Muebles", "Restauración"],
    whatsapp: "+591 73456789",
    photos: ["/img/carpinteria1.jpg", "/img/carpinteria2.jpg", "/img/carpinteria3.jpg"],
    services: ["Carpintería"],
    price: 49,
    createdAt: new Date("2025-01-15"),
    city: "Cochabamba",
    location: {
      lat: -17.3935, // Cerca de la UMSS (500m)
      lng: -66.1468,
      address: "Av. Oquendo #234, Cochabamba",
    },
  },
  {
    id: "offer-005",
    fixerId: "fixer-005",
    fixerName: "Roberto Vargas",
    description: "Electricista certificado con experiencia en instalaciones residenciales y comerciales. Atención 24/7 para emergencias.",
    tags: ["Electricidad", "Instalaciones", "Emergencias"],
    whatsapp: "+591 75432198",
    photos: ["/img/cons1.png", "/img/construccion1.jpg"],
    services: ["Electricidad"],
    price: 40,
    createdAt: new Date("2025-01-16"),
    city: "Cochabamba",
    location: {
      lat: -17.3930, // Muy cerca de la UMSS (300m)
      lng: -66.1470,
      address: "Calle Jordan #567, Cochabamba",
    },
  },
  {
    id: "offer-006",
    fixerId: "fixer-006",
    fixerName: "Patricia Medina",
    description: "Servicio profesional de pintura interior y exterior. Acabados texturizados y decorativos.",
    tags: ["Pintura", "Decoración", "Acabados"],
    whatsapp: "+591 76543219",
    photos: ["/img/construccion2.jpg", "/img/cons1.png"],
    services: ["Pintura"],
    price: 35,
    createdAt: new Date("2025-01-16"),
    city: "Cochabamba",
    location: {
      lat: -17.3950, // A 800m de la UMSS
      lng: -66.1485,
      address: "Av. América E. #789, Cochabamba",
    },
  },
  {
    id: "offer-007",
    fixerId: "fixer-007",
    fixerName: "Jorge Flores",
    description: "Plomero especializado en reparaciones e instalaciones. Detección y reparación de fugas.",
    tags: ["Plomería", "Reparaciones", "Emergencias"],
    whatsapp: "+591 71234598",
    photos: ["/img/construccion3.jpg", "/img/construccion1.jpg"],
    services: ["Plomería"],
    price: 45,
    createdAt: new Date("2025-01-17"),
    city: "Cochabamba",
    location: {
      lat: -17.3920, // A 600m de la UMSS
      lng: -66.1460,
      address: "Calle Lanza #432, Cochabamba",
    },
  },
  {
    id: "offer-008",
    fixerId: "fixer-008",
    fixerName: "Miguel Torres",
    description: "Técnico en climatización y aire acondicionado. Instalación y mantenimiento de equipos.",
    tags: ["Climatización", "Mantenimiento", "Instalaciones"],
    whatsapp: "+591 79876543",
    photos: ["/img/cons1.png", "/img/construccion2.jpg"],
    services: ["Reparación de electrodomésticos"],
    price: 55,
    createdAt: new Date("2025-01-17"),
    city: "Cochabamba",
    location: {
      lat: -17.3970, // A 1.2km de la UMSS
      lng: -66.1495,
      address: "Av. Ayacucho #901, Cochabamba",
    },
  },
  {
    id: "offer-009",
    fixerId: "fixer-009",
    fixerName: "Laura Guzmán",
    description: "Diseñadora de interiores y decoradora. Especialista en optimización de espacios pequeños.",
    tags: ["Diseño", "Decoración", "Remodelación"],
    whatsapp: "+591 72345678",
    photos: ["/img/carpinteria1.jpg", "/img/carpinteria2.jpg"],
    services: ["Diseño"],
    price: 60,
    createdAt: new Date("2025-01-18"),
    city: "Cochabamba",
    location: {
      lat: -17.3890, // A 1.5km de la UMSS
      lng: -66.1440,
      address: "Av. Ballivián #345, Cochabamba",
    },
  },
  {
    id: "offer-010",
    fixerId: "fixer-010",
    fixerName: "Daniel Rojas",
    description: "Jardinero profesional. Diseño y mantenimiento de áreas verdes, sistemas de riego.",
    tags: ["Jardinería", "Paisajismo", "Mantenimiento"],
    whatsapp: "+591 77654321",
    photos: ["/img/construccion1.jpg", "/img/cons1.png"],
    services: ["Jardinería"],
    price: 40,
    createdAt: new Date("2025-01-18"),
    city: "Cochabamba",
    location: {
      lat: -17.3925, // A 400m de la UMSS
      lng: -66.1465,
      address: "Calle Baptista #678, Cochabamba",
    },
  },
  {
    id: "offer-002",
    fixerId: "fixer-002",
    fixerName: "Luis Fernández",
    description:
      "Constructor profesional especializado en obras residenciales, ampliaciones y remodelaciones. Trabajo garantizado y presupuestos sin compromiso.",
    tags: ["Construcción", "Albañilería", "Remodelaciones"],
    whatsapp: "+591 74561234",
    photos: ["/img/construccion1.jpg", "/img/construccion2.jpg", "/img/construccion3.jpg"],
    services: ["Albañilería"],
    price: 65,
    createdAt: new Date("2025-01-14"),
    city: "La Paz",
    location: {
      lat: -16.5,
      lng: -68.15,
      address: "Av. Arce #234, La Paz",
    },
  },
  {
    id: "offer-003",
    fixerId: "fixer-003",
    fixerName: "Carlos Mendoza",
    description:
      "Servicio integral de construcción y remodelación. Especialista en acabados de primera calidad y optimización de espacios.",
    tags: ["Construcción", "Diseño", "Acabados"],
    whatsapp: "+591 76543210",
    photos: ["/img/construccion3.jpg", "/img/construccion1.jpg", "/img/cons1.png"],
    services: ["Albañilería", "Diseño"],
    price: 55,
    createdAt: new Date("2025-01-13"),
    city: "Cochabamba",
    location: {
      lat: -17.3895,
      lng: -66.1568,
      address: "Av. América #456, Cochabamba",
    },
  },
  {
    id: "offer-004",
    fixerId: "fixer-004",
    fixerName: "María González",
    description:
      "Diseño y fabricación de muebles personalizados. Especialidad en cocinas integrales y closets a medida con los mejores materiales.",
    tags: ["Carpintería", "Diseño", "Muebles"],
    whatsapp: "+591 71234567",
    photos: ["/img/carpinteria3.jpg", "/img/carpinteria1.jpg", "/img/carpinteria2.jpg"],
    services: ["Carpintería", "Diseño"],
    price: 45,
    createdAt: new Date("2025-01-12"),
    city: "El Alto",
    location: {
      lat: -16.5207,
      lng: -68.1742,
      address: "Av. 6 de Marzo #789, El Alto",
    },
  },
]

// Funciones mock para manejar ofertas
export const mockJobOfferService = {
  getOffers: () => _mockJobOffers,

  addOffer: (offer: Omit<JobOffer, "id" | "createdAt">) => {
    const newOffer: JobOffer = {
      ...offer,
      id: `offer-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date(),
    }
    _mockJobOffers = [newOffer, ..._mockJobOffers]
    return newOffer
  },

  updateOffer: (offerId: string, offer: Partial<JobOffer>) => {
    _mockJobOffers = _mockJobOffers.map((o) => (o.id === offerId ? { ...o, ...offer } : o))
    return _mockJobOffers.find((o) => o.id === offerId)
  },

  deleteOffer: (offerId: string) => {
    _mockJobOffers = _mockJobOffers.filter((o) => o.id !== offerId)
  },

  getMyOffers: (fixerId: string) => {
    return _mockJobOffers.filter((o) => o.fixerId === fixerId)
  },
}

// Exportar también como mockJobOffers para compatibilidad
export const mockJobOffers = _mockJobOffers

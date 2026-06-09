// Mock data centralizado para features que aún no tienen soporte en la API.
// Cada uso de estos datos tiene un comentario TODO indicando qué se necesita en el backend.

export interface MockProduct {
  id: string
  name: string
  price: number
  oldPrice?: number
  color: string
  tone: string
  size: string
  sizes: string[]
  material: string
  category: string
  tag?: 'Más vendido' | 'Novedad' | 'Oferta' | ''
  description: string
  medidas: string
  cuidados: string
  variants: string[]
  rating: number
  reviewCount: number
  images: string[]
}

export const MOCK_PRODUCTS: MockProduct[] = [
  {
    id: 'lino-natural', name: 'Almohadón Lino Natural', price: 24900, color: 'Natural',
    tone: 'natural', size: '50x50', sizes: ['40x40', '50x50', '60x60'], material: 'Lino 100% natural',
    category: 'Almohadones', tag: 'Más vendido',
    description: 'Almohadón de lino puro de tejido suave y caída elegante. Aporta calidez y textura natural a cualquier ambiente.',
    medidas: '50 x 50 cm · funda + relleno', cuidados: 'Lavado en seco. Funda desenfundable con cierre invisible.',
    variants: ['Natural', 'Beige', 'Arena'], rating: 4.8, reviewCount: 24,
    images: [],
  },
  {
    id: 'tusor-beige', name: 'Almohadón Tusor Beige', price: 22900, color: 'Beige',
    tone: 'beige', size: '50x50', sizes: ['40x40', '50x50'], material: 'Tusor de algodón',
    category: 'Almohadones', tag: 'Novedad',
    description: 'Tusor de algodón con textura artesanal y tono neutro cálido. Versátil y atemporal.',
    medidas: '50 x 50 cm · funda + relleno', cuidados: 'Lavar a máquina con agua fría. No usar lavandina.',
    variants: ['Beige', 'Marfil', 'Arena'], rating: 4.6, reviewCount: 18,
    images: [],
  },
  {
    id: 'verde-oliva', name: 'Almohadón Verde Oliva', price: 24900, color: 'Verde Oliva',
    tone: 'oliva', size: '50x50', sizes: ['40x40', '50x50', '60x60'], material: 'Terciopelo mate',
    category: 'Almohadones', tag: '',
    description: 'Terciopelo mate en un verde oliva profundo que suma carácter y sofisticación.',
    medidas: '50 x 50 cm · funda + relleno', cuidados: 'Lavado en seco recomendado.',
    variants: ['Verde Oliva', 'Salvia'], rating: 4.7, reviewCount: 11,
    images: [],
  },
  {
    id: 'gris-piedra', name: 'Almohadón Gris Piedra', price: 21900, oldPrice: 25900, color: 'Gris',
    tone: 'gris', size: '40x40', sizes: ['40x40', '50x50'], material: 'Lino lavado',
    category: 'Almohadones', tag: 'Oferta',
    description: 'Lino lavado en gris piedra, de aspecto relajado y sofisticado.',
    medidas: '40 x 40 cm · funda + relleno', cuidados: 'Lavar a máquina con agua fría.',
    variants: ['Gris', 'Natural'], rating: 4.5, reviewCount: 8,
    images: [],
  },
  {
    id: 'boucle-marfil', name: 'Almohadón Bouclé Marfil', price: 26900, color: 'Marfil',
    tone: 'marfil', size: '50x50', sizes: ['50x50', '60x60'], material: 'Bouclé texturado',
    category: 'Almohadones', tag: 'Más vendido',
    description: 'Bouclé de textura mullida en marfil cálido. Confort visual y al tacto.',
    medidas: '50 x 50 cm · funda + relleno', cuidados: 'Lavado en seco. Cepillar suavemente.',
    variants: ['Marfil', 'Natural'], rating: 4.9, reviewCount: 32,
    images: [],
  },
  {
    id: 'terracota-tejido', name: 'Almohadón Terracota Tejido', price: 25900, color: 'Terracota',
    tone: 'terracota', size: '45x45', sizes: ['45x45', '50x50'], material: 'Tejido artesanal',
    category: 'Almohadones', tag: 'Novedad',
    description: 'Tejido artesanal en terracota que aporta un acento cálido y orgánico.',
    medidas: '45 x 45 cm · funda + relleno', cuidados: 'Lavar a mano con agua fría.',
    variants: ['Terracota', 'Arena'], rating: 4.7, reviewCount: 15,
    images: [],
  },
  {
    id: 'salvia-bordado', name: 'Almohadón Salvia Bordado', price: 27900, color: 'Salvia',
    tone: 'salvia', size: '50x50', sizes: ['50x50'], material: 'Algodón bordado',
    category: 'Almohadones', tag: '',
    description: 'Bordado tono sobre tono en verde salvia. Detalle delicado hecho a mano.',
    medidas: '50 x 50 cm · funda + relleno', cuidados: 'Lavado en seco recomendado.',
    variants: ['Salvia', 'Marfil'], rating: 4.8, reviewCount: 9,
    images: [],
  },
]

export const MOCK_CATEGORIES = [
  { id: 'almohadones', name: 'Almohadones', count: 48 },
  { id: 'fundas', name: 'Fundas', count: 32 },
  { id: 'mantas', name: 'Mantas & Pies de cama', count: 24 },
  { id: 'mesa', name: 'Textiles de mesa', count: 18 },
  { id: 'deco', name: 'Decoración', count: 21 },
]

export const MOCK_COLLECTIONS = [
  {
    id: 'natural', name: 'Colección Natural', tone: 'natural',
    description: 'Lino, algodón y fibras crudas en tonos marfil y arena. La calidez de lo simple.',
    productIds: ['lino-natural', 'boucle-marfil', 'tusor-beige', 'gris-piedra'],
  },
  {
    id: 'tierra', name: 'Colección Tierra', tone: 'terracota',
    description: 'Terracota, ocre y marrones profundos. Acentos cálidos que dan carácter.',
    productIds: ['terracota-tejido', 'gris-piedra', 'lino-natural', 'verde-oliva'],
  },
  {
    id: 'nordica', name: 'Colección Nórdica', tone: 'gris',
    description: 'Grises suaves, verdes salvia y texturas mullidas. Serenidad escandinava.',
    productIds: ['gris-piedra', 'salvia-bordado', 'verde-oliva', 'boucle-marfil'],
  },
]

export const MOCK_INSPIRATION = [
  { id: 'living-1', category: 'Living', title: 'Living cálido en capas', productIds: ['lino-natural', 'boucle-marfil'] },
  { id: 'dorm-1', category: 'Dormitorio', title: 'Dormitorio sereno', productIds: ['boucle-marfil', 'tusor-beige'] },
  { id: 'living-2', category: 'Living', title: 'Sillón de acento', productIds: ['terracota-tejido'] },
  { id: 'ofi-1', category: 'Oficina', title: 'Rincón de lectura', productIds: ['gris-piedra', 'verde-oliva'] },
  { id: 'ext-1', category: 'Exterior', title: 'Galería al aire libre', productIds: ['salvia-bordado'] },
  { id: 'dorm-2', category: 'Dormitorio', title: 'Cama en neutros', productIds: ['tusor-beige', 'lino-natural'] },
]

export const INSPIRATION_CATEGORIES = ['Living', 'Dormitorio', 'Oficina', 'Exterior'] as const

export const MOCK_SWATCHES: Record<string, string> = {
  Natural: '#D8CFC5', Beige: '#E0D2C0', 'Verde Oliva': '#6E6E4E',
  Arena: '#CDB394', Marfil: '#EDE4D6', Terracota: '#B97B57',
  Gris: '#A59C90', Salvia: '#A7B09A', Marrón: '#5A4B3F',
}

export const MOCK_ORDERS = [
  {
    id: 'RN-2024-001', date: '2026-06-01', status: 'En camino',
    total: 73700, items: [{ name: 'Almohadón Lino Natural', qty: 2 }, { name: 'Almohadón Bouclé Marfil', qty: 1 }],
  },
  {
    id: 'RN-2024-002', date: '2026-05-15', status: 'Entregado',
    total: 24900, items: [{ name: 'Almohadón Verde Oliva', qty: 1 }],
  },
]

export const MOCK_USER = {
  name: 'María González',
  email: 'maria@gmail.com',
  phone: '11 2345 6789',
}

export function getMockProductById(id: string): MockProduct | undefined {
  return MOCK_PRODUCTS.find((p) => p.id === id)
}

export function getRelatedMockProducts(id: string, limit = 4): MockProduct[] {
  return MOCK_PRODUCTS.filter((p) => p.id !== id).slice(0, limit)
}

// Mock data centralizado para features que aún no tienen soporte en la API.
// Cada uso de estos datos tiene un comentario TODO indicando qué se necesita en el backend.

export interface MockProduct {
  id: string
  slug: string
  name: string
  color: string
  colorHex: string
  price: number
  oldPrice?: number | null
  tag?: 'Más vendido' | 'Novedad' | 'Oferta' | ''
  category: string
  stock: boolean
  imagenPrincipal: string
  galeria: string[]
  description: string
  material: string
  medidas: string
  cuidados: string
  configuraciones: string[]
  variants: string[]  // slugs de las otras variantes de color
  rating: number
  reviewCount: number
  // Legacy aliases
  images: string[]
  sizes: string[]
  size: string
}

// 6 variantes de color del Juego de Living Provenzal
export const COLOR_VARIANTS = [
  { key: 'turquesa',  nombre: 'Turquesa',   hex: '#2E8B96', slug: 'juego-living-provenzal-turquesa' },
  { key: 'azul',      nombre: 'Azul Noche',  hex: '#2B3A52', slug: 'juego-living-provenzal-azul' },
  { key: 'rojo',      nombre: 'Rojo',        hex: '#A6403B', slug: 'juego-living-provenzal-rojo' },
  { key: 'natural',   nombre: 'Natural',     hex: '#C7BAA4', slug: 'juego-living-provenzal-natural' },
  { key: 'verde',     nombre: 'Verde',       hex: '#3E8E7E', slug: 'juego-living-provenzal-verde' },
  { key: 'terracota', nombre: 'Terracota',   hex: '#A8553F', slug: 'juego-living-provenzal-terracota' },
] as const

export const CONFIGURACIONES = ['Juego 3 piezas', 'Sofá 3 cuerpos', 'Sillón'] as const

const ALL_SLUGS = COLOR_VARIANTS.map((c) => c.slug)

function otherSlugs(selfSlug: string) {
  return ALL_SLUGS.filter((s) => s !== selfSlug)
}

export const MOCK_PRODUCTS: MockProduct[] = [
  {
    id: 'living-turquesa',
    slug: 'juego-living-provenzal-turquesa',
    name: 'Juego de Living Provenzal',
    color: 'Turquesa', colorHex: '#2E8B96',
    price: 942000, oldPrice: null, tag: 'Más vendido',
    category: 'Juegos de Living', stock: true,
    imagenPrincipal: '/productos/turquesa-amb.jpg',
    galeria: ['/productos/turquesa-amb.jpg', '/productos/turquesa-close.jpg', '/productos/turquesa-amb2.jpg'],
    description: 'Juego de living de estructura de madera maciza con almohadones tapizados de gran confort. Líneas atemporales que aportan calidez y carácter a tu espacio.',
    material: 'Madera maciza de paraíso · almohadones de chenille',
    medidas: 'Sofá 3 cuerpos 1,90 m + 2 sillones + mesa ratona',
    cuidados: 'Fundas desenfundables, lavado en seco. Madera: paño seco y lustre cada 6 meses.',
    configuraciones: [...CONFIGURACIONES],
    variants: otherSlugs('juego-living-provenzal-turquesa'),
    rating: 4.9, reviewCount: 38,
    get images() { return this.galeria },
    get sizes() { return this.configuraciones },
    get size() { return this.configuraciones[0] },
  },
  {
    id: 'living-verde',
    slug: 'juego-living-provenzal-verde',
    name: 'Juego de Living Provenzal',
    color: 'Verde', colorHex: '#3E8E7E',
    price: 928000, oldPrice: null, tag: '',
    category: 'Juegos de Living', stock: true,
    imagenPrincipal: '/productos/verde-amb.jpg',
    galeria: ['/productos/verde-amb.jpg', '/productos/verde-close.jpg', '/productos/verde-amb2.jpg'],
    description: 'Juego de living de estructura de madera maciza con almohadones tapizados de gran confort. Líneas atemporales que aportan calidez y carácter a tu espacio.',
    material: 'Madera maciza de paraíso · almohadones de chenille',
    medidas: 'Sofá 3 cuerpos 1,90 m + 2 sillones + mesa ratona',
    cuidados: 'Fundas desenfundables, lavado en seco. Madera: paño seco y lustre cada 6 meses.',
    configuraciones: [...CONFIGURACIONES],
    variants: otherSlugs('juego-living-provenzal-verde'),
    rating: 4.7, reviewCount: 21,
    get images() { return this.galeria },
    get sizes() { return this.configuraciones },
    get size() { return this.configuraciones[0] },
  },
  {
    id: 'living-azul',
    slug: 'juego-living-provenzal-azul',
    name: 'Juego de Living Provenzal',
    color: 'Azul Noche', colorHex: '#2B3A52',
    price: 958000, oldPrice: null, tag: 'Novedad',
    category: 'Juegos de Living', stock: true,
    imagenPrincipal: '/productos/azul-amb.jpg',
    galeria: ['/productos/azul-amb.jpg', '/productos/azul-close.jpg', '/productos/azul-amb2.jpg'],
    description: 'Juego de living de estructura de madera maciza con almohadones tapizados de gran confort. Líneas atemporales que aportan calidez y carácter a tu espacio.',
    material: 'Madera maciza de paraíso · almohadones de chenille',
    medidas: 'Sofá 3 cuerpos 1,90 m + 2 sillones + mesa ratona',
    cuidados: 'Fundas desenfundables, lavado en seco. Madera: paño seco y lustre cada 6 meses.',
    configuraciones: [...CONFIGURACIONES],
    variants: otherSlugs('juego-living-provenzal-azul'),
    rating: 4.8, reviewCount: 14,
    get images() { return this.galeria },
    get sizes() { return this.configuraciones },
    get size() { return this.configuraciones[0] },
  },
  {
    id: 'living-natural',
    slug: 'juego-living-provenzal-natural',
    name: 'Juego de Living Provenzal',
    color: 'Natural', colorHex: '#C7BAA4',
    price: 912000, oldPrice: null, tag: '',
    category: 'Juegos de Living', stock: true,
    imagenPrincipal: '/productos/natural-amb.jpg',
    galeria: ['/productos/natural-amb.jpg', '/productos/natural-close.jpg', '/productos/natural-amb2.jpg'],
    description: 'Juego de living de estructura de madera maciza con almohadones tapizados de gran confort. Líneas atemporales que aportan calidez y carácter a tu espacio.',
    material: 'Madera maciza de paraíso · almohadones de chenille',
    medidas: 'Sofá 3 cuerpos 1,90 m + 2 sillones + mesa ratona',
    cuidados: 'Fundas desenfundables, lavado en seco. Madera: paño seco y lustre cada 6 meses.',
    configuraciones: [...CONFIGURACIONES],
    variants: otherSlugs('juego-living-provenzal-natural'),
    rating: 4.6, reviewCount: 18,
    get images() { return this.galeria },
    get sizes() { return this.configuraciones },
    get size() { return this.configuraciones[0] },
  },
  {
    id: 'living-rojo',
    slug: 'juego-living-provenzal-rojo',
    name: 'Juego de Living Provenzal',
    color: 'Rojo', colorHex: '#A6403B',
    price: 936000, oldPrice: null, tag: 'Novedad',
    category: 'Juegos de Living', stock: true,
    imagenPrincipal: '/productos/rojo-amb.jpg',
    galeria: ['/productos/rojo-amb.jpg', '/productos/rojo-close.jpg', '/productos/rojo-amb2.jpg'],
    description: 'Juego de living de estructura de madera maciza con almohadones tapizados de gran confort. Líneas atemporales que aportan calidez y carácter a tu espacio.',
    material: 'Madera maciza de paraíso · almohadones de chenille',
    medidas: 'Sofá 3 cuerpos 1,90 m + 2 sillones + mesa ratona',
    cuidados: 'Fundas desenfundables, lavado en seco. Madera: paño seco y lustre cada 6 meses.',
    configuraciones: [...CONFIGURACIONES],
    variants: otherSlugs('juego-living-provenzal-rojo'),
    rating: 4.7, reviewCount: 11,
    get images() { return this.galeria },
    get sizes() { return this.configuraciones },
    get size() { return this.configuraciones[0] },
  },
  {
    id: 'living-terracota',
    slug: 'juego-living-provenzal-terracota',
    name: 'Juego de Living Provenzal',
    color: 'Terracota', colorHex: '#A8553F',
    price: 889000, oldPrice: 989000, tag: 'Oferta',
    category: 'Juegos de Living', stock: true,
    imagenPrincipal: '/productos/terracota-amb.jpg',
    galeria: ['/productos/terracota-amb.jpg', '/productos/terracota-close.jpg', '/productos/terracota-amb2.jpg'],
    description: 'Juego de living de estructura de madera maciza con almohadones tapizados de gran confort. Líneas atemporales que aportan calidez y carácter a tu espacio.',
    material: 'Madera maciza de paraíso · almohadones de chenille',
    medidas: 'Sofá 3 cuerpos 1,90 m + 2 sillones + mesa ratona',
    cuidados: 'Fundas desenfundables, lavado en seco. Madera: paño seco y lustre cada 6 meses.',
    configuraciones: [...CONFIGURACIONES],
    variants: otherSlugs('juego-living-provenzal-terracota'),
    rating: 4.8, reviewCount: 26,
    get images() { return this.galeria },
    get sizes() { return this.configuraciones },
    get size() { return this.configuraciones[0] },
  },
]

export const MOCK_CATEGORIES = [
  { id: 'juegos',      name: 'Juegos de Living',   count: 6 },
  { id: 'sillones',    name: 'Sillones',            count: 6 },
  { id: 'sofas',       name: 'Sofás 3 cuerpos',     count: 6 },
  { id: 'mesas',       name: 'Mesas ratonas',       count: 4 },
  { id: 'almohadones', name: 'Almohadones',         count: 18 },
  { id: 'combos',      name: 'Combos',              count: 5 },
]

export const MOCK_COLLECTIONS = [
  {
    id: 'natural', name: 'Colección Natural', tone: 'natural',
    description: 'Tonos crudos y cálidos —natural y verde— para ambientes serenos y luminosos.',
    productIds: ['living-natural', 'living-verde', 'living-turquesa'],
    imagenHero: '/productos/natural-amb.jpg',
  },
  {
    id: 'tierra', name: 'Colección Tierra', tone: 'terracota',
    description: 'Terracota y rojo profundo. Acentos cálidos que dan carácter y personalidad.',
    productIds: ['living-terracota', 'living-rojo', 'living-natural'],
    imagenHero: '/productos/terracota-amb.jpg',
  },
  {
    id: 'nordica', name: 'Colección Nórdica', tone: 'azul',
    description: 'Azul noche y verdes serenos. La frescura escandinava llevada a tu living.',
    productIds: ['living-azul', 'living-verde', 'living-turquesa'],
    imagenHero: '/productos/azul-amb.jpg',
  },
]

export const MOCK_INSPIRATION = [
  { id: 'living-1', category: 'Living',     imagen: '/productos/turquesa-amb.jpg',  title: 'Living en turquesa', productIds: ['living-turquesa'] },
  { id: 'living-2', category: 'Living',     imagen: '/productos/rojo-amb.jpg',      title: 'Acentos en rojo',    productIds: ['living-rojo'] },
  { id: 'dorm-1',   category: 'Dormitorio', imagen: '/productos/natural-amb.jpg',   title: 'Estar en neutros',   productIds: ['living-natural'] },
  { id: 'ofi-1',    category: 'Oficina',    imagen: '/productos/azul-amb.jpg',      title: 'Rincón sobrio',      productIds: ['living-azul'] },
  { id: 'ext-1',    category: 'Exterior',   imagen: '/productos/verde-amb.jpg',     title: 'Galería natural',    productIds: ['living-verde'] },
  { id: 'living-3', category: 'Living',     imagen: '/productos/terracota-amb.jpg', title: 'Calidez tierra',     productIds: ['living-terracota'] },
]

export const INSPIRATION_CATEGORIES = ['Living', 'Dormitorio', 'Oficina', 'Exterior'] as const

export const MOCK_SWATCHES: Record<string, string> = {
  Turquesa:   '#2E8B96',
  'Azul Noche': '#2B3A52',
  Rojo:       '#A6403B',
  Natural:    '#C7BAA4',
  Verde:      '#3E8E7E',
  Terracota:  '#A8553F',
}

export const MOCK_ORDERS = [
  {
    id: 'RN-2024-001', date: '2026-06-01', status: 'En camino',
    total: 942000, items: [{ name: 'Juego de Living Provenzal Turquesa', qty: 1 }],
  },
  {
    id: 'RN-2024-002', date: '2026-05-15', status: 'Entregado',
    total: 889000, items: [{ name: 'Juego de Living Provenzal Terracota', qty: 1 }],
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

export interface ThemeTokens {
  background: string
  surface: string
  txPrimary: string
  txSecondary: string
  txFaint: string
  border: string
  borderSoft: string
  brand: string
  brandHover: string
  success: string
  error: string
  footerBg: string
  hoverSoft: string
  accentSecondary: string // alias legacy: --salvia
  overlayDark: string     // triplete "r,g,b" para rgba(var(--overlay-dark), alpha)
  fontHead: string
  fontBody: string
  radius: string
}

export const THEMES: Record<string, ThemeTokens> = {
  renuevo: {
    background: '#FAF7F3',
    surface: '#F6F2ED',
    txPrimary: '#3F352C',
    txSecondary: '#8C8073',
    txFaint: '#B3A799',
    border: '#E7DFD5',
    borderSoft: '#EFE9E1',
    brand: '#8A7A68',
    brandHover: '#766857',
    success: '#7F9A70',
    error: '#B96363',
    footerBg: '#5A4B3F',
    hoverSoft: '#EEE7DF',
    accentSecondary: '#A7B09A',
    overlayDark: '63,53,44',
    fontHead: "'Cormorant Garamond', Georgia, serif",
    fontBody: "'Poppins', system-ui, sans-serif",
    radius: '14px',
  },
  senal: {
    background: '#F4F6F8',
    surface: '#FFFFFF',
    txPrimary: '#1B2430',
    txSecondary: '#5A6675',
    txFaint: '#98A2B2',
    border: '#D9E0E8',
    borderSoft: '#E8EDF2',
    brand: '#2563EB',
    brandHover: '#1D4FC7',
    success: '#16A34A',
    error: '#DC2626',
    footerBg: '#101826',
    hoverSoft: '#EBF0F5',
    accentSecondary: '#7FA8C9',
    overlayDark: '16,24,38',
    fontHead: "'Space Grotesk', system-ui, sans-serif",
    fontBody: "'Inter', system-ui, sans-serif",
    radius: '12px',
  },
}

export const DEFAULT_THEME_ID = 'renuevo'

import { describe, it, expect } from 'vitest'
import { THEMES, DEFAULT_THEME_ID } from './themes'

const REQUIRED_KEYS = [
  'background', 'surface', 'txPrimary', 'txSecondary', 'txFaint', 'border', 'borderSoft',
  'brand', 'brandHover', 'success', 'error', 'footerBg', 'hoverSoft', 'accentSecondary',
  'overlayDark', 'fontHead', 'fontBody', 'radius',
] as const

describe('THEMES', () => {
  it('define renuevo y senal', () => {
    expect(Object.keys(THEMES).sort()).toEqual(['renuevo', 'senal'])
  })

  it('cada tema tiene todos los tokens requeridos, sin strings vacíos', () => {
    for (const [themeId, tokens] of Object.entries(THEMES)) {
      for (const key of REQUIRED_KEYS) {
        expect(tokens[key], `${themeId}.${key}`).toBeTruthy()
      }
    }
  })

  it('DEFAULT_THEME_ID apunta a un tema que existe', () => {
    expect(THEMES[DEFAULT_THEME_ID]).toBeDefined()
    expect(DEFAULT_THEME_ID).toBe('renuevo')
  })

  it('overlayDark es un triplete "r,g,b" sin # ni espacios', () => {
    for (const [themeId, tokens] of Object.entries(THEMES)) {
      expect(tokens.overlayDark, themeId).toMatch(/^\d{1,3},\d{1,3},\d{1,3}$/)
    }
  })
})

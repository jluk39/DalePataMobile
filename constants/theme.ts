/**
 * DalePata Theme - Colores y estilos de la aplicación
 * Sincronizado con la versión web
 */

import { Platform } from 'react-native';

// Colores base de DalePata (sin transparencia)
export const colors = {
  // PRIMARY (Verde DalePata)
  primary: '#89C7A8',              // Botones, títulos, links
  primaryForeground: '#FFFFFF',    // Texto blanco sobre verde
  
  // HEADERS (Títulos de pantallas)
  headerTitle: '#89C7A8',          // oklch(0.75 0.08 160) - Verde suave para títulos
  
  // BACKGROUND
  background: '#F5F5F5',           // Fondo de pantalla (gris claro)
  
  // CARD
  card: '#FFFFFF',                 // Fondo de tarjetas (blanco)
  cardForeground: '#1F2937',       // Texto en tarjetas (negro suave)
  
  // BORDERS
  border: '#E5E7EB',               // Bordes generales (gris claro)
  input: '#E5E7EB',                // Bordes de inputs
  
  // TEXT
  foreground: '#1F2937',           // Texto principal (negro suave)
  mutedForeground: '#6B7280',      // Texto secundario (gris)
  
  // DESTRUCTIVE (Errores)
  destructive: '#EF4444',          // Rojo para mensajes de error
  destructiveForeground: '#FFFFFF',// Texto blanco sobre rojo
  
  // RING (Focus state)
  ring: '#89C7A8',                 // Color del anillo de foco
}

// Theme completo con transparencias
export const theme = {
  colors: {
    // PRIMARY
    primary: '#89C7A8',
    primaryForeground: '#FFFFFF',
    primaryHover: 'rgba(137, 199, 168, 0.9)',     // ⚠️ CON TRANSPARENCIA 90%
    
    // HEADERS (Títulos)
    headerTitle: '#89C7A8',                       // oklch(0.75 0.08 160) - Verde suave
    
    // BACKGROUND
    background: '#F5F5F5',
    
    // CARD
    card: '#FFFFFF',
    cardForeground: '#1F2937',
    
    // BORDERS & INPUTS
    border: '#E5E7EB',
    input: '#E5E7EB',
    inputBackground: 'transparent',               // ⚠️ TRANSPARENTE
    
    // FOCUS STATES
    ring: '#89C7A8',
    ringFocus: 'rgba(137, 199, 168, 0.5)',       // ⚠️ CON TRANSPARENCIA 50%
    ringError: 'rgba(239, 68, 68, 0.2)',         // ⚠️ CON TRANSPARENCIA 20%
    
    // TEXT
    foreground: '#1F2937',
    mutedForeground: '#6B7280',
    
    // DESTRUCTIVE
    destructive: '#EF4444',
    destructiveForeground: '#FFFFFF',
    
    // STATES
    disabledOpacity: 0.5,                         // ⚠️ OPACIDAD 50%
  },
  
  spacing: {
    xs: 4,    // 0.5 en Tailwind
    sm: 8,    // 2
    md: 12,   // 3
    lg: 16,   // 4
    xl: 24,   // 6
  },
  
  borderRadius: {
    md: 8,    // rounded-md
    lg: 12,   // rounded-xl
  },
  
  fontSize: {
    sm: 14,   // text-sm
    base: 16, // default
    xl: 20,   // text-xl
    '2xl': 24,// text-2xl
  },
  
  fontWeight: {
    normal: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
  },
  
  shadows: {
    card: {
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 5,
    },
  },
}

// Legacy Colors para compatibilidad (deprecado)
const tintColorLight = '#89C7A8';
const tintColorDark = '#fff';

export const Colors = {
  light: {
    text: '#1F2937',
    background: '#F5F5F5',
    tint: tintColorLight,
    icon: '#6B7280',
    tabIconDefault: '#6B7280',
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: '#ECEDEE',
    background: '#151718',
    tint: tintColorDark,
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: tintColorDark,
  },
};

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});

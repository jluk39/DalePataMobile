# 🎨 DalePata Theme - Guía de Colores

## Colores implementados exactamente como en web

### 📋 Tabla de Colores con Transparencias

| Estado | Color Base | Transparencia | Resultado RGBA |
|--------|-----------|---------------|----------------|
| **Button Hover** | `#4CAF50` | 90% | `rgba(76, 175, 80, 0.9)` |
| **Ring Focus** | `#4CAF50` | 50% | `rgba(76, 175, 80, 0.5)` |
| **Ring Error** | `#EF4444` | 20% | `rgba(239, 68, 68, 0.2)` |
| **Disabled** | Cualquiera | 50% | `opacity: 0.5` |
| **Input Background** | N/A | 100% | `transparent` |

---

## 🎯 Uso del Theme

### Importar el theme:
```typescript
import { theme } from '@/constants/theme'
```

### Colores disponibles:

#### PRIMARY (Verde DalePata)
- `theme.colors.primary` → `#4CAF50`
- `theme.colors.primaryForeground` → `#FFFFFF`
- `theme.colors.primaryHover` → `rgba(76, 175, 80, 0.9)` ⚠️ CON TRANSPARENCIA

#### BACKGROUND
- `theme.colors.background` → `#F5F5F5` (gris claro)

#### CARD
- `theme.colors.card` → `#FFFFFF` (blanco)
- `theme.colors.cardForeground` → `#1F2937` (texto en tarjetas)

#### BORDERS & INPUTS
- `theme.colors.border` → `#E5E7EB`
- `theme.colors.input` → `#E5E7EB`
- `theme.colors.inputBackground` → `transparent` ⚠️ TRANSPARENTE

#### FOCUS STATES
- `theme.colors.ring` → `#4CAF50`
- `theme.colors.ringFocus` → `rgba(76, 175, 80, 0.5)` ⚠️ 50% OPACIDAD
- `theme.colors.ringError` → `rgba(239, 68, 68, 0.2)` ⚠️ 20% OPACIDAD

#### TEXT
- `theme.colors.foreground` → `#1F2937` (texto principal)
- `theme.colors.mutedForeground` → `#6B7280` (texto secundario)

#### DESTRUCTIVE (Errores)
- `theme.colors.destructive` → `#EF4444`
- `theme.colors.destructiveForeground` → `#FFFFFF`

#### STATES
- `theme.colors.disabledOpacity` → `0.5` ⚠️ 50% OPACIDAD

---

## 📐 Spacing

```typescript
theme.spacing.xs   // 4  (Tailwind: 0.5)
theme.spacing.sm   // 8  (Tailwind: 2)
theme.spacing.md   // 12 (Tailwind: 3)
theme.spacing.lg   // 16 (Tailwind: 4)
theme.spacing.xl   // 24 (Tailwind: 6)
```

---

## 🔄 Border Radius

```typescript
theme.borderRadius.md  // 8  (rounded-md)
theme.borderRadius.lg  // 12 (rounded-xl)
```

---

## 📝 Font Sizes

```typescript
theme.fontSize.sm     // 14 (text-sm)
theme.fontSize.base   // 16 (default)
theme.fontSize.xl     // 20 (text-xl)
theme.fontSize['2xl'] // 24 (text-2xl)
```

---

## 💪 Font Weights

```typescript
theme.fontWeight.normal   // '400'
theme.fontWeight.medium   // '500'
theme.fontWeight.semibold // '600'
theme.fontWeight.bold     // '700'
```

---

## 🌑 Shadows

```typescript
// Para tarjetas:
...theme.shadows.card

// Equivale a:
{
  shadowColor: '#000000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.1,
  shadowRadius: 8,
  elevation: 5, // Para Android
}
```

---

## 💡 Ejemplos de Uso

### Botón Primario:
```typescript
const styles = StyleSheet.create({
  button: {
    backgroundColor: theme.colors.primary,
    padding: theme.spacing.lg,
    borderRadius: theme.borderRadius.md,
  },
  buttonText: {
    color: theme.colors.primaryForeground,
    fontSize: theme.fontSize.base,
    fontWeight: theme.fontWeight.semibold,
  },
})
```

### Input con Error:
```typescript
const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderColor: theme.colors.input,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    backgroundColor: theme.colors.inputBackground, // transparent
  },
  inputError: {
    borderColor: theme.colors.destructive,
    borderWidth: 2,
    shadowColor: theme.colors.destructive,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.2, // Usa el ringError para más sutil
    shadowRadius: 4,
  },
})
```

### Card con Shadow:
```typescript
const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.xl,
    ...theme.shadows.card, // Spread del shadow
  },
})
```

### Estado Disabled:
```typescript
const styles = StyleSheet.create({
  buttonDisabled: {
    opacity: theme.colors.disabledOpacity, // 0.5
  },
})
```

---

## ✅ Checklist de Implementación

- ✅ Colores base sin transparencia
- ✅ Colores con transparencias (hover, focus, error)
- ✅ Input backgrounds transparentes
- ✅ Estados disabled con opacidad 50%
- ✅ Spacing system (Tailwind equivalente)
- ✅ Border radius
- ✅ Font sizes
- ✅ Font weights
- ✅ Card shadows

---

## 🔗 Sincronización con Web

Todos los colores y valores están **100% sincronizados** con la versión web de DalePata. 

Los valores RGBA con transparencias son especialmente importantes para mantener la consistencia visual entre plataformas.

---

## 📱 Archivos Actualizados

1. ✅ `constants/theme.ts` - Theme completo
2. ✅ `app/index.tsx` - Welcome screen
3. ✅ `app/auth/login.tsx` - Login screen
4. ✅ `app/auth/register.tsx` - Register screen

Todos usando el theme system centralizado.

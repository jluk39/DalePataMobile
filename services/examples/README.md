# 💡 Ejemplos de Uso - DalePata Mobile API

Esta carpeta contiene ejemplos completos de componentes React Native usando los servicios de API.

## 📁 Ejemplos Disponibles

### 1. **LoginExample.tsx** - Autenticación
```typescript
import LoginExample from '@/services/examples/LoginExample'
```

**Qué incluye**:
- ✅ Formulario de login
- ✅ Validación de campos
- ✅ Manejo de errores
- ✅ Loading states
- ✅ Navegación después del login
- ✅ Link a registro

**Usar como base para**:
- `app/auth/login.tsx`
- Pantalla de inicio de sesión

---

### 2. **PetsListExample.tsx** - Listado de Mascotas
```typescript
import PetsListExample from '@/services/examples/PetsListExample'
```

**Qué incluye**:
- ✅ Lista de mascotas con FlatList
- ✅ Pull to refresh
- ✅ Loading indicator
- ✅ Empty state
- ✅ Navegación a detalles
- ✅ Badges de urgencia
- ✅ TypeScript types

**Usar como base para**:
- `app/(tabs)/index.tsx`
- Pantalla principal de mascotas
- Lista de búsqueda

---

### 3. **CreatePetExample.tsx** - Crear Mascota
```typescript
import CreatePetExample from '@/services/examples/CreatePetExample'
```

**Qué incluye**:
- ✅ Formulario completo
- ✅ Selección de imagen con expo-image-picker
- ✅ Preview de imagen
- ✅ Validación de campos
- ✅ Upload con FormData
- ✅ Campos opcionales y obligatorios
- ✅ ScrollView para formularios largos

**Usar como base para**:
- `app/pets/create.tsx`
- Formulario de registro de mascota
- Panel de administración

---

## 🚀 Cómo Usar los Ejemplos

### Opción 1: Copiar y Pegar (Recomendado para empezar)

```bash
# Copia el archivo directamente a tu carpeta de screens
cp services/examples/LoginExample.tsx app/auth/login.tsx
```

Luego personaliza según tus necesidades.

### Opción 2: Importar y Extender

```typescript
// En tu componente
import { useState, useEffect } from 'react'
import { ApiService, Pet } from '@/services'

// Copia la lógica del ejemplo que necesites
// Por ejemplo, de PetsListExample.tsx
export default function MyPetsScreen() {
  const [pets, setPets] = useState<Pet[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadPets()
  }, [])

  async function loadPets() {
    try {
      setLoading(true)
      const data = await ApiService.fetchPets()
      setPets(data)
    } catch (error: any) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  // ... tu UI personalizada
}
```

### Opción 3: Usar como Referencia

Abre los ejemplos en VS Code y úsalos como referencia mientras construyes tus propios componentes.

---

## 📚 Estructura de los Ejemplos

Todos los ejemplos siguen esta estructura:

```typescript
// 1. Imports
import React, { useState, useEffect } from 'react'
import { ApiService } from '@/services'

// 2. Component
export default function ExampleComponent() {
  // 3. State
  const [data, setData] = useState()
  const [loading, setLoading] = useState(false)

  // 4. API Calls
  async function loadData() {
    try {
      setLoading(true)
      const result = await ApiService.someMethod()
      setData(result)
    } catch (error: any) {
      // Handle error
    } finally {
      setLoading(false)
    }
  }

  // 5. Render
  return (
    // UI Components
  )
}

// 6. Styles
const styles = StyleSheet.create({
  // Styles
})
```

---

## 🎨 Personalizar los Ejemplos

### Cambiar Estilos

Los ejemplos usan estilos básicos. Puedes personalizarlos:

```typescript
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5', // ← Cambia aquí
  },
  button: {
    backgroundColor: '#007AFF', // ← Tu color de marca
    // ...
  },
})
```

### Agregar Validaciones

```typescript
const handleSubmit = async () => {
  // Validaciones personalizadas
  if (!email.includes('@')) {
    Alert.alert('Error', 'Email inválido')
    return
  }

  if (password.length < 8) {
    Alert.alert('Error', 'La contraseña debe tener al menos 8 caracteres')
    return
  }

  // Continúa con el submit...
}
```

### Agregar Funcionalidades

```typescript
// Agregar búsqueda
const [searchQuery, setSearchQuery] = useState('')
const filteredPets = pets.filter(pet => 
  pet.name.toLowerCase().includes(searchQuery.toLowerCase())
)

// Agregar favoritos
const [favorites, setFavorites] = useState<number[]>([])
const toggleFavorite = (petId: number) => {
  setFavorites(prev => 
    prev.includes(petId) 
      ? prev.filter(id => id !== petId)
      : [...prev, petId]
  )
}
```

---

## 🔧 Dependencias Necesarias

Todos los ejemplos requieren:

```json
{
  "@react-native-async-storage/async-storage": "^2.x.x",
  "expo-image-picker": "^16.x.x",  // Solo CreatePetExample
  "expo-router": "^6.x.x"
}
```

Ya instaladas en tu proyecto ✅

---

## 💡 Tips para Desarrollo

### 1. Usar TypeScript Types

```typescript
import { Pet, AdoptionRequest } from '@/services'

// Obtendrás autocompletado en tu IDE
const pet: Pet = await ApiService.fetchPetById(123)
//    ↑ TypeScript te ayuda aquí
```

### 2. Manejar Loading States

```typescript
// Siempre muestra feedback al usuario
if (loading) {
  return <ActivityIndicator size="large" />
}

// O usa un skeleton loader
if (loading) {
  return <SkeletonLoader />
}
```

### 3. Manejar Errores

```typescript
try {
  await ApiService.someMethod()
} catch (error: any) {
  // Mostrar al usuario
  Alert.alert('Error', error.message)
  
  // O usar toast notification
  Toast.show({
    type: 'error',
    text1: 'Error',
    text2: error.message
  })
}
```

### 4. Usar Pull to Refresh

```typescript
<FlatList
  data={pets}
  onRefresh={loadPets}
  refreshing={refreshing}
  // ...
/>
```

---

## 🎯 Casos de Uso Comunes

### Login + Redirect
→ Ver **LoginExample.tsx**

### Lista con Búsqueda
→ Usar **PetsListExample.tsx** + agregar TextInput de búsqueda

### Formulario con Imagen
→ Ver **CreatePetExample.tsx**

### Detalles de Mascota
→ Usar `fetchPetById()` + mostrar en ScrollView

### Perfil de Usuario
→ Usar `getUserProfile()` + formulario de edición

---

## 📱 Testing en Dispositivo

```bash
# Iniciar servidor
npm start

# En tu dispositivo con Expo Go
# Escanea el QR code

# O en emulador
npm run android  # Android
npm run ios      # iOS
```

---

## 🐛 Solución de Problemas en Ejemplos

### Ejemplo no renderiza

**Verifica**:
1. URL de API configurada en `api-config.ts`
2. Backend está corriendo
3. No hay errores en la consola

### Imágenes no cargan

```typescript
// En CreatePetExample, verifica permisos
const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync()
if (status !== 'granted') {
  Alert.alert('Permisos requeridos', 'Necesitamos acceso a tu galería')
}
```

### Navigation error

```typescript
// Asegúrate de tener la ruta en app/
// Por ejemplo: app/auth/login.tsx
router.replace('/auth/login')
```

---

## 🎓 Orden Recomendado de Aprendizaje

1. **LoginExample.tsx** - Aprende autenticación básica
2. **PetsListExample.tsx** - Aprende a listar datos
3. **CreatePetExample.tsx** - Aprende formularios y uploads

---

## 📖 Documentación Relacionada

- [API Service Documentation](../README.md)
- [Setup Guide](../SETUP.md)
- [Quick Start](../QUICKSTART.md)

---

**¿Creaste algo cool con estos ejemplos?** Compártelo con el equipo 🐾

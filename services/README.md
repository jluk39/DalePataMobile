# 🐾 DalePata Mobile - API Services

Servicios de API adaptados para React Native (Expo) desde la aplicación web.

## 📁 Estructura de Archivos

```
services/
├── api-config.ts      # Configuración de la API y endpoints
├── api-service.ts     # Servicio principal con todos los métodos
├── storage.ts         # Servicio de almacenamiento con AsyncStorage
├── index.ts           # Exportaciones centralizadas
└── README.md          # Esta documentación
```

## 🚀 Configuración Inicial

### 1. Actualizar la URL de la API

Edita `services/api-config.ts` y cambia la URL base:

```typescript
export const API_CONFIG = {
  BASE_URL: 'https://tu-api-backend.com/api', // 🔴 CAMBIAR AQUÍ
  TIMEOUT: 30000,
  DEBUG: __DEV__,
}
```

### 2. Importar el servicio

```typescript
import { ApiService } from '@/services'
// o
import { ApiService } from '@/services/api-service'
```

## 📱 Diferencias con la versión Web

| Característica | Web | Mobile (React Native) |
|---------------|-----|----------------------|
| Almacenamiento | `localStorage` | `AsyncStorage` |
| Métodos | Síncronos | **Asíncronos (async/await)** |
| Navegación | `window.location.href` | `router.replace()` (Expo Router) |
| Tipos | JavaScript | **TypeScript** |

## 🔐 Autenticación

### Login

```typescript
try {
  const result = await ApiService.login('user@example.com', 'password123')
  console.log('Usuario:', result.user)
  console.log('Token:', result.token)
  
  // El token y usuario se guardan automáticamente
} catch (error) {
  console.error('Error:', error.message)
}
```

### Login con tipo de usuario

```typescript
const result = await ApiService.login(
  'shelter@example.com', 
  'password123',
  'refugio' // Opciones: 'usuario', 'refugio', 'veterinaria', 'medico'
)
```

### Registro (Usuario normal)

```typescript
const userData = {
  nombre: 'Juan',
  apellido: 'Pérez',
  email: 'juan@example.com',
  password: 'password123',
  telefono: '555-1234', // Opcional
}

try {
  const result = await ApiService.register(userData)
  console.log('Registro exitoso:', result)
} catch (error) {
  console.error('Error:', error.message)
}
```

### Registro por tipo de usuario

```typescript
// Refugio
const shelterData = {
  nombre: 'Refugio Amigos Peludos',
  email: 'contacto@refugio.com',
  password: 'password123',
  telefono: '555-0000',
  direccion: 'Calle 123',
  ciudad: 'Ciudad de México',
}

const result = await ApiService.registerByType(shelterData, 'refugio')

// Veterinaria
const vetData = {
  nombre: 'Veterinaria San José',
  email: 'info@veterinaria.com',
  password: 'password123',
  // ... otros campos
}

const result = await ApiService.registerByType(vetData, 'veterinaria')
```

### Obtener perfil del usuario

```typescript
const profile = await ApiService.getUserProfile()
console.log('Perfil:', profile)
```

### Verificar disponibilidad de email

```typescript
const result = await ApiService.checkEmailAvailability('test@example.com')
console.log('Email disponible:', result.available)
```

### Renovar token

```typescript
try {
  const result = await ApiService.refreshToken()
  console.log('Token renovado')
} catch (error) {
  // Token inválido, redirigir a login
  router.replace('/auth/login')
}
```

### Cerrar sesión

```typescript
await ApiService.logout()
router.replace('/auth/login')
```

## 🐕 Gestión de Mascotas

### Listar todas las mascotas

```typescript
const pets = await ApiService.fetchPets()
console.log(`${pets.length} mascotas encontradas`)

pets.forEach(pet => {
  console.log(`${pet.name} - ${pet.species} - ${pet.location}`)
})
```

### Obtener mis mascotas (requiere autenticación)

```typescript
try {
  const myPets = await ApiService.fetchMyPets()
  console.log('Mis mascotas:', myPets)
} catch (error) {
  if (error.message.includes('autenticado')) {
    router.replace('/auth/login')
  }
}
```

### Obtener detalles de una mascota

```typescript
const petId = 123
const pet = await ApiService.fetchPetById(petId)

console.log('Detalles de la mascota:')
console.log('Nombre:', pet.name)
console.log('Raza:', pet.breed)
console.log('Edad:', pet.age)
console.log('Refugio:', pet.shelter)
console.log('Teléfono:', pet.phone)
```

### Crear una mascota (requiere FormData)

```typescript
import * as ImagePicker from 'expo-image-picker'

// Seleccionar imagen
const result = await ImagePicker.launchImageLibraryAsync({
  mediaTypes: ImagePicker.MediaTypeOptions.Images,
  allowsEditing: true,
  aspect: [4, 3],
  quality: 1,
})

if (!result.canceled) {
  const formData = new FormData()
  
  // Datos de la mascota
  formData.append('nombre', 'Max')
  formData.append('especie', 'Perro')
  formData.append('raza', 'Labrador')
  formData.append('edad_anios', '3')
  formData.append('sexo', 'Macho')
  formData.append('color', 'Dorado')
  formData.append('peso', '30')
  formData.append('estado_salud', 'Saludable')
  formData.append('descripcion', 'Perro muy juguetón y amigable')
  
  // Imagen
  const uri = result.assets[0].uri
  const filename = uri.split('/').pop()
  const match = /\.(\w+)$/.exec(filename)
  const type = match ? `image/${match[1]}` : 'image/jpeg'
  
  formData.append('imagen', {
    uri,
    name: filename,
    type,
  } as any)
  
  try {
    const newPet = await ApiService.createPet(formData)
    console.log('Mascota creada:', newPet)
  } catch (error) {
    console.error('Error:', error.message)
  }
}
```

### Actualizar una mascota

```typescript
// Con FormData (incluye imagen)
const formData = new FormData()
formData.append('nombre', 'Max actualizado')
formData.append('peso', '32')
// ... otros campos

await ApiService.updatePet(petId, formData)

// O con objeto JSON (sin imagen)
const updates = {
  nombre: 'Max actualizado',
  peso: '32',
  descripcion: 'Nueva descripción',
}

await ApiService.updatePet(petId, updates)
```

### Eliminar una mascota

```typescript
try {
  await ApiService.deletePet(petId)
  console.log('Mascota eliminada')
} catch (error) {
  console.error('Error:', error.message)
}
```

### Obtener mascotas para panel de administración

```typescript
const adminPets = await ApiService.getAdminPets()

// Incluye todas las mascotas del refugio (disponibles y no disponibles)
console.log('Total de mascotas:', adminPets.length)

// Filtrar mascotas en adopción
const availablePets = adminPets.filter(pet => pet.en_adopcion)
console.log('En adopción:', availablePets.length)

// Filtrar mascotas adoptadas
const adoptedPets = adminPets.filter(pet => pet.duenio_usuario_id)
console.log('Adoptadas:', adoptedPets.length)
```

## 💌 Solicitudes de Adopción

### Crear solicitud de adopción

```typescript
const adoptionData = {
  housingType: 'Casa con jardín',
  hasYard: true,
  landlordPermission: true,
  petExperience: 'He tenido perros toda mi vida',
  currentPets: 'Tengo un gato de 5 años',
  adoptionReason: 'Quiero darle un hogar amoroso a Max porque...',
  timeCommitment: 'Trabajo desde casa y puedo dedicarle todo el tiempo necesario',
}

try {
  const result = await ApiService.createAdoptionRequest(petId, adoptionData)
  console.log('Solicitud enviada:', result)
  
  // Mostrar mensaje de éxito
  Alert.alert(
    'Solicitud enviada',
    'Tu solicitud de adopción ha sido enviada exitosamente. El refugio se pondrá en contacto contigo pronto.'
  )
} catch (error) {
  Alert.alert('Error', error.message)
}
```

### Obtener solicitudes de adopción

```typescript
// Todas las solicitudes
const requests = await ApiService.getAdoptionRequests()

// Filtradas por estado
const pendingRequests = await ApiService.getAdoptionRequests({
  estado: 'pendiente',
  page: 1,
  limit: 10,
})

// Estados disponibles: 'pendiente', 'aprobada', 'rechazada'
```

### Obtener detalles de una solicitud

```typescript
const requestId = 456
const request = await ApiService.getAdoptionRequestById(requestId)

console.log('Solicitante:', request.usuario)
console.log('Mascota:', request.mascota)
console.log('Estado:', request.estado)
console.log('Razón:', request.adoptionReason)
```

### Actualizar estado de solicitud (solo refugios)

```typescript
// Aprobar
await ApiService.updateAdoptionRequestStatus(
  requestId,
  'aprobada',
  '¡Felicidades! Tu solicitud ha sido aprobada.'
)

// Rechazar
await ApiService.updateAdoptionRequestStatus(
  requestId,
  'rechazada',
  'Lamentablemente no cumples con los requisitos necesarios.'
)
```

## 🔧 Gestión de Almacenamiento (Storage)

Puedes usar `StorageService` directamente si necesitas control manual:

```typescript
import { StorageService } from '@/services'

// Token
const token = await StorageService.getToken()
await StorageService.setToken('nuevo-token')
await StorageService.removeToken()

// Usuario
const user = await StorageService.getUser()
await StorageService.setUser({ id: 1, name: 'Juan' })
await StorageService.removeUser()

// Limpiar todo
await StorageService.clearAll()
```

## ⚠️ Manejo de Errores

Todos los métodos pueden lanzar errores, úsalos con `try/catch`:

```typescript
try {
  const pets = await ApiService.fetchPets()
  // Éxito
} catch (error) {
  console.error('Error:', error.message)
  
  // Mostrar al usuario
  Alert.alert('Error', error.message)
  
  // O manejar específicamente
  if (error.message.includes('Sesión expirada')) {
    router.replace('/auth/login')
  }
}
```

## 🔄 Navegación Automática

El servicio maneja automáticamente la navegación en caso de errores 401 (token expirado):

- **Web**: `window.location.href = '/auth/login'`
- **Mobile**: `router.replace('/auth/login')`

## 🐛 Debug Mode

Los logs de debug se muestran solo en modo desarrollo:

```typescript
// En desarrollo (__DEV__ = true)
[API Debug] Sending login data: { email: 'user@example.com', userType: 'usuario' }
[API Debug] ✅ Login successful, data saved

// En producción (__DEV__ = false)
// No muestra logs
```

## 📊 Estructura de Datos

### Pet Object

```typescript
interface Pet {
  id: number | string
  name: string
  age: string
  gender: string
  location: string
  shelter: string
  description: string
  image: string
  phone?: string
  shelterId?: number | string
  species: string
  breed: string
  healthStatus: string
  vaccinated?: boolean
  sterilized?: boolean
  urgent?: boolean
  status?: string
  // ... otros campos opcionales
}
```

### Adoption Request

```typescript
interface AdoptionRequest {
  housingType: string
  hasYard: boolean
  landlordPermission?: boolean
  petExperience: string
  currentPets: string
  adoptionReason: string       // Mínimo 20 caracteres
  timeCommitment: string
}
```

## 🎯 Ejemplo Completo de Uso en un Componente

```typescript
import React, { useEffect, useState } from 'react'
import { View, Text, FlatList, ActivityIndicator, Alert } from 'react-native'
import { ApiService, Pet } from '@/services'

export default function PetsScreen() {
  const [pets, setPets] = useState<Pet[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadPets()
  }, [])

  const loadPets = async () => {
    try {
      setLoading(true)
      const data = await ApiService.fetchPets()
      setPets(data)
    } catch (error: any) {
      Alert.alert('Error', error.message)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <ActivityIndicator size="large" />
  }

  return (
    <FlatList
      data={pets}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => (
        <View>
          <Text>{item.name}</Text>
          <Text>{item.species} - {item.breed}</Text>
        </View>
      )}
    />
  )
}
```

## 📝 Notas Importantes

1. **Todos los métodos son asíncronos**: Usa siempre `await` o `.then()`
2. **Token automático**: El token se guarda automáticamente en login
3. **Navegación automática**: Redirige automáticamente si el token expira
4. **TypeScript**: Todos los tipos están definidos para mejor autocompletado
5. **FormData en móvil**: Usa el mismo formato que en web
6. **Imágenes**: Usa `expo-image-picker` para seleccionar imágenes

## 🔗 Recursos

- [AsyncStorage Docs](https://react-native-async-storage.github.io/async-storage/)
- [Expo Router](https://docs.expo.dev/router/introduction/)
- [Expo Image Picker](https://docs.expo.dev/versions/latest/sdk/imagepicker/)

---

**Desarrollado para DalePata Mobile** 🐾

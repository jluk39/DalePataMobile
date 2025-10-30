# 🎓 Ejemplos de Uso - HomePage Mobile

## 📱 FLUJO DE USUARIO

### 1. Usuario NO Autenticado
```typescript
// El usuario intenta acceder a /home
// ↓
// UserProtectedRoute detecta que NO hay usuario
// ↓
// Redirige automáticamente a /auth/login
```

### 2. Usuario Tipo "refugio"
```typescript
// Usuario de refugio intenta acceder a /home
// ↓
// UserProtectedRoute detecta userType === 'refugio'
// ↓
// Muestra Alert: "Esta aplicación es solo para usuarios comunes..."
// ↓
// Redirige a /auth/login
```

### 3. Usuario Tipo "usuario" ✅
```typescript
// Usuario común accede a /home
// ↓
// UserProtectedRoute permite el acceso
// ↓
// Renderiza HomeScreen con:
//   - HeaderBar (con nombre del usuario)
//   - HeroSection (saludo personalizado)
//   - MyPetsGrid (sus mascotas)
```

## 🧩 EJEMPLOS DE COMPONENTES

### 1. Usar Button en tu código

```typescript
import { Button } from '@/components/ui/Button'

// Botón default (primary)
<Button onPress={() => console.log('Click!')}>
  Mi Botón
</Button>

// Botón ghost (transparente)
<Button variant="ghost" onPress={handleAction}>
  Cancelar
</Button>

// Botón outline (con borde)
<Button variant="outline" size="sm">
  Ver más
</Button>

// Botón con loading
<Button loading={isLoading} disabled={isLoading}>
  {isLoading ? 'Cargando...' : 'Enviar'}
</Button>

// Botón de icono
<Button variant="ghost" size="icon" onPress={handlePress}>
  <MaterialIcons name="settings" size={24} color="#000" />
</Button>
```

### 2. Usar PetCard

```typescript
import { PetCard } from '@/components/home/PetCard'

const pet = {
  id: 1,
  name: 'Luna',
  species: 'Perro',
  breed: 'Golden Retriever',
  age: '2 años',
  gender: 'Hembra',
  healthStatus: 'Saludable',
  image: 'https://...',
}

<PetCard 
  pet={pet} 
  onPress={() => router.push(`/pet/${pet.id}`)} 
/>
```

### 3. Usar UserProtectedRoute

```typescript
import UserProtectedRoute from '@/components/UserProtectedRoute'

export default function MyScreen() {
  return (
    <UserProtectedRoute>
      {/* Tu contenido aquí - solo usuarios comunes verán esto */}
      <View>
        <Text>Contenido protegido</Text>
      </View>
    </UserProtectedRoute>
  )
}
```

## 🎨 EJEMPLOS DE ESTILOS

### 1. Usar theme en tus componentes

```typescript
import { theme } from '@/constants/theme'
import { StyleSheet } from 'react-native'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,      // #F5F5F5
    padding: theme.spacing.lg,                     // 16
  },
  title: {
    fontSize: theme.fontSize['2xl'],               // 24
    fontWeight: 'bold',
    color: theme.colors.foreground,                // #1F2937
    marginBottom: theme.spacing.md,                // 12
  },
  card: {
    backgroundColor: theme.colors.card,            // #FFFFFF
    borderRadius: theme.borderRadius.lg,           // 12
    padding: theme.spacing.lg,                     // 16
    borderWidth: 1,
    borderColor: theme.colors.border,              // #E5E7EB
  },
  primaryButton: {
    backgroundColor: theme.colors.primary,         // #89C7A8
  },
  errorText: {
    color: theme.colors.destructive,               // #EF4444
  },
})
```

### 2. Crear un componente con Material Icons

```typescript
import { MaterialIcons } from '@expo/vector-icons'
import { theme } from '@/constants/theme'

<MaterialIcons 
  name="favorite"               // heart icon
  size={24} 
  color={theme.colors.primary}  // #89C7A8
/>

// Otros iconos útiles:
// "home"           → 🏠 Casa
// "favorite"       → ❤️ Corazón
// "location-on"    → 📍 Pin de ubicación
// "notifications"  → 🔔 Campana
// "account-circle" → 👤 Usuario
// "add"            → ➕ Más
// "settings"       → ⚙️ Configuración
// "pets"           → 🐾 Pata
// "cake"           → 🎂 Torta (para edad)
// "male"           → ♂️ Masculino
// "female"         → ♀️ Femenino
```

## 🔄 EJEMPLOS DE INTEGRACIÓN CON API

### 1. Obtener mascotas del usuario

```typescript
import { ApiService } from '@/services/api-service'
import { useState, useEffect } from 'react'

export function MyComponent() {
  const [pets, setPets] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const loadPets = async () => {
      try {
        setLoading(true)
        const myPets = await ApiService.fetchMyPets()
        setPets(myPets)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    
    loadPets()
  }, [])

  if (loading) return <Text>Cargando...</Text>
  if (error) return <Text>Error: {error}</Text>
  
  return (
    <FlatList
      data={pets}
      renderItem={({ item }) => <PetCard pet={item} />}
      keyExtractor={(item) => item.id.toString()}
    />
  )
}
```

### 2. Usar AuthContext

```typescript
import { useAuth } from '@/contexts/AuthContext'

export function MyComponent() {
  const { user, signOut, loading } = useAuth()

  if (loading) return <Text>Verificando...</Text>
  
  return (
    <View>
      {user ? (
        <>
          <Text>Hola, {user.nombre}!</Text>
          <Button onPress={signOut}>Cerrar Sesión</Button>
        </>
      ) : (
        <Text>No hay usuario</Text>
      )}
    </View>
  )
}
```

## 🧪 EJEMPLOS DE TESTING

### 1. Probar flujo completo en desarrollo

```powershell
# Terminal 1: Iniciar backend
cd ../DalePataSistema
npm run dev

# Terminal 2: Iniciar app mobile
cd DalePataMobile
npm start
# Presiona 'i' para iOS o 'a' para Android
```

### 2. Probar diferentes escenarios

```typescript
// Escenario 1: Usuario común con mascotas
// 1. Login con usuario@example.com
// 2. Navegar a tab "Inicio"
// 3. Verificar que se muestran las mascotas

// Escenario 2: Usuario sin mascotas
// 1. Login con usuario sin mascotas
// 2. Ver mensaje "Aún no tenés mascotas"
// 3. Click en "Ver Mascotas en Adopción"

// Escenario 3: Usuario refugio (bloqueo)
// 1. Login con refugio@example.com
// 2. Intentar acceder a home
// 3. Ver alerta de acceso denegado
```

## 📱 EJEMPLOS DE NAVEGACIÓN

### 1. Navegar entre pantallas

```typescript
import { useRouter } from 'expo-router'

const router = useRouter()

// Ir a otra pantalla
router.push('/auth/login')
router.push('/(tabs)/explore')

// Reemplazar (no se puede volver atrás)
router.replace('/auth/login')

// Volver atrás
router.back()
```

### 2. Navegar con parámetros

```typescript
// Enviar parámetros
router.push({
  pathname: '/pet/[id]',
  params: { id: '123' }
})

// Recibir parámetros
import { useLocalSearchParams } from 'expo-router'

export default function PetDetail() {
  const { id } = useLocalSearchParams()
  return <Text>Pet ID: {id}</Text>
}
```

## 🎯 CASOS DE USO REALES

### Caso 1: Usuario registra su primera mascota

```
1. Usuario se registra → Login automático
2. Accede a HomeScreen → Ve "Aún no tenés mascotas"
3. Click en "Agregar Mascota" (botón +)
4. [TODO] Modal se abre para registrar mascota
5. Completa formulario y envía
6. MyPetsGrid se actualiza automáticamente
7. PetCard aparece en la lista
```

### Caso 2: Usuario explora mascotas en adopción

```
1. Usuario ve HeroSection con saludo
2. Click en "Explorar Mascotas"
3. Navega a tab "Adoptar"
4. [Próximamente] Ve grid de mascotas disponibles
5. Selecciona una mascota
6. Ve detalles y puede solicitar adopción
```

### Caso 3: Usuario gestiona su perfil

```
1. Usuario abre dropdown del HeaderBar
2. Click en "Mi Perfil"
3. [TODO] Navega a pantalla de perfil
4. Puede editar sus datos
5. Guarda cambios
6. HeaderBar se actualiza con nuevos datos
```

## 🔍 DEBUGGING

### Verificar usuario actual

```typescript
import { useAuth } from '@/contexts/AuthContext'

export function DebugUser() {
  const { user } = useAuth()
  
  console.log('Usuario actual:', JSON.stringify(user, null, 2))
  
  return (
    <View style={{ padding: 20 }}>
      <Text>ID: {user?.id}</Text>
      <Text>Nombre: {user?.nombre}</Text>
      <Text>Email: {user?.email}</Text>
      <Text>Tipo: {user?.userType}</Text>
    </View>
  )
}
```

### Verificar llamadas a API

```typescript
// En MyPetsGrid.tsx
useEffect(() => {
  const fetchMyPets = async () => {
    console.log('🔄 Iniciando carga de mascotas...')
    
    try {
      const myPets = await ApiService.fetchMyPets()
      console.log('✅ Mascotas cargadas:', myPets.length)
      console.log('📋 Datos:', JSON.stringify(myPets[0], null, 2))
      setPets(myPets)
    } catch (err) {
      console.error('❌ Error:', err)
      setError(err.message)
    }
  }
  
  fetchMyPets()
}, [user])
```

---

## 🎓 RECURSOS ADICIONALES

- [Expo Router Docs](https://docs.expo.dev/router/introduction/)
- [React Native Docs](https://reactnative.dev/docs/getting-started)
- [Material Icons List](https://icons.expo.fyi/)
- [AsyncStorage Docs](https://react-native-async-storage.github.io/async-storage/)

---

**Última actualización:** Octubre 29, 2025

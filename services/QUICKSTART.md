# ⚡ Quick Start - DalePata Mobile API

## 🚀 Inicio en 3 minutos

### Paso 1: Configurar URL de API (30 segundos)

```typescript
// services/api-config.ts - Línea 2
BASE_URL: 'http://TU-IP:PUERTO/api'  // 🔴 CAMBIAR AQUÍ
```

Ejemplo: `'http://192.168.1.100:3000/api'`

---

### Paso 2: Crear pantalla de Login (1 minuto)

Copia y pega en `app/auth/login.tsx`:

```typescript
import React, { useState } from 'react'
import { View, TextInput, Button, Alert } from 'react-native'
import { ApiService } from '@/services'
import { router } from 'expo-router'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleLogin = async () => {
    try {
      await ApiService.login(email, password)
      router.replace('/(tabs)')
    } catch (error: any) {
      Alert.alert('Error', error.message)
    }
  }

  return (
    <View style={{ padding: 20 }}>
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        style={{ borderWidth: 1, padding: 10, marginBottom: 10 }}
      />
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={{ borderWidth: 1, padding: 10, marginBottom: 10 }}
      />
      <Button title="Iniciar Sesión" onPress={handleLogin} />
    </View>
  )
}
```

---

### Paso 3: Listar mascotas (1 minuto)

Copia y pega en `app/(tabs)/index.tsx`:

```typescript
import { useEffect, useState } from 'react'
import { View, Text, FlatList, ActivityIndicator } from 'react-native'
import { ApiService, Pet } from '@/services'

export default function Home() {
  const [pets, setPets] = useState<Pet[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadPets()
  }, [])

  async function loadPets() {
    try {
      const data = await ApiService.fetchPets()
      setPets(data)
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <ActivityIndicator />

  return (
    <FlatList
      data={pets}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => (
        <View style={{ padding: 15, borderBottomWidth: 1 }}>
          <Text style={{ fontSize: 18, fontWeight: 'bold' }}>{item.name}</Text>
          <Text>{item.species} • {item.breed}</Text>
          <Text>{item.location}</Text>
        </View>
      )}
    />
  )
}
```

---

## ✅ ¡Listo!

Ahora ejecuta:

```bash
npm start
```

Y abre en tu dispositivo con Expo Go.

---

## 📖 Más información

- **Documentación completa**: [`services/README.md`](./README.md)
- **Configuración detallada**: [`services/SETUP.md`](./SETUP.md)
- **Ejemplos completos**: [`services/examples/`](./examples/)

---

## 🔧 Comandos Útiles

```bash
# Iniciar desarrollo
npm start

# Android
npm run android

# iOS
npm run ios

# Limpiar caché
npx expo start -c
```

---

## 🎯 Métodos Principales

```typescript
// Autenticación
await ApiService.login(email, password)
await ApiService.register(userData)
await ApiService.logout()

// Mascotas
await ApiService.fetchPets()
await ApiService.fetchMyPets()
await ApiService.createPet(formData)
await ApiService.updatePet(id, data)
await ApiService.deletePet(id)

// Adopción
await ApiService.createAdoptionRequest(petId, formData)
await ApiService.getAdoptionRequests()
```

---

## ⚠️ Recuerda

1. ✅ Todos los métodos son **asíncronos** (usa `await`)
2. ✅ Usa tu **IP local** en desarrollo, no `localhost`
3. ✅ El token se guarda **automáticamente** al hacer login
4. ✅ La app redirige **automáticamente** si expira la sesión

---

**¿Problemas?** Revisa [`SETUP.md`](./SETUP.md) → Sección "Solución de Problemas" 🐾

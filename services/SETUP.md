# 🚀 Configuración Rápida - API Services

## 📝 Paso 1: Configurar la URL de tu API

Edita `services/api-config.ts`:

```typescript
export const API_CONFIG = {
  BASE_URL: 'https://tu-backend.com/api', // 🔴 CAMBIAR AQUÍ
  TIMEOUT: 30000,
  DEBUG: __DEV__,
}
```

### URLs de ejemplo:
- **Desarrollo local**: `http://192.168.1.100:3000/api` (usa tu IP local, no localhost)
- **Servidor de pruebas**: `https://api-staging.tuapp.com/api`
- **Producción**: `https://api.tuapp.com/api`

⚠️ **Importante para Android**: No uses `localhost` o `127.0.0.1`, usa tu IP local de red.

Para obtener tu IP:
- **Windows**: `ipconfig` → Busca "Dirección IPv4"
- **Mac/Linux**: `ifconfig` → Busca "inet"

---

## 📦 Paso 2: Verificar dependencias instaladas

Ejecuta en la terminal:

```bash
npm list @react-native-async-storage/async-storage expo-image-picker
```

Deberías ver:
```
├── @react-native-async-storage/async-storage@2.x.x
└── expo-image-picker@16.x.x
```

Si falta alguna, instala:
```bash
npm install @react-native-async-storage/async-storage
npx expo install expo-image-picker
```

---

## 🧪 Paso 3: Prueba la conexión

Crea un archivo de prueba `test-api.ts`:

```typescript
import { ApiService } from '@/services'

async function testConnection() {
  try {
    console.log('🔍 Probando conexión con la API...')
    const pets = await ApiService.fetchPets()
    console.log('✅ Conexión exitosa!')
    console.log(`📊 Se encontraron ${pets.length} mascotas`)
  } catch (error: any) {
    console.error('❌ Error de conexión:', error.message)
  }
}

testConnection()
```

---

## 🔐 Paso 4: Implementar autenticación en tu app

### Crear pantalla de login

```typescript
// app/auth/login.tsx
import React, { useState } from 'react'
import { View, TextInput, TouchableOpacity, Text, Alert } from 'react-native'
import { ApiService } from '@/services'
import { router } from 'expo-router'

export default function LoginScreen() {
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
    <View>
      <TextInput value={email} onChangeText={setEmail} placeholder="Email" />
      <TextInput value={password} onChangeText={setPassword} placeholder="Password" secureTextEntry />
      <TouchableOpacity onPress={handleLogin}>
        <Text>Iniciar Sesión</Text>
      </TouchableOpacity>
    </View>
  )
}
```

### Proteger rutas autenticadas

```typescript
// app/_layout.tsx
import { useEffect, useState } from 'react'
import { ApiService } from '@/services'
import { router } from 'expo-router'

export default function RootLayout() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    checkAuth()
  }, [])

  async function checkAuth() {
    const token = await ApiService.getToken()
    if (!token) {
      router.replace('/auth/login')
    } else {
      setIsAuthenticated(true)
    }
  }

  // ... resto del layout
}
```

---

## 📱 Paso 5: Usar la API en tus componentes

### Listar mascotas

```typescript
// app/(tabs)/index.tsx
import { useEffect, useState } from 'react'
import { FlatList, Text } from 'react-native'
import { ApiService, Pet } from '@/services'

export default function HomeScreen() {
  const [pets, setPets] = useState<Pet[]>([])

  useEffect(() => {
    loadPets()
  }, [])

  async function loadPets() {
    try {
      const data = await ApiService.fetchPets()
      setPets(data)
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <FlatList
      data={pets}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => <Text>{item.name}</Text>}
    />
  )
}
```

### Registrar mascota con imagen

```typescript
import * as ImagePicker from 'expo-image-picker'
import { ApiService } from '@/services'

async function createPet() {
  // Seleccionar imagen
  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: true,
    quality: 0.8,
  })

  if (!result.canceled) {
    const formData = new FormData()
    formData.append('nombre', 'Max')
    formData.append('especie', 'Perro')
    formData.append('raza', 'Labrador')
    // ... más campos

    // Agregar imagen
    const uri = result.assets[0].uri
    const filename = uri.split('/').pop()
    const match = /\.(\w+)$/.exec(filename!)
    const type = match ? `image/${match[1]}` : 'image/jpeg'

    formData.append('imagen', {
      uri,
      name: filename,
      type,
    } as any)

    try {
      await ApiService.createPet(formData)
      alert('Mascota registrada!')
    } catch (error: any) {
      alert(error.message)
    }
  }
}
```

---

## 🐛 Solución de Problemas

### Error: "Network request failed"

**Causa**: No se puede conectar a la API

**Soluciones**:
1. Verifica que la URL en `api-config.ts` sea correcta
2. Si es desarrollo local, usa tu IP de red, no `localhost`
3. Asegúrate de que tu servidor backend esté corriendo
4. Verifica que tu dispositivo/emulador esté en la misma red

### Error: "Cannot find module '@/services'"

**Causa**: Path alias no configurado

**Solución**: Verifica que `tsconfig.json` tenga:
```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./*"]
    }
  }
}
```

### Error: "Sesión expirada"

**Causa**: Token JWT expirado

**Solución**: 
```typescript
// La app redirige automáticamente al login
// O puedes renovar el token:
await ApiService.refreshToken()
```

### Error al subir imagen: "400 Bad Request"

**Causa**: Formato de imagen incorrecto

**Solución**: Verifica que el FormData tenga el formato correcto:
```typescript
formData.append('imagen', {
  uri: imageUri,
  name: 'photo.jpg',
  type: 'image/jpeg', // Asegúrate de que coincida con el formato real
} as any)
```

---

## 📊 Estructura de Archivos Final

```
services/
├── api-config.ts          # ✅ Configuración y endpoints
├── api-service.ts         # ✅ Servicio principal
├── storage.ts             # ✅ AsyncStorage wrapper
├── index.ts               # ✅ Exportaciones
├── README.md              # ✅ Documentación completa
├── SETUP.md               # ✅ Esta guía
└── examples/              # ✅ Ejemplos de uso
    ├── PetsListExample.tsx
    ├── LoginExample.tsx
    └── CreatePetExample.tsx
```

---

## ✅ Checklist de Configuración

- [ ] Instalar dependencias: `@react-native-async-storage/async-storage`, `expo-image-picker`
- [ ] Actualizar `BASE_URL` en `api-config.ts`
- [ ] Crear pantallas de autenticación (login/registro)
- [ ] Implementar protección de rutas
- [ ] Probar conexión con la API
- [ ] Implementar manejo de errores
- [ ] Agregar loading states en componentes
- [ ] Probar en dispositivo físico (no solo emulador)

---

## 🎯 Próximos Pasos

1. **Implementa autenticación**: Crea las pantallas de login y registro
2. **Lista de mascotas**: Crea una pantalla para mostrar todas las mascotas
3. **Detalles de mascota**: Pantalla individual para cada mascota
4. **Formulario de adopción**: Implementa el flujo de solicitud de adopción
5. **Panel de administración**: Si eres refugio, agrega gestión de mascotas
6. **Notificaciones**: Implementa push notifications para nuevas solicitudes

---

## 📚 Recursos Útiles

- [Documentación completa](./README.md)
- [Expo Router](https://docs.expo.dev/router/introduction/)
- [AsyncStorage](https://react-native-async-storage.github.io/async-storage/)
- [Expo Image Picker](https://docs.expo.dev/versions/latest/sdk/imagepicker/)
- [React Native Fetch](https://reactnative.dev/docs/network)

---

**¿Necesitas ayuda?** Revisa los ejemplos en `services/examples/` 🐾

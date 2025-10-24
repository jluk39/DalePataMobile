# ✨ DalePata Mobile - API Services

## 📦 Archivos Creados (13 archivos totales)

```
services/
├── 📘 api-config.ts          ← Configuración y endpoints
├── 📘 api-service.ts         ← Servicio principal (⭐ MÁS IMPORTANTE)
├── 📘 storage.ts             ← AsyncStorage wrapper
├── 📘 index.ts               ← Exportaciones centralizadas
│
├── 📗 README.md              ← Documentación completa de la API
├── 📗 SETUP.md               ← Guía de configuración paso a paso
├── 📗 QUICKSTART.md          ← Inicio rápido (3 minutos)
├── 📗 CHANGELOG.md           ← Resumen de cambios y diferencias
├── 📗 TODO.md                ← Acción requerida: Configurar URL
│
└── examples/                 ← 💡 Ejemplos listos para usar
    ├── LoginExample.tsx          → Autenticación completa
    ├── PetsListExample.tsx       → Lista de mascotas
    ├── CreatePetExample.tsx      → Crear mascota con imagen
    └── README.md                 → Documentación de ejemplos
```

---

## 🎯 ¿Por dónde empezar?

### 1️⃣ PRIMERO (OBLIGATORIO): Configurar URL
📄 Abre **`services/TODO.md`** y sigue las instrucciones

### 2️⃣ Inicio Rápido (3 minutos)
📄 Abre **`services/QUICKSTART.md`**
- Copiar código de login
- Copiar código de lista de mascotas
- ¡Listo para usar!

### 3️⃣ Configuración Completa
📄 Abre **`services/SETUP.md`**
- Guía paso a paso
- Checklist completo
- Solución de problemas

### 4️⃣ Ver Ejemplos Completos
📁 Abre **`services/examples/`**
- Componentes completos
- Listos para copiar
- Con estilos incluidos

### 5️⃣ Documentación de Referencia
📄 Abre **`services/README.md`**
- Todos los métodos disponibles
- Ejemplos de cada función
- Estructura de datos

---

## ⚡ Uso Básico

### Importar el servicio

```typescript
import { ApiService } from '@/services'
```

### Login

```typescript
await ApiService.login(email, password)
```

### Listar mascotas

```typescript
const pets = await ApiService.fetchPets()
```

### Crear mascota

```typescript
const formData = new FormData()
formData.append('nombre', 'Max')
formData.append('especie', 'Perro')
// ... más campos
await ApiService.createPet(formData)
```

---

## 🔑 Funcionalidades Principales

### ✅ Autenticación
- Login / Registro
- Gestión de tokens automática
- Renovar sesión
- Logout

### ✅ Mascotas
- Listar todas
- Ver detalles
- Crear / Editar / Eliminar
- Mis mascotas
- Con imágenes

### ✅ Adopción
- Crear solicitud
- Ver solicitudes
- Actualizar estado

---

## 🚨 IMPORTANTE

### ⚠️ Todos los métodos son ASÍNCRONOS

```typescript
// ❌ MAL (como en web)
const pets = ApiService.fetchPets()

// ✅ BIEN (React Native)
const pets = await ApiService.fetchPets()
```

### ⚠️ No uses localhost en móvil

```typescript
// ❌ MAL
BASE_URL: 'http://localhost:3000/api'

// ✅ BIEN (usa tu IP local)
BASE_URL: 'http://192.168.1.100:3000/api'
```

---

## 📱 Dependencias Instaladas

```bash
✅ @react-native-async-storage/async-storage  (para almacenamiento)
✅ expo-image-picker                          (para subir imágenes)
```

---

## 🎨 Características Destacadas

🔐 **Autenticación automática**: Token se guarda solo
🔄 **Redirección inteligente**: Si expira sesión, va a login
📝 **TypeScript completo**: Autocompletado en tu IDE
🐛 **Debug mode**: Logs automáticos en desarrollo
📱 **Optimizado para móvil**: AsyncStorage + expo-router
🖼️ **Upload de imágenes**: Con expo-image-picker
📖 **Documentación completa**: README + SETUP + Ejemplos
💡 **3 ejemplos completos**: Login, Lista, Crear

---

## 📊 Comparación con Versión Web

| Característica | Web | Mobile |
|---------------|-----|--------|
| Almacenamiento | `localStorage` | `AsyncStorage` |
| Métodos | Síncronos | **Asíncronos** |
| Navegación | `window.location` | `router.replace()` |
| Tipos | JavaScript | **TypeScript** |
| Import | `./api-service.js` | `@/services` |

---

## 🚀 Comandos de Desarrollo

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

## 📖 Guías de Lectura

| Archivo | Cuándo leerlo |
|---------|---------------|
| **TODO.md** | 🔴 Ahora mismo (configurar URL) |
| **QUICKSTART.md** | ⚡ Para empezar rápido (3 min) |
| **SETUP.md** | 📖 Configuración completa |
| **examples/** | 💡 Ver código real |
| **README.md** | 📕 Referencia de API |
| **CHANGELOG.md** | 📋 Diferencias con web |

---

## 🎓 Roadmap Sugerido

1. ✅ Archivos de API creados
2. 🔴 **Configurar URL** en `api-config.ts` (TODO.md)
3. ⚡ Seguir QUICKSTART.md
4. 🏗️ Crear pantallas de autenticación
5. 📱 Implementar lista de mascotas
6. 🖼️ Agregar funcionalidad de imágenes
7. 💌 Implementar solicitudes de adopción
8. 🎨 Personalizar UI/UX
9. 🧪 Testing en dispositivo real
10. 🚀 Deploy

---

## 💬 Necesitas Ayuda?

1. **Problemas de conexión**: Ver `SETUP.md` → Sección "Solución de Problemas"
2. **Cómo usar un método**: Ver `README.md` → Buscar el método
3. **Ver código de ejemplo**: Ver `examples/` → Componente similar
4. **Configuración inicial**: Ver `SETUP.md` → Checklist completo
5. **Inicio rápido**: Ver `QUICKSTART.md` → Copiar y pegar

---

## ✨ Todo está listo para empezar

```typescript
// Solo necesitas 3 pasos:
1. Configurar URL en api-config.ts
2. Importar: import { ApiService } from '@/services'
3. Usar: await ApiService.login(email, password)
```

---

## 🎉 ¡A desarrollar!

**Siguiente paso**: Abre `services/TODO.md` y configura tu URL de API

**¿Dudas?**: Revisa `services/SETUP.md` para configuración completa

**¿Ejemplos?**: Revisa `services/examples/` para ver código real

---

Desarrollado con 🐾 para **DalePata Mobile**

---

## 📝 Notas Finales

- ✅ Todos los archivos creados y sin errores
- ✅ Dependencias instaladas correctamente
- ✅ TypeScript configurado
- ✅ Ejemplos completos incluidos
- ✅ Documentación exhaustiva
- 🔴 Falta: Configurar URL de tu API
- 🔨 Siguiente: Implementar pantallas en tu app

---

**Versión**: 1.0.0 | **Fecha**: Octubre 2025 | **Estado**: ✅ Listo para usar

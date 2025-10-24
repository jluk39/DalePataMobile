# 🎯 ACCIÓN REQUERIDA - Configurar API

## ⚠️ IMPORTANTE: Antes de usar la app

### 🔴 PASO OBLIGATORIO: Cambiar URL de API

Abre el archivo `services/api-config.ts` y modifica la línea 2:

```typescript
// services/api-config.ts
export const API_CONFIG = {
  BASE_URL: 'https://tu-api-backend.com/api', // 🔴 CAMBIAR por tu URL real
  TIMEOUT: 30000,
  DEBUG: __DEV__,
}
```

### 📍 Opciones de URL según tu entorno:

#### 1. Desarrollo Local (Backend en tu computadora)
```typescript
BASE_URL: 'http://192.168.1.100:3000/api'  // Usa tu IP local
```

**¿Cómo obtener tu IP?**
- **Windows**: Abre CMD → ejecuta `ipconfig` → busca "Dirección IPv4"
- **Mac/Linux**: Abre Terminal → ejecuta `ifconfig` → busca "inet"

**Ejemplo de IP**: `192.168.1.100`, `192.168.0.15`, `10.0.0.5`, etc.

⚠️ **NUNCA uses**:
- ❌ `localhost` (no funciona en móvil)
- ❌ `127.0.0.1` (no funciona en móvil)

#### 2. Servidor de Pruebas
```typescript
BASE_URL: 'https://api-staging.tuapp.com/api'
```

#### 3. Producción
```typescript
BASE_URL: 'https://api.tuapp.com/api'
```

---

## ✅ Después de cambiar la URL

### Opción A: Inicio Rápido (3 minutos)
Sigue la guía: **[`QUICKSTART.md`](./QUICKSTART.md)**

### Opción B: Configuración Completa
Sigue la guía: **[`SETUP.md`](./SETUP.md)**

### Opción C: Ver Ejemplos
Revisa los componentes en: **[`examples/`](./examples/)**

---

## 📱 Probar la Conexión

Una vez configurada la URL, puedes probar la conexión:

```typescript
import { ApiService } from '@/services'

// Probar endpoint público (listar mascotas)
const pets = await ApiService.fetchPets()
console.log('✅ Conexión exitosa!', pets.length, 'mascotas encontradas')
```

---

## 🐛 Si tienes problemas

### Error: "Network request failed"

**Verifica**:
1. ✅ ¿Tu backend está corriendo?
2. ✅ ¿La URL es correcta?
3. ✅ ¿Estás usando tu IP local (no localhost)?
4. ✅ ¿Tu dispositivo está en la misma red WiFi?

**Solución rápida**:
```bash
# En tu computadora, obtén tu IP
ipconfig  # Windows
ifconfig  # Mac/Linux

# Usa esa IP en api-config.ts
BASE_URL: 'http://TU-IP-AQUI:3000/api'
```

### Error: "Cannot find module '@/services'"

**Solución**: Ya está configurado en `tsconfig.json`, solo reinicia el servidor:
```bash
npx expo start -c
```

---

## 📚 Documentación Disponible

| Archivo | Descripción |
|---------|-------------|
| **`QUICKSTART.md`** | ⚡ Inicio rápido (3 minutos) |
| **`SETUP.md`** | 📖 Configuración completa paso a paso |
| **`README.md`** | 📕 Documentación de todos los métodos |
| **`CHANGELOG.md`** | 📋 Resumen de cambios y diferencias |
| **`examples/`** | 💡 Componentes de ejemplo listos para usar |

---

## 🎓 Orden Recomendado de Lectura

1. 🔴 **Este archivo** (TODO.md) - Configurar URL
2. ⚡ **QUICKSTART.md** - Crear login y lista de mascotas
3. 📖 **SETUP.md** - Configuración completa
4. 💡 **examples/** - Ver ejemplos más avanzados
5. 📕 **README.md** - Referencia completa de la API

---

## ✨ Una vez configurado, podrás

✅ Iniciar sesión y registrar usuarios
✅ Listar todas las mascotas disponibles
✅ Ver detalles de cada mascota
✅ Crear y actualizar mascotas (con imágenes)
✅ Enviar solicitudes de adopción
✅ Gestionar perfil de usuario
✅ Y mucho más...

---

## 🚀 Comenzar Ahora

```bash
# 1. Configura la URL en api-config.ts
# 2. Inicia el servidor de desarrollo
npm start

# 3. Abre en tu dispositivo con Expo Go
# 4. ¡Prueba la app!
```

---

**¿Todo listo?** Marca esta tarea como completada y empieza a desarrollar tu app 🐾

**¿Problemas?** Revisa la sección "Solución de Problemas" en [`SETUP.md`](./SETUP.md)

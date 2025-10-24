# 🔐 Configuración de Variables de Entorno

## ✅ Ya Configurado

El proyecto ya está configurado para usar variables de entorno. Solo necesitas actualizar tus valores.

---

## 📝 Cómo Configurar

### 1. Edita el archivo `.env`

```bash
# Ya existe en la raíz del proyecto
# Abre: .env
```

### 2. Actualiza la URL de tu API

```env
EXPO_PUBLIC_API_BASE_URL=http://TU_IP_LOCAL:3001/api
```

**¿Cómo obtener tu IP?**

Windows (PowerShell):
```powershell
ipconfig
# Busca "Dirección IPv4" (ejemplo: 192.168.1.100)
```

Mac/Linux (Terminal):
```bash
ifconfig
# Busca "inet" (ejemplo: 192.168.1.100)
```

### 3. Reinicia Expo

```bash
# Detén el servidor (Ctrl+C)
# Inicia de nuevo
npm start
# o
npx expo start -c  # Con caché limpio
```

---

## 📋 Variables Disponibles

| Variable | Descripción | Ejemplo |
|----------|-------------|---------|
| `EXPO_PUBLIC_API_BASE_URL` | URL de tu backend | `http://192.168.1.100:3001/api` |
| `EXPO_PUBLIC_SUPABASE_URL` | URL de Supabase (opcional) | `https://xxx.supabase.co` |
| `EXPO_PUBLIC_SUPABASE_ANON_KEY` | Key de Supabase (opcional) | `eyJhbG...` |

---

## 🔄 Diferentes Entornos

### Desarrollo Local
```env
EXPO_PUBLIC_API_BASE_URL=http://192.168.1.100:3001/api
```

### Servidor de Pruebas
```env
EXPO_PUBLIC_API_BASE_URL=https://api-staging.tuapp.com/api
```

### Producción
```env
EXPO_PUBLIC_API_BASE_URL=https://api.tuapp.com/api
```

---

## 🔍 Verificar Configuración

Puedes verificar que las variables se están cargando correctamente:

```typescript
import { API_CONFIG } from '@/services/api-config'

console.log('API URL:', API_CONFIG.BASE_URL)
// Debería mostrar: http://192.168.1.100:3001/api
```

---

## ⚠️ Importante

### ✅ Reglas de Variables en Expo

1. **Deben empezar con `EXPO_PUBLIC_`** para ser accesibles en el código
2. **Se leen al iniciar** el servidor (requiere reiniciar después de cambios)
3. **No exponen secretos** en producción (son públicas en el bundle)

### ❌ NO uses variables de entorno para:
- API keys secretas (úsalas en el backend)
- Contraseñas
- Tokens privados

### ✅ SÍ usa variables de entorno para:
- URLs de API
- Configuraciones públicas
- Feature flags

---

## 🐛 Solución de Problemas

### Problema: Variables no se cargan

**Solución 1**: Reinicia el servidor de Expo
```bash
# Ctrl+C para detener
npm start
```

**Solución 2**: Limpia caché
```bash
npx expo start -c
```

**Solución 3**: Verifica el nombre
```bash
# ✅ CORRECTO
EXPO_PUBLIC_API_BASE_URL=http://...

# ❌ INCORRECTO (sin EXPO_PUBLIC_)
API_BASE_URL=http://...
```

### Problema: "Cannot connect to API"

**Verifica**:
1. ✅ Tu backend está corriendo en el puerto 3001
2. ✅ La IP es correcta (no `localhost`)
3. ✅ Tu dispositivo está en la misma red WiFi
4. ✅ El firewall no bloquea el puerto

---

## 📦 Archivos de Configuración

```
.
├── .env              ← Tus valores (no se sube a git)
├── .env.example      ← Plantilla de ejemplo
├── .gitignore        ← Ya incluye .env
└── services/
    └── api-config.ts ← Lee las variables
```

---

## 🚀 Listo para Usar

Una vez configurado el `.env`, los servicios de API automáticamente usarán esas URLs:

```typescript
import { ApiService } from '@/services'

// Usa automáticamente EXPO_PUBLIC_API_BASE_URL
const pets = await ApiService.fetchPets()
```

---

## 📚 Más Información

- [Expo Environment Variables](https://docs.expo.dev/guides/environment-variables/)
- [API Config](./services/api-config.ts)

---

**¿Todo configurado?** Prueba hacer login o listar mascotas 🐾

# 🔔 Sistema de Notificaciones - DalePata Mobile

## ✅ Implementación Completada

### 📋 Resumen
Sistema de notificaciones virtuales completamente funcional que genera alertas a partir de solicitudes de adopción aprobadas/rechazadas.

---

## 🏗️ Arquitectura

### Flujo de Datos
```
┌─────────────────────────────────────────────────────────────┐
│                 FLUJO DE NOTIFICACIONES                     │
└─────────────────────────────────────────────────────────────┘

1️⃣ USUARIO SOLICITA ADOPCIÓN
   ↓
   POST /solicitudes/mascotas/{petId}

2️⃣ ADMIN APRUEBA/RECHAZA
   ↓
   PUT /solicitudes/{requestId}/estado
   { estado: "aprobada", comentario: "..." }

3️⃣ APP CONSULTA SOLICITUDES
   ↓
   GET /solicitudes/mis-solicitudes

4️⃣ GENERA NOTIFICACIONES VIRTUALES
   ↓
   • Filtra aprobadas/rechazadas últimos 30 días
   • Compara con AsyncStorage (leídas)
   • Genera array en cliente

5️⃣ USUARIO VE NOTIFICACIONES
   ↓
   • Contador en HeaderBar
   • Pantalla completa de notificaciones

6️⃣ MARCA COMO LEÍDA
   ↓
   AsyncStorage.setItem('dalepata-read-notifications', [ids])
```

---

## 📁 Archivos Modificados/Creados

### 1. `services/api-service.ts` ⚡ MODIFICADO
Métodos agregados:
- ✅ `getVirtualNotifications()` - Genera notificaciones virtuales
- ✅ `markNotificationAsRead(solicitudId)` - Marca como leída
- ✅ `markAllNotificationsAsRead(solicitudIds[])` - Marca todas
- ✅ `getUnreadNotificationsCount()` - Cuenta sin leer

### 2. `services/storage.ts` ⚡ MODIFICADO
Métodos agregados:
- ✅ `getReadNotifications()` - Obtiene IDs leídas
- ✅ `setReadNotifications(ids[])` - Establece lista completa
- ✅ `addReadNotification(id)` - Agrega una leída
- ✅ `clearReadNotifications()` - Limpia todas

Nueva key de storage:
```typescript
READ_NOTIFICATIONS: 'dalepata-read-notifications'
```

### 3. `app/(tabs)/notificaciones.tsx` 🆕 NUEVO
Pantalla completa de notificaciones con:
- ✅ Lista de notificaciones con imágenes de mascotas
- ✅ Indicador visual de no leídas (borde azul + punto)
- ✅ Pull-to-refresh
- ✅ Formateo de fechas relativas ("Hace 2h", "Hace 3 días")
- ✅ Botón "Marcar todas como leídas"
- ✅ Navegación a pantalla de seguimiento al hacer tap
- ✅ Estado vacío con mensaje amigable

### 4. `components/home/HeaderBar.tsx` ⚡ MODIFICADO
Agregado:
- ✅ Contador de notificaciones (badge rojo)
- ✅ Auto-actualización con `useFocusEffect`
- ✅ Navegación a `/notificaciones` al hacer tap

### 5. `app/(tabs)/_layout.tsx` ⚡ MODIFICADO
Agregado:
- ✅ Ruta de notificaciones (oculta del tab bar)

---

## 🎨 Características de Diseño

### 🔴 Badge de Notificaciones (HeaderBar)
```typescript
// Aparece en esquina superior derecha del ícono de campana
• Color: Rojo (#EF4444)
• Muestra número hasta 99 (luego "99+")
• Borde blanco para destacar
• Auto-oculta cuando unreadCount = 0
```

### 📱 Pantalla de Notificaciones
```typescript
• Header con título y contador "X sin leer"
• Botón "Marcar todas" (solo si hay sin leer)
• Notificaciones NO LEÍDAS:
  - Fondo azul claro (#e3f2fd)
  - Borde izquierdo verde (4px)
  - Punto indicador azul en la derecha
  - Título en negrita

• Notificaciones LEÍDAS:
  - Fondo blanco
  - Sin borde especial
  - Título normal

• Cada notificación muestra:
  - Foto de la mascota (o ícono 🎉/❌)
  - Título: "¡Solicitud para [Nombre] aprobada/rechazada!"
  - Comentario del refugio (si existe)
  - Fecha relativa
  - CTA "Ver detalles" (solo aprobadas)
```

### ⏰ Auto-marcado como Leídas
```typescript
• Después de 7 días → Auto-marcado
• Filtro: Solo últimos 30 días
• Usuario puede marcar manual
• Usuario puede marcar todas
```

---

## 🔌 Uso en tu App

### Obtener Contador de Notificaciones
```typescript
import { ApiService } from '@/services/api-service'

const count = await ApiService.getUnreadNotificationsCount()
console.log(`Notificaciones sin leer: ${count}`)
```

### Obtener Lista de Notificaciones
```typescript
const notifications = await ApiService.getVirtualNotifications()

// Estructura de cada notificación:
{
  id: "solicitud-123",
  solicitudId: 123,
  tipo: "solicitud_adopcion",
  estado: "aprobada" | "rechazada",
  mascota: "Firulais",
  mascotaImagen: "https://...",
  mascotaId: 456,
  fecha: "2025-12-02T10:30:00Z",
  comentario: "¡Felicidades! Tu solicitud fue aprobada",
  leida: false
}
```

### Marcar Notificación como Leída
```typescript
await ApiService.markNotificationAsRead(solicitudId)
```

### Marcar Todas como Leídas
```typescript
const allIds = notifications.map(n => n.solicitudId)
await ApiService.markAllNotificationsAsRead(allIds)
```

---

## 🧪 Testing

### Caso 1: Usuario Sin Solicitudes
```
✅ Pantalla vacía con mensaje
✅ Ícono 🔔 grande
✅ Texto: "No hay notificaciones"
✅ Badge NO visible en HeaderBar
```

### Caso 2: Usuario con Solicitud Aprobada Reciente
```
✅ Notificación visible con fondo azul
✅ Badge rojo con "1" en HeaderBar
✅ Al abrir: Notificación con borde verde
✅ CTA "Ver detalles" visible
✅ Al tocar: Navega a seguimiento
✅ Notificación se marca como leída automáticamente
```

### Caso 3: Solicitud Rechazada
```
✅ Notificación con ícono ❌
✅ SIN botón "Ver detalles"
✅ Muestra comentario del refugio (si existe)
✅ Fondo azul si no está leída
```

### Caso 4: Notificaciones Antiguas (>7 días)
```
✅ Auto-marcadas como leídas
✅ NO cuentan en badge del header
✅ Fondo blanco (leídas)
✅ Siguen visibles en la lista
```

### Caso 5: Notificaciones Muy Antiguas (>30 días)
```
✅ Filtradas completamente
✅ NO aparecen en la lista
```

---

## 🔄 Sincronización

### Actualización del Contador
El badge se actualiza automáticamente en:
- ✅ Al volver a la pantalla Home (`useFocusEffect`)
- ✅ Al iniciar sesión
- ✅ Al volver de la pantalla de notificaciones

### Pull-to-Refresh
- ✅ Desliza hacia abajo en la pantalla de notificaciones
- ✅ Re-consulta `/solicitudes/mis-solicitudes`
- ✅ Regenera notificaciones virtuales
- ✅ Actualiza contador

---

## 🚀 Navegación

### Desde HeaderBar
```typescript
// Tap en campana → Abre notificaciones
router.push('/(tabs)/notificaciones')
```

### Desde Notificación
```typescript
// Tap en notificación → Abre seguimiento
router.push({
  pathname: '/(tabs)/seguimiento',
  params: { solicitudId: notification.solicitudId }
})
```

---

## 📦 Almacenamiento Local (AsyncStorage)

### Key Utilizada
```typescript
'dalepata-read-notifications'
```

### Formato del Valor
```json
[123, 456, 789]
```
Array de IDs de solicitudes marcadas como leídas.

### Limpieza
Se limpia automáticamente al cerrar sesión:
```typescript
await StorageService.clearAll()
```

---

## 🎯 Ventajas de Este Sistema

### ✅ Sin Backend Adicional
- No requiere tabla de notificaciones en BD
- No requiere endpoints nuevos
- Usa datos existentes (solicitudes)

### ✅ Eficiente
- Solo consulta cuando es necesario
- Caching en AsyncStorage
- Filtrado en cliente

### ✅ UX Consistente con Web
- Mismo flujo que versión web
- Mismo diseño de notificaciones
- Misma lógica de marcado

### ✅ Offline-Ready
- Estado de "leída" persiste localmente
- No depende de conexión para marcar
- Sincroniza automáticamente al volver online

---

## 🐛 Troubleshooting

### Badge no aparece
```typescript
// Verificar que el usuario esté autenticado
const user = await StorageService.getUser()
console.log('Usuario:', user)

// Verificar solicitudes
const solicitudes = await ApiService.getMyAdoptionRequests()
console.log('Solicitudes:', solicitudes)

// Verificar filtrado
const notifications = await ApiService.getVirtualNotifications()
console.log('Notificaciones generadas:', notifications)
```

### Notificaciones no se marcan como leídas
```typescript
// Verificar AsyncStorage
const read = await StorageService.getReadNotifications()
console.log('IDs leídos:', read)

// Verificar que se guarde correctamente
await ApiService.markNotificationAsRead(123)
const updated = await StorageService.getReadNotifications()
console.log('Después de marcar:', updated)
```

### Contador desactualizado
```typescript
// El contador se actualiza con useFocusEffect
// Forzar recarga manual:
const count = await ApiService.getUnreadNotificationsCount()
console.log('Contador actual:', count)
```

---

## 🎨 Personalización

### Cambiar Colores
Edita `constants/theme.ts`:
```typescript
primary: '#TU_COLOR_VERDE',      // Badge y bordes
destructive: '#TU_COLOR_ROJO',   // Badge de contador
```

### Cambiar Días de Filtrado
Edita `services/api-service.ts`:
```typescript
// Línea ~1435
const thirtyDaysAgo = new Date()
thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30) // Cambia 30 a tu valor
```

### Cambiar Auto-marcado
Edita `services/api-service.ts`:
```typescript
// Línea ~1462
leida: readNotifications.includes(s.id) || daysSinceDecision > 7 
// Cambia 7 a tu valor
```

---

## 📚 Dependencias Usadas

### Ya Instaladas en tu Proyecto
- ✅ `@react-native-async-storage/async-storage` - Storage local
- ✅ `@expo/vector-icons` - Íconos
- ✅ `expo-router` - Navegación
- ✅ `react-native-safe-area-context` - SafeAreaView

### No Requiere Instalación Adicional
Todo está implementado con dependencias existentes.

---

## ✨ Próximas Mejoras (Opcionales)

1. **Push Notifications Reales**
   - Usar `expo-notifications`
   - Recibir alertas cuando admin aprueba/rechaza

2. **Animaciones**
   - Animación de entrada de notificaciones
   - Animación del badge

3. **Sonidos**
   - Sonido al recibir notificación nueva
   - Vibración al marcar como leída

4. **Filtros**
   - Ver solo aprobadas
   - Ver solo rechazadas
   - Ordenar por fecha

5. **Acciones Rápidas**
   - Swipe para marcar como leída
   - Swipe para eliminar

---

## 📞 Soporte

Si algo no funciona:
1. Verifica logs en la consola (`console.log`)
2. Verifica que el token esté presente
3. Verifica que las solicitudes se estén obteniendo correctamente
4. Revisa que AsyncStorage tenga permisos

**¡Sistema completamente funcional y listo para usar!** 🎉

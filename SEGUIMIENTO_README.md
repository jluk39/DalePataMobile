# Sección de Seguimiento - DalePata Mobile

## 📱 Descripción

La sección de Seguimiento permite a los usuarios ver y gestionar todas sus solicitudes de adopción en una interfaz intuitiva y completa, replicando la funcionalidad del frontend web.

## 🎯 Características Implementadas

### ✅ Funcionalidades Principales

1. **Vista de Estadísticas**
   - Total de solicitudes
   - Solicitudes pendientes (pendiente + enviada)
   - Solicitudes aprobadas
   - Solicitudes rechazadas

2. **Búsqueda y Filtrado**
   - Búsqueda por nombre de mascota
   - Filtros por estado: Todas, Pendientes, Enviadas, Aprobadas, Rechazadas, Canceladas

3. **Lista de Solicitudes**
   - Imagen de la mascota
   - Nombre y raza
   - Badge de estado con colores distintivos
   - Fecha de solicitud
   - Nombre del refugio
   - Botones de acción (Ver Detalles / Cancelar)

4. **Modal de Detalles**
   - Información completa de la solicitud
   - Datos de vivienda
   - Experiencia con mascotas
   - Disponibilidad y tiempo de dedicación
   - Razón de adopción
   - Comentarios adicionales
   - Fechas relevantes

5. **Cancelación de Solicitudes**
   - Solo para solicitudes con estado "pendiente" o "enviada"
   - Confirmación antes de cancelar
   - Actualización inmediata del estado local

## 📂 Archivos Creados/Modificados

### Nuevos Archivos

1. **`components/adoption/AdoptionRequestDetailsModal.tsx`**
   - Modal completo para ver detalles de una solicitud
   - Diseño adaptado a mobile con scroll
   - Secciones organizadas por categoría

### Archivos Modificados

1. **`app/(tabs)/seguimiento.tsx`**
   - Pantalla principal de seguimiento
   - Implementación completa de todas las funcionalidades
   - Estadísticas, búsqueda, filtros y lista de solicitudes

2. **`services/api-service.ts`**
   - Agregados métodos alias para compatibilidad con frontend web:
     - `getMyAdoptionRequests()` → alias de `getMyAdoptions()`
     - `cancelAdoptionRequest(requestId)` → alias de `cancelAdoption(requestId)`

3. **`services/api-config.ts`**
   - Ya contenía los endpoints necesarios (sin cambios)

## 🔌 API Endpoints Utilizados

### 1. Obtener Mis Solicitudes
```typescript
ApiService.getMyAdoptions() // o getMyAdoptionRequests()
```
- **Endpoint**: `GET /api/adopciones/mis-solicitudes`
- **Retorna**: Array de solicitudes de adopción

### 2. Cancelar Solicitud
```typescript
ApiService.cancelAdoption(requestId) // o cancelAdoptionRequest(requestId)
```
- **Endpoint**: `DELETE /api/adopciones/:requestId`
- **Acción**: Cambia el estado a "cancelada"

## 📊 Estructura de Datos

### AdoptionRequest Interface
```typescript
interface AdoptionRequest {
  id: number;
  estado: 'pendiente' | 'enviada' | 'aprobada' | 'rechazada' | 'cancelada';
  created_at: string;
  mascota: {
    nombre: string;
    especie: string;
    raza: string;
    imagen_url: string;
  };
  refugio: {
    nombre: string;
  };
  // Campos adicionales opcionales
  tipo_vivienda?: string;
  tiene_patio?: string;
  permiso_propietario?: boolean;
  experiencia_mascotas?: string;
  mascotas_actuales?: string;
  tiempo_dedicacion?: string;
  razon_adopcion?: string;
  comentario?: string;
  fecha_decision?: string;
}
```

## 🎨 Diseño y Estilo

### Colores de Estados (Badges)

| Estado      | Color     | Hex      |
|-------------|-----------|----------|
| Pendiente   | Amarillo  | #EAB308  |
| Enviada     | Azul      | #3B82F6  |
| Aprobada    | Verde     | #22C55E  |
| Rechazada   | Rojo      | #EF4444  |
| Cancelada   | Gris      | #6B7280  |

### Componentes UI

- **SafeAreaView**: Gestión de áreas seguras
- **FlatList**: Lista optimizada con pull-to-refresh
- **Modal**: Detalles en pantalla completa
- **Alert**: Confirmaciones de acciones críticas
- **ActivityIndicator**: Estados de carga

## 🔄 Flujos de Usuario

### 1. Ver Solicitudes
1. Usuario abre la pestaña "Seguimiento"
2. Se cargan automáticamente todas las solicitudes
3. Se muestran estadísticas en la parte superior
4. Lista paginada de solicitudes con scroll

### 2. Buscar/Filtrar
1. Usuario ingresa texto en barra de búsqueda
2. Filtrado en tiempo real por nombre de mascota
3. Usuario selecciona filtro de estado
4. Lista se actualiza inmediatamente

### 3. Ver Detalles
1. Usuario toca "Ver Detalles"
2. Se abre modal con información completa
3. Usuario puede desplazarse por todas las secciones
4. Cierra con botón "Cerrar" o gesto de arrastre

### 4. Cancelar Solicitud
1. Usuario toca "Cancelar" (solo si estado es pendiente/enviada)
2. Se muestra alerta de confirmación
3. Si confirma:
   - Se llama a la API
   - Estado local se actualiza a "cancelada"
   - Badge cambia de color
   - Botón "Cancelar" desaparece
4. Si cancela: no ocurre nada

## 🚀 Próximas Mejoras (Opcional)

- [ ] Notificaciones push cuando cambia el estado
- [ ] Chat directo con el refugio desde la solicitud
- [ ] Compartir solicitud por redes sociales
- [ ] Exportar historial en PDF
- [ ] Filtros avanzados (por fecha, refugio, especie)
- [ ] Ordenamiento personalizado

## 🧪 Testing

### Escenarios de Prueba

1. **Carga inicial**: Verificar que se cargan todas las solicitudes
2. **Búsqueda**: Probar con diferentes nombres
3. **Filtros**: Cambiar entre todos los estados
4. **Detalles**: Abrir y cerrar modal
5. **Cancelación**: Cancelar una solicitud pendiente
6. **Estados vacíos**: Probar sin solicitudes o sin resultados de búsqueda
7. **Refresh**: Pull-to-refresh para recargar datos
8. **Errores de red**: Comportamiento sin conexión

## 📱 Compatibilidad

- ✅ iOS
- ✅ Android
- ✅ Modo claro/oscuro (según configuración del sistema)
- ✅ Diferentes tamaños de pantalla
- ✅ Tablets (diseño responsivo)

## 🔗 Referencias

- Frontend Web: Componente equivalente en la versión web
- API Backend: Documentación de endpoints en `/api/docs`
- Design System: `constants/theme.ts`

---

**Última actualización**: Noviembre 14, 2025  
**Versión**: 1.0.0  
**Autor**: Equipo DalePata Mobile

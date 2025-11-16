# Sección de Perdidos - DalePata Mobile

## ⚠️ ESTADO ACTUAL: SOLO UI (Mock Data)

Esta sección está implementada **únicamente con interfaz de usuario y datos de prueba**. La integración con el backend se realizará en una fase posterior cuando los endpoints estén completos.

## 📱 Descripción

La sección de Perdidos permite a los usuarios visualizar mascotas perdidas y encontradas en formato de lista o mapa interactivo.

## 🎯 Funcionalidades Implementadas

### ✅ Vista de Lista
- Grid de tarjetas con información de mascotas
- Información detallada de cada mascota:
  - Imagen
  - Nombre
  - Tipo (Perro/Gato)
  - Raza, edad, género
  - Color y tamaño
  - Ubicación
  - Fecha de avistamiento
  - Descripción
  - Botones de contacto (llamar/email)
- Badges visuales:
  - Estado: "Perdido" (rojo) o "Encontrado" (azul)
  - "Urgente" (naranja) - para casos urgentes
  - "Recompensa" (verde) - si hay recompensa ofrecida
- Pull-to-refresh para recargar datos
- Botón "Reportar Mascota Perdida" (placeholder)

### ✅ Vista de Mapa
- Placeholder para futura implementación
- Mensaje informativo sobre funcionalidad pendiente

### ✅ Datos Mock
- 6 mascotas de ejemplo con datos completos
- Simulación de latencia de red (1 segundo)
- Mezcla de mascotas perdidas y encontradas
- Datos realistas de Buenos Aires, Argentina

## 📂 Archivos Creados

### 1. **`constants/mockLostPets.ts`**
- Interface `LostPet` con toda la estructura de datos
- Array `MOCK_LOST_PETS` con 6 mascotas de prueba
- Funciones mock para simular API:
  - `fetchMockLostPets()` - Obtener lista de mascotas
  - `submitMockFoundReport()` - Reportar mascota encontrada
  - `reportMockPetAsLost()` - Reportar mascota propia como perdida

### 2. **`components/perdidos/LostFoundCard.tsx`**
- Componente de tarjeta individual
- Diseño completo según especificaciones
- Badges de estado, urgencia y recompensa
- Botones funcionales de llamada y email
- Formato de fecha en español
- Responsive y optimizado para mobile

### 3. **`app/(tabs)/perdidos.tsx`**
- Pantalla principal de la sección
- Sistema de tabs (Lista / Mapa)
- Pull-to-refresh implementado
- Estados de carga y vacío
- Botón de reportar (placeholder)

## 📊 Estructura de Datos

### Interface LostPet
```typescript
interface LostPet {
  id: number;
  name: string;
  type: 'Perro' | 'Gato';
  breed: string;
  age?: string;
  gender: 'Macho' | 'Hembra';
  color: string;
  size: 'Pequeño' | 'Mediano' | 'Grande';
  image: string;
  status: 'lost' | 'found';
  location: string;
  lastSeen: string; // ISO date
  description: string;
  urgent: boolean;
  reward: boolean;
  contactPhone: string;
  contactEmail: string;
  lat: number;
  lon: number;
}
```

## 🎨 Diseño y Estilo

### Colores de Estados

| Estado | Color | Uso |
|--------|-------|-----|
| Perdido | `#EF4444` (Rojo) | Badge de estado |
| Encontrado | `#3B82F6` (Azul) | Badge de estado |
| Urgente | `#F97316` (Naranja) | Badge de urgencia |
| Recompensa | `#16A34A` (Verde) | Badge de recompensa |

### Componentes UI Utilizados

- **SafeAreaView**: Gestión de áreas seguras
- **FlatList**: Lista optimizada con scroll
- **Image**: Carga de imágenes de mascotas
- **TouchableOpacity**: Botones interactivos
- **RefreshControl**: Pull-to-refresh
- **ActivityIndicator**: Estados de carga
- **Linking**: Abrir teléfono y email

## 🔄 Flujos de Usuario

### 1. Ver Mascotas Perdidas
1. Usuario abre la pestaña "Perdidos"
2. Se cargan las mascotas mock (simula 1s de carga)
3. Se muestra grid de tarjetas con información
4. Usuario puede hacer scroll para ver más

### 2. Ver Detalles de Mascota
1. Cada tarjeta muestra información completa
2. Badges visuales indican estado, urgencia y recompensa
3. Usuario ve ubicación y fecha de avistamiento
4. Descripción detallada disponible

### 3. Contactar
1. Usuario toca botón "Llamar"
2. Se abre marcador telefónico con número
3. O toca "Email"
4. Se abre cliente de email con dirección

### 4. Cambiar Vista
1. Usuario toca tab "Vista de Mapa"
2. Se muestra placeholder con mensaje informativo
3. Puede volver a "Vista de Lista"

### 5. Recargar Datos
1. Usuario hace pull-to-refresh
2. Se recargan los datos mock
3. Lista se actualiza

## 🚫 Funcionalidades NO Implementadas (Pending Backend)

### Próximas Implementaciones

#### 1. Reportar Mascota Encontrada
- Formulario completo con campos:
  - Nombre/descripción
  - Tipo de animal
  - Raza, género, tamaño, color
  - Descripción detallada
  - Foto (obligatoria, máx 5MB)
  - Ubicación (geocoder)
  - Fecha de avistamiento
- Validaciones de campos
- Carga y preview de imagen
- Envío a API

#### 2. Reportar Mascota Propia Como Perdida
- Modal desde "Mis Mascotas"
- Campos:
  - Ubicación donde se perdió
  - Fecha de pérdida
  - Descripción de circunstancias
- Integración con lista de mascotas del usuario

#### 3. Vista de Mapa Interactivo
- Implementación con react-native-maps
- Marcadores personalizados con fotos
- Popups informativos al tocar marcador
- Control de geolocalización
- Ajuste automático de zoom
- Clustering de marcadores

#### 4. Filtros Avanzados
- Por tipo (Perro/Gato)
- Por estado (Perdido/Encontrado)
- Por urgencia
- Por recompensa
- Por ubicación
- Por fecha

#### 5. Búsqueda
- Barra de búsqueda
- Filtrado en tiempo real
- Por nombre, raza, ubicación

## 🔌 Endpoints Necesarios (Cuando Backend Esté Listo)

### 1. Listar Mascotas Perdidas
```
GET /api/perdidos
Response: Array<LostPet>
```

### 2. Reportar Mascota Encontrada
```
POST /api/perdidos/reportar
Body: FormData (con imagen)
Response: { success: boolean, data: LostPet }
```

### 3. Reportar Mascota Propia Como Perdida
```
POST /api/mascotas/:id/reportar-perdida
Body: { location, date, description, lat, lon }
Response: { success: boolean, data: LostPet }
```

### 4. Obtener Detalles de Mascota Perdida
```
GET /api/perdidos/:id
Response: { success: boolean, data: LostPet }
```

## 📝 Datos Mock Actuales

**6 mascotas de ejemplo:**

1. **Max** - Labrador perdido (urgente, con recompensa)
2. **Luna** - Siamés encontrada
3. **Rocky** - Mestizo perdido
4. **Bella** - Golden Retriever perdida (urgente, con recompensa)
5. **Michi** - Persa encontrado
6. **Toby** - Beagle perdido (con recompensa)

Todas con ubicaciones reales de CABA y fotos de Unsplash.

## 🧪 Testing

### Escenarios de Prueba

1. **Carga inicial**: Verificar que se cargan los 6 mascotas mock
2. **Vista de lista**: Comprobar que se muestran todas las tarjetas
3. **Badges**: Verificar colores según estado
4. **Contacto**: Probar botones de llamar y email
5. **Tabs**: Cambiar entre vista de lista y mapa
6. **Refresh**: Pull-to-refresh recarga los datos
7. **Estados vacíos**: Simular lista vacía
8. **Loading**: Verificar indicador de carga

## 🎯 Próximos Pasos

1. ✅ **Fase 1: UI Completa** (ACTUAL)
   - Vista de lista ✅
   - Tarjetas de mascotas ✅
   - Datos mock ✅

2. ⏳ **Fase 2: Formularios** (Pendiente)
   - Formulario de reporte
   - Carga de imágenes
   - Geocoder para ubicaciones
   - Validaciones

3. ⏳ **Fase 3: Mapa Interactivo** (Pendiente)
   - Implementar react-native-maps
   - Marcadores personalizados
   - Popups informativos

4. ⏳ **Fase 4: Integración Backend** (Pendiente)
   - Reemplazar datos mock con API real
   - Implementar endpoints
   - Manejo de errores
   - Optimizaciones

5. ⏳ **Fase 5: Funcionalidades Avanzadas** (Futuro)
   - Filtros y búsqueda
   - Notificaciones
   - Chat integrado
   - Compartir en redes sociales

## 🔗 Referencias

- **Mock Data**: `constants/mockLostPets.ts`
- **Componentes**: `components/perdidos/`
- **Pantalla**: `app/(tabs)/perdidos.tsx`
- **Theme**: `constants/theme.ts`

## ⚠️ Notas Importantes

1. **Datos de Prueba**: Todos los datos son simulados y se reinician en cada carga
2. **Sin Backend**: No hay comunicación real con servidor
3. **Imágenes Externas**: Se usan URLs de Unsplash (requieren internet)
4. **Botones Placeholder**: "Reportar Mascota" muestra alerta de "próximamente"
5. **Mapa Pendiente**: Vista de mapa es solo placeholder visual

---

**Última actualización**: Noviembre 15, 2025  
**Versión**: 1.0.0 (UI Only)  
**Estado**: ✅ UI Completa - ⏳ Backend Pendiente  
**Autor**: Equipo DalePata Mobile

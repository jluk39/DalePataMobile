# ✅ Integración Backend - Sección Perdidos

## 📋 Resumen de Cambios

Se realizó la integración completa con el backend para la sección de mascotas perdidas, eliminando mock data y conectando con los endpoints reales.

---

## 🔄 Archivos Modificados

### 1. **`types/lostPets.ts`** (NUEVO)
✅ Creada interfaz `LostPet` correcta según backend
❌ Eliminados campos inexistentes: `status`, `urgent`, `reward`

```typescript
export interface LostPet {
  id: string;
  name: string;
  breed: string;
  age: string;
  gender: string;
  color: string;
  size: string;
  image: string;
  location: string;
  lat: number;
  lon: number;
  lastSeen: string;
  description: string;
  contactPhone: string;
  contactEmail: string;
  especie?: string;
}
```

---

### 2. **`services/api-service.ts`**
✅ Agregados 5 métodos nuevos para mascotas perdidas:

#### **fetchLostPets()**
- **Endpoint**: `GET /api/mascotas/perdidas`
- **Descripción**: Lista todas las mascotas perdidas
- **Autenticación**: Bearer Token requerido
- **Mapeo**: Convierte datos del backend al formato del frontend

#### **reportPetAsLost(petId, data)**
- **Endpoint**: `POST /api/mascotas/{petId}/reportar-perdida`
- **Descripción**: Reportar mascota propia como perdida
- **Body**: 
  ```json
  {
    "perdida_direccion": string,
    "perdida_lat": number,
    "perdida_lon": number,
    "perdida_fecha": string (ISO),
    "descripcion": string
  }
  ```

#### **markPetAsFound(petId, comentario)**
- **Endpoint**: `PUT /api/mascotas/{petId}/marcar-encontrada`
- **Descripción**: Marcar mascota como encontrada
- **Body**: `{ "comentario": string }`

#### **reportLostPetSighting(formData)**
- **Endpoint**: `POST /api/mascotas/reporte-avistamiento`
- **Descripción**: Reportar avistamiento de mascota ajena
- **Body**: FormData con imagen y datos

#### **deleteLostPetReport(petId)**
- **Endpoint**: `DELETE /api/mascotas/reporte-avistamiento/{petId}`
- **Descripción**: Eliminar reporte de avistamiento
- **Restricción**: Solo reportes creados por el usuario

---

### 3. **`app/(tabs)/perdidos.tsx`**
✅ **Cambios principales**:
- ❌ Eliminado import de `mockLostPets`
- ✅ Agregado import de `ApiService`
- ✅ Actualizado `loadLostPets()` para usar `ApiService.fetchLostPets()`
- ✅ Mejorados logs y manejo de errores

```typescript
const loadLostPets = useCallback(async () => {
  try {
    console.log('📤 Cargando mascotas perdidas...');
    const data = await ApiService.fetchLostPets();
    console.log('✅ Mascotas perdidas cargadas:', data.length);
    setLostPets(data);
  } catch (error: any) {
    console.error('❌ Error loading lost pets:', error);
    Alert.alert('Error', error.message || 'No se pudieron cargar las mascotas perdidas');
  } finally {
    setLoading(false);
    setRefreshing(false);
  }
}, []);
```

---

### 4. **`components/perdidos/LostFoundCard.tsx`**
✅ **Eliminaciones**:
- ❌ Función `getStatusConfig()` (ya no hay status dinámico)
- ❌ Badge "Urgente" (campo `urgent` no existe)
- ❌ Badge y sección "Recompensa" (campo `reward` no existe)
- ❌ Lógica condicional de `status === 'lost'`

✅ **Simplificaciones**:
- Badge de estado siempre muestra "Perdido" en rojo
- Texto siempre dice "Perdido el [fecha]"
- Estilos `urgentBadge`, `rewardBadge`, `rewardSection`, `rewardText` eliminados

**Antes**:
```tsx
{pet.status === 'lost' ? 'Perdido el' : 'Encontrado el'} {formatDate(pet.lastSeen)}
```

**Después**:
```tsx
Perdido el {formatDate(pet.lastSeen)}
```

---

### 5. **`components/perdidos/MapaPerdidos.tsx`**
✅ **Simplificación de marcadores**:

**Antes**:
```tsx
borderColor: mascota.status === 'lost' ? theme.colors.destructive : '#3B82F6'
```

**Después**:
```tsx
borderColor: theme.colors.destructive // ✅ Siempre rojo (perdidas)
```

---

### 6. **`constants/mockLostPets.ts`**
❌ **ELIMINADO** - Ya no se usan mocks, todo viene del backend

---

## 🔌 Endpoints del Backend

### **GET /api/mascotas/perdidas**
Respuesta:
```json
{
  "success": true,
  "data": [
    {
      "id": 15,
      "nombre": "Luna",
      "genero": "Hembra",
      "edad": "3 años",
      "imagen": "https://...",
      "color": "Marrón claro",
      "tamaño": "Mediano",
      "descripcion": "...",
      "especie": "Perro",
      "raza": "Labrador",
      "perdida_fecha": "2025-11-15T14:30:00Z",
      "perdida_direccion": "Parque Centenario, CABA",
      "perdida_lat": -34.6037,
      "perdida_lon": -58.3816,
      "reportado_por": {
        "id": 123,
        "nombre": "Juan Pérez",
        "telefono": "+54 11 1234-5678",
        "email": "juan@example.com"
      },
      "duenio": {
        "id": 123,
        "nombre": "Juan Pérez",
        "telefono": "+54 11 1234-5678"
      }
    }
  ],
  "total": 1
}
```

---

## 🎯 Lógica de Contacto

```typescript
// Priorizar dueño si existe, sino quien reportó
contactPhone: pet.duenio?.telefono || pet.reportado_por?.telefono || 'No disponible'
contactEmail: pet.duenio?.email || pet.reportado_por?.email || 'No disponible'
```

---

## 📱 Próximos Pasos

### 1. **Formulario de Reportar Avistamiento**
Crear `ReportFoundPetForm.tsx` con:
- Campos: nombre, especie, raza, género, color, tamaño, descripción
- Imagen (requerida, máx 5MB)
- Ubicación con geocoder (MapboxGeocoderInput)
- Fecha de avistamiento
- Validaciones

### 2. **Modal de Reportar Mascota Propia**
Crear `ReportLostModal.tsx` para usar desde "Mis Mascotas":
- Ubicación de pérdida (geocoder)
- Fecha de pérdida
- Descripción adicional
- Checkbox de consentimiento de datos
- Llamar a `ApiService.reportPetAsLost()`

### 3. **Acciones Adicionales**
- Botón "Marcar como Encontrada" en cards del dueño
- Botón "Eliminar Reporte" para avistamientos propios
- Filtros: especie, ubicación, fecha

---

## ✅ Testing

### Verificar:
1. ✅ Lista de mascotas perdidas se carga desde backend
2. ✅ Mapa muestra marcadores rojos en coordenadas correctas
3. ✅ Cards muestran toda la información correctamente
4. ✅ Botones de contacto (llamar/email) funcionan
5. ✅ Pull-to-refresh recarga los datos
6. ✅ Loading state mientras carga
7. ✅ Empty state si no hay mascotas

### Probar en device con development build:
```bash
# Ya ejecutaste:
npx expo prebuild
eas build --profile development --platform android

# Ahora ejecuta:
npx expo start --dev-client
```

---

## 🚀 Comandos Útiles

```bash
# Ver logs del servidor
npx expo start --dev-client

# Recompilar si cambias plugins
npx expo prebuild --clean

# Nueva build en EAS
eas build --profile development --platform android
```

---

## 📝 Notas Importantes

1. **Mapbox solo funciona en development build**, no en Expo Go
2. **Todos los datos vienen del backend**, no hay mocks
3. **Los campos `urgent`, `reward`, `status` NO EXISTEN** en el backend
4. **Contacto**: Se prioriza dueño sobre reportante
5. **Token requerido**: Todas las llamadas necesitan autenticación

---

## 🐛 Errores Conocidos

- ✅ Mapbox error en Expo Go: **Normal** - requiere development build
- ✅ Token expirado (403): AuthContext redirige automáticamente a login

---

¡Integración completada! 🎉

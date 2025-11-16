# Configuración de Mapbox para React Native

## ✅ Implementación con Mapbox GL Native

Se ha integrado **@rnmapbox/maps** (Mapbox GL Native) con la sección de Perdidos para mostrar un mapa interactivo con las ubicaciones de las mascotas.

## 📦 Dependencias Instaladas

```bash
npm install @rnmapbox/maps
```

## 🔧 Configuración

### 1. Variables de Entorno

**Archivo: `.env`**

```properties
# Mapbox Access Token
EXPO_PUBLIC_MAPBOX_TOKEN=pk.eyJ1Ijoiamx1azM5IiwiYSI6ImNtaG80dTFwYjA3bzIya3EzMTgyNHY1M3oifQ.Wl24Ug4fRQiK5yblohFVcg
```

### 2. Configuración en app.json

**Archivo: `app.json`**

```json
{
  "expo": {
    "plugins": [
      "@rnmapbox/maps",
      {
        "RNMapboxMapsDownloadToken": "pk.eyJ1Ijoiamx1azM5IiwiYSI6ImNtaG80dTFwYjA3bzIya3EzMTgyNHY1M3oifQ.Wl24Ug4fRQiK5yblohFVcg"
      }
    ],
    "android": {
      "permissions": [
        "ACCESS_FINE_LOCATION",
        "ACCESS_COARSE_LOCATION"
      ]
    },
    "ios": {
      "infoPlist": {
        "NSLocationWhenInUseUsageDescription": "Esta aplicación necesita acceder a tu ubicación para mostrar mascotas perdidas cercanas en el mapa."
      }
    }
  }
}
```

### 3. Prebuild (IMPORTANTE)

Después de instalar @rnmapbox/maps, debes ejecutar:

```bash
npx expo prebuild --clean
```

Este comando:
- Genera los archivos nativos necesarios
- Configura Mapbox en Android e iOS
- Descarga los recursos de Mapbox

### 4. Ejecutar la App

**Android:**
```bash
npx expo run:android
```

**iOS:**
```bash
npx expo run:ios
```

**⚠️ Nota:** El mapa **NO funcionará** en Expo Go. Debes usar desarrollo client o compilar la app.

## 📱 Componente Creado

### **`components/perdidos/MapaPerdidos.tsx`**

Mapa interactivo con Mapbox que muestra:

✅ **Mapa Base de Mapbox**
- Estilo: Street (calles)
- Brújula habilitada
- Escala habilitada
- Sin logo de Mapbox (mejor UX)

✅ **Marcadores Personalizados**
- Imagen circular de la mascota (40x40px)
- Borde de color según estado:
  - 🔴 Rojo = Perdido
  - 🔵 Azul = Encontrado
- Pin pointer apuntando hacia abajo

✅ **Cámara Inicial**
- Centro: Buenos Aires (-58.3816, -34.6037)
- Zoom: 11
- Animación suave (flyTo)

✅ **Leyenda**
- Esquina superior derecha
- Muestra colores de estados
- Nota de uso

## 🎯 Funcionalidades

### Marcadores Interactivos
- Cada mascota tiene su marcador con foto
- Colores distintivos por estado
- Ubicación exacta en el mapa

### Navegación del Mapa
- Zoom con gestos de pinza
- Desplazamiento arrastrando
- Rotación con dos dedos
- Brújula para orientación

### Estados
- Error si no hay token configurado
- Estado vacío si no hay mascotas
- Loading automático al cargar mapa

## 🎨 Personalización

### Estilos de Mapa Disponibles

Puedes cambiar el estilo del mapa en el código:

```typescript
<MapboxMapView
  styleURL={Mapbox.StyleURL.Street}  // ← Cambiar aquí
  // Opciones:
  // Mapbox.StyleURL.Street - Calles (default)
  // Mapbox.StyleURL.Outdoors - Exterior
  // Mapbox.StyleURL.Light - Claro
  // Mapbox.StyleURL.Dark - Oscuro
  // Mapbox.StyleURL.Satellite - Satélite
  // Mapbox.StyleURL.SatelliteStreet - Satélite con calles
/>
```

### Colores de Marcadores

```typescript
const getMarkerColor = (status: 'lost' | 'found') => {
  return status === 'lost' ? '#EF4444' : '#3B82F6';
};
```

### Centro y Zoom Inicial

```typescript
const initialCenter = [-58.3816, -34.6037]; // [lon, lat]

<Camera
  zoomLevel={11}  // ← Ajustar zoom (0-22)
  centerCoordinate={initialCenter}
/>
```

## 🐛 Troubleshooting

### Error: "Cannot find module '@rnmapbox/maps'"

**Solución:**
```bash
npm install @rnmapbox/maps
npx expo prebuild --clean
```

### El mapa no se muestra (pantalla en blanco)

**Solución:**
1. Verifica que `EXPO_PUBLIC_MAPBOX_TOKEN` esté en `.env`
2. Ejecuta `npx expo prebuild --clean`
3. Reconstruye la app: `npx expo run:android` o `npx expo run:ios`
4. **NO uses Expo Go** - requiere desarrollo client

### Error: "Mapbox token not set"

**Solución:**
1. Verifica el `.env`:
   ```
   EXPO_PUBLIC_MAPBOX_TOKEN=tu_token_aqui
   ```
2. Reinicia el servidor: `npx expo start --clear`

### Los marcadores no aparecen

**Solución:**
1. Verifica que las mascotas tengan `lat` y `lon` válidos
2. Comprueba que las URLs de imágenes funcionen
3. Revisa la consola para errores

### "This app is not authorized to use Mapbox"

**Solución:**
1. Verifica que tu token de Mapbox sea válido
2. Asegúrate de que el token tenga permisos para uso en mobile
3. Verifica que `RNMapboxMapsDownloadToken` en `app.json` sea correcto

## 📊 Coordenadas de Prueba (Mock Data)

| Mascota | Ubicación | Lat | Lon |
|---------|-----------|-----|-----|
| Max | Parque Centenario | -34.6097 | -58.4370 |
| Luna | Plaza Serrano | -34.5891 | -58.4373 |
| Rocky | Av. Corrientes y Callao | -34.6041 | -58.3924 |
| Bella | Bosques de Palermo | -34.5755 | -58.4115 |
| Michi | Villa Crespo | -34.5992 | -58.4377 |
| Toby | Recoleta | -34.5875 | -58.3974 |

## 🚀 Próximas Mejoras

- [ ] Callouts/Popups al tocar marcadores
- [ ] Clustering de marcadores cercanos
- [ ] Animaciones al agregar marcadores
- [ ] Filtrar marcadores por estado
- [ ] Ajustar bounds automáticamente
- [ ] Botón de ubicación actual
- [ ] Ruta desde ubicación del usuario

## 📱 Comandos Útiles

```bash
# Limpiar y reconstruir
npx expo prebuild --clean

# Ejecutar en Android
npx expo run:android

# Ejecutar en iOS
npx expo run:ios

# Limpiar caché
npx expo start --clear

# Ver logs
npx react-native log-android
npx react-native log-ios
```

## 🔗 Referencias

- [Mapbox GL Native Documentation](https://github.com/rnmapbox/maps)
- [Mapbox Studio](https://studio.mapbox.com/) - Para crear estilos custom
- [Mapbox Account](https://account.mapbox.com/) - Gestionar tokens

---

**Última actualización**: Noviembre 15, 2025  
**Versión**: 2.0.0 (Mapbox GL Native)  
**Estado**: ✅ Implementado con Mapbox

1. **Ve a Google Cloud Console:**
   - https://console.cloud.google.com/

2. **Crea un proyecto o selecciona uno existente**

3. **Habilita la API de Maps SDK for Android:**
   - Ve a "APIs y servicios" > "Biblioteca"
   - Busca "Maps SDK for Android"
   - Haz clic en "Habilitar"

4. **Crea credenciales:**
   - Ve a "APIs y servicios" > "Credenciales"
   - Clic en "Crear credenciales" > "Clave de API"
   - Copia la clave generada

5. **Agrega la clave a `app.json`:**
   ```json
   "android": {
     "config": {
       "googleMaps": {
         "apiKey": "TU_API_KEY_AQUI"
       }
     }
   }
   ```

6. **Reconstruye la app:**
   ```bash
   npx expo prebuild --clean
   npx expo run:android
   ```

### 4. iOS

Para iOS, Apple Maps funciona automáticamente sin necesidad de API Key.

## 📱 Componente Creado

### **`components/perdidos/MapaPerdidos.tsx`**

Mapa interactivo que muestra:

✅ **Marcadores Personalizados**
- Imagen circular de la mascota
- Borde de color según estado (rojo = perdido, azul = encontrado)
- Tamaño: 40x40px

✅ **Popups Informativos (Callouts)**
Al tocar un marcador se muestra:
- Imagen de la mascota
- Nombre
- Tipo y raza
- Ubicación
- Descripción (truncada a 2 líneas)
- Teléfono de contacto

✅ **Controles del Mapa**
- Botón de ubicación actual
- Brújula
- Escala
- Zoom

✅ **Ajuste Automático**
- El mapa se ajusta automáticamente para mostrar todos los marcadores
- Padding de 50px en todos los lados

✅ **Leyenda**
- Esquina superior derecha
- Muestra colores de estados (Perdido/Encontrado)

## 🎯 Funcionalidades

### Vista de Lista
- Grid de tarjetas con información detallada
- Pull-to-refresh
- Botones de contacto (llamar/email)

### Vista de Mapa
- Mapa interactivo con ubicaciones reales
- Marcadores personalizados con foto
- Popups informativos al tocar
- Ubicación del usuario
- Zoom automático para ver todos los marcadores

## 🔄 Flujo de Usuario

1. Usuario abre "Perdidos"
2. Por defecto ve la "Vista de Lista"
3. Cambia a "Vista de Mapa"
4. Mapa se carga con marcadores de mascotas
5. Usuario puede:
   - Hacer zoom in/out
   - Desplazar el mapa
   - Tocar un marcador para ver detalles
   - Ver su ubicación actual
   - Los marcadores se ajustan automáticamente

## 🎨 Personalización

### Colores de Marcadores

```typescript
const getMarkerColor = (status: 'lost' | 'found') => {
  return status === 'lost' ? '#EF4444' : '#3B82F6';
};
```

- **Perdido**: `#EF4444` (Rojo)
- **Encontrado**: `#3B82F6` (Azul)

### Región Inicial

Centrado en Buenos Aires, Argentina:

```typescript
const initialRegion = {
  latitude: -34.6037,
  longitude: -58.3816,
  latitudeDelta: 0.15,
  longitudeDelta: 0.15,
};
```

## 🐛 Troubleshooting

### El mapa no se muestra en Android

**Solución:**
1. Asegúrate de tener una API Key de Google Maps válida
2. Verifica que esté configurada en `app.json`
3. Reconstruye la app: `npx expo prebuild --clean`

### El mapa está en blanco

**Solución:**
1. Verifica los permisos de ubicación
2. Asegúrate de que las mascotas tengan coordenadas válidas
3. Revisa la consola para errores

### Los marcadores no se ven

**Solución:**
1. Verifica que las mascotas tengan `lat` y `lon` válidos
2. Comprueba que las URLs de las imágenes funcionen
3. Aumenta el `latitudeDelta` y `longitudeDelta` para ampliar la vista

### "Property 'fitToCoordinates' does not exist"

**Solución:**
- Asegúrate de que `react-native-maps` esté instalado correctamente
- Verifica que el tipo de `MapView` sea correcto

## 📊 Datos de Prueba

Los datos mock incluyen coordenadas reales de CABA:

| Mascota | Ubicación | Lat | Lon |
|---------|-----------|-----|-----|
| Max | Parque Centenario | -34.6097 | -58.4370 |
| Luna | Plaza Serrano | -34.5891 | -58.4373 |
| Rocky | Av. Corrientes y Callao | -34.6041 | -58.3924 |
| Bella | Bosques de Palermo | -34.5755 | -58.4115 |
| Michi | Villa Crespo | -34.5992 | -58.4377 |
| Toby | Recoleta | -34.5875 | -58.3974 |

## 🚀 Próximas Mejoras

- [ ] Clustering de marcadores cuando hay muchos cercanos
- [ ] Filtrar marcadores en el mapa por estado
- [ ] Abrir ruta en Google Maps/Waze al tocar "Cómo llegar"
- [ ] Mostrar radio de búsqueda alrededor del usuario
- [ ] Animaciones al agregar/remover marcadores
- [ ] Dark mode para el mapa

## 🔗 Referencias

- [react-native-maps Documentation](https://github.com/react-native-maps/react-native-maps)
- [Google Maps Platform](https://developers.google.com/maps)
- [Expo Location](https://docs.expo.dev/versions/latest/sdk/location/)

---

**Última actualización**: Noviembre 15, 2025  
**Versión**: 1.0.0  
**Estado**: ✅ Implementado y Funcional

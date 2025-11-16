# Integración de Mapbox en DalePata Mobile

## ✅ Configuración Completada

Se ha integrado **Mapbox GL Native** en la sección de Perdidos para mostrar mascotas en un mapa interactivo.

## 📦 Paquete Instalado

```bash
npm install @rnmapbox/maps
```

## 🔑 Configuración de Token

### 1. Variables de Entorno (`.env`)

```properties
# Token público de Mapbox (para el mapa)
EXPO_PUBLIC_MAPBOX_TOKEN=pk.eyJ1Ijoiamx1azM5IiwiYSI6ImNtaG80dTFwYjA3bzIya3EzMTgyNHY1M3oifQ.Wl24Ug4fRQiK5yblohFVcg
```

**⚠️ Importante:** Debe ser `EXPO_PUBLIC_MAPBOX_TOKEN` (no `NEXT_PUBLIC_MAPBOX_TOKEN`)

### 2. Configuración del Plugin (`app.json`)

Se agregó el plugin de Mapbox:

```json
{
  "plugins": [
    [
      "@rnmapbox/maps",
      {
        "RNMapboxMapsDownloadToken": "sk.eyJ1Ijoiamx1azM5IiwiYSI6ImNtaG80dms1aTBidzUya3NlaWI2dDdyNnEifQ.c9OXGj4EHAaVCOkRRnSlEw",
        "RNMapboxMapsImpl": "mapbox"
      }
    ]
  ]
}
```

### 3. Permisos de Ubicación

#### Android (`app.json`)
```json
"android": {
  "permissions": [
    "ACCESS_FINE_LOCATION",
    "ACCESS_COARSE_LOCATION"
  ]
}
```

#### iOS (`app.json`)
```json
"ios": {
  "infoPlist": {
    "NSLocationWhenInUseUsageDescription": "Esta aplicación necesita acceder a tu ubicación para mostrar mascotas perdidas cercanas en el mapa.",
    "NSLocationAlwaysUsageDescription": "Esta aplicación necesita acceder a tu ubicación para mostrar mascotas perdidas cercanas en el mapa."
  }
}
```

## 📂 Archivos Creados/Modificados

### Nuevos Archivos

1. **`components/perdidos/MapaPerdidos.tsx`**
   - Componente de mapa interactivo con Mapbox
   - Marcadores personalizados con fotos de mascotas
   - Control de ubicación del usuario
   - Ajuste automático de bounds
   - Contador de mascotas

### Archivos Modificados

2. **`app/(tabs)/perdidos.tsx`**
   - Integración del componente MapaPerdidos
   - Cambio de placeholder a mapa funcional

3. **`.env`**
   - Token de Mapbox actualizado: `EXPO_PUBLIC_MAPBOX_TOKEN`

4. **`app.json`**
   - Plugin de @rnmapbox/maps configurado
   - Permisos de ubicación agregados (Android/iOS)
   - Bundle identifiers agregados

## 🗺️ Características del Mapa

### ✅ Implementado

- **Mapa Base**: Estilo Street de Mapbox
- **Marcadores Personalizados**:
  - Imagen circular de la mascota
  - Borde rojo para perdidas (#EF4444)
  - Borde azul para encontradas (#3B82F6)
  - Tamaño: 40x40px
  - Sombra y elevación
- **Controles**:
  - Zoom in/out
  - Brújula (esquina superior derecha)
  - Ubicación del usuario (botón de geolocalización)
- **Auto-ajuste**: El mapa se ajusta automáticamente para mostrar todos los marcadores
- **Contador**: Badge en esquina superior izquierda con número de mascotas
- **Estados**:
  - Loading mientras carga el mapa
  - Error si no hay token configurado
  - Empty si no hay mascotas con coordenadas

### 📍 Coordenadas

- **Centro inicial**: Buenos Aires, Argentina `[-58.3816, -34.6037]`
- **Zoom inicial**: 12
- **Padding**: 50px alrededor de los bounds

## 🎨 Diseño

### Marcadores

```typescript
{
  width: 40px,
  height: 40px,
  borderRadius: 20px (circular),
  borderWidth: 3px,
  borderColor: mascota.status === 'lost' ? '#EF4444' : '#3B82F6',
  backgroundColor: '#FFF',
  shadowColor: '#000',
  shadowOpacity: 0.3,
  elevation: 5
}
```

### Contador de Mascotas

```typescript
{
  position: 'absolute',
  top: 16,
  left: 16,
  backgroundColor: theme.colors.card,
  borderRadius: theme.borderRadius.md,
  padding: 8-12px,
  shadow: true
}
```

## 🔄 Flujo de Usuario

1. Usuario abre "Perdidos"
2. Cambia a tab "Vista de Mapa"
3. Mapa se carga con spinner
4. Se muestran 6 marcadores en ubicaciones de CABA
5. Mapa se ajusta automáticamente para mostrar todos
6. Usuario puede:
   - Hacer zoom in/out
   - Desplazarse por el mapa
   - Tocar botón de ubicación para centrarse
   - Ver contador de mascotas

## 🚀 Comandos Necesarios

### Desarrollo

```bash
# Limpiar cache y reiniciar (RECOMENDADO después de instalar Mapbox)
npx expo start -c

# Android
npx expo run:android

# iOS
npx expo run:ios
```

### Build

```bash
# Android
eas build --platform android --profile preview

# iOS
eas build --platform ios --profile preview
```

## ⚠️ Troubleshooting

### Problema: "Token no configurado"

**Solución:**
1. Verificar que `.env` tenga `EXPO_PUBLIC_MAPBOX_TOKEN`
2. Reiniciar servidor: `npx expo start -c`
3. Verificar que el token sea el público (empieza con `pk.`)

### Problema: Mapa no carga

**Solución:**
1. Limpiar cache: `npx expo start -c`
2. Verificar permisos de ubicación en el dispositivo
3. Verificar conexión a internet
4. Revisar logs en consola

### Problema: Marcadores no aparecen

**Solución:**
1. Verificar que las mascotas tengan `lat` y `lon`
2. Revisar console.log para errores
3. Verificar formato de coordenadas: `[lon, lat]` (Mapbox usa longitud primero)

### Problema: Error en build

**Solución:**
1. Verificar que `app.json` tenga el plugin configurado
2. Ejecutar `npx expo prebuild --clean`
3. Reinstalar dependencias: `rm -rf node_modules && npm install`

## 📱 Compatibilidad

- ✅ Android (API 21+)
- ✅ iOS (iOS 12+)
- ✅ Expo Go (con limitaciones)
- ✅ EAS Build
- ✅ Development Build (Recomendado)

## 🔗 Tokens de Mapbox

### Token Público (Mapa)
```
pk.eyJ1Ijoiamx1azM5IiwiYSI6ImNtaG80dTFwYjA3bzIya3EzMTgyNHY1M3oifQ.Wl24Ug4fRQiK5yblohFVcg
```
- **Uso**: Cliente (renderizar mapa)
- **Variable**: `EXPO_PUBLIC_MAPBOX_TOKEN`

### Token de Descarga (Build)
```
sk.eyJ1Ijoiamx1azM5IiwiYSI6ImNtaG80dms1aTBidzUya3NlaWI2dDdyNnEifQ.c9OXGj4EHAaVCOkRRnSlEw
```
- **Uso**: Descargar SDK durante build
- **Ubicación**: `app.json` → plugins

## 📚 Referencias

- **Documentación**: https://github.com/rnmapbox/maps
- **Ejemplos**: https://github.com/rnmapbox/maps/tree/main/example
- **Mapbox Studio**: https://studio.mapbox.com/
- **Account**: https://account.mapbox.com/

## 🎯 Próximas Mejoras

- [ ] Click en marcador para mostrar popup con info
- [ ] Animación de marcadores al cargar
- [ ] Clustering de marcadores cercanos
- [ ] Filtros en el mapa
- [ ] Ruta desde ubicación actual a mascota
- [ ] Compartir ubicación de mascota

---

**Fecha**: Noviembre 15, 2025  
**Versión**: 1.0.0  
**Estado**: ✅ Integración Completa  
**Tecnología**: @rnmapbox/maps v10.1.30

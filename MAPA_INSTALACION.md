# 🗺️ Instalación del Mapa para la Sección de Perdidos

## 📦 Instalación de Dependencias

Para usar el mapa en React Native con Expo, necesitas instalar `react-native-maps`:

### Paso 1: Instalar la librería

```bash
npx expo install react-native-maps
```

### Paso 2: Configuración para Android

Agrega esto en tu `app.json` si aún no está:

```json
{
  "expo": {
    "android": {
      "config": {
        "googleMaps": {
          "apiKey": "TU_API_KEY_DE_GOOGLE_MAPS"
        }
      }
    }
  }
}
```

**Nota**: Para Android necesitas una API Key de Google Maps. Puedes obtenerla en:
https://console.cloud.google.com/google/maps-apis

### Paso 3: Configuración para iOS

En iOS, los mapas funcionan out-of-the-box usando Apple Maps, pero si quieres usar Google Maps:

```json
{
  "expo": {
    "ios": {
      "config": {
        "googleMapsApiKey": "TU_API_KEY_DE_GOOGLE_MAPS"
      }
    }
  }
}
```

## 🔑 Variables de Entorno

Ya agregamos la variable de Mapbox en tu `.env`:

```properties
# Mapbox Configuration (para mobile - Expo)
EXPO_PUBLIC_MAPBOX_TOKEN=pk.eyJ1Ijoiamx1azM5IiwiYSI6ImNtaG80dTFwYjA3bzIya3EzMTgyNHY1M3oifQ.Wl24Ug4fRQiK5yblohFVcg
```

**Nota**: Aunque tenemos el token de Mapbox, en React Native es más común usar `react-native-maps` que utiliza Google Maps (Android) y Apple Maps (iOS) nativamente.

## 🚀 Ejecutar la Aplicación

Después de instalar las dependencias:

### Para desarrollo:

```bash
# Reiniciar el servidor de desarrollo
npm run android
# o
npm run ios
```

### Si usas Expo Go:

```bash
npx expo start --clear
```

**⚠️ IMPORTANTE**: Si usas Expo Go, los mapas tienen limitaciones. Para una experiencia completa, es mejor usar un **development build**:

```bash
# Crear un development build
npx expo run:android
# o
npx expo run:ios
```

## 🎯 Características del Mapa Implementadas

✅ **Vista de Mapa Interactivo**
- Centrado en Buenos Aires, Argentina
- Muestra todas las mascotas perdidas/encontradas
- Marcadores personalizados con fotos
- Auto-ajuste para mostrar todos los marcadores

✅ **Marcadores Personalizados**
- Imagen circular de la mascota
- Borde rojo para "Perdido"
- Borde azul para "Encontrado"

✅ **Callouts (Popups)**
- Se abren al tocar un marcador
- Muestran:
  - Foto de la mascota
  - Nombre, tipo, raza
  - Ubicación
  - Fecha de avistamiento
  - Descripción
  - Teléfono de contacto
  - Badge de estado

✅ **Controles**
- Botón de ubicación del usuario
- Zoom y navegación
- Brújula

✅ **Leyenda**
- Indicadores visuales de estado
- Rojo = Perdido
- Azul = Encontrado

## 🔧 Solución de Problemas

### Error: "Unable to resolve module 'react-native-maps'"

**Solución**: Ejecuta:
```bash
npx expo install react-native-maps
npm run android --clear
```

### El mapa no se muestra

**Causa 1**: No tienes API Key de Google Maps (Android)
**Solución**: 
1. Ve a https://console.cloud.google.com/
2. Crea un proyecto
3. Habilita "Maps SDK for Android"
4. Crea una API Key
5. Agrégala en `app.json`

**Causa 2**: Usando Expo Go
**Solución**: Crea un development build con `npx expo run:android`

### Marcadores no se muestran

**Causa**: Las coordenadas son inválidas
**Solución**: Verifica que los datos mock tengan `lat` y `lon` válidos

## 📱 Testing

### Probar en Android:

```bash
npm run android
```

Deberías ver:
1. Vista de mapa centrada en Buenos Aires
2. 6 marcadores con fotos de mascotas
3. Al tocar un marcador, se abre un popup con info
4. Leyenda en la esquina inferior derecha

### Probar en iOS:

```bash
npm run ios
```

El mapa usará Apple Maps por defecto (no requiere configuración).

## 🎨 Personalización

El componente está en: `components/perdidos/MapaPerdidos.tsx`

Puedes personalizar:
- **Región inicial**: Cambia `initialRegion`
- **Estilos de marcadores**: Modifica `styles.markerImage`
- **Contenido del callout**: Edita el contenido dentro de `<Callout>`
- **Colores**: Ajusta según el theme

## 📚 Documentación Adicional

- **react-native-maps**: https://github.com/react-native-maps/react-native-maps
- **Expo Maps**: https://docs.expo.dev/versions/latest/sdk/map-view/
- **Google Maps Platform**: https://console.cloud.google.com/

## ✅ Checklist de Verificación

- [ ] `react-native-maps` instalado
- [ ] Variable `EXPO_PUBLIC_MAPBOX_TOKEN` en `.env` (opcional)
- [ ] API Key de Google Maps en `app.json` (Android)
- [ ] App reiniciada después de instalar
- [ ] Development build creado (si no usas Expo Go)
- [ ] Permisos de ubicación otorgados
- [ ] Internet conectado (para cargar tiles del mapa)

---

**Última actualización**: Noviembre 15, 2025  
**Versión**: 1.0.0  
**Estado**: ✅ Componente Creado - ⏳ Instalación Pendiente

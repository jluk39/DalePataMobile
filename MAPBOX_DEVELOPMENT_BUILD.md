# 🗺️ Habilitar Mapbox con Development Build

## ❌ Problema Actual

Mapbox (`@rnmapbox/maps`) requiere **código nativo** que no está disponible en **Expo Go**.

**Error que verás en Expo Go:**
```
@rnmapbox/maps native code not available. Make sure you have linked the library and rebuild your app.
```

## ✅ Solución: Development Build

Hay **3 opciones** para usar Mapbox:

---

## Opción 1: EAS Build (Nube) ☁️ - **RECOMENDADA**

### Ventajas
- ✅ No necesitas configurar Android Studio ni Java
- ✅ Compila en servidores de Expo
- ✅ Más fácil y rápido

### Pasos

#### 1. Crear cuenta en Expo
Ve a https://expo.dev/signup y crea una cuenta gratuita.

#### 2. Login desde la terminal
```powershell
eas login
```

Ingresa tu email y contraseña de Expo.

#### 3. Configurar EAS Build
```powershell
eas build:configure
```

Esto creará un archivo `eas.json` con los perfiles de build.

#### 4. Compilar la app
Para Android:
```powershell
eas build --profile development --platform android
```

Para iOS (requiere cuenta de Apple Developer):
```powershell
eas build --profile development --platform ios
```

#### 5. Instalar la app
- EAS te dará un link para descargar el APK (Android) o IPA (iOS)
- Descarga e instala en tu dispositivo
- Escanea el QR que aparece en tu terminal cuando ejecutes `npx expo start --dev-client`

---

## Opción 2: Build Local 🖥️

### Requisitos Previos

#### Para Android
1. **Instalar Java JDK 17**
   - Descarga: https://adoptium.net/
   - Agrega `JAVA_HOME` al PATH:
     ```powershell
     [System.Environment]::SetEnvironmentVariable('JAVA_HOME', 'C:\Program Files\Eclipse Adoptium\jdk-17.0.x-hotspot', 'Machine')
     ```

2. **Instalar Android Studio**
   - Descarga: https://developer.android.com/studio
   - Durante la instalación, instala:
     - Android SDK
     - Android SDK Platform
     - Android Virtual Device (AVD)
   - Agrega al PATH:
     ```powershell
     [System.Environment]::SetEnvironmentVariable('ANDROID_HOME', "$env:LOCALAPPDATA\Android\Sdk", 'User')
     ```

#### Para iOS (solo en macOS)
1. Instala Xcode desde la App Store
2. Instala las herramientas de línea de comandos:
   ```bash
   xcode-select --install
   ```

### Compilar Localmente

Ya ejecutamos el prebuild, ahora solo necesitas:

#### Android
```powershell
npx expo run:android
```

Esto:
1. Compila la app con Gradle
2. Genera el APK
3. Lo instala automáticamente en tu dispositivo/emulador conectado

#### iOS (macOS)
```bash
npx expo run:ios
```

---

## Opción 3: Usar Emulador Android (Android Studio)

Si instalaste Android Studio:

1. Abre Android Studio
2. Ve a **Tools > Device Manager**
3. Crea un nuevo Virtual Device (AVD)
4. Inicia el emulador
5. En tu proyecto, ejecuta:
   ```powershell
   npx expo run:android
   ```

La app se instalará automáticamente en el emulador.

---

## 🔄 Habilitar el Mapa en el Código

Una vez que tengas el **development build** instalado:

### 1. Abre `app/(tabs)/perdidos.tsx`

### 2. Cambia esta línea:
```typescript
const MAP_AVAILABLE = false;
```

Por:
```typescript
const MAP_AVAILABLE = true;
```

### 3. Descomenta el import:
```typescript
// Cambia esto:
// import MapaPerdidos from '@/components/perdidos/MapaPerdidos';

// Por esto:
import MapaPerdidos from '@/components/perdidos/MapaPerdidos';
```

### 4. Actualiza la función `renderMapView`:
```typescript
const renderMapView = () => (
  <View style={styles.mapContainer}>
    <MapaPerdidos mascotas={lostPets} />
  </View>
);
```

### 5. Reinicia el servidor
```powershell
npx expo start --dev-client
```

¡Ahora el mapa debería funcionar! 🎉

---

## 📱 Desarrollar con Development Build

### Iniciar el servidor
```powershell
npx expo start --dev-client
```

La flag `--dev-client` le dice a Expo que busque tu development build en lugar de Expo Go.

### Recompilar después de cambios nativos

Si cambias algo en:
- `app.json`
- Instalas un nuevo paquete con código nativo
- Cambias configuración de plugins

Necesitas recompilar:

**Con EAS:**
```powershell
eas build --profile development --platform android
```

**Local:**
```powershell
npx expo run:android
```

---

## ⚠️ Notas Importantes

1. **Tokens de Mapbox**: Ya están configurados en `.env`:
   - `EXPO_PUBLIC_MAPBOX_TOKEN`: Token público (para el mapa)
   - `RNMAPBOX_MAPS_DOWNLOAD_TOKEN`: Token de descarga (para compilar)

2. **No commitees los tokens**: Agrega `.env` a `.gitignore`

3. **Permisos de ubicación**: Ya configurados en `app.json` para Android e iOS

4. **Primera vez**: El primer build puede tardar 10-20 minutos

5. **Hot Reload**: Funciona igual que con Expo Go, pero con código nativo incluido

---

## 🆘 Problemas Comunes

### "JAVA_HOME is not set"
- Instala Java JDK 17
- Configura la variable de entorno `JAVA_HOME`
- Reinicia la terminal

### "SDK location not found"
- Instala Android Studio
- Configura `ANDROID_HOME` apuntando a `%LOCALAPPDATA%\Android\Sdk`

### "License not accepted"
- Abre Android Studio
- Ve a Settings > Appearance & Behavior > System Settings > Android SDK
- Acepta todas las licencias

### El mapa no se muestra
- Verifica que `MAP_AVAILABLE = true`
- Revisa que el import de `MapaPerdidos` no esté comentado
- Confirma que estés usando el development build (no Expo Go)
- Chequea los tokens en `.env`

---

## 📚 Recursos

- [Expo Development Builds](https://docs.expo.dev/develop/development-builds/introduction/)
- [EAS Build Documentation](https://docs.expo.dev/build/introduction/)
- [Mapbox Setup](https://rnmapbox.github.io/docs/install?rebuild=expo)
- [Expo Router + Native Code](https://docs.expo.dev/router/installation/#modify-your-project)

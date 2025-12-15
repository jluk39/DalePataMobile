<div align="center">
  <h1>🐾 DalePata Mobile</h1>
  <p><strong>Aplicación móvil para conectar mascotas con familias amorosas</strong></p>
  
  [![React Native](https://img.shields.io/badge/React%20Native-0.81-61DAFB?style=for-the-badge&logo=react&logoColor=white)](https://reactnative.dev/)
  [![Expo](https://img.shields.io/badge/Expo-~54.0-000020?style=for-the-badge&logo=expo&logoColor=white)](https://expo.dev/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
  [![License](https://img.shields.io/badge/License-MIT-89C7A8?style=for-the-badge)](LICENSE)
</div>

---

## 📱 Acerca del Proyecto

**DalePata Mobile** es una aplicación móvil desarrollada con React Native y Expo que facilita la adopción responsable de mascotas. Conecta refugios, veterinarias y usuarios en una plataforma intuitiva donde encontrar un nuevo mejor amigo es fácil y seguro.

### ✨ Características Principales

- 🏠 **Inicio Personalizado** - Dashboard con tus mascotas y acceso rápido
- 🐕 **Explorar Mascotas** - Búsqueda y filtros avanzados para encontrar tu compañero ideal
- 🔔 **Notificaciones Inteligentes** - Sistema de alertas para solicitudes de adopción
- 📍 **Mascotas Perdidas** - Mapa interactivo y reportes de mascotas extraviadas
- 📋 **Seguimiento de Solicitudes** - Gestión completa de tus solicitudes de adopción
- 🔐 **Autenticación Segura** - Sistema robusto de login/registro
- 🎨 **Diseño Moderno** - Interfaz intuitiva y responsive

---

## 🚀 Inicio Rápido

### Prerrequisitos

- Node.js 18+ instalado
- npm o yarn
- Expo CLI (se instala automáticamente)
- Emulador Android/iOS o dispositivo físico con Expo Go

### Instalación

1. **Clona el repositorio**
   ```bash
   git clone https://github.com/jluk39/DalePataMobile.git
   cd DalePataMobile
   ```

2. **Instala las dependencias**
   ```bash
   npm install
   ```

3. **Configura las variables de entorno**
   
   Edita `services/api-config.ts` con la URL de tu backend:
   ```typescript
   export const API_BASE_URL = 'https://tu-backend.com/api';
   ```

4. **Inicia el servidor de desarrollo**
   ```bash
   npm start
   ```

5. **Ejecuta la app**
   - Presiona `a` para Android
   - Presiona `i` para iOS
   - Escanea el QR con Expo Go en tu dispositivo

---

## 📂 Estructura del Proyecto

```
DalePataMobile/
├── 📱 app/                      # Rutas y pantallas
│   ├── (tabs)/                  # Navegación principal
│   │   ├── home.tsx             # Pantalla de inicio
│   │   ├── explore.tsx          # Explorar mascotas
│   │   ├── notificaciones.tsx   # Centro de notificaciones
│   │   ├── perdidos.tsx         # Mascotas perdidas/encontradas
│   │   └── seguimiento.tsx      # Seguimiento de solicitudes
│   └── auth/                    # Autenticación
│       ├── login.tsx
│       └── register.tsx
├── 🎨 components/               # Componentes reutilizables
│   ├── home/                    # Componentes del inicio
│   ├── adoption/                # Componentes de adopción
│   ├── perdidos/                # Componentes de perdidos
│   └── ui/                      # Componentes base UI
├── 🔧 services/                 # Lógica de negocio
│   ├── api-service.ts           # Cliente API
│   ├── api-config.ts            # Configuración de endpoints
│   └── storage.ts               # AsyncStorage wrapper
├── 🎭 contexts/                 # Context API
│   └── AuthContext.tsx          # Estado de autenticación
├── 🎨 constants/                # Constantes y tema
│   └── theme.ts                 # Colores y estilos
└── 📚 types/                    # Definiciones TypeScript
```

---

## 🎯 Funcionalidades Detalladas

### 🏠 Pantalla de Inicio
- Bienvenida personalizada con nombre del usuario
- Grid de "Mis Mascotas" con información detallada
- Acceso rápido a funcionalidades principales
- Header con notificaciones y menú de usuario

### 🐕 Explorar Mascotas
- Lista de mascotas disponibles para adopción
- Filtros por especie, edad, tamaño, género
- Búsqueda por nombre o características
- Formulario de solicitud de adopción
- Información detallada de refugios

### 🔔 Notificaciones
- Alertas de solicitudes aprobadas/rechazadas
- Badge con contador de notificaciones sin leer
- Sistema virtual basado en estado de solicitudes
- Navegación directa a detalles de solicitud
- Auto-marcado de notificaciones antiguas

### 📍 Mascotas Perdidas
- Vista de lista con tarjetas informativas
- Mapa interactivo con ubicaciones
- Reportar mascota perdida o encontrada
- Contacto directo (teléfono/email)
- Badges de urgencia y recompensa

### 📋 Seguimiento de Solicitudes
- Dashboard con estadísticas de solicitudes
- Filtros por estado (pendiente, aprobada, rechazada)
- Modal con detalles completos de cada solicitud
- Cancelación de solicitudes pendientes
- Búsqueda por nombre de mascota

---

## 🛠️ Tecnologías Utilizadas

### Core
- **React Native** - Framework de desarrollo móvil
- **Expo** - Plataforma de desarrollo y build
- **TypeScript** - Tipado estático
- **Expo Router** - Navegación basada en archivos

### UI/UX
- **@expo/vector-icons** - Iconografía Material Icons
- **React Native Gesture Handler** - Gestos nativos
- **React Native Reanimated** - Animaciones fluidas
- **React Native Safe Area Context** - Gestión de áreas seguras

### Estado y Persistencia
- **Context API** - Gestión de estado global
- **AsyncStorage** - Almacenamiento local
- **React Hooks** - Gestión de estado local

### Mapas y Ubicación
- **@rnmapbox/maps** - Mapas interactivos
- **React Native Maps** - Vista de mapas

### Formularios e Inputs
- **@react-native-community/datetimepicker** - Selector de fechas
- **@react-native-picker/picker** - Selectores nativos
- **@react-native-community/slider** - Sliders

---

## 🔐 Autenticación y Seguridad

La app implementa un sistema robusto de autenticación:

- **JWT Tokens** - Almacenados de forma segura en AsyncStorage
- **Rutas Protegidas** - Componente `UserProtectedRoute`
- **Auto-refresh** - Revalidación automática de tokens
- **Tipos de Usuario** - Diferenciación entre usuario, refugio, veterinaria y médico
- **Logout Seguro** - Limpieza completa de datos locales

---

## 📡 Integración con Backend

### Endpoints Principales

```typescript
// Autenticación
POST   /api/auth/login
POST   /api/auth/register/usuario
POST   /api/auth/register/refugio
GET    /api/auth/profile

// Mascotas
GET    /api/listarMascotas              # Lista mascotas para adopción
GET    /api/mascotas/mis-mascotas        # Mis mascotas
GET    /api/mascotas/:id                 # Detalle de mascota
POST   /api/mascotas                     # Crear mascota
PUT    /api/mascotas/:id                 # Actualizar mascota
DELETE /api/mascotas/:id                 # Eliminar mascota

// Solicitudes de Adopción
GET    /api/solicitudes                  # Listar solicitudes
GET    /api/solicitudes/mis-solicitudes  # Mis solicitudes
GET    /api/solicitudes/:id              # Detalle de solicitud
POST   /api/solicitudes/mascota/:id      # Crear solicitud
PUT    /api/solicitudes/:id/estado       # Actualizar estado
DELETE /api/solicitudes/:id/cancelar     # Cancelar solicitud

// Adopciones
POST   /api/adopciones                   # Crear adopción

// Mascotas Perdidas
GET    /api/mascotas-perdidas/listar            # Listar perdidas
POST   /api/mascotas/:id/reportar-perdida      # Reportar propia como perdida
PUT    /api/mascotas/:id/marcar-encontrada     # Marcar como encontrada
POST   /api/mascotas/reportar-avistamiento     # Reportar avistamiento
DELETE /api/mascotas-perdidas/:id              # Eliminar reporte
```

### Configuración API

Edita `services/api-config.ts`:

```typescript
export const API_BASE_URL = 'https://tu-backend.com/api';
export const MAPBOX_ACCESS_TOKEN = 'tu-token-de-mapbox';
```

---


## 🎨 Personalización

### Colores del Tema

Edita `constants/theme.ts`:

```typescript
export const theme = {
  colors: {
    // PRIMARY (Verde DalePata)
    primary: '#89C7A8',                    // Verde principal - Botones, títulos, links
    primaryForeground: '#FFFFFF',          // Texto blanco sobre verde
    primaryHover: 'rgba(137, 199, 168, 0.9)', // Hover con 90% opacidad
    
    // HEADERS
    headerTitle: '#89C7A8',                // Verde suave para títulos de pantalla
    
    // BACKGROUND
    background: '#F5F5F5',                 // Fondo de pantalla (gris claro)
    
    // CARD
    card: '#FFFFFF',                       // Fondo de tarjetas (blanco)
    cardForeground: '#1F2937',             // Texto en tarjetas (negro suave)
    
    // BORDERS & INPUTS
    border: '#E5E7EB',                     // Bordes generales (gris claro)
    input: '#E5E7EB',                      // Bordes de inputs
    inputBackground: 'transparent',        // Fondo de inputs transparente
    
    // FOCUS STATES
    ring: '#89C7A8',                       // Anillo de foco (verde)
    ringFocus: 'rgba(137, 199, 168, 0.5)', // Anillo con 50% opacidad
    ringError: 'rgba(239, 68, 68, 0.2)',   // Anillo de error con 20% opacidad
    
    // TEXT
    foreground: '#1F2937',                 // Texto principal (negro suave)
    mutedForeground: '#6B7280',            // Texto secundario (gris)
    
    // DESTRUCTIVE (Errores y alertas)
    destructive: '#EF4444',                // Rojo para errores
    destructiveForeground: '#FFFFFF',      // Texto blanco sobre rojo
    
    // STATES
    disabledOpacity: 0.5,                  // Opacidad de elementos deshabilitados
  },
  
  spacing: {
    xs: 4,    // Extra pequeño
    sm: 8,    // Pequeño
    md: 12,   // Mediano
    lg: 16,   // Grande
    xl: 24,   // Extra grande
  },
  
  borderRadius: {
    md: 8,    // Redondeado mediano
    lg: 12,   // Redondeado grande
  },
  
  fontSize: {
    sm: 14,   // Texto pequeño
    base: 16, // Texto base
    xl: 20,   // Texto extra grande
    '2xl': 24,// Texto 2x grande
  },
  
  fontWeight: {
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  },
};
```

### Badges de Estado

| Estado | Color | Hex | Uso |
|--------|-------|-----|-----|
| Aprobada | Verde | `#22C55E` | Solicitudes aprobadas |
| Pendiente | Amarillo | `#EAB308` | Solicitudes pendientes |
| Enviada | Azul | `#3B82F6` | Solicitudes enviadas |
| Rechazada | Rojo | `#EF4444` | Solicitudes rechazadas |
| Cancelada | Gris | `#6B7280` | Solicitudes canceladas |
| Urgente | Naranja | `#F97316` | Mascotas perdidas urgentes |
| Recompensa | Verde | `#16A34A` | Mascotas con recompensa |

### Componentes Reutilizables

Todos los componentes UI están en `components/ui/`:
- `Button.tsx` - Botones con variantes
- `MapboxAddressInput.tsx` - Input de direcciones
- `icon-symbol.tsx` - Iconos personalizados

---

## 📦 Build y Deployment

### Android

```bash
# Build APK
npx expo build:android

# Build AAB (Google Play)
npx expo build:android -t app-bundle
```

### EAS Build (Recomendado)

```bash
# Instalar EAS CLI
npm install -g eas-cli

# Login en Expo
eas login

# Configurar proyecto
eas build:configure

# Build para Android
eas build --platform android

# Build para iOS
eas build --platform ios
```

---

## 📝 Changelog

### Versión 1.0.0 (Diciembre 2025)
- ✅ Sistema de autenticación completo
- ✅ Pantalla de inicio con "Mis Mascotas"
- ✅ Exploración y solicitud de adopción
- ✅ Sistema de notificaciones virtuales
- ✅ Seguimiento de solicitudes con filtros
- ✅ Mascotas perdidas

---

## 👥 Equipo

Desarrollado con ❤️ por el equipo de **DalePata**

- **Integrantes**: [Juan Manuel Lukaszewicz](https://github.com/jluk39) - [Andres Berillo](https://github.com/AndresBerillo)
- **Proyecto**: [DalePata](https://github.com/jluk39/DalePataMobile)


---

<div align="center">
  <p><strong>Hecho con 🐾 para ayudar a las mascotas a encontrar un hogar</strong></p>
</div>

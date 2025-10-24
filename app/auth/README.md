# 🔐 Pantallas de Autenticación - DalePata Mobile

## ✅ Pantallas Creadas

```
app/
├── index.tsx               ← Pantalla de bienvenida
└── auth/
    ├── _layout.tsx         ← Layout de autenticación
    ├── login.tsx           ← Pantalla de login
    └── register.tsx        ← Pantalla de registro
```

---

## 📱 Pantallas Implementadas

### 1. **Welcome Screen** (`app/index.tsx`)

Pantalla de bienvenida con:
- ✅ Logo y tagline de la app
- ✅ Botón "Iniciar Sesión"
- ✅ Botón "Crear Cuenta"
- ✅ Opción "Explorar sin cuenta"
- ✅ Auto-login si ya hay sesión activa

**Navegación**:
- → `/auth/login` (Iniciar Sesión)
- → `/auth/register` (Crear Cuenta)
- → `/(tabs)` (Home sin autenticación)

---

### 2. **Login Screen** (`app/auth/login.tsx`)

Formulario de inicio de sesión siguiendo el diseño de web:

#### Componentes Visuales:
- **Card** con shadow y border radius
- **Header** con título y descripción
- **Inputs**:
  - Email (con teclado email)
  - Contraseña (secureTextEntry)
- **Mensajes de error** en contenedor rojo
- **Botón de login** con loading spinner
- **Link** a registro

#### Validaciones:
- ✅ Campos no vacíos
- ✅ Formato de email (nativo)
- ✅ Longitud mínima de contraseña

#### Funcionalidad:
```typescript
await ApiService.login(email, password)
// Redirige según tipo de usuario:
// - 'refugio' → /(tabs)/admin
// - otros → /(tabs)
```

---

### 3. **Register Screen** (`app/auth/register.tsx`)

Formulario condicional de registro según tipo de usuario:

#### Selector de Tipo de Usuario:
- 🙋 Usuario
- 🏠 Refugio
- 🏥 Veterinaria
- 👨‍⚕️ Médico Veterinario

#### Campos por Tipo:

**Usuario** (persona normal):
- Nombre *
- Apellido *
- Email *
- Teléfono
- Contraseña *
- Confirmar Contraseña *

**Refugio**:
- Nombre de organización *
- Email *
- Teléfono
- Dirección
- Tipo de Organización (Picker)
- Capacidad (número)
- Contraseña *
- Confirmar Contraseña *

**Veterinaria**:
- Nombre de organización *
- Email *
- Teléfono
- Dirección
- Especialidades (TextArea)
- Horarios (TextArea)
- Contraseña *
- Confirmar Contraseña *

**Médico Veterinario**:
- Nombre *
- Email *
- Teléfono
- Especialidad
- Matrícula Profesional
- ID Veterinaria
- Contraseña *
- Confirmar Contraseña *

#### Validaciones:
- ✅ Campos obligatorios según tipo
- ✅ Contraseñas coinciden
- ✅ Contraseña mínimo 6 caracteres
- ✅ Formato de email

#### Funcionalidad:
```typescript
await ApiService.registerByType(userData, userType)
// Redirige a login después de registro exitoso
```

---

## 🎨 Diseño y Estilos

### Colores Principales:
```typescript
Primary: '#4CAF50'    // Verde - botones y títulos
Error: '#ef4444'      // Rojo - mensajes de error
Background: '#f5f5f5' // Gris claro - fondo
Card: '#ffffff'       // Blanco - cards
Text: '#333333'       // Negro - texto principal
Secondary: '#666666'  // Gris - texto secundario
Border: '#dddddd'     // Gris claro - bordes
```

### Componentes Traducidos de Web:

| Web (shadcn/ui) | React Native |
|----------------|--------------|
| `Card` | `View` con shadow y border |
| `CardHeader` | `View` con padding |
| `CardTitle` | `Text` bold y grande |
| `CardDescription` | `Text` color gris |
| `Input` | `TextInput` |
| `Label` | `Text` sobre input |
| `Button` | `TouchableOpacity` |
| `Select` | `Picker` de @react-native-picker/picker |
| `Textarea` | `TextInput` con multiline |
| `Link` | `Text` con onPress |

---

## 🚀 Flujo de Navegación

```
Welcome Screen (/)
├── Login (/auth/login)
│   └── Success → Home (/(tabs))
│
└── Register (/auth/register)
    └── Success → Login (/auth/login)
```

---

## 🔌 Integración con API

Las pantallas usan `ApiService` que ya está configurado:

```typescript
import { ApiService } from '@/services'

// Login
const result = await ApiService.login(email, password)
// result.user: datos del usuario
// result.token: token JWT (se guarda automáticamente)

// Register
const result = await ApiService.registerByType(userData, userType)
// Tipos: 'usuario' | 'refugio' | 'veterinaria' | 'medico'
```

---

## 📦 Dependencias Nuevas

```bash
✅ @react-native-picker/picker  # Para el selector de tipo de usuario
```

Ya instalado y listo para usar.

---

## 🧪 Testing

### Probar Login:
1. Abre la app
2. Click en "Iniciar Sesión"
3. Ingresa email y contraseña
4. Debería redirigir a Home

### Probar Registro:
1. Abre la app
2. Click en "Crear Cuenta"
3. Selecciona tipo de usuario
4. Completa el formulario
5. Click en "Crear Cuenta"
6. Debería redirigir a Login

### Probar Navegación:
```typescript
// En cualquier pantalla autenticada:
const user = await ApiService.getUser()
console.log('Usuario:', user)

// Cerrar sesión:
await ApiService.logout()
router.replace('/auth/login')
```

---

## 🎯 Estados Manejados

### Loading States:
- ✅ Botón de login muestra spinner
- ✅ Botón de registro muestra spinner
- ✅ Inputs se deshabilitan durante carga

### Error States:
- ✅ Mensajes de error en contenedor rojo
- ✅ Errores de API se muestran al usuario
- ✅ Validaciones en tiempo real

### Success States:
- ✅ Alert de bienvenida después de login
- ✅ Alert de registro exitoso
- ✅ Navegación automática

---

## 🔐 Seguridad

### Validaciones Frontend:
- ✅ Email válido
- ✅ Contraseña mínimo 6 caracteres
- ✅ Contraseñas coinciden
- ✅ Campos requeridos

### Manejo de Datos:
- ✅ Contraseñas ocultas (secureTextEntry)
- ✅ Token guardado en AsyncStorage
- ✅ Auto-logout en token expirado
- ✅ .env no se sube a git

---

## 📱 Características UX

### KeyboardAvoidingView:
```typescript
<KeyboardAvoidingView 
  behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
>
```
Evita que el teclado tape los inputs.

### ScrollView:
```typescript
<ScrollView 
  keyboardShouldPersistTaps="handled"
  showsVerticalScrollIndicator={false}
>
```
Permite scroll en formularios largos.

### TouchableOpacity:
```typescript
<TouchableOpacity activeOpacity={0.8}>
```
Feedback visual al tocar botones.

---

## 🐛 Solución de Problemas

### Error: "Cannot connect to API"

**Verifica**:
1. ✅ `.env` configurado con tu IP
2. ✅ Backend corriendo en puerto 3001
3. ✅ Reiniciaste Expo después de cambiar .env

### Error: "Picker no funciona"

**Solución**:
```bash
npm install @react-native-picker/picker
npx expo start -c
```

### Error: "Navigation no funciona"

**Verifica** que las rutas existan:
```
app/
├── index.tsx
├── auth/
│   ├── login.tsx
│   └── register.tsx
└── (tabs)/
    └── index.tsx
```

---

## 📚 Archivos de Referencia

| Archivo | Descripción |
|---------|-------------|
| `app/index.tsx` | Pantalla de bienvenida |
| `app/auth/login.tsx` | Login screen |
| `app/auth/register.tsx` | Register screen |
| `services/api-service.ts` | Métodos de API |
| `.env` | Variables de entorno |

---

## 🎉 ¡Listo para Usar!

Las pantallas están completamente funcionales y conectadas con la API.

**Próximos pasos sugeridos**:
1. ✅ Probar login con usuario existente
2. ✅ Probar registro de nuevo usuario
3. ✅ Personalizar colores si es necesario
4. ✅ Agregar logo de la app
5. ✅ Implementar "Olvidé mi contraseña"

---

**Desarrollado con 🐾 para DalePata Mobile**

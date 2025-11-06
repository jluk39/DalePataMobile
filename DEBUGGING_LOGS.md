# 🔍 Guía de Debugging - Creación de Mascotas

## Cambios Realizados

### 1. Logs Agregados en `AddPetModal.tsx`

Se agregaron logs exhaustivos en el flujo completo de creación:

- **🚀 INICIO handleSubmit**: Marca el inicio del proceso
- **📝 Datos del formulario**: Muestra todos los valores antes de validar
- **❌ VALIDACIÓN FALLIDA**: Si faltan campos obligatorios
- **✅ Validación exitosa**: Cuando pasa las validaciones
- **📋 Agregando campos**: Cada campo que se añade al FormData
- **📸 IMAGEN A SUBIR**: Estructura completa de la imagen (uri, name, type)
- **⚠️ NO hay imagen**: Si no se seleccionó imagen
- **📤 ENVIANDO FormData**: Antes de llamar al backend
- **✅ RESPUESTA DEL SERVIDOR**: Resultado completo del backend
- **🎉 Mascota creada exitosamente**: Confirmación de éxito
- **🧹 Limpiando formulario**: Antes de resetear
- **🚪 Cerrando modal**: Antes de cerrar
- **📢 Mostrando alerta**: Antes de mostrar la alerta de éxito
- **👤 Usuario cerró la alerta**: Cuando el usuario toca OK
- **❌ ERROR AL CREAR MASCOTA**: Si hay algún error, con message y stack
- **🏁 FIN handleSubmit**: Marca el fin del proceso

### 2. Logs Agregados en `ApiService.createPet()`

- **🔐 Obteniendo token**: Antes de obtener el token
- **✅ Token obtenido**: Muestra primeros 20 caracteres del token
- **🌐 URL de destino**: URL completa del endpoint
- **📋 Headers**: Headers de la petición
- **📦 Enviando FormData**: Antes del fetch
- **📡 Respuesta recibida**: Status y statusText de la respuesta
- **📡 Response headers**: Headers de la respuesta
- **✅ handleResponse completado**: Resultado parseado
- **❌ Backend reportó error**: Si result.success = false
- **🎉 Mascota creada exitosamente**: Confirmación final

### 3. Logs Agregados en `handleResponse()`

- **🔍 handleResponse - Status**: Status de cada respuesta HTTP
- **❌ 401**: Token expirado o inválido
- **❌ Response not OK**: Si el status no es 2xx
- **❌ Error data del servidor**: Detalles del error del backend
- **✅ handleResponse - JSON parseado**: Datos completos de la respuesta

### 4. Logs Agregados en `fetchMyPets()`

- **🔐 Obteniendo token**: Antes de obtener el token
- **✅ Token obtenido**: Confirmación
- **🌐 Solicitando mascotas**: URL del endpoint
- **📡 Respuesta recibida**: Status de la respuesta
- **✅ Mascotas obtenidas**: Cantidad de mascotas obtenidas
- **❌ Backend reportó error**: Si hay error en la respuesta

### 5. Logs Agregados en `MyPetsGrid.handlePetAdded()`

- **🔄 Recargando lista**: Cuando empieza la recarga
- **✅ Mascotas recargadas exitosamente**: Cantidad de mascotas después del reload
- **❌ Error al recargar mascotas**: Si falla la recarga
- **🏁 Recarga finalizada**: Al terminar el proceso

### 6. Mejoras en el Flujo de Éxito

El flujo ahora es:
1. Se guarda la mascota
2. Se limpia el formulario
3. **Se cierra el modal primero**
4. **Luego se muestra la alerta de éxito**
5. Cuando el usuario cierra la alerta, se llama a `onSuccess()` que recarga la lista

**IMPORTANTE**: Este orden es crítico porque si el modal está abierto, la alerta puede no verse correctamente.

## Cómo Verificar los Logs

### Paso 1: Abre la consola de desarrollo

```bash
# Asegúrate de que el servidor de desarrollo esté corriendo
npx expo start
```

### Paso 2: Reproduce el flujo completo

1. Abre la app en tu dispositivo/emulador
2. Ve a la pestaña "Inicio"
3. Click en el botón "+" para agregar mascota
4. Llena el formulario:
   - **Nombre**: Luna (ejemplo)
   - **Especie**: Perro
   - **Sexo**: Hembra
5. (Opcional) Click en "Agregar foto" y selecciona una imagen
6. Click en "Guardar"

### Paso 3: Observa los logs en orden

Deberías ver una secuencia como esta:

```
🚀 INICIO handleSubmit
📝 Datos del formulario: {...}
✅ Validación exitosa, iniciando proceso de guardado...
📋 Agregando campos obligatorios al FormData...
📋 Agregando raza: ...
📋 Agregando color: ...
📸 IMAGEN A SUBIR: {...}
📤 ENVIANDO FormData al backend...

🔐 ApiService.createPet - Obteniendo token...
✅ Token obtenido: eyJhbGciOiJIUzI1NiIs...
🌐 URL de destino: http://localhost:3000/api/mascotas
📋 Headers: {...}
📦 Enviando FormData...

📡 Respuesta recibida - Status: 200 OK
🔍 handleResponse - Status: 200 OK
✅ handleResponse - JSON parseado: {...}
✅ handleResponse completado: {...}
🎉 Mascota creada exitosamente en el backend!

✅ RESPUESTA DEL SERVIDOR: {...}
🎉 Mascota creada exitosamente!
🧹 Limpiando formulario...
🚪 Cerrando modal...
📢 Mostrando alerta de éxito...
👤 Usuario cerró la alerta, llamando onSuccess...

🔄 MyPetsGrid.handlePetAdded - Recargando lista de mascotas...
🔐 ApiService.fetchMyPets - Obteniendo token...
✅ Token obtenido
🌐 Solicitando mascotas del usuario: http://localhost:3000/api/mascotas/mis-mascotas
📡 Respuesta recibida - Status: 200
🔍 handleResponse - Status: 200 OK
✅ handleResponse - JSON parseado: {...}
✅ Mascotas obtenidas del backend: 3
✅ Mascotas recargadas exitosamente: 3
🏁 Recarga de mascotas finalizada
🏁 FIN handleSubmit
```

## Qué Buscar si Algo Falla

### ❌ Si no se muestra la alerta de éxito

Busca en los logs:
- ¿Llegó a "📢 Mostrando alerta de éxito..."?
- ¿Hay un error antes de ese log?

### ❌ Si la lista no se refresca

Busca en los logs:
- ¿Se llamó "🔄 MyPetsGrid.handlePetAdded"?
- ¿Llegó a "✅ Mascotas recargadas exitosamente"?
- ¿Cuántas mascotas reporta? (debe ser +1 de las que tenías antes)

### ❌ Si la imagen no sube

Busca en los logs:
- ¿Aparece "📸 IMAGEN A SUBIR" con la estructura {uri, name, type}?
- ¿El `type` coincide con el formato de la imagen (image/png, image/jpeg, etc.)?
- ¿El `uri` es válido?

### ❌ Si hay error del backend

Busca en los logs:
- "📡 Respuesta recibida - Status: XXX" (¿cuál es el código?)
- "❌ Error data del servidor: ..." (¿qué dice el error?)

### ❌ Si hay error de validación

Busca en los logs:
- "❌ VALIDACIÓN FALLIDA: Faltan campos obligatorios: ..."
- Verifica que hayas llenado: Nombre, Especie y Sexo

## Siguiente Paso

Ahora **ejecuta el flujo completo** de agregar una mascota y **comparte los logs completos** que aparezcan en la consola. Así podremos identificar exactamente dónde está el problema.

## Comparación con la Implementación Web

El equipo de front-web usa:
- `window.location.reload()` para recargar toda la página
- `alert()` estándar de JavaScript
- `FileReader` para preview de imágenes

En React Native usamos:
- `Alert.alert()` de React Native (más nativo)
- `ApiService.fetchMyPets()` para recargar solo la lista (más eficiente)
- URIs directas para preview de imágenes

Ambos flujos son correctos, pero React Native necesita un enfoque diferente porque no tiene `window` ni DOM.

# 🔧 SOLUCIÓN: Network Request Failed en Android

## ✅ Problema Identificado
Tu archivo `.env` tenía `localhost:3001` que **NO funciona en Android**. 
En Android, `localhost` apunta al dispositivo móvil, no a tu PC.

## 🛠️ Solución Aplicada

### 1. ✅ Archivo `.env` actualizado
**Antes:** `http://localhost:3001/api`
**Ahora:** `http://192.168.30.239:3001/api`

Tu IP local (192.168.30.239) ahora está configurada correctamente.

---

## 📋 Pasos para Completar la Configuración

### Paso 1: Configurar el Firewall de Windows

**Opción A - Script Automático (Recomendado):**

Abre PowerShell como **Administrador** y ejecuta:

```powershell
cd C:\Users\andre\Desktop\ASistema\DalePata\DalePataMobile
.\setup-firewall.ps1
```

**Opción B - Manual:**

Abre PowerShell como **Administrador** y ejecuta:

```powershell
New-NetFirewallRule -DisplayName "Node Backend 3001" -Direction Inbound -LocalPort 3001 -Protocol TCP -Action Allow
```

### Paso 2: Verificar que tu Backend esté corriendo

Asegúrate de que tu servidor backend esté:
- ✅ Corriendo en el puerto **3001**
- ✅ Escuchando en **todas las interfaces** (0.0.0.0), no solo localhost

En tu servidor backend, debe ser algo como:

```javascript
app.listen(3001, '0.0.0.0', () => {
  console.log('Servidor corriendo en http://0.0.0.0:3001')
})
```

### Paso 3: Reiniciar Expo con Cache Limpio

Detén Expo (Ctrl+C) y ejecuta:

```powershell
npx expo start -c
```

El `-c` limpia el cache para que use la nueva configuración del `.env`

### Paso 4: Probar desde el Navegador de Android (Opcional pero Recomendado)

Antes de abrir la app, abre el navegador de tu Android y visita:

```
http://192.168.30.239:3001/api
```

Deberías ver una respuesta del servidor. Si esto funciona, la app también funcionará.

### Paso 5: Abrir la App en Android

1. Escanea el QR code con Expo Go
2. La app debería conectarse correctamente
3. Intenta iniciar sesión

---

## ✅ Checklist de Verificación

- [x] Archivo `.env` actualizado con tu IP (192.168.30.239)
- [ ] Firewall de Windows configurado para permitir puerto 3001
- [ ] Backend corriendo y escuchando en 0.0.0.0:3001
- [ ] PC y Android en la misma red WiFi
- [ ] Expo reiniciado con cache limpio (`npx expo start -c`)
- [ ] Probado desde navegador Android

---

## 🐛 Si Aún No Funciona

### 1. Verifica tu IP actual (puede cambiar)
```powershell
ipconfig | findstr "IPv4"
```

Si cambió, actualiza el `.env` y reinicia Expo.

### 2. Verifica que el backend esté accesible desde la red
```powershell
# En tu PC, prueba
curl http://192.168.30.239:3001/api
```

### 3. Verifica que estén en la misma red
- Tu PC debe estar conectada a WiFi (no cable Ethernet preferiblemente)
- Tu Android debe estar en la **misma red WiFi**
- No usar datos móviles en el Android

### 4. Desactiva temporalmente el Firewall para probar
```powershell
# ⚠️ Solo para prueba - vuelve a activarlo después
netsh advfirewall set allprofiles state off

# Para volver a activarlo
netsh advfirewall set allprofiles state on
```

---

## 📱 Log Esperado (Éxito)

Después de seguir estos pasos, deberías ver:

```
LOG  [API Debug] Sending login data: {"email": "andy@admin.com", "userType": null}
LOG  ✅ Login successful, data saved
LOG  🔐 User data saved:...
```

En lugar de:
```
ERROR  Error during login: [TypeError: Network request failed]
```

---

## 🎯 Resumen Rápido

```powershell
# 1. Configurar firewall (PowerShell como Admin)
.\setup-firewall.ps1

# 2. Asegurarse de que backend esté corriendo

# 3. Reiniciar Expo con cache limpio
npx expo start -c

# 4. Escanear QR en Android y probar login
```

¡Ahora debería funcionar! 🎉

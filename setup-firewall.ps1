# Script para configurar el Firewall de Windows
# Permite conexiones entrantes en el puerto 3001 (Backend)

Write-Host "🔥 Configurando Firewall de Windows..." -ForegroundColor Yellow

# Verificar si la regla ya existe
$existingRule = Get-NetFirewallRule -DisplayName "Node Backend 3001" -ErrorAction SilentlyContinue

if ($existingRule) {
    Write-Host "✅ La regla del firewall ya existe" -ForegroundColor Green
} else {
    Write-Host "➕ Creando nueva regla del firewall..." -ForegroundColor Cyan
    
    New-NetFirewallRule `
        -DisplayName "Node Backend 3001" `
        -Direction Inbound `
        -LocalPort 3001 `
        -Protocol TCP `
        -Action Allow `
        -Profile Any `
        -Description "Permite conexiones al backend Node.js en puerto 3001"
    
    Write-Host "✅ Regla del firewall creada exitosamente" -ForegroundColor Green
}

Write-Host ""
Write-Host "📋 Información de la regla:" -ForegroundColor Cyan
Get-NetFirewallRule -DisplayName "Node Backend 3001" | Format-List DisplayName, Enabled, Direction, Action

Write-Host ""
Write-Host "✅ Configuración completada" -ForegroundColor Green
Write-Host "🔄 Ahora reinicia Expo con: npx expo start -c" -ForegroundColor Yellow

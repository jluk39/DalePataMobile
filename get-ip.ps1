# Script para obtener la IP local y mostrar configuración
Write-Host "`n==================================" -ForegroundColor Cyan
Write-Host "  DALEPATA - IP Configuration  " -ForegroundColor Green
Write-Host "==================================`n" -ForegroundColor Cyan

# Obtener IP local
Write-Host "🔍 Buscando tu IP local..." -ForegroundColor Yellow

$ipAddress = (Get-NetIPAddress -AddressFamily IPv4 | Where-Object {
    $_.InterfaceAlias -notlike "*Loopback*" -and 
    $_.IPAddress -notlike "169.254.*"
} | Select-Object -First 1).IPAddress

if ($ipAddress) {
    Write-Host "✅ IP encontrada: $ipAddress`n" -ForegroundColor Green
    
    Write-Host "📝 Agrega esta línea a tu archivo .env:" -ForegroundColor Yellow
    Write-Host "   EXPO_PUBLIC_API_BASE_URL=http://${ipAddress}:3001/api`n" -ForegroundColor White
    
    Write-Host "📋 O copia y pega esto en .env:`n" -ForegroundColor Yellow
    Write-Host "EXPO_PUBLIC_API_BASE_URL=http://${ipAddress}:3001/api" -ForegroundColor Cyan
    Write-Host "EXPO_PUBLIC_SUPABASE_URL=https://ardusobgkwlhiapfnwkp.supabase.co" -ForegroundColor Cyan
    $supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFyZHVzb2Jna3dsaGlhcGZud2twIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU4MTU2MDMsImV4cCI6MjA3MTM5MTYwM30._ZwqXh6Ey6sip0HX5YytkNvYbkWyipqTllM6AVHzv4M"
    Write-Host "EXPO_PUBLIC_SUPABASE_ANON_KEY=$supabaseKey`n" -ForegroundColor Cyan
    
    Write-Host "⚠️  Recuerda reiniciar Expo después de modificar .env:" -ForegroundColor Red
    Write-Host "   npm start`n" -ForegroundColor White
} else {
    Write-Host "❌ No se pudo detectar tu IP automáticamente" -ForegroundColor Red
    Write-Host "   Ejecuta manualmente: ipconfig" -ForegroundColor Yellow
    Write-Host "   Y busca 'Dirección IPv4'`n" -ForegroundColor Yellow
}

Write-Host "==================================`n" -ForegroundColor Cyan

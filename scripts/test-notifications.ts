/**
 * 🧪 Script de Testing - Sistema de Notificaciones
 * 
 * Copia y pega estas funciones en tu consola de React Native
 * para probar el sistema de notificaciones.
 */

import { ApiService } from '@/services/api-service'
import { StorageService } from '@/services/storage'

// ========================================
// TEST 1: Verificar Storage
// ========================================
export async function testStorage() {
  console.log('\n📦 TEST 1: Verificar AsyncStorage\n')
  
  // Limpiar
  await StorageService.clearReadNotifications()
  console.log('✅ Storage limpiado')
  
  // Agregar notificaciones leídas
  await StorageService.addReadNotification(123)
  await StorageService.addReadNotification(456)
  console.log('✅ Notificaciones 123 y 456 agregadas')
  
  // Leer
  const read = await StorageService.getReadNotifications()
  console.log('📖 Notificaciones leídas:', read)
  
  if (read.length === 2 && read.includes(123) && read.includes(456)) {
    console.log('✅ TEST 1 PASADO')
  } else {
    console.log('❌ TEST 1 FALLADO')
  }
}

// ========================================
// TEST 2: Verificar API
// ========================================
export async function testAPI() {
  console.log('\n🌐 TEST 2: Verificar API Service\n')
  
  try {
    // Obtener solicitudes
    const solicitudes = await ApiService.getMyAdoptionRequests()
    console.log(`📋 Solicitudes obtenidas: ${solicitudes?.length || 0}`)
    
    // Generar notificaciones
    const notifications = await ApiService.getVirtualNotifications()
    console.log(`🔔 Notificaciones generadas: ${notifications.length}`)
    
    if (notifications.length > 0) {
      console.log('Primera notificación:', JSON.stringify(notifications[0], null, 2))
    }
    
    // Contar sin leer
    const unreadCount = await ApiService.getUnreadNotificationsCount()
    console.log(`🔢 Notificaciones sin leer: ${unreadCount}`)
    
    console.log('✅ TEST 2 PASADO')
  } catch (error) {
    console.error('❌ TEST 2 FALLADO:', error)
  }
}

// ========================================
// TEST 3: Marcar como Leída
// ========================================
export async function testMarkAsRead() {
  console.log('\n📖 TEST 3: Marcar como Leída\n')
  
  try {
    // Limpiar storage
    await StorageService.clearReadNotifications()
    
    // Obtener notificaciones
    const notificationsBefore = await ApiService.getVirtualNotifications()
    const unreadBefore = notificationsBefore.filter(n => !n.leida).length
    console.log(`🔔 Sin leer ANTES: ${unreadBefore}`)
    
    if (notificationsBefore.length === 0) {
      console.log('⚠️ No hay notificaciones para probar')
      return
    }
    
    // Marcar primera como leída
    const firstNotification = notificationsBefore[0]
    await ApiService.markNotificationAsRead(firstNotification.solicitudId)
    console.log(`✅ Notificación ${firstNotification.solicitudId} marcada como leída`)
    
    // Verificar cambio
    const notificationsAfter = await ApiService.getVirtualNotifications()
    const unreadAfter = notificationsAfter.filter(n => !n.leida).length
    console.log(`🔔 Sin leer DESPUÉS: ${unreadAfter}`)
    
    if (unreadAfter === unreadBefore - 1) {
      console.log('✅ TEST 3 PASADO')
    } else {
      console.log('❌ TEST 3 FALLADO: El contador no disminuyó correctamente')
    }
  } catch (error) {
    console.error('❌ TEST 3 FALLADO:', error)
  }
}

// ========================================
// TEST 4: Marcar Todas como Leídas
// ========================================
export async function testMarkAllAsRead() {
  console.log('\n📚 TEST 4: Marcar Todas como Leídas\n')
  
  try {
    // Limpiar storage
    await StorageService.clearReadNotifications()
    
    // Obtener notificaciones
    const notifications = await ApiService.getVirtualNotifications()
    console.log(`🔔 Total notificaciones: ${notifications.length}`)
    
    if (notifications.length === 0) {
      console.log('⚠️ No hay notificaciones para probar')
      return
    }
    
    // Marcar todas
    const allIds = notifications.map(n => n.solicitudId)
    await ApiService.markAllNotificationsAsRead(allIds)
    console.log('✅ Todas las notificaciones marcadas como leídas')
    
    // Verificar
    const unreadCount = await ApiService.getUnreadNotificationsCount()
    console.log(`🔢 Sin leer después: ${unreadCount}`)
    
    if (unreadCount === 0) {
      console.log('✅ TEST 4 PASADO')
    } else {
      console.log('❌ TEST 4 FALLADO: Aún hay notificaciones sin leer')
    }
  } catch (error) {
    console.error('❌ TEST 4 FALLADO:', error)
  }
}

// ========================================
// TEST 5: Filtrado por Fecha
// ========================================
export async function testDateFiltering() {
  console.log('\n📅 TEST 5: Filtrado por Fecha\n')
  
  try {
    const notifications = await ApiService.getVirtualNotifications()
    console.log(`🔔 Notificaciones obtenidas: ${notifications.length}`)
    
    if (notifications.length === 0) {
      console.log('⚠️ No hay notificaciones para probar')
      return
    }
    
    // Verificar que todas sean de últimos 30 días
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
    
    const invalidNotifications = notifications.filter(n => {
      const fecha = new Date(n.fecha)
      return fecha < thirtyDaysAgo
    })
    
    console.log(`📋 Notificaciones de últimos 30 días: ${notifications.length - invalidNotifications.length}`)
    console.log(`❌ Notificaciones más antiguas (no deberían estar): ${invalidNotifications.length}`)
    
    if (invalidNotifications.length === 0) {
      console.log('✅ TEST 5 PASADO')
    } else {
      console.log('❌ TEST 5 FALLADO: Hay notificaciones más antiguas de 30 días')
    }
  } catch (error) {
    console.error('❌ TEST 5 FALLADO:', error)
  }
}

// ========================================
// EJECUTAR TODOS LOS TESTS
// ========================================
export async function runAllTests() {
  console.log('\n🧪 EJECUTANDO TODOS LOS TESTS\n')
  console.log('=' .repeat(50))
  
  await testStorage()
  await new Promise(resolve => setTimeout(resolve, 1000))
  
  await testAPI()
  await new Promise(resolve => setTimeout(resolve, 1000))
  
  await testMarkAsRead()
  await new Promise(resolve => setTimeout(resolve, 1000))
  
  await testMarkAllAsRead()
  await new Promise(resolve => setTimeout(resolve, 1000))
  
  await testDateFiltering()
  
  console.log('\n' + '=' .repeat(50))
  console.log('✅ TESTS COMPLETADOS\n')
}

// ========================================
// HELPERS DE DEBUG
// ========================================

export async function debugNotifications() {
  console.log('\n🔍 DEBUG: Información Completa de Notificaciones\n')
  
  const solicitudes = await ApiService.getMyAdoptionRequests()
  const notifications = await ApiService.getVirtualNotifications()
  const readIds = await StorageService.getReadNotifications()
  const unreadCount = await ApiService.getUnreadNotificationsCount()
  
  console.log('📋 SOLICITUDES TOTALES:', solicitudes?.length || 0)
  console.log('🔔 NOTIFICACIONES GENERADAS:', notifications.length)
  console.log('📖 IDs MARCADOS COMO LEÍDOS:', readIds)
  console.log('🔢 CONTADOR SIN LEER:', unreadCount)
  console.log('\n📦 Notificaciones Detalladas:')
  notifications.forEach((n, i) => {
    console.log(`\n  ${i + 1}. ${n.mascota} (ID: ${n.solicitudId})`)
    console.log(`     Estado: ${n.estado}`)
    console.log(`     Leída: ${n.leida ? '✅' : '❌'}`)
    console.log(`     Fecha: ${n.fecha}`)
  })
}

export async function clearAllNotifications() {
  console.log('\n🗑️ Limpiando todas las notificaciones leídas...')
  await StorageService.clearReadNotifications()
  console.log('✅ Storage limpiado')
  
  const count = await ApiService.getUnreadNotificationsCount()
  console.log(`🔔 Notificaciones sin leer ahora: ${count}`)
}

// ========================================
// INSTRUCCIONES DE USO
// ========================================

/*

📱 CÓMO USAR ESTE SCRIPT:

1. En tu app, importa el script:
   import * as Tests from './path/to/test-notifications'

2. En el componente donde quieras probar:
   
   // Test individual
   Tests.testStorage()
   Tests.testAPI()
   Tests.testMarkAsRead()
   
   // Todos los tests
   Tests.runAllTests()
   
   // Debug completo
   Tests.debugNotifications()
   
   // Limpiar storage
   Tests.clearAllNotifications()

3. O desde la consola de React Native Debugger:
   
   // Ejecutar todos
   runAllTests()
   
   // Ver info completa
   debugNotifications()

*/

import { theme } from '@/constants/theme'
import { ApiService } from '@/services/api-service'
import { MaterialIcons } from '@expo/vector-icons'
import { useFocusEffect, useRouter } from 'expo-router'
import React, { useCallback, useState } from 'react'
import {
    ActivityIndicator,
    FlatList,
    Image,
    RefreshControl,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

interface Notification {
  id: string
  solicitudId: number
  tipo: string
  estado: 'aprobada' | 'rechazada'
  mascota: string
  mascotaImagen?: string
  mascotaId?: number
  fecha: string
  comentario?: string
  leida: boolean
}

export default function NotificationsScreen() {
  const router = useRouter()
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  // ✅ Recargar al entrar a la pantalla
  useFocusEffect(
    useCallback(() => {
      loadNotifications()
    }, [])
  )

  const loadNotifications = async () => {
    try {
      setLoading(true)
      // ⚠️ ESTO LLAMA A getVirtualNotifications() QUE:
      // 1. Hace GET /solicitudes/mis-solicitudes
      // 2. Filtra aprobadas/rechazadas de últimos 30 días
      // 3. Compara con AsyncStorage
      // 4. Genera notificaciones virtuales
      const data = await ApiService.getVirtualNotifications()
      setNotifications(data)
    } catch (error) {
      console.error('Error cargando notificaciones:', error)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  const onRefresh = () => {
    setRefreshing(true)
    loadNotifications()
  }

  const handlePress = async (notification: Notification) => {
    // Marcar como leída en AsyncStorage
    await ApiService.markNotificationAsRead(notification.solicitudId)
    
    // Actualizar UI localmente
    setNotifications(prev =>
      prev.map(n => 
        n.solicitudId === notification.solicitudId 
          ? { ...n, leida: true } 
          : n
      )
    )

    // Navegar a seguimiento con el ID de la solicitud
    router.push({
      pathname: '/(tabs)/seguimiento',
      params: { solicitudId: notification.solicitudId }
    })
  }

  const markAllAsRead = async () => {
    const allIds = notifications.map(n => n.solicitudId)
    await ApiService.markAllNotificationsAsRead(allIds)
    setNotifications(prev => prev.map(n => ({ ...n, leida: true })))
  }

  const unreadCount = notifications.filter(n => !n.leida).length

  if (loading) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Notificaciones</Text>
          <Text style={styles.headerSubtitle}>
            {unreadCount} sin leer
          </Text>
        </View>
        
        {unreadCount > 0 && (
          <TouchableOpacity 
            onPress={markAllAsRead}
            style={styles.markAllButton}
          >
            <Text style={styles.markAllText}>Marcar todas</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Lista de Notificaciones */}
      {notifications.length === 0 ? (
        <ScrollView
          contentContainerStyle={styles.emptyContainer}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          <Text style={styles.emptyIcon}>🔔</Text>
          <Text style={styles.emptyText}>No hay notificaciones</Text>
          <Text style={styles.emptySubtext}>
            Cuando tengas solicitudes de adopción aprobadas o rechazadas, aparecerán aquí
          </Text>
        </ScrollView>
      ) : (
        <FlatList
          data={notifications}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.card,
                !item.leida && styles.unreadCard
              ]}
              onPress={() => handlePress(item)}
              activeOpacity={0.7}
            >
              <View style={styles.iconContainer}>
                {item.mascotaImagen ? (
                  <Image 
                    source={{ uri: item.mascotaImagen }} 
                    style={styles.petImage}
                  />
                ) : (
                  <View style={[
                    styles.iconCircle,
                    { backgroundColor: item.estado === 'aprobada' ? '#4caf50' : '#f44336' }
                  ]}>
                    <Text style={styles.iconText}>
                      {item.estado === 'aprobada' ? '🎉' : '❌'}
                    </Text>
                  </View>
                )}
              </View>

              <View style={styles.content}>
                <Text style={[
                  styles.title,
                  !item.leida && styles.unreadTitle
                ]}>
                  {item.estado === 'aprobada' 
                    ? `¡Solicitud para ${item.mascota} aprobada!`
                    : `Solicitud para ${item.mascota} rechazada`
                  }
                </Text>
                
                {item.comentario && (
                  <Text style={styles.comment} numberOfLines={2}>
                    {item.comentario}
                  </Text>
                )}
                
                <Text style={styles.date}>
                  {formatDate(item.fecha)}
                </Text>

                {item.estado === 'aprobada' && (
                  <View style={styles.ctaContainer}>
                    <MaterialIcons name="arrow-forward" size={14} color={theme.colors.primary} />
                    <Text style={styles.cta}>Ver detalles</Text>
                  </View>
                )}
              </View>

              {!item.leida && <View style={styles.unreadDot} />}
            </TouchableOpacity>
          )}
          refreshControl={
            <RefreshControl 
              refreshing={refreshing} 
              onRefresh={onRefresh}
              colors={[theme.colors.primary]}
            />
          }
          contentContainerStyle={styles.listContainer}
        />
      )}
    </SafeAreaView>
  )
}

// Helper para formatear fechas
function formatDate(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMins / 60)
  const diffDays = Math.floor(diffHours / 24)

  if (diffMins < 1) return 'Ahora'
  if (diffMins < 60) return `Hace ${diffMins} min`
  if (diffHours < 24) return `Hace ${diffHours}h`
  if (diffDays < 7) return `Hace ${diffDays} días`
  
  return date.toLocaleDateString('es-ES', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  })
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacing.lg,
    backgroundColor: theme.colors.card,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.foreground,
  },
  headerSubtitle: {
    fontSize: 14,
    color: theme.colors.mutedForeground,
    marginTop: 4,
  },
  markAllButton: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.primary + '10', // 10% opacity
  },
  markAllText: {
    color: theme.colors.primary,
    fontWeight: '600',
    fontSize: 14,
  },
  listContainer: {
    padding: theme.spacing.md,
    paddingBottom: theme.spacing.xl * 2,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: theme.colors.card,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  unreadCard: {
    backgroundColor: '#e3f2fd',
    borderLeftWidth: 4,
    borderLeftColor: theme.colors.primary,
    borderColor: theme.colors.primary + '20', // 20% opacity
  },
  iconContainer: {
    marginRight: theme.spacing.md,
  },
  petImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: theme.colors.border,
  },
  iconCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconText: {
    fontSize: 24,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 15,
    fontWeight: '500',
    color: theme.colors.foreground,
    lineHeight: 20,
  },
  unreadTitle: {
    fontWeight: 'bold',
  },
  comment: {
    fontSize: 13,
    color: theme.colors.mutedForeground,
    marginTop: 6,
    lineHeight: 18,
  },
  date: {
    fontSize: 12,
    color: theme.colors.mutedForeground,
    marginTop: 8,
  },
  ctaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  cta: {
    fontSize: 13,
    color: theme.colors.primary,
    fontWeight: '600',
    marginLeft: 4,
  },
  unreadDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: theme.colors.primary,
    marginLeft: theme.spacing.sm,
    alignSelf: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.xl * 2,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: theme.spacing.lg,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.foreground,
    marginBottom: theme.spacing.sm,
  },
  emptySubtext: {
    fontSize: 14,
    color: theme.colors.mutedForeground,
    textAlign: 'center',
    lineHeight: 20,
  },
})

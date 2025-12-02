import { theme } from '@/constants/theme'
import { useAuth } from '@/contexts/AuthContext'
import { ApiService } from '@/services/api-service'
import { MaterialIcons } from '@expo/vector-icons'
import { useFocusEffect, useRouter } from 'expo-router'
import React, { useCallback, useRef, useState } from 'react'
import {
  Animated,
  Modal,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native'
import { Button } from '../ui/Button'

export function HeaderBar() {
  const { user, signOut } = useAuth()
  const router = useRouter()
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [unreadCount, setUnreadCount] = useState(0)
  const fadeAnim = useRef(new Animated.Value(0)).current

  // ✅ Actualizar contador de notificaciones al entrar/volver a la pantalla
  useFocusEffect(
    useCallback(() => {
      if (user) {
        loadUnreadCount()
      }
    }, [user])
  )

  const loadUnreadCount = async () => {
    try {
      const count = await ApiService.getUnreadNotificationsCount()
      setUnreadCount(count)
    } catch (error) {
      console.error('Error loading unread count:', error)
    }
  }

  const handleNotificationsClick = () => {
    router.push('/(tabs)/notificaciones' as any)
  }

  const handleProfileClick = () => {
    setDropdownOpen(false)
    // TODO: Navegar a perfil cuando esté implementado
    console.log('Navegar a perfil')
  }

  const handleSettingsClick = () => {
    setDropdownOpen(false)
    // TODO: Navegar a configuración cuando esté implementado
    console.log('Navegar a configuración')
  }

  const handleSignOut = () => {
    setDropdownOpen(false)
    signOut()
  }

  const toggleDropdown = () => {
    if (dropdownOpen) {
      // Cerrar
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }).start(() => setDropdownOpen(false))
    } else {
      // Abrir
      setDropdownOpen(true)
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }).start()
    }
  }

  return (
    <View style={styles.header}>
      {/* Logo y título */}
      <View style={styles.logoContainer}>
        <View style={styles.logoCircle}>
          <Text style={styles.logoEmoji}>🐾</Text>
        </View>
        <Text style={styles.title}>DalePata</Text>
      </View>

      {/* Acciones */}
      <View style={styles.actions}>
        {/* Botón de notificaciones con contador */}
        <View style={styles.notificationContainer}>
          <Button variant="ghost" size="icon" onPress={handleNotificationsClick}>
            <MaterialIcons name="notifications" size={24} color={theme.colors.foreground} />
          </Button>
          {unreadCount > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>
                {unreadCount > 99 ? '99+' : unreadCount}
              </Text>
            </View>
          )}
        </View>

        {/* Usuario */}
        {user ? (
          <View>
            <Button variant="ghost" size="icon" onPress={toggleDropdown}>
              <MaterialIcons name="account-circle" size={24} color={theme.colors.foreground} />
            </Button>

            {/* Dropdown Modal */}
            <Modal
              visible={dropdownOpen}
              transparent
              animationType="none"
              onRequestClose={() => setDropdownOpen(false)}
            >
              <TouchableWithoutFeedback onPress={() => setDropdownOpen(false)}>
                <View style={styles.modalOverlay}>
                  <TouchableWithoutFeedback>
                    <Animated.View
                      style={[
                        styles.dropdown,
                        {
                          opacity: fadeAnim,
                          transform: [
                            {
                              translateY: fadeAnim.interpolate({
                                inputRange: [0, 1],
                                outputRange: [-10, 0],
                              }),
                            },
                          ],
                        },
                      ]}
                    >
                      {/* Info del usuario */}
                      <View style={styles.userInfo}>
                        <Text style={styles.userName}>
                          {user.nombre} {user.apellido}
                        </Text>
                      </View>
                      <View style={styles.userEmail}>
                        <Text style={styles.userEmailText}>{user.email}</Text>
                      </View>

                      {/* Opciones */}
                      <View style={styles.dropdownOptions}>
                        <TouchableOpacity style={styles.dropdownOption} onPress={handleProfileClick}>
                          <MaterialIcons name="person" size={20} color={theme.colors.foreground} />
                          <Text style={styles.dropdownOptionText}>Mi Perfil</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                          style={styles.dropdownOption}
                          onPress={handleSettingsClick}
                        >
                          <MaterialIcons name="settings" size={20} color={theme.colors.foreground} />
                          <Text style={styles.dropdownOptionText}>Configuración</Text>
                        </TouchableOpacity>

                        <View style={styles.divider} />

                        <TouchableOpacity
                          style={styles.dropdownOption}
                          onPress={handleSignOut}
                        >
                          <MaterialIcons
                            name="logout"
                            size={20}
                            color={theme.colors.destructive}
                          />
                          <Text style={[styles.dropdownOptionText, styles.logoutText]}>
                            Cerrar Sesión
                          </Text>
                        </TouchableOpacity>
                      </View>
                    </Animated.View>
                  </TouchableWithoutFeedback>
                </View>
              </TouchableWithoutFeedback>
            </Modal>
          </View>
        ) : (
          <View style={styles.authButtons}>
            <Button variant="ghost" size="sm" onPress={() => router.push('/auth/login')}>
              Iniciar Sesión
            </Button>
            <Button size="sm" onPress={() => router.push('/auth/register')}>
              Registrarse
            </Button>
          </View>
        )}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    backgroundColor: theme.colors.card,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
  },
  logoCircle: {
    width: 32,
    height: 32,
    backgroundColor: theme.colors.primary,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoEmoji: {
    fontSize: 16,
  },
  title: {
    fontSize: theme.fontSize.xl,
    fontWeight: 'bold',
    color: theme.colors.primary,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  notificationContainer: {
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: theme.colors.destructive,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 5,
    borderWidth: 2,
    borderColor: theme.colors.card,
  },
  badgeText: {
    color: theme.colors.destructiveForeground,
    fontSize: 11,
    fontWeight: 'bold',
  },
  authButtons: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
    paddingTop: 60, // Debajo del header
    paddingRight: theme.spacing.lg,
  },
  dropdown: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.md,
    minWidth: 220,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  userInfo: {
    paddingHorizontal: theme.spacing.md,
    paddingTop: theme.spacing.md,
    paddingBottom: theme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  userName: {
    fontSize: theme.fontSize.sm,
    fontWeight: '600',
    color: theme.colors.foreground,
  },
  userEmail: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.xs,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  userEmailText: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.mutedForeground,
  },
  dropdownOptions: {
    paddingVertical: theme.spacing.xs,
  },
  dropdownOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.md,
    gap: theme.spacing.sm,
  },
  dropdownOptionText: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.foreground,
  },
  logoutText: {
    color: theme.colors.destructive,
  },
  divider: {
    height: 1,
    backgroundColor: theme.colors.border,
    marginVertical: theme.spacing.xs,
  },
})

import { theme } from '@/constants/theme'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'expo-router'
import React, { ReactNode, useEffect, useState } from 'react'
import { ActivityIndicator, Alert, StyleSheet, Text, View } from 'react-native'

interface UserProtectedRouteProps {
  children: ReactNode
}

export default function UserProtectedRoute({ children }: UserProtectedRouteProps) {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [isChecking, setIsChecking] = useState(true)

  useEffect(() => {
    if (!loading) {
      // 1. Si NO hay usuario → Login
      if (!user) {
        router.replace('/auth/login')
        return
      }

      // 2. Obtener tipo de usuario
      const userType = user.userType || user.tipo || user.role || user.user_type

      // 3. Si es usuario común → OK (continuar)
      if (userType === 'usuario') {
        setIsChecking(false)
        return
      }

      // 4. Si es OTRO tipo (refugio, veterinaria, medico) → Rechazar
      if (userType === 'refugio' || userType === 'veterinaria' || userType === 'medico') {
        Alert.alert(
          'Acceso Denegado',
          'Esta aplicación es solo para usuarios comunes. Los refugios, veterinarias y médicos deben usar la versión web.',
          [
            {
              text: 'OK',
              onPress: () => {
                router.replace('/auth/login')
              },
            },
          ]
        )
        return
      }

      // 5. Si llegamos aquí, permitir acceso
      setIsChecking(false)
    }
  }, [user, loading, router])

  // Mostrar loading mientras verificamos
  if (loading || isChecking) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={styles.loadingText}>Verificando acceso...</Text>
      </View>
    )
  }

  // Renderizar contenido si el usuario puede acceder
  return <>{children}</>
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
  },
  loadingText: {
    marginTop: theme.spacing.md,
    fontSize: theme.fontSize.base,
    color: theme.colors.mutedForeground,
  },
})

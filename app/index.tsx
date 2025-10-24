import { theme } from '@/constants/theme'
import { useAuth } from '@/contexts'
import { router } from 'expo-router'
import { useEffect } from 'react'
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native'

export default function WelcomeScreen() {
  const { user, loading } = useAuth()

  // Verificar si ya hay sesión iniciada
  useEffect(() => {
    if (!loading) {
      if (user) {
        console.log('✅ Usuario ya autenticado, redirigiendo...')
        
        // Redirigir según el tipo de usuario
        const userType = user.userType || user.tipo || user.role || user.user_type
        if (userType === 'refugio') {
          router.replace('/admin/refugio' as any)
        } else {
          router.replace('/(tabs)' as any)
        }
      }
    }
  }, [user, loading])

  // Mostrar loading mientras se verifica la sesión
  if (loading) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color="#89C7A8" />
        <Text style={styles.loadingText}>Cargando...</Text>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {/* Logo o imagen */}
        <View style={styles.logoContainer}>
          <Text style={styles.logo}>🐾</Text>
          <Text style={styles.appName}>DalePata</Text>
          <Text style={styles.tagline}>
            Encuentra tu mejor amigo
          </Text>
        </View>

        {/* Descripción */}
        <View style={styles.descriptionContainer}>
          <Text style={styles.description}>
            Conectamos mascotas en adopción con personas que quieren darles un hogar
          </Text>
        </View>

        {/* Botones */}
        <View style={styles.buttonsContainer}>
          <TouchableOpacity
            style={[styles.button, styles.primaryButton]}
            onPress={() => router.push('/auth/login' as any)}
            activeOpacity={0.8}
          >
            <Text style={styles.primaryButtonText}>Iniciar Sesión</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.secondaryButton]}
            onPress={() => router.push('/auth/register' as any)}
            activeOpacity={0.8}
          >
            <Text style={styles.secondaryButtonText}>Crear Cuenta</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.skipButton}
            onPress={() => router.push('/(tabs)' as any)}
            activeOpacity={0.6}
          >
            <Text style={styles.skipButtonText}>Explorar sin cuenta</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.card,
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
    padding: theme.spacing.xl,
    paddingTop: 80,
    paddingBottom: 40,
  },
  logoContainer: {
    alignItems: 'center',
  },
  logo: {
    fontSize: 80,
    marginBottom: theme.spacing.lg,
  },
  appName: {
    fontSize: 36,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.headerTitle, // oklch(0.75 0.08 160)
    marginBottom: theme.spacing.sm,
  },
  tagline: {
    fontSize: theme.fontSize.base,
    color: theme.colors.mutedForeground,
  },
  descriptionContainer: {
    paddingHorizontal: 20,
  },
  description: {
    fontSize: theme.fontSize.xl,
    color: theme.colors.mutedForeground,
    textAlign: 'center',
    lineHeight: 26,
  },
  buttonsContainer: {
    gap: theme.spacing.md,
  },
  button: {
    padding: theme.spacing.lg,
    borderRadius: theme.borderRadius.lg,
    alignItems: 'center',
  },
  primaryButton: {
    backgroundColor: theme.colors.primary,
  },
  primaryButtonText: {
    color: theme.colors.primaryForeground,
    fontSize: theme.fontSize.base,
    fontWeight: theme.fontWeight.semibold,
  },
  secondaryButton: {
    backgroundColor: theme.colors.card,
    borderWidth: 2,
    borderColor: theme.colors.primary,
  },
  secondaryButtonText: {
    color: theme.colors.primary,
    fontSize: theme.fontSize.base,
    fontWeight: theme.fontWeight.semibold,
  },
  skipButton: {
    padding: theme.spacing.md,
    alignItems: 'center',
  },
  skipButtonText: {
    color: theme.colors.mutedForeground,
    fontSize: theme.fontSize.sm,
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: theme.spacing.md,
    fontSize: theme.fontSize.base,
    color: theme.colors.mutedForeground,
  },
})

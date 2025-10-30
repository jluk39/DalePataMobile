import { theme } from '@/constants/theme'
import { useAuth } from '@/contexts'
import { router } from 'expo-router'
import React, { useState } from 'react'
import {
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native'

export default function LoginScreen() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const { signIn } = useAuth()

  const handleLogin = async () => {
    if (!email || !password) {
      setError('Por favor completa todos los campos')
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const result = await signIn(email.trim(), password)
      
      console.log('✅ Login exitoso:', result.user)
      
      // Redirigir según el tipo de usuario (igual que en web)
      if (result.user) {
        // El campo correcto es userType (con U mayúscula)
        const userType = result.user.userType || result.user.tipo || result.user.role || result.user.user_type
        
        if (userType === 'refugio') {
          // Usuarios refugio van directamente al panel admin
          router.replace('/admin/refugio' as any)
        } else {
          // Usuarios comunes van directamente a /home
          router.replace('/(tabs)/home' as any)
        }
      } else {
        // Fallback: ir a /home
        router.replace('/(tabs)/home' as any)
      }
    } catch (error: any) {
      console.error('❌ Error de login:', error)
      setError(error instanceof Error ? error.message : 'Ocurrió un error')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        {/* Card */}
        <View style={styles.card}>
          {/* CardHeader */}
          <View style={styles.header}>
            <Text style={styles.title}>Iniciar Sesión</Text>
            <Text style={styles.description}>
              Ingresa tus datos para acceder a DalePata
            </Text>
          </View>

          {/* CardContent */}
          <View style={styles.content}>
            {/* Email Input */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Correo Electrónico</Text>
              <TextInput
                style={[styles.input, error && styles.inputError]}
                placeholder="tu@email.com"
                placeholderTextColor="#999"
                value={email}
                onChangeText={(text) => {
                  setEmail(text)
                  if (error) setError(null) // Limpiar error al escribir
                }}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                editable={!isLoading}
                returnKeyType="next"
              />
            </View>

            {/* Password Input */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Contraseña</Text>
              <TextInput
                style={[styles.input, error && styles.inputError]}
                placeholder="••••••••"
                placeholderTextColor="#999"
                value={password}
                onChangeText={(text) => {
                  setPassword(text)
                  if (error) setError(null) // Limpiar error al escribir
                }}
                secureTextEntry
                autoCapitalize="none"
                editable={!isLoading}
                returnKeyType="done"
                onSubmitEditing={handleLogin}
              />
            </View>

            {/* Error Message */}
            {error && (
              <Text style={styles.error}>{error}</Text>
            )}

            {/* Submit Button */}
            <TouchableOpacity 
              style={[styles.button, isLoading && styles.buttonDisabled]}
              onPress={handleLogin}
              disabled={isLoading}
              activeOpacity={0.8}
            >
              {isLoading ? (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator color="#fff" size="small" />
                  <Text style={styles.buttonText}> Iniciando sesión...</Text>
                </View>
              ) : (
                <Text style={styles.buttonText}>Iniciar Sesión</Text>
              )}
            </TouchableOpacity>

            {/* Link to Register */}
            <View style={styles.linkContainer}>
              <Text style={styles.linkText}>¿No tienes cuenta? </Text>
              <TouchableOpacity 
                onPress={() => router.push('/auth/register' as any)}
                disabled={isLoading}
              >
                <Text style={styles.link}>Regístrate</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: theme.spacing.xl,
  },
  card: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.xl,
    ...theme.shadows.card,
  },
  header: {
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
  },
  title: {
    fontSize: theme.fontSize['2xl'],
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.headerTitle, // oklch(0.75 0.08 160)
    marginBottom: theme.spacing.sm,
  },
  description: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.mutedForeground,
    textAlign: 'center',
  },
  content: {
    // gap no funciona en todas las versiones de RN
  },
  inputGroup: {
    marginBottom: theme.spacing.lg,
  },
  label: {
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.medium,
    marginBottom: theme.spacing.sm,
    color: theme.colors.cardForeground,
  },
  input: {
    borderWidth: 1,
    borderColor: theme.colors.input,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    fontSize: theme.fontSize.base,
    backgroundColor: theme.colors.inputBackground,
    color: theme.colors.foreground,
  },
  inputError: {
    borderColor: theme.colors.destructive,
    borderWidth: 2,
    shadowColor: theme.colors.destructive,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  error: {
    color: theme.colors.destructive,
    fontSize: theme.fontSize.sm,
    marginBottom: theme.spacing.sm,
  },
  button: {
    backgroundColor: theme.colors.primary,
    padding: theme.spacing.lg,
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
    marginTop: theme.spacing.sm,
  },
  buttonDisabled: {
    opacity: theme.colors.disabledOpacity,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  buttonText: {
    color: theme.colors.primaryForeground,
    fontSize: theme.fontSize.base,
    fontWeight: theme.fontWeight.semibold,
  },
  linkContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: theme.spacing.lg,
  },
  linkText: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.mutedForeground,
  },
  link: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.primary,
    fontWeight: theme.fontWeight.semibold,
  },
})

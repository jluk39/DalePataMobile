import { theme } from '@/constants/theme'
import { useAuth } from '@/contexts'
import { Picker } from '@react-native-picker/picker'
import { router } from 'expo-router'
import React, { useState } from 'react'
import {
    ActivityIndicator,
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native'

type UserType = 'usuario' | 'refugio' | 'veterinaria' | 'medico'

export default function RegisterScreen() {
  const [userType, setUserType] = useState<UserType>('usuario')
  const { registerByType } = useAuth()
  
  // Campos comunes
  const [nombre, setNombre] = useState('')
  const [apellido, setApellido] = useState('')
  const [email, setEmail] = useState('')
  const [telefono, setTelefono] = useState('')
  const [direccion, setDireccion] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  
  // Campos para refugio
  const [tipoOrganizacion, setTipoOrganizacion] = useState('')
  const [capacidad, setCapacidad] = useState('')
  
  // Campos para veterinaria
  const [especialidades, setEspecialidades] = useState('')
  const [horarios, setHorarios] = useState('')
  
  // Campos para médico
  const [especialidad, setEspecialidad] = useState('')
  const [matricula, setMatricula] = useState('')
  const [veterinariaId, setVeterinariaId] = useState('')
  
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleRegister = async () => {
    // Validaciones básicas
    if (!nombre.trim() || !email.trim() || !password.trim()) {
      setError('Por favor completa todos los campos obligatorios')
      return
    }

    if (userType === 'usuario' && !apellido.trim()) {
      setError('El apellido es obligatorio para usuarios')
      return
    }

    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden')
      return
    }

    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres')
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      // Preparar datos según tipo de usuario
      let userData: any = {
        nombre: nombre.trim(),
        email: email.trim(),
        password: password.trim(),
      }

      // Campos opcionales comunes
      if (telefono.trim()) userData.telefono = telefono.trim()

      // Campos según tipo de usuario
      switch (userType) {
        case 'usuario':
          userData.apellido = apellido.trim()
          break

        case 'refugio':
          if (direccion.trim()) userData.direccion = direccion.trim()
          if (tipoOrganizacion.trim()) userData.tipoOrganizacion = tipoOrganizacion.trim()
          if (capacidad.trim()) userData.capacidad = parseInt(capacidad)
          break

        case 'veterinaria':
          if (direccion.trim()) userData.direccion = direccion.trim()
          if (especialidades.trim()) userData.especialidades = especialidades.trim()
          if (horarios.trim()) userData.horarios = horarios.trim()
          break

        case 'medico':
          if (especialidad.trim()) userData.especialidad = especialidad.trim()
          if (matricula.trim()) userData.matricula = matricula.trim()
          if (veterinariaId.trim()) userData.veterinariaId = parseInt(veterinariaId)
          break
      }

      console.log('📤 Registrando usuario:', { ...userData, password: '***' })

      const result = await registerByType(userData, userType)
      
      console.log('✅ Registro exitoso:', result)

      Alert.alert(
        '¡Registro Exitoso!',
        'Tu cuenta ha sido creada. Por favor inicia sesión.',
        [
          {
            text: 'Iniciar Sesión',
            onPress: () => router.replace('/auth/login' as any)
          }
        ]
      )
    } catch (error: any) {
      console.error('❌ Error de registro:', error)
      setError(error.message || 'Error al registrar. Por favor intenta nuevamente.')
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
        showsVerticalScrollIndicator={false}
      >
        {/* Card */}
        <View style={styles.card}>
          {/* CardHeader */}
          <View style={styles.header}>
            <Text style={styles.title}>Crear Cuenta</Text>
            <Text style={styles.description}>
              Únete a la comunidad DalePata
            </Text>
          </View>

          {/* CardContent */}
          <View style={styles.content}>
            {/* Tipo de Usuario */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Tipo de Cuenta</Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={userType}
                  onValueChange={(value: any) => setUserType(value as UserType)}
                  enabled={!isLoading}
                  style={styles.picker}
                >
                  <Picker.Item label="Usuario" value="usuario" />
                  <Picker.Item label="Refugio" value="refugio" />
                  <Picker.Item label="Veterinaria" value="veterinaria" />
                  <Picker.Item label="Médico Veterinario" value="medico" />
                </Picker>
              </View>
            </View>

            {/* CAMPOS COMUNES */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Nombre *</Text>
              <TextInput
                style={styles.input}
                placeholder={userType === 'usuario' ? 'Tu nombre' : 'Nombre de la organización'}
                placeholderTextColor="#999"
                value={nombre}
                onChangeText={setNombre}
                editable={!isLoading}
              />
            </View>

            {userType === 'usuario' && (
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Apellido *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Tu apellido"
                  placeholderTextColor="#999"
                  value={apellido}
                  onChangeText={setApellido}
                  editable={!isLoading}
                />
              </View>
            )}

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Correo Electrónico *</Text>
              <TextInput
                style={styles.input}
                placeholder="tu@email.com"
                placeholderTextColor="#999"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                editable={!isLoading}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Teléfono</Text>
              <TextInput
                style={styles.input}
                placeholder="555-1234"
                placeholderTextColor="#999"
                value={telefono}
                onChangeText={setTelefono}
                keyboardType="phone-pad"
                editable={!isLoading}
              />
            </View>

            {/* Dirección para organizaciones */}
            {(userType === 'refugio' || userType === 'veterinaria') && (
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Dirección</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Calle, número, ciudad"
                  placeholderTextColor="#999"
                  value={direccion}
                  onChangeText={setDireccion}
                  editable={!isLoading}
                />
              </View>
            )}

            {/* CAMPOS ESPECÍFICOS POR TIPO */}
            
            {/* Refugio */}
            {userType === 'refugio' && (
              <>
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Tipo de Organización</Text>
                  <View style={styles.pickerContainer}>
                    <Picker
                      selectedValue={tipoOrganizacion}
                      onValueChange={setTipoOrganizacion}
                      enabled={!isLoading}
                      style={styles.picker}
                    >
                      <Picker.Item label="Selecciona..." value="" />
                      <Picker.Item label="Refugio" value="refugio" />
                      <Picker.Item label="Fundación" value="fundacion" />
                      <Picker.Item label="Protectora" value="protectora" />
                    </Picker>
                  </View>
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Capacidad (número de animales)</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="50"
                    placeholderTextColor="#999"
                    value={capacidad}
                    onChangeText={setCapacidad}
                    keyboardType="numeric"
                    editable={!isLoading}
                  />
                </View>
              </>
            )}

            {/* Veterinaria */}
            {userType === 'veterinaria' && (
              <>
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Especialidades</Text>
                  <TextInput
                    style={[styles.input, styles.textArea]}
                    placeholder="Cirugía, Medicina general, etc."
                    placeholderTextColor="#999"
                    value={especialidades}
                    onChangeText={setEspecialidades}
                    multiline
                    numberOfLines={3}
                    textAlignVertical="top"
                    editable={!isLoading}
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Horarios</Text>
                  <TextInput
                    style={[styles.input, styles.textArea]}
                    placeholder="Lunes a Viernes: 9am - 6pm"
                    placeholderTextColor="#999"
                    value={horarios}
                    onChangeText={setHorarios}
                    multiline
                    numberOfLines={3}
                    textAlignVertical="top"
                    editable={!isLoading}
                  />
                </View>
              </>
            )}

            {/* Médico */}
            {userType === 'medico' && (
              <>
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Especialidad</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Cirujano, Dermatólogo, etc."
                    placeholderTextColor="#999"
                    value={especialidad}
                    onChangeText={setEspecialidad}
                    editable={!isLoading}
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Matrícula Profesional</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="12345"
                    placeholderTextColor="#999"
                    value={matricula}
                    onChangeText={setMatricula}
                    editable={!isLoading}
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.label}>ID Veterinaria</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="ID de la veterinaria donde trabajas"
                    placeholderTextColor="#999"
                    value={veterinariaId}
                    onChangeText={setVeterinariaId}
                    keyboardType="numeric"
                    editable={!isLoading}
                  />
                </View>
              </>
            )}

            {/* Contraseñas */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Contraseña *</Text>
              <TextInput
                style={styles.input}
                placeholder="Mínimo 6 caracteres"
                placeholderTextColor="#999"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                autoCapitalize="none"
                editable={!isLoading}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Confirmar Contraseña *</Text>
              <TextInput
                style={styles.input}
                placeholder="Repite tu contraseña"
                placeholderTextColor="#999"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
                autoCapitalize="none"
                editable={!isLoading}
              />
            </View>

            {/* Error Message */}
            {error && (
              <View style={styles.errorContainer}>
                <Text style={styles.error}>{error}</Text>
              </View>
            )}

            {/* Submit Button */}
            <TouchableOpacity 
              style={[styles.button, isLoading && styles.buttonDisabled]}
              onPress={handleRegister}
              disabled={isLoading}
              activeOpacity={0.8}
            >
              {isLoading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>Crear Cuenta</Text>
              )}
            </TouchableOpacity>

            {/* Link to Login */}
            <View style={styles.linkContainer}>
              <Text style={styles.linkText}>¿Ya tienes cuenta? </Text>
              <TouchableOpacity 
                onPress={() => router.push('/auth/login' as any)}
                disabled={isLoading}
              >
                <Text style={styles.link}>Iniciar Sesión</Text>
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
    padding: theme.spacing.xl,
    paddingTop: 60, // Para dar espacio al header
    paddingBottom: 40,
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
    // Campos se espacian con marginBottom en inputGroup
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
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: theme.colors.input,
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.card,
    overflow: 'hidden',
  },
  picker: {
    height: 50,
    color: theme.colors.foreground,
  },
  errorContainer: {
    backgroundColor: theme.colors.ringError,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.lg,
    borderWidth: 1,
    borderColor: theme.colors.destructive,
  },
  error: {
    color: theme.colors.destructive,
    fontSize: theme.fontSize.sm,
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

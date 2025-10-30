import { theme } from '@/constants/theme'
import { ApiService } from '@/services/api-service'
import { MaterialIcons } from '@expo/vector-icons'
import * as ImagePicker from 'expo-image-picker'
import React, { useState } from 'react'
import {
    ActivityIndicator,
    Alert,
    Image,
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native'

interface AddPetModalProps {
  visible: boolean
  onClose: () => void
  onSuccess: () => void
}

interface ImageState {
  uri: string
  fileName: string
  type: string
}

export function AddPetModal({ visible, onClose, onSuccess }: AddPetModalProps) {
  // Estados del formulario
  const [nombre, setNombre] = useState('')
  const [especie, setEspecie] = useState<'Perro' | 'Gato' | ''>('')
  const [sexo, setSexo] = useState<'Macho' | 'Hembra' | ''>('')
  const [raza, setRaza] = useState('')
  const [color, setColor] = useState('')
  const [descripcion, setDescripcion] = useState('')
  const [image, setImage] = useState<ImageState | null>(null)
  const [loading, setLoading] = useState(false)

  // Seleccionar imagen
  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync()

    if (status !== 'granted') {
      Alert.alert(
        'Permisos necesarios',
        'Necesitamos acceso a tu galería para seleccionar una foto'
      )
      return
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    })

    if (!result.canceled) {
      const selectedImage = result.assets[0]
      
      // Validar tamaño (máx 5MB)
      if (selectedImage.fileSize && selectedImage.fileSize > 5 * 1024 * 1024) {
        Alert.alert('Error', 'La imagen no puede superar los 5MB')
        return
      }

      setImage({
        uri: selectedImage.uri,
        fileName: selectedImage.fileName || `pet_${Date.now()}.jpg`,
        type: selectedImage.mimeType || 'image/jpeg',
      })
    }
  }

  // Limpiar formulario
  const resetForm = () => {
    setNombre('')
    setEspecie('')
    setSexo('')
    setRaza('')
    setColor('')
    setDescripcion('')
    setImage(null)
  }

  // Validar y enviar
  const handleSubmit = async () => {
    // Validar campos obligatorios
    if (!nombre.trim()) {
      Alert.alert('Error', 'El nombre es obligatorio')
      return
    }
    if (!especie) {
      Alert.alert('Error', 'Debes seleccionar una especie')
      return
    }
    if (!sexo) {
      Alert.alert('Error', 'Debes seleccionar el sexo')
      return
    }

    setLoading(true)

    try {
      // Crear FormData
      const formData = new FormData()
      
      // Campos obligatorios
      formData.append('nombre', nombre.trim())
      formData.append('especie', especie)
      formData.append('sexo', sexo)
      
      // Valores por defecto
      formData.append('estado_salud', 'Saludable')
      formData.append('en_adopcion', 'false')
      
      // Campos opcionales
      if (raza.trim()) formData.append('raza', raza.trim())
      if (color.trim()) formData.append('color', color.trim())
      if (descripcion.trim()) formData.append('descripcion', descripcion.trim())
      
      // Imagen
      if (image) {
        formData.append('imagen', {
          uri: image.uri,
          name: image.fileName,
          type: image.type,
        } as any)
      }

      // Enviar al backend
      await ApiService.createPet(formData)

      Alert.alert('Éxito', 'Mascota registrada correctamente', [
        {
          text: 'OK',
          onPress: () => {
            resetForm()
            onSuccess()
            onClose()
          },
        },
      ])
    } catch (error: any) {
      console.error('Error al crear mascota:', error)
      Alert.alert('Error', error.message || 'No se pudo registrar la mascota')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Agregar Mascota</Text>
            <TouchableOpacity onPress={onClose} disabled={loading}>
              <MaterialIcons name="close" size={24} color={theme.colors.foreground} />
            </TouchableOpacity>
          </View>

          {/* Content */}
          <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
            {/* Nombre */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>
                Nombre <Text style={styles.required}>*</Text>
              </Text>
              <TextInput
                style={styles.input}
                placeholder="Ej: Luna"
                value={nombre}
                onChangeText={setNombre}
                editable={!loading}
              />
            </View>

            {/* Especie */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>
                Especie <Text style={styles.required}>*</Text>
              </Text>
              <View style={styles.optionsRow}>
                <TouchableOpacity
                  style={[styles.option, especie === 'Perro' && styles.optionActive]}
                  onPress={() => setEspecie('Perro')}
                  disabled={loading}
                >
                  <MaterialIcons
                    name="pets"
                    size={20}
                    color={especie === 'Perro' ? theme.colors.primaryForeground : theme.colors.foreground}
                  />
                  <Text
                    style={[
                      styles.optionText,
                      especie === 'Perro' && styles.optionTextActive,
                    ]}
                  >
                    Perro
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.option, especie === 'Gato' && styles.optionActive]}
                  onPress={() => setEspecie('Gato')}
                  disabled={loading}
                >
                  <MaterialIcons
                    name="pets"
                    size={20}
                    color={especie === 'Gato' ? theme.colors.primaryForeground : theme.colors.foreground}
                  />
                  <Text
                    style={[
                      styles.optionText,
                      especie === 'Gato' && styles.optionTextActive,
                    ]}
                  >
                    Gato
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Sexo */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>
                Sexo <Text style={styles.required}>*</Text>
              </Text>
              <View style={styles.optionsRow}>
                <TouchableOpacity
                  style={[styles.option, sexo === 'Macho' && styles.optionActive]}
                  onPress={() => setSexo('Macho')}
                  disabled={loading}
                >
                  <MaterialIcons
                    name="male"
                    size={20}
                    color={sexo === 'Macho' ? theme.colors.primaryForeground : theme.colors.foreground}
                  />
                  <Text
                    style={[
                      styles.optionText,
                      sexo === 'Macho' && styles.optionTextActive,
                    ]}
                  >
                    Macho
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.option, sexo === 'Hembra' && styles.optionActive]}
                  onPress={() => setSexo('Hembra')}
                  disabled={loading}
                >
                  <MaterialIcons
                    name="female"
                    size={20}
                    color={sexo === 'Hembra' ? theme.colors.primaryForeground : theme.colors.foreground}
                  />
                  <Text
                    style={[
                      styles.optionText,
                      sexo === 'Hembra' && styles.optionTextActive,
                    ]}
                  >
                    Hembra
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Raza (opcional) */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Raza (opcional)</Text>
              <TextInput
                style={styles.input}
                placeholder="Ej: Golden Retriever"
                value={raza}
                onChangeText={setRaza}
                editable={!loading}
              />
            </View>

            {/* Color (opcional) */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Color (opcional)</Text>
              <TextInput
                style={styles.input}
                placeholder="Ej: Dorado"
                value={color}
                onChangeText={setColor}
                editable={!loading}
              />
            </View>

            {/* Descripción (opcional) */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Descripción (opcional)</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Cuéntanos sobre tu mascota..."
                value={descripcion}
                onChangeText={setDescripcion}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
                editable={!loading}
              />
            </View>

            {/* Imagen (opcional) */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Foto (opcional)</Text>
              <TouchableOpacity
                style={styles.imagePickerButton}
                onPress={pickImage}
                disabled={loading}
              >
                {image ? (
                  <View style={styles.imagePreviewContainer}>
                    <Image source={{ uri: image.uri }} style={styles.imagePreview} />
                    <TouchableOpacity
                      style={styles.removeImageButton}
                      onPress={() => setImage(null)}
                      disabled={loading}
                    >
                      <MaterialIcons name="close" size={20} color="#fff" />
                    </TouchableOpacity>
                  </View>
                ) : (
                  <View style={styles.imagePickerContent}>
                    <MaterialIcons name="add-a-photo" size={32} color={theme.colors.primary} />
                    <Text style={styles.imagePickerText}>Agregar foto</Text>
                  </View>
                )}
              </TouchableOpacity>
            </View>
          </ScrollView>

          {/* Footer */}
          <View style={styles.footer}>
            <TouchableOpacity
              style={[styles.button, styles.buttonCancel]}
              onPress={onClose}
              disabled={loading}
            >
              <Text style={styles.buttonCancelText}>Cancelar</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.buttonSubmit, loading && styles.buttonDisabled]}
              onPress={handleSubmit}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color={theme.colors.primaryForeground} />
              ) : (
                <Text style={styles.buttonSubmitText}>Guardar</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: theme.colors.card,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '90%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  title: {
    fontSize: theme.fontSize['2xl'],
    fontWeight: 'bold',
    color: theme.colors.foreground,
  },
  scrollView: {
    padding: theme.spacing.lg,
  },
  inputGroup: {
    marginBottom: theme.spacing.lg,
  },
  label: {
    fontSize: theme.fontSize.base,
    fontWeight: '600',
    color: theme.colors.foreground,
    marginBottom: theme.spacing.sm,
  },
  required: {
    color: theme.colors.destructive,
  },
  input: {
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    fontSize: theme.fontSize.base,
    color: theme.colors.foreground,
    backgroundColor: theme.colors.background,
  },
  textArea: {
    height: 100,
    paddingTop: theme.spacing.md,
  },
  optionsRow: {
    flexDirection: 'row',
    gap: theme.spacing.md,
  },
  option: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing.sm,
    padding: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.background,
  },
  optionActive: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  optionText: {
    fontSize: theme.fontSize.base,
    fontWeight: '600',
    color: theme.colors.foreground,
  },
  optionTextActive: {
    color: theme.colors.primaryForeground,
  },
  imagePickerButton: {
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.md,
    borderStyle: 'dashed',
    padding: theme.spacing.lg,
    alignItems: 'center',
    backgroundColor: theme.colors.background,
  },
  imagePickerContent: {
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  imagePickerText: {
    fontSize: theme.fontSize.base,
    color: theme.colors.mutedForeground,
  },
  imagePreviewContainer: {
    position: 'relative',
    width: '100%',
    height: 200,
  },
  imagePreview: {
    width: '100%',
    height: '100%',
    borderRadius: theme.borderRadius.md,
  },
  removeImageButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderRadius: 16,
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  footer: {
    flexDirection: 'row',
    gap: theme.spacing.md,
    padding: theme.spacing.lg,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  button: {
    flex: 1,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonCancel: {
    backgroundColor: theme.colors.background,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  buttonCancelText: {
    fontSize: theme.fontSize.base,
    fontWeight: '600',
    color: theme.colors.foreground,
  },
  buttonSubmit: {
    backgroundColor: theme.colors.primary,
  },
  buttonSubmitText: {
    fontSize: theme.fontSize.base,
    fontWeight: '600',
    color: theme.colors.primaryForeground,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
})

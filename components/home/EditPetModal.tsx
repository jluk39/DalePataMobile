import { theme } from '@/constants/theme'
import { ApiService, Pet } from '@/services/api-service'
import { MaterialIcons } from '@expo/vector-icons'
import * as ImagePicker from 'expo-image-picker'
import React, { useEffect, useState } from 'react'
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

interface EditPetModalProps {
  visible: boolean
  onClose: () => void
  pet: Pet | null
  onSuccess: (updatedPet: any) => void
}

interface ImageState {
  uri: string
  fileName: string
  type: string
  fileSize?: number
}

export function EditPetModal({ visible, onClose, pet, onSuccess }: EditPetModalProps) {
  // Estados del formulario
  const [nombre, setNombre] = useState('')
  const [especie, setEspecie] = useState<'Perro' | 'Gato' | ''>('')
  const [sexo, setSexo] = useState<'Macho' | 'Hembra' | ''>('')
  const [raza, setRaza] = useState('')
  const [fechaNacimiento, setFechaNacimiento] = useState('')
  const [peso, setPeso] = useState('')
  const [color, setColor] = useState('')
  const [tamaño, setTamaño] = useState<'Pequeño' | 'Mediano' | 'Grande' | ''>('')
  const [descripcion, setDescripcion] = useState('')
  
  const [image, setImage] = useState<ImageState | null>(null)
  const [existingImageUrl, setExistingImageUrl] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  // ✅ Cargar datos de la mascota cuando se abre el modal
  useEffect(() => {
    if (visible && pet) {
      console.log('📝 Cargando datos de la mascota:', pet)
      
      setNombre(pet.name || '')
      setEspecie((pet.species === 'Perro' || pet.species === 'Gato') ? pet.species : '')
      setRaza(pet.breed || '')
      setFechaNacimiento(pet.fecha_nacimiento || '')
      setSexo((pet.gender === 'Macho' || pet.gender === 'Hembra') ? pet.gender : '')
      setPeso(pet.weight ? pet.weight.toString() : '')
      setColor(pet.color || '')
      setTamaño((pet.size === 'Pequeño' || pet.size === 'Mediano' || pet.size === 'Grande') ? pet.size : '')
      setDescripcion(pet.description || '')
      
      // Cargar imagen existente
      if (pet.image) {
        setExistingImageUrl(pet.image)
      }
      
      // Reset nueva imagen
      setImage(null)
    }
  }, [visible, pet])

  // Seleccionar nueva imagen
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

      const uri = selectedImage.uri
      const fileExtension = uri.split('.').pop()?.toLowerCase()
      const fileName = selectedImage.fileName || `pet_${Date.now()}.${fileExtension}`
      
      let mimeType = selectedImage.mimeType || 'image/jpeg'
      if (fileExtension === 'png') mimeType = 'image/png'
      else if (fileExtension === 'webp') mimeType = 'image/webp'

      setImage({
        uri,
        fileName,
        type: mimeType,
        fileSize: selectedImage.fileSize,
      })
      
      // Ocultar imagen existente si se selecciona una nueva
      setExistingImageUrl(null)
    }
  }

  // Restaurar imagen original
  const restoreOriginalImage = () => {
    setImage(null)
    if (pet?.image) {
      setExistingImageUrl(pet.image)
    }
  }

  // Validar y enviar
  const handleSubmit = async () => {
    if (!pet) {
      Alert.alert('Error', 'No se encontró la mascota')
      return
    }

    // ✅ Validar campos obligatorios
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
      // ✅ Crear FormData
      const formData = new FormData()
      
      // Campos obligatorios
      formData.append('nombre', nombre.trim())
      formData.append('especie', especie)
      formData.append('sexo', sexo)
      
      // Valores por defecto (para usuarios)
      formData.append('estado_salud', 'Saludable')
      formData.append('en_adopcion', 'false')
      
      // ✅ Campos opcionales (solo si tienen valor)
      if (raza.trim()) {
        formData.append('raza', raza.trim())
      }
      if (fechaNacimiento) {
        formData.append('fecha_nacimiento', fechaNacimiento)
      }
      if (peso && parseFloat(peso) > 0) {
        formData.append('peso', peso)
      }
      if (color.trim()) {
        formData.append('color', color.trim())
      }
      if (tamaño) {
        formData.append('tamaño', tamaño)
      }
      if (descripcion.trim()) {
        formData.append('descripcion', descripcion.trim())
      }
      
      // ✅ Agregar nueva imagen (solo si se seleccionó una)
      if (image) {
        const imageFile: any = {
          uri: image.uri,
          name: image.fileName,
          type: image.type,
        }
        
        console.log('📤 Enviando nueva imagen:', imageFile)
        formData.append('imagen', imageFile)
      }

      console.log('📤 Actualizando mascota...')

      // ✅ Enviar al backend
      const updatedPet = await ApiService.updatePet(pet.id, formData)

      console.log('✅ Mascota actualizada:', updatedPet)

      // Cerrar modal primero para mejor UX
      onClose()
      
      // Llamar al callback para actualizar la lista
      onSuccess(updatedPet)

      // Mostrar mensaje de éxito después (no bloqueante)
      setTimeout(() => {
        Alert.alert(
          '✅ Éxito',
          `${updatedPet.nombre || nombre} ha sido actualizado exitosamente`
        )
      }, 300)
    } catch (error: any) {
      console.error('❌ Error al actualizar mascota:', error)
      Alert.alert('Error', error.message || 'No se pudo actualizar la mascota')
    } finally {
      setLoading(false)
    }
  }

  // Imagen actual (nueva o existente)
  const currentImageUri = image ? image.uri : existingImageUrl

  if (!pet) {
    return null
  }

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Editar {nombre || 'Mascota'}</Text>
            <TouchableOpacity onPress={onClose} disabled={loading}>
              <MaterialIcons name="close" size={24} color={theme.colors.foreground} />
            </TouchableOpacity>
          </View>

          {/* Content */}
          <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
            {/* Imagen */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Foto de la mascota</Text>
              <TouchableOpacity style={styles.imagePickerButton} onPress={pickImage} disabled={loading}>
                {currentImageUri ? (
                  <View style={styles.imagePreviewContainer}>
                    <Image source={{ uri: currentImageUri }} style={styles.imagePreview} resizeMode="cover" />
                    <TouchableOpacity
                      style={styles.removeImageButton}
                      onPress={image ? restoreOriginalImage : () => {}}
                      disabled={loading}
                    >
                      <MaterialIcons name={image ? "undo" : "close"} size={20} color="#fff" />
                    </TouchableOpacity>
                    
                    {image && (
                      <View style={styles.imageInfo}>
                        <Text style={styles.imageInfoText}>Nueva imagen seleccionada</Text>
                      </View>
                    )}
                  </View>
                ) : (
                  <View style={styles.imagePickerContent}>
                    <MaterialIcons name="add-a-photo" size={32} color={theme.colors.primary} />
                    <Text style={styles.imagePickerText}>Agregar foto</Text>
                  </View>
                )}
              </TouchableOpacity>
            </View>

            {/* Nombre */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>
                Nombre <Text style={styles.required}>*</Text>
              </Text>
              <TextInput
                style={styles.input}
                placeholder="Ej: Luna, Max"
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
                  <Text style={[styles.optionText, especie === 'Perro' && styles.optionTextActive]}>
                    🐕 Perro
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.option, especie === 'Gato' && styles.optionActive]}
                  onPress={() => setEspecie('Gato')}
                  disabled={loading}
                >
                  <Text style={[styles.optionText, especie === 'Gato' && styles.optionTextActive]}>
                    🐈 Gato
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
                  <Text style={[styles.optionText, sexo === 'Macho' && styles.optionTextActive]}>
                    ♂️ Macho
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.option, sexo === 'Hembra' && styles.optionActive]}
                  onPress={() => setSexo('Hembra')}
                  disabled={loading}
                >
                  <Text style={[styles.optionText, sexo === 'Hembra' && styles.optionTextActive]}>
                    ♀️ Hembra
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Raza */}
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

            {/* Fecha de nacimiento */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Fecha de nacimiento (opcional)</Text>
              <TextInput
                style={styles.input}
                placeholder="YYYY-MM-DD"
                value={fechaNacimiento}
                onChangeText={setFechaNacimiento}
                editable={!loading}
              />
              <Text style={styles.hint}>Formato: YYYY-MM-DD</Text>
            </View>

            {/* Peso */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Peso (kg)</Text>
              <TextInput
                style={styles.input}
                placeholder="0.0"
                keyboardType="decimal-pad"
                value={peso}
                onChangeText={setPeso}
                editable={!loading}
              />
            </View>

            {/* Color */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Color (opcional)</Text>
              <TextInput
                style={styles.input}
                placeholder="Ej: Dorado, Negro"
                value={color}
                onChangeText={setColor}
                editable={!loading}
              />
            </View>

            {/* Tamaño */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Tamaño (opcional)</Text>
              <View style={styles.optionsRow}>
                {['Pequeño', 'Mediano', 'Grande'].map((size) => (
                  <TouchableOpacity
                    key={size}
                    style={[styles.option, tamaño === size && styles.optionActive]}
                    onPress={() => setTamaño(size as any)}
                    disabled={loading}
                  >
                    <Text style={[styles.optionText, tamaño === size && styles.optionTextActive]}>
                      {size}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Descripción */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Descripción (opcional)</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Describe a tu mascota..."
                value={descripcion}
                onChangeText={setDescripcion}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
                editable={!loading}
              />
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
                <Text style={styles.buttonSubmitText}>Actualizar</Text>
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
  hint: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.mutedForeground,
    marginTop: 4,
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
  imageInfo: {
    position: 'absolute',
    bottom: 8,
    left: 8,
    right: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    padding: 8,
    borderRadius: 4,
  },
  imageInfoText: {
    color: '#fff',
    fontSize: 12,
    textAlign: 'center',
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

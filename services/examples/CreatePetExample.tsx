// Example of creating a pet with image upload
import { ApiService } from '@/services'
import * as ImagePicker from 'expo-image-picker'
import { router } from 'expo-router'
import React, { useState } from 'react'
import { ActivityIndicator, Alert, Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'

/**
 * Example component for creating a pet with image upload
 */
export default function CreatePetExample() {
  const [nombre, setNombre] = useState('')
  const [especie, setEspecie] = useState('')
  const [raza, setRaza] = useState('')
  const [edadAnios, setEdadAnios] = useState('')
  const [sexo, setSexo] = useState('')
  const [color, setColor] = useState('')
  const [peso, setPeso] = useState('')
  const [estadoSalud, setEstadoSalud] = useState('')
  const [descripcion, setDescripcion] = useState('')
  const [imageUri, setImageUri] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const pickImage = async () => {
    // Request permissions
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync()
    
    if (status !== 'granted') {
      Alert.alert('Permisos requeridos', 'Necesitamos acceso a tu galería para seleccionar una imagen')
      return
    }

    // Launch image picker
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    })

    if (!result.canceled) {
      setImageUri(result.assets[0].uri)
    }
  }

  const handleSubmit = async () => {
    // Validate required fields
    if (!nombre.trim() || !especie.trim() || !raza.trim() || !sexo.trim() || !estadoSalud.trim()) {
      Alert.alert('Campos incompletos', 'Por favor completa todos los campos obligatorios')
      return
    }

    if (!imageUri) {
      Alert.alert('Imagen requerida', 'Por favor selecciona una imagen de la mascota')
      return
    }

    try {
      setLoading(true)

      // Create FormData
      const formData = new FormData()
      
      // Add pet data
      formData.append('nombre', nombre.trim())
      formData.append('especie', especie.trim())
      formData.append('raza', raza.trim())
      formData.append('sexo', sexo.trim())
      formData.append('estado_salud', estadoSalud.trim())
      
      if (edadAnios.trim()) {
        formData.append('edad_anios', edadAnios.trim())
      }
      
      if (color.trim()) {
        formData.append('color', color.trim())
      }
      
      if (peso.trim()) {
        formData.append('peso', peso.trim())
      }
      
      if (descripcion.trim()) {
        formData.append('descripcion', descripcion.trim())
      }

      // Add image
      const filename = imageUri.split('/').pop() || 'pet-image.jpg'
      const match = /\.(\w+)$/.exec(filename)
      const type = match ? `image/${match[1]}` : 'image/jpeg'

      formData.append('imagen', {
        uri: imageUri,
        name: filename,
        type,
      } as any)

      // Call API
      const result = await ApiService.createPet(formData)
      
      console.log('Pet created:', result)
      
      Alert.alert(
        'Mascota registrada',
        `${nombre} ha sido registrado exitosamente`,
        [
          {
            text: 'OK',
            onPress: () => router.back(),
          },
        ]
      )
    } catch (error: any) {
      console.error('Error creating pet:', error)
      
      Alert.alert(
        'Error',
        error.message || 'No se pudo registrar la mascota'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Registrar Nueva Mascota</Text>
      
      {/* Image picker */}
      <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
        {imageUri ? (
          <Image source={{ uri: imageUri }} style={styles.image} />
        ) : (
          <Text style={styles.imagePickerText}>Seleccionar Imagen</Text>
        )}
      </TouchableOpacity>
      
      {/* Form fields */}
      <TextInput
        style={styles.input}
        placeholder="Nombre *"
        value={nombre}
        onChangeText={setNombre}
        editable={!loading}
      />
      
      <TextInput
        style={styles.input}
        placeholder="Especie * (Perro, Gato, etc.)"
        value={especie}
        onChangeText={setEspecie}
        editable={!loading}
      />
      
      <TextInput
        style={styles.input}
        placeholder="Raza *"
        value={raza}
        onChangeText={setRaza}
        editable={!loading}
      />
      
      <TextInput
        style={styles.input}
        placeholder="Edad (años)"
        value={edadAnios}
        onChangeText={setEdadAnios}
        keyboardType="numeric"
        editable={!loading}
      />
      
      <TextInput
        style={styles.input}
        placeholder="Sexo * (Macho/Hembra)"
        value={sexo}
        onChangeText={setSexo}
        editable={!loading}
      />
      
      <TextInput
        style={styles.input}
        placeholder="Color"
        value={color}
        onChangeText={setColor}
        editable={!loading}
      />
      
      <TextInput
        style={styles.input}
        placeholder="Peso (kg)"
        value={peso}
        onChangeText={setPeso}
        keyboardType="numeric"
        editable={!loading}
      />
      
      <TextInput
        style={styles.input}
        placeholder="Estado de Salud *"
        value={estadoSalud}
        onChangeText={setEstadoSalud}
        editable={!loading}
      />
      
      <TextInput
        style={[styles.input, styles.textArea]}
        placeholder="Descripción"
        value={descripcion}
        onChangeText={setDescripcion}
        multiline
        numberOfLines={4}
        editable={!loading}
      />
      
      <TouchableOpacity
        style={[styles.button, loading && styles.buttonDisabled]}
        onPress={handleSubmit}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Registrar Mascota</Text>
        )}
      </TouchableOpacity>
      
      <View style={styles.spacing} />
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  imagePicker: {
    width: '100%',
    height: 200,
    backgroundColor: '#f0f0f0',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  imagePickerText: {
    color: '#666',
    fontSize: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
    fontSize: 16,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  spacing: {
    height: 40,
  },
})

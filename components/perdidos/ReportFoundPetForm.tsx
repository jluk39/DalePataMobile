import { MapboxAddressInput } from '@/components/ui/MapboxAddressInput';
import { theme } from '@/constants/theme';
import { useAuth } from '@/contexts/AuthContext';
import { ApiService } from '@/services';
import { MaterialIcons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Image,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface LocationData {
  address: string;
  lat: number;
  lon: number;
}

export default function ReportFoundPetForm() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  // Form fields
  const [name, setName] = useState('');
  const [species, setSpecies] = useState<'Perro' | 'Gato' | null>(null);
  const [breed, setBreed] = useState('');
  const [gender, setGender] = useState<'Macho' | 'Hembra' | null>(null);
  const [color, setColor] = useState('');
  const [size, setSize] = useState<'Pequeño' | 'Mediano' | 'Grande' | null>(null);
  const [description, setDescription] = useState('');
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [locationData, setLocationData] = useState<LocationData>({
    address: '',
    lat: 0,
    lon: 0,
  });
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleImagePick = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permiso requerido', 'Se necesita acceso a la galería para seleccionar una imagen.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        const uri = result.assets[0].uri;
        
        // Check file size (5MB max)
        const response = await fetch(uri);
        const blob = await response.blob();
        const sizeInMB = blob.size / (1024 * 1024);
        
        if (sizeInMB > 5) {
          Alert.alert('Imagen muy grande', 'La imagen no debe superar los 5MB.');
          return;
        }

        setImageUri(uri);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'No se pudo seleccionar la imagen.');
    }
  };

  const handleDateChange = (_event: any, selectedDate?: Date) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (selectedDate) {
      setDate(selectedDate);
    }
  };

  const handleSubmit = async () => {
    // Validations
    if (!imageUri) {
      Alert.alert('Imagen requerida', 'Debes subir al menos una foto de la mascota encontrada.');
      return;
    }

    if (!name.trim()) {
      Alert.alert('Nombre requerido', 'Por favor ingresa un nombre o descripción para la mascota.');
      return;
    }

    if (!species) {
      Alert.alert('Especie requerida', 'Por favor selecciona si es perro o gato.');
      return;
    }

    if (!locationData.address.trim()) {
      Alert.alert('Ubicación requerida', 'Por favor ingresa la dirección donde encontraste la mascota.');
      return;
    }

    try {
      setLoading(true);

      // Crear FormData para enviar la imagen
      const formData = new FormData();
      
      // Agregar la imagen
      const uriParts = imageUri.split('.');
      const fileType = uriParts[uriParts.length - 1];
      formData.append('imagen', {
        uri: imageUri,
        name: `pet_${Date.now()}.${fileType}`,
        type: `image/${fileType}`,
      } as any);

      // Agregar campos requeridos
      formData.append('nombre', name.trim());
      formData.append('especie', species);
      formData.append('perdida_direccion', locationData.address);
      formData.append('perdida_lat', locationData.lat.toString());
      formData.append('perdida_lon', locationData.lon.toString());
      formData.append('perdida_fecha', date.toISOString());

      // Agregar campos opcionales
      if (breed.trim()) formData.append('raza', breed.trim());
      if (gender) formData.append('sexo', gender);
      if (size) formData.append('tamanio', size);
      if (color.trim()) formData.append('color', color.trim());
      if (description.trim()) formData.append('descripcion', description.trim());

      console.log('📤 Enviando reporte de mascota encontrada...');
      
      await ApiService.reportFoundPet(formData);
      
      Alert.alert(
        '¡Reporte enviado!',
        'Gracias por reportar esta mascota encontrada. Ahora será visible en el mapa y ayudarás a reunirla con su familia.',
        [
          {
            text: 'OK',
            onPress: () => router.back(),
          },
        ]
      );
    } catch (error: any) {
      console.error('Error submitting found pet report:', error);
      Alert.alert('Error', error.message || 'No se pudo enviar el reporte.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <MaterialIcons name="arrow-back" size={24} color={theme.colors.foreground} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Reportar Mascota Encontrada</Text>
        </View>

        {/* Image Upload */}
        <View style={styles.section}>
          <Text style={styles.label}>
            Foto de la mascota <Text style={styles.required}>*</Text>
          </Text>
          <TouchableOpacity style={styles.imageButton} onPress={handleImagePick}>
            {imageUri ? (
              <Image source={{ uri: imageUri }} style={styles.previewImage} />
            ) : (
              <View style={styles.imagePlaceholder}>
                <MaterialIcons name="add-a-photo" size={40} color={theme.colors.mutedForeground} />
                <Text style={styles.imagePlaceholderText}>Subir foto</Text>
                <Text style={styles.imageHint}>(Máximo 5MB)</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* Name (optional) */}
        <View style={styles.section}>
          <Text style={styles.label}>Nombre (si lo sabes)</Text>
          <TextInput
            style={styles.input}
            placeholder="Ej: Max"
            placeholderTextColor={theme.colors.mutedForeground}
            value={name}
            onChangeText={setName}
          />
        </View>

        {/* Species */}
        <View style={styles.section}>
          <Text style={styles.label}>
            Especie <Text style={styles.required}>*</Text>
          </Text>
          <View style={styles.buttonGroup}>
            <TouchableOpacity
              style={[styles.optionButton, species === 'Perro' && styles.optionButtonActive]}
              onPress={() => setSpecies('Perro')}
            >
              <MaterialIcons
                name="pets"
                size={20}
                color={species === 'Perro' ? theme.colors.primaryForeground : theme.colors.mutedForeground}
              />
              <Text
                style={[
                  styles.optionButtonText,
                  species === 'Perro' && styles.optionButtonTextActive,
                ]}
              >
                Perro
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.optionButton, species === 'Gato' && styles.optionButtonActive]}
              onPress={() => setSpecies('Gato')}
            >
              <MaterialIcons
                name="pets"
                size={20}
                color={species === 'Gato' ? theme.colors.primaryForeground : theme.colors.mutedForeground}
              />
              <Text
                style={[
                  styles.optionButtonText,
                  species === 'Gato' && styles.optionButtonTextActive,
                ]}
              >
                Gato
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Breed */}
        <View style={styles.section}>
          <Text style={styles.label}>Raza (si la conoces)</Text>
          <TextInput
            style={styles.input}
            placeholder="Ej: Labrador, Mestizo"
            placeholderTextColor={theme.colors.mutedForeground}
            value={breed}
            onChangeText={setBreed}
          />
        </View>

        {/* Gender */}
        <View style={styles.section}>
          <Text style={styles.label}>
            Género <Text style={styles.required}>*</Text>
          </Text>
          <View style={styles.buttonGroup}>
            <TouchableOpacity
              style={[styles.optionButton, gender === 'Macho' && styles.optionButtonActive]}
              onPress={() => setGender('Macho')}
            >
              <MaterialIcons
                name="male"
                size={20}
                color={gender === 'Macho' ? theme.colors.primaryForeground : theme.colors.mutedForeground}
              />
              <Text
                style={[
                  styles.optionButtonText,
                  gender === 'Macho' && styles.optionButtonTextActive,
                ]}
              >
                Macho
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.optionButton, gender === 'Hembra' && styles.optionButtonActive]}
              onPress={() => setGender('Hembra')}
            >
              <MaterialIcons
                name="female"
                size={20}
                color={gender === 'Hembra' ? theme.colors.primaryForeground : theme.colors.mutedForeground}
              />
              <Text
                style={[
                  styles.optionButtonText,
                  gender === 'Hembra' && styles.optionButtonTextActive,
                ]}
              >
                Hembra
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Color */}
        <View style={styles.section}>
          <Text style={styles.label}>Color</Text>
          <TextInput
            style={styles.input}
            placeholder="Ej: Marrón, Blanco y negro"
            placeholderTextColor={theme.colors.mutedForeground}
            value={color}
            onChangeText={setColor}
          />
        </View>

        {/* Size */}
        <View style={styles.section}>
          <Text style={styles.label}>
            Tamaño <Text style={styles.required}>*</Text>
          </Text>
          <View style={styles.buttonGroup}>
            <TouchableOpacity
              style={[styles.optionButton, size === 'Pequeño' && styles.optionButtonActive]}
              onPress={() => setSize('Pequeño')}
            >
              <Text
                style={[
                  styles.optionButtonText,
                  size === 'Pequeño' && styles.optionButtonTextActive,
                ]}
              >
                Pequeño
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.optionButton, size === 'Mediano' && styles.optionButtonActive]}
              onPress={() => setSize('Mediano')}
            >
              <Text
                style={[
                  styles.optionButtonText,
                  size === 'Mediano' && styles.optionButtonTextActive,
                ]}
              >
                Mediano
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.optionButton, size === 'Grande' && styles.optionButtonActive]}
              onPress={() => setSize('Grande')}
            >
              <Text
                style={[
                  styles.optionButtonText,
                  size === 'Grande' && styles.optionButtonTextActive,
                ]}
              >
                Grande
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Location */}
        <View style={styles.section}>
          <Text style={styles.label}>
            ¿Dónde la encontraste? <Text style={styles.required}>*</Text>
          </Text>
          <Text style={styles.hint}>
            Escribe la dirección y selecciona una opción
          </Text>
          <MapboxAddressInput
            onLocationSelect={(location) => {
              setLocationData({
                address: location.address,
                lat: location.lat,
                lon: location.lon,
              });
            }}
            placeholder="Ej: Parque Centenario, CABA"
            initialValue={locationData.address}
          />
        </View>

        {/* Date */}
        <View style={styles.section}>
          <Text style={styles.label}>
            ¿Cuándo la encontraste? <Text style={styles.required}>*</Text>
          </Text>
          <TouchableOpacity
            style={styles.dateButton}
            onPress={() => setShowDatePicker(true)}
          >
            <MaterialIcons name="calendar-today" size={20} color={theme.colors.mutedForeground} />
            <Text style={styles.dateButtonText}>
              {date.toLocaleDateString('es-AR', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}
            </Text>
          </TouchableOpacity>
          {showDatePicker && (
            <DateTimePicker
              value={date}
              mode="date"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={handleDateChange}
              maximumDate={new Date()}
            />
          )}
        </View>

        {/* Description */}
        <View style={styles.section}>
          <Text style={styles.label}>
            Descripción <Text style={styles.required}>*</Text>
          </Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Describe las circunstancias del hallazgo, comportamiento, características distintivas, etc."
            placeholderTextColor={theme.colors.mutedForeground}
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={5}
            textAlignVertical="top"
          />
        </View>

        {/* Contact Info Note */}
        <View style={styles.infoBox}>
          <MaterialIcons name="info-outline" size={20} color={theme.colors.primary} />
          <Text style={styles.infoText}>
            Tu información de contacto ({user?.email || user?.telefono}) se compartirá con el dueño
            si se identifica a la mascota.
          </Text>
        </View>

        {/* Submit Button */}
        <TouchableOpacity
          style={[styles.submitButton, loading && styles.submitButtonDisabled]}
          onPress={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator size="small" color={theme.colors.primaryForeground} />
          ) : (
            <>
              <MaterialIcons name="send" size={20} color={theme.colors.primaryForeground} />
              <Text style={styles.submitButtonText}>Enviar Reporte</Text>
            </>
          )}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: theme.spacing.xl,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing.lg,
    backgroundColor: theme.colors.card,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
    gap: theme.spacing.md,
  },
  backButton: {
    padding: theme.spacing.xs,
  },
  headerTitle: {
    fontSize: theme.fontSize.xl,
    fontWeight: 'bold',
    color: theme.colors.foreground,
    flex: 1,
  },
  section: {
    padding: theme.spacing.lg,
    gap: theme.spacing.sm,
  },
  label: {
    fontSize: theme.fontSize.base,
    fontWeight: '600',
    color: theme.colors.foreground,
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
    backgroundColor: theme.colors.card,
  },
  textArea: {
    minHeight: 100,
  },
  hint: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.mutedForeground,
    marginTop: theme.spacing.xs,
  },
  buttonGroup: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
  },
  optionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing.xs,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.sm,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.card,
  },
  optionButtonActive: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  optionButtonText: {
    fontSize: theme.fontSize.sm,
    fontWeight: '600',
    color: theme.colors.mutedForeground,
  },
  optionButtonTextActive: {
    color: theme.colors.primaryForeground,
  },
  imageButton: {
    width: '100%',
    aspectRatio: 4 / 3,
    borderRadius: theme.borderRadius.md,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: theme.colors.border,
    borderStyle: 'dashed',
  },
  imagePlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    gap: theme.spacing.xs,
  },
  imagePlaceholderText: {
    fontSize: theme.fontSize.base,
    fontWeight: '600',
    color: theme.colors.mutedForeground,
  },
  imageHint: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.mutedForeground,
  },
  previewImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  dateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.card,
  },
  dateButtonText: {
    fontSize: theme.fontSize.base,
    color: theme.colors.foreground,
  },
  infoBox: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
    padding: theme.spacing.md,
    marginHorizontal: theme.spacing.lg,
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.primary,
  },
  infoText: {
    flex: 1,
    fontSize: theme.fontSize.sm,
    color: theme.colors.foreground,
    lineHeight: 20,
  },
  submitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing.sm,
    backgroundColor: theme.colors.primary,
    paddingVertical: theme.spacing.md,
    marginHorizontal: theme.spacing.lg,
    borderRadius: theme.borderRadius.md,
    marginTop: theme.spacing.lg,
  },
  submitButtonDisabled: {
    opacity: 0.5,
  },
  submitButtonText: {
    fontSize: theme.fontSize.base,
    fontWeight: '600',
    color: theme.colors.primaryForeground,
  },
});

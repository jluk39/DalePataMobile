import { MapboxAddressInput } from '@/components/ui/MapboxAddressInput';
import { theme } from '@/constants/theme';
import { ApiService } from '@/services';
import { Pet } from '@/services/api-service';
import { MaterialIcons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import React, { useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Modal,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

interface ReportLostModalProps {
  pet: Pet | null;
  visible: boolean;
  onClose: () => void;
  onSuccess: (updatedPet?: any) => void; // ✅ Ahora puede recibir la mascota actualizada
}

const ReportLostModal: React.FC<ReportLostModalProps> = ({
  pet,
  visible,
  onClose,
  onSuccess,
}) => {
  const [loading, setLoading] = useState(false);
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [description, setDescription] = useState('');
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [locationData, setLocationData] = useState({
    address: '',
    lat: 0,
    lon: 0,
  });

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (selectedDate) {
      setDate(selectedDate);
    }
  };

  const formatDate = (date: Date): string => {
    return date.toLocaleDateString('es-AR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  const handleSubmit = async () => {
    // Validaciones
    if (!locationData.address) {
      Alert.alert('Ubicación requerida', 'Por favor, ingresa dónde se perdió tu mascota');
      return;
    }

    if (!date) {
      Alert.alert('Fecha requerida', 'Por favor, selecciona cuándo se perdió');
      return;
    }

    if (!acceptTerms) {
      Alert.alert(
        'Consentimiento requerido',
        'Debes aceptar que tus datos de contacto sean visibles'
      );
      return;
    }

    if (!pet) return;

    setLoading(true);

    try {
      const reportData = {
        perdida_direccion: locationData.address,
        perdida_lat: locationData.lat,
        perdida_lon: locationData.lon,
        perdida_fecha: date.toISOString(),
        descripcion:
          description || `${pet.name} se perdió el ${formatDate(date)}`,
      };

      console.log('📤 Reportando mascota perdida:', reportData);

      const response = await ApiService.reportPetAsLost(pet.id, reportData);
      
      console.log('✅ Respuesta del backend:', response);

      Alert.alert(
        '¡Mascota reportada!',
        `${pet.name} ha sido reportada como perdida exitosamente. Ahora aparecerá en el mapa y lista de mascotas perdidas.`,
        [
          {
            text: 'OK',
            onPress: () => {
              // Limpiar formulario
              setDate(undefined);
              setDescription('');
              setAcceptTerms(false);
              setLocationData({ address: '', lat: 0, lon: 0 });
              onClose();
              // ✅ Pasar los datos actualizados del backend
              onSuccess(response.data);
            },
          },
        ]
      );
    } catch (error: any) {
      console.error('Error al reportar mascota perdida:', error);
      Alert.alert('Error', error.message || 'No se pudo reportar la mascota');
    } finally {
      setLoading(false);
    }
  };

  if (!pet) return null;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Reportar Mascota Perdida</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <MaterialIcons name="close" size={24} color={theme.colors.foreground} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
            {/* Alerta informativa */}
            <View style={styles.alert}>
              <MaterialIcons
                name="info"
                size={20}
                color={theme.colors.primary}
                style={styles.alertIcon}
              />
              <Text style={styles.alertText}>
                Tu mascota aparecerá en el mapa de mascotas perdidas para que otros
                usuarios puedan ayudar a encontrarla
              </Text>
            </View>

            {/* Información de la mascota */}
            <View style={styles.petInfo}>
              <Text style={styles.petName}>{pet.name}</Text>
              <Text style={styles.petDetails}>
                {pet.species} • {pet.breed}
              </Text>
            </View>

            {/* Ubicación */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>
                ¿Dónde se perdió? <Text style={styles.required}>*</Text>
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

            {/* Fecha de pérdida */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>
                ¿Cuándo se perdió? <Text style={styles.required}>*</Text>
              </Text>
              <TouchableOpacity
                style={styles.dateButton}
                onPress={() => setShowDatePicker(true)}
              >
                <MaterialIcons
                  name="event"
                  size={20}
                  color={theme.colors.mutedForeground}
                />
                <Text style={styles.dateButtonText}>
                  {date ? formatDate(date) : 'Seleccionar fecha'}
                </Text>
              </TouchableOpacity>

              {showDatePicker && (
                <DateTimePicker
                  value={date || new Date()}
                  mode="date"
                  display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                  onChange={handleDateChange}
                  maximumDate={new Date()}
                />
              )}
            </View>

            {/* Descripción adicional */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>Descripción adicional</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Describe las circunstancias de la pérdida, si llevaba collar, etc."
                value={description}
                onChangeText={setDescription}
                multiline
                numberOfLines={3}
              />
            </View>

            {/* Checkbox de consentimiento */}
            <View style={styles.checkboxContainer}>
              <TouchableOpacity
                style={styles.checkbox}
                onPress={() => setAcceptTerms(!acceptTerms)}
              >
                <MaterialIcons
                  name={acceptTerms ? 'check-box' : 'check-box-outline-blank'}
                  size={24}
                  color={acceptTerms ? theme.colors.primary : theme.colors.mutedForeground}
                />
              </TouchableOpacity>
              <View style={styles.checkboxTextContainer}>
                <Text style={styles.checkboxLabel}>
                  Acepto que mis datos de contacto sean visibles{' '}
                  <Text style={styles.required}>*</Text>
                </Text>
                <Text style={styles.checkboxHint}>
                  Tu nombre, teléfono y email serán visibles para otros usuarios que
                  puedan ayudar a encontrar a tu mascota
                </Text>
              </View>
            </View>
          </ScrollView>

          {/* Footer con botones */}
          <View style={styles.footer}>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={onClose}
              disabled={loading}
            >
              <Text style={styles.cancelButtonText}>Cancelar</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.submitButton]}
              onPress={handleSubmit}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color={theme.colors.primaryForeground} />
              ) : (
                <Text style={styles.submitButtonText}>Reportar</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: theme.colors.background,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '90%',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: theme.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  headerTitle: {
    fontSize: theme.fontSize.xl,
    fontWeight: 'bold',
    color: theme.colors.foreground,
  },
  closeButton: {
    padding: theme.spacing.xs,
  },
  scrollView: {
    padding: theme.spacing.lg,
  },
  alert: {
    flexDirection: 'row',
    backgroundColor: '#E6F4FE',
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.lg,
  },
  alertIcon: {
    marginRight: theme.spacing.sm,
  },
  alertText: {
    flex: 1,
    fontSize: theme.fontSize.sm,
    color: theme.colors.primary,
    lineHeight: 20,
  },
  petInfo: {
    backgroundColor: theme.colors.card,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.lg,
  },
  petName: {
    fontSize: theme.fontSize.xl,
    fontWeight: 'bold',
    color: theme.colors.foreground,
    marginBottom: 4,
  },
  petDetails: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.mutedForeground,
  },
  formGroup: {
    marginBottom: theme.spacing.lg,
  },
  label: {
    fontSize: theme.fontSize.sm,
    fontWeight: '600',
    color: theme.colors.foreground,
    marginBottom: theme.spacing.xs,
  },
  required: {
    color: theme.colors.destructive,
  },
  hint: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.mutedForeground,
    marginBottom: theme.spacing.sm,
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
    minHeight: 80,
    textAlignVertical: 'top',
  },
  successText: {
    fontSize: theme.fontSize.sm,
    color: '#16A34A',
    marginTop: theme.spacing.xs,
  },
  coordinatesRow: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
  },
  coordinateInput: {
    flex: 1,
  },
  dateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    backgroundColor: theme.colors.background,
  },
  dateButtonText: {
    fontSize: theme.fontSize.base,
    color: theme.colors.foreground,
  },
  checkboxContainer: {
    flexDirection: 'row',
    padding: theme.spacing.md,
    backgroundColor: '#F9FAFB',
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  checkbox: {
    marginRight: theme.spacing.sm,
  },
  checkboxTextContainer: {
    flex: 1,
  },
  checkboxLabel: {
    fontSize: theme.fontSize.sm,
    fontWeight: '600',
    color: theme.colors.foreground,
    marginBottom: 4,
  },
  checkboxHint: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.mutedForeground,
    lineHeight: 16,
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
    paddingVertical: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButton: {
    backgroundColor: '#F9FAFB',
  },
  cancelButtonText: {
    fontSize: theme.fontSize.base,
    fontWeight: '600',
    color: theme.colors.foreground,
  },
  submitButton: {
    backgroundColor: theme.colors.primary,
  },
  submitButtonText: {
    fontSize: theme.fontSize.base,
    fontWeight: '600',
    color: theme.colors.primaryForeground,
  },
});

export default ReportLostModal;

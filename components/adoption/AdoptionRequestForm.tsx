import { theme } from '@/constants/theme';
import { ApiService } from '@/services';
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

interface AdoptionRequestFormProps {
  visible: boolean;
  onClose: () => void;
  petId: number;
  petName: string;
  onSuccess: () => void;
}

interface FormData {
  // Step 1: Vivienda
  tipo_vivienda: 'casa' | 'apartamento' | 'finca' | '';
  tiene_patio: boolean | null;
  permiso_propietario: boolean | null;

  // Step 2: Experiencia
  experiencia_mascotas: string;
  mascotas_actuales: string;

  // Step 3: Motivación
  razon_adopcion: string;
  tiempo_dedicacion: string;
}

const AdoptionRequestForm: React.FC<AdoptionRequestFormProps> = ({
  visible,
  onClose,
  petId,
  petName,
  onSuccess,
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    tipo_vivienda: '',
    tiene_patio: null,
    permiso_propietario: null,
    experiencia_mascotas: '',
    mascotas_actuales: '',
    razon_adopcion: '',
    tiempo_dedicacion: '',
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validateStep1 = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.tipo_vivienda) {
      newErrors.tipo_vivienda = 'Selecciona un tipo de vivienda';
    }
    if (formData.tiene_patio === null) {
      newErrors.tiene_patio = 'Indica si tienes patio';
    }
    if (formData.tipo_vivienda === 'apartamento' && formData.permiso_propietario === null) {
      newErrors.permiso_propietario = 'Indica si tienes permiso';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (formData.experiencia_mascotas.trim().length < 10) {
      newErrors.experiencia_mascotas = 'Describe tu experiencia (mínimo 10 caracteres)';
    }
    if (formData.mascotas_actuales.trim().length < 5) {
      newErrors.mascotas_actuales = 'Describe tus mascotas actuales (mínimo 5 caracteres)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep3 = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (formData.razon_adopcion.trim().length < 20) {
      newErrors.razon_adopcion = 'Describe tu motivación (mínimo 20 caracteres)';
    }
    if (formData.tiempo_dedicacion.trim().length < 10) {
      newErrors.tiempo_dedicacion = 'Describe el tiempo disponible (mínimo 10 caracteres)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (currentStep === 1 && validateStep1()) {
      setCurrentStep(2);
    } else if (currentStep === 2 && validateStep2()) {
      setCurrentStep(3);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      setErrors({});
    }
  };

  const handleSubmit = async () => {
    if (!validateStep3()) return;

    setLoading(true);
    try {
      // Convert boolean to string for API
      const submissionData = {
        mascota_id: petId,
        tipo_vivienda: formData.tipo_vivienda,
        tiene_patio: formData.tiene_patio ? 'si' : 'no',
        permiso_propietario: formData.permiso_propietario === true,
        experiencia_mascotas: formData.experiencia_mascotas,
        mascotas_actuales: formData.mascotas_actuales,
        razon_adopcion: formData.razon_adopcion,
        tiempo_dedicacion: formData.tiempo_dedicacion,
      };

      await ApiService.createAdoption(submissionData);

      // Close modal first
      onClose();

      // Show success message
      setTimeout(() => {
        if (Platform.OS === 'web') {
          window.alert(`¡Solicitud enviada! Tu solicitud de adopción para ${petName} ha sido enviada exitosamente.`);
        } else {
          Alert.alert(
            '¡Solicitud enviada!',
            `Tu solicitud de adopción para ${petName} ha sido enviada exitosamente.`,
            [{ text: 'OK' }]
          );
        }
        onSuccess();
      }, 300);
    } catch (error: any) {
      const errorMessage = error.message || 'Error al enviar la solicitud';
      if (Platform.OS === 'web') {
        window.alert(errorMessage);
      } else {
        Alert.alert('Error', errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setCurrentStep(1);
    setFormData({
      tipo_vivienda: '',
      tiene_patio: null,
      permiso_propietario: null,
      experiencia_mascotas: '',
      mascotas_actuales: '',
      razon_adopcion: '',
      tiempo_dedicacion: '',
    });
    setErrors({});
    onClose();
  };

  const renderStepIndicator = () => (
    <View style={styles.stepIndicator}>
      {[1, 2, 3].map((step) => (
        <View key={step} style={styles.stepContainer}>
          <View
            style={[
              styles.stepCircle,
              currentStep === step && styles.stepCircleActive,
              currentStep > step && styles.stepCircleCompleted,
            ]}
          >
            <Text
              style={[
                styles.stepNumber,
                currentStep >= step && styles.stepNumberActive,
              ]}
            >
              {step}
            </Text>
          </View>
          {step < 3 && (
            <View
              style={[
                styles.stepLine,
                currentStep > step && styles.stepLineCompleted,
              ]}
            />
          )}
        </View>
      ))}
    </View>
  );

  const renderStep1 = () => (
    <View style={styles.stepContent}>
      <Text style={styles.stepTitle}>Información de Vivienda</Text>

      {/* Tipo de Vivienda */}
      <Text style={styles.label}>Tipo de vivienda *</Text>
      <View style={styles.optionsRow}>
        {['casa', 'apartamento', 'finca'].map((tipo) => (
          <TouchableOpacity
            key={tipo}
            style={[
              styles.option,
              formData.tipo_vivienda === tipo && styles.optionSelected,
            ]}
            onPress={() =>
              setFormData({ ...formData, tipo_vivienda: tipo as any })
            }
          >
            <Text
              style={[
                styles.optionText,
                formData.tipo_vivienda === tipo && styles.optionTextSelected,
              ]}
            >
              {tipo.charAt(0).toUpperCase() + tipo.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      {errors.tipo_vivienda && (
        <Text style={styles.errorText}>{errors.tipo_vivienda}</Text>
      )}

      {/* Tiene Patio */}
      <Text style={[styles.label, styles.labelSpaced]}>¿Tienes patio? *</Text>
      <View style={styles.optionsRow}>
        <TouchableOpacity
          style={[
            styles.option,
            formData.tiene_patio === true && styles.optionSelected,
          ]}
          onPress={() => setFormData({ ...formData, tiene_patio: true })}
        >
          <Text
            style={[
              styles.optionText,
              formData.tiene_patio === true && styles.optionTextSelected,
            ]}
          >
            Sí
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.option,
            formData.tiene_patio === false && styles.optionSelected,
          ]}
          onPress={() => setFormData({ ...formData, tiene_patio: false })}
        >
          <Text
            style={[
              styles.optionText,
              formData.tiene_patio === false && styles.optionTextSelected,
            ]}
          >
            No
          </Text>
        </TouchableOpacity>
      </View>
      {errors.tiene_patio && (
        <Text style={styles.errorText}>{errors.tiene_patio}</Text>
      )}

      {/* Permiso Propietario (solo si es apartamento) */}
      {formData.tipo_vivienda === 'apartamento' && (
        <>
          <Text style={[styles.label, styles.labelSpaced]}>
            ¿Tienes permiso del propietario? *
          </Text>
          <View style={styles.optionsRow}>
            <TouchableOpacity
              style={[
                styles.option,
                formData.permiso_propietario === true && styles.optionSelected,
              ]}
              onPress={() =>
                setFormData({ ...formData, permiso_propietario: true })
              }
            >
              <Text
                style={[
                  styles.optionText,
                  formData.permiso_propietario === true &&
                    styles.optionTextSelected,
                ]}
              >
                Sí
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.option,
                formData.permiso_propietario === false && styles.optionSelected,
              ]}
              onPress={() =>
                setFormData({ ...formData, permiso_propietario: false })
              }
            >
              <Text
                style={[
                  styles.optionText,
                  formData.permiso_propietario === false &&
                    styles.optionTextSelected,
                ]}
              >
                No
              </Text>
            </TouchableOpacity>
          </View>
          {errors.permiso_propietario && (
            <Text style={styles.errorText}>{errors.permiso_propietario}</Text>
          )}
        </>
      )}
    </View>
  );

  const renderStep2 = () => (
    <View style={styles.stepContent}>
      <Text style={styles.stepTitle}>Experiencia con Mascotas</Text>

      {/* Experiencia */}
      <Text style={styles.label}>Experiencia previa con mascotas *</Text>
      <TextInput
        style={[styles.textArea, errors.experiencia_mascotas && styles.inputError]}
        multiline
        numberOfLines={4}
        placeholder="Describe tu experiencia con mascotas (mínimo 10 caracteres)"
        placeholderTextColor={theme.colors.mutedForeground}
        value={formData.experiencia_mascotas}
        onChangeText={(text) =>
          setFormData({ ...formData, experiencia_mascotas: text })
        }
      />
      {errors.experiencia_mascotas && (
        <Text style={styles.errorText}>{errors.experiencia_mascotas}</Text>
      )}

      {/* Mascotas Actuales */}
      <Text style={[styles.label, styles.labelSpaced]}>
        Mascotas actuales en el hogar *
      </Text>
      <TextInput
        style={[styles.textArea, errors.mascotas_actuales && styles.inputError]}
        multiline
        numberOfLines={3}
        placeholder="Describe las mascotas que tienes actualmente (mínimo 5 caracteres, escribe 'ninguna' si no tienes)"
        placeholderTextColor={theme.colors.mutedForeground}
        value={formData.mascotas_actuales}
        onChangeText={(text) =>
          setFormData({ ...formData, mascotas_actuales: text })
        }
      />
      {errors.mascotas_actuales && (
        <Text style={styles.errorText}>{errors.mascotas_actuales}</Text>
      )}
    </View>
  );

  const renderStep3 = () => (
    <View style={styles.stepContent}>
      <Text style={styles.stepTitle}>Motivación y Compromiso</Text>

      {/* Razón de Adopción */}
      <Text style={styles.label}>¿Por qué quieres adoptar a {petName}? *</Text>
      <TextInput
        style={[styles.textArea, errors.razon_adopcion && styles.inputError]}
        multiline
        numberOfLines={4}
        placeholder="Describe tu motivación para adoptar (mínimo 20 caracteres)"
        placeholderTextColor={theme.colors.mutedForeground}
        value={formData.razon_adopcion}
        onChangeText={(text) =>
          setFormData({ ...formData, razon_adopcion: text })
        }
      />
      {errors.razon_adopcion && (
        <Text style={styles.errorText}>{errors.razon_adopcion}</Text>
      )}

      {/* Tiempo Dedicación */}
      <Text style={[styles.label, styles.labelSpaced]}>
        ¿Cuánto tiempo puedes dedicarle? *
      </Text>
      <TextInput
        style={[styles.textArea, errors.tiempo_dedicacion && styles.inputError]}
        multiline
        numberOfLines={3}
        placeholder="Describe el tiempo que puedes dedicarle diariamente (mínimo 10 caracteres)"
        placeholderTextColor={theme.colors.mutedForeground}
        value={formData.tiempo_dedicacion}
        onChangeText={(text) =>
          setFormData({ ...formData, tiempo_dedicacion: text })
        }
      />
      {errors.tiempo_dedicacion && (
        <Text style={styles.errorText}>{errors.tiempo_dedicacion}</Text>
      )}
    </View>
  );

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={handleClose}
    >
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Solicitud de Adopción</Text>
          <Text style={styles.subtitle}>
            Adoptar a <Text style={styles.petNameText}>{petName}</Text>
          </Text>
          <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
            <Text style={styles.closeButtonText}>✕</Text>
          </TouchableOpacity>
        </View>

        {/* Step Indicator */}
        {renderStepIndicator()}

        {/* Form Content */}
        <ScrollView style={styles.scrollView}>
          {currentStep === 1 && renderStep1()}
          {currentStep === 2 && renderStep2()}
          {currentStep === 3 && renderStep3()}
        </ScrollView>

        {/* Actions */}
        <View style={styles.actions}>
          {currentStep > 1 && (
            <TouchableOpacity
              style={[styles.button, styles.buttonSecondary]}
              onPress={handleBack}
              disabled={loading}
            >
              <Text style={styles.buttonSecondaryText}>Anterior</Text>
            </TouchableOpacity>
          )}

          {currentStep < 3 ? (
            <TouchableOpacity
              style={[styles.button, styles.buttonPrimary]}
              onPress={handleNext}
            >
              <Text style={styles.buttonPrimaryText}>Siguiente</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={[styles.button, styles.buttonPrimary]}
              onPress={handleSubmit}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.buttonPrimaryText}>Enviar Solicitud</Text>
              )}
            </TouchableOpacity>
          )}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    backgroundColor: theme.colors.card,
    paddingTop: Platform.OS === 'ios' ? 60 : 20,
    paddingBottom: theme.spacing.lg,
    paddingHorizontal: theme.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
    position: 'relative',
  },
  title: {
    fontSize: theme.fontSize['2xl'],
    fontWeight: '700',
    color: theme.colors.foreground,
    marginBottom: theme.spacing.xs,
  },
  subtitle: {
    fontSize: theme.fontSize.base,
    color: theme.colors.mutedForeground,
  },
  petNameText: {
    color: theme.colors.primary,
    fontWeight: '600',
  },
  closeButton: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 60 : 20,
    right: theme.spacing.lg,
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 24,
    color: theme.colors.mutedForeground,
  },
  stepIndicator: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: theme.spacing.lg,
    backgroundColor: theme.colors.card,
  },
  stepContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stepCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E5E7EB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepCircleActive: {
    backgroundColor: theme.colors.primary,
  },
  stepCircleCompleted: {
    backgroundColor: theme.colors.primary,
  },
  stepNumber: {
    fontSize: theme.fontSize.base,
    fontWeight: '600',
    color: '#6B7280',
  },
  stepNumberActive: {
    color: '#FFFFFF',
  },
  stepLine: {
    width: 60,
    height: 2,
    backgroundColor: '#E5E7EB',
    marginHorizontal: theme.spacing.xs,
  },
  stepLineCompleted: {
    backgroundColor: theme.colors.primary,
  },
  scrollView: {
    flex: 1,
  },
  stepContent: {
    padding: theme.spacing.lg,
  },
  stepTitle: {
    fontSize: theme.fontSize.xl,
    fontWeight: '700',
    color: theme.colors.foreground,
    marginBottom: theme.spacing.lg,
  },
  label: {
    fontSize: theme.fontSize.base,
    fontWeight: '600',
    color: theme.colors.foreground,
    marginBottom: theme.spacing.sm,
  },
  labelSpaced: {
    marginTop: theme.spacing.lg,
  },
  optionsRow: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.sm,
  },
  option: {
    flex: 1,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
    borderWidth: 2,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.card,
    alignItems: 'center',
  },
  optionSelected: {
    borderColor: theme.colors.primary,
    backgroundColor: 'rgba(137, 199, 168, 0.1)',
  },
  optionText: {
    fontSize: theme.fontSize.base,
    color: theme.colors.foreground,
    fontWeight: '500',
  },
  optionTextSelected: {
    color: theme.colors.primary,
    fontWeight: '700',
  },
  textArea: {
    backgroundColor: theme.colors.card,
    borderWidth: 1,
    borderColor: theme.colors.input,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    fontSize: theme.fontSize.base,
    color: theme.colors.foreground,
    minHeight: 100,
    textAlignVertical: 'top',
  },
  inputError: {
    borderColor: theme.colors.destructive,
  },
  errorText: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.destructive,
    marginTop: theme.spacing.xs,
  },
  actions: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
    padding: theme.spacing.lg,
    backgroundColor: theme.colors.card,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  button: {
    flex: 1,
    paddingVertical: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
  },
  buttonPrimary: {
    backgroundColor: theme.colors.primary,
  },
  buttonPrimaryText: {
    color: theme.colors.primaryForeground,
    fontSize: theme.fontSize.base,
    fontWeight: '600',
  },
  buttonSecondary: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: theme.colors.border,
  },
  buttonSecondaryText: {
    color: theme.colors.foreground,
    fontSize: theme.fontSize.base,
    fontWeight: '600',
  },
});

export default AdoptionRequestForm;

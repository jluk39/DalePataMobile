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
  housingType: 'casa' | 'departamento' | '';
  hasYard: 'si' | 'no' | '';
  landlordPermission: boolean | null;

  // Step 2: Experiencia
  petExperience: 'si' | 'no' | '';
  currentPets: 'si' | 'no' | '';

  // Step 3: Motivación
  adoptionReason: string;
  timeCommitment: string;
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
    housingType: '',
    hasYard: '',
    landlordPermission: null,
    petExperience: '',
    currentPets: '',
    adoptionReason: '',
    timeCommitment: '',
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validateStep1 = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.housingType) {
      newErrors.housingType = 'Selecciona el tipo de vivienda';
    }
    if (!formData.hasYard) {
      newErrors.hasYard = 'Indica si tienes patio';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.petExperience) {
      newErrors.petExperience = 'Indica si has tenido mascotas antes';
    }
    if (!formData.currentPets) {
      newErrors.currentPets = 'Indica si tienes mascotas actualmente';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep3 = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.adoptionReason.trim()) {
      newErrors.adoptionReason = 'Explica tu motivación para adoptar';
    } else if (formData.adoptionReason.trim().length < 20) {
      newErrors.adoptionReason = 'Proporciona más detalles (mínimo 20 caracteres)';
    }
    if (!formData.timeCommitment.trim()) {
      newErrors.timeCommitment = 'Indica el tiempo que puedes dedicar';
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
      // Estructura correcta según el backend
      const submissionData = {
        housingType: formData.housingType,
        hasYard: formData.hasYard,
        landlordPermission: formData.landlordPermission || false,
        petExperience: formData.petExperience,
        currentPets: formData.currentPets,
        adoptionReason: formData.adoptionReason,
        timeCommitment: formData.timeCommitment,
      };

      await ApiService.createAdoptionRequest(petId, submissionData);

      // Close modal first
      onClose();

      // Show success message
      setTimeout(() => {
        if (Platform.OS === 'web') {
          window.alert(`✅ ¡Solicitud Enviada!\n\nTu solicitud de adopción para ${petName} ha sido enviada exitosamente.\n\nEl refugio revisará tu solicitud y se pondrá en contacto contigo pronto.\nRecibirás una notificación por email cuando haya novedades.`);
        } else {
          Alert.alert(
            '✅ ¡Solicitud Enviada!',
            `Tu solicitud de adopción para ${petName} ha sido enviada exitosamente.\n\nEl refugio revisará tu solicitud y se pondrá en contacto contigo pronto.\nRecibirás una notificación por email cuando haya novedades.`,
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
      housingType: '',
      hasYard: '',
      landlordPermission: null,
      petExperience: '',
      currentPets: '',
      adoptionReason: '',
      timeCommitment: '',
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
        {['casa', 'departamento'].map((tipo) => (
          <TouchableOpacity
            key={tipo}
            style={[
              styles.option,
              formData.housingType === tipo && styles.optionSelected,
            ]}
            onPress={() =>
              setFormData({ ...formData, housingType: tipo as any })
            }
          >
            <Text
              style={[
                styles.optionText,
                formData.housingType === tipo && styles.optionTextSelected,
              ]}
            >
              {tipo.charAt(0).toUpperCase() + tipo.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      {errors.housingType && (
        <Text style={styles.errorText}>{errors.housingType}</Text>
      )}

      {/* Tiene Patio */}
      <Text style={[styles.label, styles.labelSpaced]}>¿Tienes patio? *</Text>
      <View style={styles.optionsRow}>
        <TouchableOpacity
          style={[
            styles.option,
            formData.hasYard === 'si' && styles.optionSelected,
          ]}
          onPress={() => setFormData({ ...formData, hasYard: 'si' })}
        >
          <Text
            style={[
              styles.optionText,
              formData.hasYard === 'si' && styles.optionTextSelected,
            ]}
          >
            Sí
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.option,
            formData.hasYard === 'no' && styles.optionSelected,
          ]}
          onPress={() => setFormData({ ...formData, hasYard: 'no' })}
        >
          <Text
            style={[
              styles.optionText,
              formData.hasYard === 'no' && styles.optionTextSelected,
            ]}
          >
            No
          </Text>
        </TouchableOpacity>
      </View>
      {errors.hasYard && (
        <Text style={styles.errorText}>{errors.hasYard}</Text>
      )}

      {/* Permiso Propietario (opcional para el backend) */}
      <Text style={[styles.label, styles.labelSpaced]}>
        ¿Alquilas? ¿Tienes permiso del propietario?
      </Text>
      <View style={styles.optionsRow}>
        <TouchableOpacity
          style={[
            styles.option,
            formData.landlordPermission === true && styles.optionSelected,
          ]}
          onPress={() =>
            setFormData({ ...formData, landlordPermission: true })
          }
        >
          <Text
            style={[
              styles.optionText,
              formData.landlordPermission === true &&
                styles.optionTextSelected,
            ]}
          >
            Sí
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.option,
            formData.landlordPermission === false && styles.optionSelected,
          ]}
          onPress={() =>
            setFormData({ ...formData, landlordPermission: false })
          }
        >
          <Text
            style={[
              styles.optionText,
              formData.landlordPermission === false &&
                styles.optionTextSelected,
            ]}
          >
            No / No Aplica
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderStep2 = () => (
    <View style={styles.stepContent}>
      <Text style={styles.stepTitle}>Experiencia con Mascotas</Text>

      {/* Experiencia Previa */}
      <Text style={styles.label}>¿Has tenido mascotas antes? *</Text>
      <View style={styles.optionsRow}>
        <TouchableOpacity
          style={[
            styles.option,
            formData.petExperience === 'si' && styles.optionSelected,
          ]}
          onPress={() => setFormData({ ...formData, petExperience: 'si' })}
        >
          <Text
            style={[
              styles.optionText,
              formData.petExperience === 'si' && styles.optionTextSelected,
            ]}
          >
            Sí
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.option,
            formData.petExperience === 'no' && styles.optionSelected,
          ]}
          onPress={() => setFormData({ ...formData, petExperience: 'no' })}
        >
          <Text
            style={[
              styles.optionText,
              formData.petExperience === 'no' && styles.optionTextSelected,
            ]}
          >
            No
          </Text>
        </TouchableOpacity>
      </View>
      {errors.petExperience && (
        <Text style={styles.errorText}>{errors.petExperience}</Text>
      )}

      {/* Mascotas Actuales */}
      <Text style={[styles.label, styles.labelSpaced]}>
        ¿Tienes mascotas actualmente? *
      </Text>
      <View style={styles.optionsRow}>
        <TouchableOpacity
          style={[
            styles.option,
            formData.currentPets === 'si' && styles.optionSelected,
          ]}
          onPress={() => setFormData({ ...formData, currentPets: 'si' })}
        >
          <Text
            style={[
              styles.optionText,
              formData.currentPets === 'si' && styles.optionTextSelected,
            ]}
          >
            Sí
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.option,
            formData.currentPets === 'no' && styles.optionSelected,
          ]}
          onPress={() => setFormData({ ...formData, currentPets: 'no' })}
        >
          <Text
            style={[
              styles.optionText,
              formData.currentPets === 'no' && styles.optionTextSelected,
            ]}
          >
            No
          </Text>
        </TouchableOpacity>
      </View>
      {errors.currentPets && (
        <Text style={styles.errorText}>{errors.currentPets}</Text>
      )}
    </View>
  );

  const renderStep3 = () => (
    <View style={styles.stepContent}>
      <Text style={styles.stepTitle}>Motivación y Compromiso</Text>

      {/* Razón de Adopción */}
      <Text style={styles.label}>¿Por qué quieres adoptar a {petName}? *</Text>
      <TextInput
        style={[styles.textArea, errors.adoptionReason && styles.inputError]}
        multiline
        numberOfLines={4}
        placeholder="Describe tu motivación para adoptar (mínimo 20 caracteres)"
        placeholderTextColor={theme.colors.mutedForeground}
        value={formData.adoptionReason}
        onChangeText={(text) =>
          setFormData({ ...formData, adoptionReason: text })
        }
      />
      {errors.adoptionReason && (
        <Text style={styles.errorText}>{errors.adoptionReason}</Text>
      )}

      {/* Tiempo Dedicación */}
      <Text style={[styles.label, styles.labelSpaced]}>
        ¿Cuánto tiempo puedes dedicarle diariamente? *
      </Text>
      <TextInput
        style={[styles.textArea, errors.timeCommitment && styles.inputError]}
        multiline
        numberOfLines={3}
        placeholder="Ejemplo: 3-4 horas diarias, paseos mañana y tarde"
        placeholderTextColor={theme.colors.mutedForeground}
        value={formData.timeCommitment}
        onChangeText={(text) =>
          setFormData({ ...formData, timeCommitment: text })
        }
      />
      {errors.timeCommitment && (
        <Text style={styles.errorText}>{errors.timeCommitment}</Text>
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

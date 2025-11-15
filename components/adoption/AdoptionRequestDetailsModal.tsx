import { theme } from '@/constants/theme';
import { MaterialIcons } from '@expo/vector-icons';
import React from 'react';
import {
    Image,
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

interface AdoptionRequestDetailsModalProps {
  visible: boolean;
  onClose: () => void;
  request: any;
}

const AdoptionRequestDetailsModal: React.FC<AdoptionRequestDetailsModalProps> = ({
  visible,
  onClose,
  request,
}) => {
  if (!request) return null;

  const formatDate = (date: string | null): string => {
    if (!date) return 'No registrada';
    const dateObj = new Date(date);
    return dateObj.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusConfig = (status: string) => {
    const statusConfig: Record<string, { color: string; label: string }> = {
      pendiente: { color: '#EAB308', label: 'Pendiente' }, // Amarillo
      enviada: { color: '#3B82F6', label: 'Enviada' }, // Azul
      aprobada: { color: '#22C55E', label: 'Aprobada' }, // Verde
      rechazada: { color: theme.colors.destructive, label: 'Rechazada' }, // Rojo
      cancelada: { color: theme.colors.mutedForeground, label: 'Cancelada' }, // Gris
    };

    return statusConfig[status] || statusConfig.pendiente;
  };

  const statusConfig = getStatusConfig(request.estado);

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Detalles de la Solicitud</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <MaterialIcons name="close" size={24} color={theme.colors.foreground} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
            {/* Estado y Mascota */}
            <View style={styles.petSection}>
              <View style={styles.petInfo}>
                <Image
                  source={{ uri: request.mascota?.imagen_url || 'https://via.placeholder.com/64' }}
                  style={styles.petImage}
                />
                <View style={styles.petDetails}>
                  <Text style={styles.petName}>{request.mascota?.nombre}</Text>
                  <Text style={styles.petBreed}>
                    {request.mascota?.especie} • {request.mascota?.raza}
                  </Text>
                </View>
              </View>
              <View style={[styles.badge, { backgroundColor: statusConfig.color + '33', borderColor: statusConfig.color }]}>
                <Text style={[styles.badgeText, { color: statusConfig.color }]}>
                  {statusConfig.label}
                </Text>
              </View>
            </View>

            <View style={styles.divider} />

            {/* Información de Vivienda */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <MaterialIcons name="home" size={20} color={theme.colors.primary} />
                <Text style={styles.sectionTitle}>Información de Vivienda</Text>
              </View>
              <View style={styles.infoGrid}>
                <View style={styles.infoItem}>
                  <Text style={styles.infoLabel}>Tipo de Vivienda</Text>
                  <Text style={styles.infoValue}>{request.tipo_vivienda || 'No especificado'}</Text>
                </View>
                <View style={styles.infoItem}>
                  <Text style={styles.infoLabel}>¿Tiene patio?</Text>
                  <Text style={styles.infoValue}>{request.tiene_patio || 'No especificado'}</Text>
                </View>
                <View style={styles.infoItem}>
                  <Text style={styles.infoLabel}>¿Es propietario?</Text>
                  <Text style={styles.infoValue}>{request.permiso_propietario ? 'Sí' : 'No'}</Text>
                </View>
              </View>
            </View>

            <View style={styles.divider} />

            {/* Experiencia con Mascotas */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <MaterialIcons name="pets" size={20} color={theme.colors.primary} />
                <Text style={styles.sectionTitle}>Experiencia con Mascotas</Text>
              </View>
              <View style={styles.infoGrid}>
                <View style={styles.infoItem}>
                  <Text style={styles.infoLabel}>Experiencia previa</Text>
                  <Text style={styles.infoValue}>{request.experiencia_mascotas || 'No especificado'}</Text>
                </View>
                <View style={styles.infoItem}>
                  <Text style={styles.infoLabel}>¿Tiene mascotas actualmente?</Text>
                  <Text style={styles.infoValue}>{request.mascotas_actuales || 'No especificado'}</Text>
                </View>
              </View>
            </View>

            <View style={styles.divider} />

            {/* Disponibilidad */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <MaterialIcons name="schedule" size={20} color={theme.colors.primary} />
                <Text style={styles.sectionTitle}>Disponibilidad</Text>
              </View>
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Tiempo de dedicación</Text>
                <Text style={styles.infoValue}>{request.tiempo_dedicacion || 'No especificado'}</Text>
              </View>
            </View>

            {request.razon_adopcion && (
              <>
                <View style={styles.divider} />
                <View style={styles.section}>
                  <View style={styles.sectionHeader}>
                    <MaterialIcons name="article" size={20} color={theme.colors.primary} />
                    <Text style={styles.sectionTitle}>Razón de Adopción</Text>
                  </View>
                  <View style={styles.textBox}>
                    <Text style={styles.textBoxContent}>{request.razon_adopcion}</Text>
                  </View>
                </View>
              </>
            )}

            {request.comentario && request.comentario !== request.razon_adopcion && (
              <>
                <View style={styles.divider} />
                <View style={styles.section}>
                  <View style={styles.sectionHeader}>
                    <MaterialIcons name="comment" size={20} color={theme.colors.primary} />
                    <Text style={styles.sectionTitle}>Comentario Adicional</Text>
                  </View>
                  <View style={styles.textBox}>
                    <Text style={styles.textBoxContent}>{request.comentario}</Text>
                  </View>
                </View>
              </>
            )}

            <View style={styles.divider} />

            {/* Fechas */}
            <View style={styles.section}>
              <View style={styles.infoGrid}>
                <View style={styles.infoItem}>
                  <View style={styles.dateHeader}>
                    <MaterialIcons name="event" size={16} color={theme.colors.mutedForeground} />
                    <Text style={styles.infoLabel}>Fecha de Solicitud</Text>
                  </View>
                  <Text style={styles.infoValue}>{formatDate(request.created_at)}</Text>
                </View>
                {request.fecha_decision && (
                  <View style={styles.infoItem}>
                    <View style={styles.dateHeader}>
                      <MaterialIcons name="event" size={16} color={theme.colors.mutedForeground} />
                      <Text style={styles.infoLabel}>Fecha de Decisión</Text>
                    </View>
                    <Text style={styles.infoValue}>{formatDate(request.fecha_decision)}</Text>
                  </View>
                )}
              </View>
            </View>

            {request.refugio && (
              <>
                <View style={styles.divider} />
                <View style={[styles.section, styles.refugioBox]}>
                  <Text style={styles.refugioLabel}>Refugio</Text>
                  <Text style={styles.refugioName}>{request.refugio.nombre}</Text>
                </View>
              </>
            )}

            {/* Botón Cerrar */}
            <TouchableOpacity
              style={styles.closeButtonBottom}
              onPress={onClose}
            >
              <Text style={styles.closeButtonText}>Cerrar</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: theme.colors.background,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '90%',
    paddingBottom: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  petSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacing.md,
    backgroundColor: '#E5E7EB80',
    borderRadius: theme.borderRadius.lg,
  },
  petInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
    flex: 1,
  },
  petImage: {
    width: 64,
    height: 64,
    borderRadius: theme.borderRadius.lg,
  },
  petDetails: {
    flex: 1,
  },
  petName: {
    fontSize: theme.fontSize.xl,
    fontWeight: 'bold',
    color: theme.colors.foreground,
    marginBottom: 4,
  },
  petBreed: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.mutedForeground,
  },
  badge: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.xs,
    borderRadius: 999,
    borderWidth: 1,
  },
  badgeText: {
    fontSize: theme.fontSize.sm,
    fontWeight: '600',
  },
  divider: {
    height: 1,
    backgroundColor: theme.colors.border,
    marginVertical: theme.spacing.lg,
  },
  section: {
    marginBottom: theme.spacing.md,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.md,
  },
  sectionTitle: {
    fontSize: theme.fontSize.xl,
    fontWeight: '600',
    color: theme.colors.foreground,
  },
  infoGrid: {
    gap: theme.spacing.md,
  },
  infoItem: {
    gap: 4,
  },
  infoLabel: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.mutedForeground,
  },
  infoValue: {
    fontSize: theme.fontSize.base,
    fontWeight: '500',
    color: theme.colors.foreground,
  },
  textBox: {
    backgroundColor: '#E5E7EB80',
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
  },
  textBoxContent: {
    fontSize: theme.fontSize.base,
    color: theme.colors.foreground,
    lineHeight: 22,
  },
  dateHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  refugioBox: {
    backgroundColor: theme.colors.primary + '1A',
    borderWidth: 1,
    borderColor: theme.colors.primary + '4D',
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
  },
  refugioLabel: {
    fontSize: theme.fontSize.sm,
    fontWeight: '600',
    color: theme.colors.primary,
    marginBottom: 4,
  },
  refugioName: {
    fontSize: theme.fontSize.base,
    color: theme.colors.foreground,
    fontWeight: '500',
  },
  closeButtonBottom: {
    backgroundColor: theme.colors.border,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
    marginTop: theme.spacing.lg,
  },
  closeButtonText: {
    fontSize: theme.fontSize.base,
    fontWeight: '600',
    color: theme.colors.foreground,
  },
});

export default AdoptionRequestDetailsModal;

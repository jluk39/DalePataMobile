import { theme } from '@/constants/theme';
import { useAuth } from '@/contexts/AuthContext';
import { ApiService } from '@/services';
import { LostPet } from '@/types/lostPets';
import { MaterialIcons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Image,
    Linking,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

interface LostFoundCardProps {
  pet: LostPet;
  onPetUpdated?: () => void; // Callback to refresh the list after marking as found or deleting
}

const LostFoundCard: React.FC<LostFoundCardProps> = ({ pet, onPetUpdated }) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-AR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  const handleCall = () => {
    const phoneNumber = pet.contactPhone.replace(/[^0-9+]/g, '');
    Linking.openURL(`tel:${phoneNumber}`).catch(() => {
      Alert.alert('Error', 'No se pudo abrir el marcador telefónico');
    });
  };

  const handleEmail = () => {
    Linking.openURL(`mailto:${pet.contactEmail}`).catch(() => {
      Alert.alert('Error', 'No se pudo abrir el cliente de email');
    });
  };

  const handleMarkAsFound = async () => {
    Alert.alert(
      'Marcar como Encontrada',
      '¿Estás seguro de que quieres marcar esta mascota como encontrada?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Sí, marcar',
          onPress: async () => {
            try {
              setLoading(true);
              await ApiService.markPetAsFound(pet.id.toString());
              Alert.alert('¡Éxito!', 'La mascota ha sido marcada como encontrada.');
              onPetUpdated?.();
            } catch (error: any) {
              console.error('Error marking pet as found:', error);
              Alert.alert('Error', error.message || 'No se pudo marcar la mascota como encontrada.');
            } finally {
              setLoading(false);
            }
          },
        },
      ]
    );
  };

  const handleDeleteReport = async () => {
    Alert.alert(
      'Eliminar Reporte',
      '¿Estás seguro de que quieres eliminar este reporte?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            try {
              setLoading(true);
              await ApiService.deleteLostPetReport(pet.id.toString());
              Alert.alert('Eliminado', 'El reporte ha sido eliminado exitosamente.');
              onPetUpdated?.();
            } catch (error: any) {
              console.error('Error deleting report:', error);
              Alert.alert('Error', error.message || 'No se pudo eliminar el reporte.');
            } finally {
              setLoading(false);
            }
          },
        },
      ]
    );
  };

  // Lógica de ownership según documentación:
  // - Si tiene dueño (duenio): el dueño puede marcar como encontrada
  // - Si tiene reportado_por (sin dueño): el reportante puede marcar como encontrada o eliminar
  const hasDuenio = !!pet.duenio;
  
  // El usuario es dueño si pet.duenio.id === user.id
  const isOwner = user && pet.duenio && pet.duenio.id === user.id;
  
  // El usuario es reportante si pet.reportado_por.id === user.id
  const isReporter = user && pet.reportado_por && pet.reportado_por.id === user.id;
  
  // Puede marcar como encontrada: dueño O reportante
  const canMarkAsFound = isOwner || isReporter;
  
  // Puede eliminar: solo reportante Y sin dueño
  const canDelete = isReporter && !hasDuenio;

  return (
    <View style={styles.card}>
      {/* Imagen */}
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: pet.image }}
          style={styles.image}
          resizeMode="cover"
        />
        
        {/* Badge de estado */}
        <View style={styles.badgesContainer}>
          <View style={[styles.badge, { backgroundColor: theme.colors.destructive }]}>
            <Text style={styles.badgeText}>
              {pet.perdida && !pet.encontrada ? 'Perdido' : pet.encontrada ? 'Encontrado' : 'Perdido'}
            </Text>
          </View>
        </View>
      </View>

      {/* Contenido */}
      <View style={styles.content}>
        {/* Información principal */}
        <View style={styles.infoSection}>
          <Text style={styles.name}>{pet.name}</Text>
          <Text style={styles.details}>
            {pet.breed} • {pet.age} • {pet.gender}
          </Text>
          <Text style={styles.details}>
            {pet.color} • {pet.size}
          </Text>
        </View>

        {/* Detalles con iconos */}
        <View style={styles.detailsSection}>
          <View style={styles.detailRow}>
            <MaterialIcons
              name="location-on"
              size={16}
              color={theme.colors.mutedForeground}
            />
            <Text style={styles.detailText} numberOfLines={1}>
              {pet.location}
            </Text>
          </View>
          <View style={styles.detailRow}>
            <MaterialIcons
              name="event"
              size={16}
              color={theme.colors.mutedForeground}
            />
            <Text style={styles.detailText}>
              Perdido el {formatDate(pet.lastSeen)}
            </Text>
          </View>
        </View>

        {/* Descripción */}
        <Text style={styles.description} numberOfLines={2}>
          {pet.description}
        </Text>

        {/* Botones de contacto */}
        <View style={styles.contactSection}>
          <Text style={styles.contactLabel}>Contacto</Text>
          <View style={styles.contactButtons}>
            <TouchableOpacity
              style={styles.contactButton}
              onPress={handleCall}
            >
              <MaterialIcons name="phone" size={16} color={theme.colors.primary} />
              <Text style={styles.contactButtonText}>Llamar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.contactButton}
              onPress={handleEmail}
            >
              <MaterialIcons name="email" size={16} color={theme.colors.primary} />
              <Text style={styles.contactButtonText}>Email</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Action buttons - Según documentación:
            - Marcar como encontrada: dueño O reportante
            - Eliminar reporte: solo reportante Y sin dueño
        */}
        {(canMarkAsFound || canDelete) && (
          <View style={styles.actionsSection}>
            {canMarkAsFound && (
              <TouchableOpacity
                style={[styles.actionButton, styles.foundButton]}
                onPress={handleMarkAsFound}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <>
                    <MaterialIcons name="check-circle" size={18} color="#fff" />
                    <Text style={styles.actionButtonText}>Marcar como Encontrada</Text>
                  </>
                )}
              </TouchableOpacity>
            )}
            {canDelete && (
              <TouchableOpacity
                style={[styles.actionButton, styles.deleteButton]}
                onPress={handleDeleteReport}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <>
                    <MaterialIcons name="delete" size={18} color="#fff" />
                    <Text style={styles.actionButtonText}>Eliminar Reporte</Text>
                  </>
                )}
              </TouchableOpacity>
            )}
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.lg,
    overflow: 'hidden',
    marginBottom: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  imageContainer: {
    position: 'relative',
    height: 192,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  badgesContainer: {
    position: 'absolute',
    top: 8,
    left: 8,
    flexDirection: 'row',
    gap: 8,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    gap: 4,
  },
  badgeText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '600',
  },
  content: {
    padding: theme.spacing.md,
  },
  infoSection: {
    marginBottom: theme.spacing.md,
  },
  name: {
    fontSize: theme.fontSize.xl,
    fontWeight: 'bold',
    color: theme.colors.foreground,
    marginBottom: 4,
  },
  details: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.mutedForeground,
    marginBottom: 2,
  },
  detailsSection: {
    marginBottom: theme.spacing.md,
    gap: 8,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  detailText: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.mutedForeground,
    flex: 1,
  },
  description: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.foreground,
    lineHeight: 20,
    marginBottom: theme.spacing.md,
  },
  contactSection: {
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    paddingTop: theme.spacing.md,
  },
  contactLabel: {
    fontSize: theme.fontSize.sm,
    fontWeight: '600',
    color: theme.colors.foreground,
    marginBottom: theme.spacing.sm,
  },
  contactButtons: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
  },
  contactButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: theme.colors.primary,
    borderRadius: theme.borderRadius.md,
    paddingVertical: theme.spacing.sm,
  },
  contactButtonText: {
    fontSize: theme.fontSize.sm,
    fontWeight: '600',
    color: theme.colors.primary,
  },
  actionsSection: {
    marginTop: theme.spacing.md,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    paddingTop: theme.spacing.md,
    gap: theme.spacing.sm,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing.xs,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
  },
  foundButton: {
    backgroundColor: '#10B981', // Green for success
  },
  deleteButton: {
    backgroundColor: theme.colors.destructive,
  },
  actionButtonText: {
    fontSize: theme.fontSize.sm,
    fontWeight: '600',
    color: '#fff',
  },
});

export default LostFoundCard;

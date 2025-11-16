import { LostPet } from '@/constants/mockLostPets';
import { theme } from '@/constants/theme';
import { MaterialIcons } from '@expo/vector-icons';
import React from 'react';
import {
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
}

const LostFoundCard: React.FC<LostFoundCardProps> = ({ pet }) => {
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

  const getStatusConfig = () => {
    return pet.status === 'lost'
      ? { color: theme.colors.destructive, label: 'Perdido' }
      : { color: '#3B82F6', label: 'Encontrado' };
  };

  const statusConfig = getStatusConfig();

  return (
    <View style={styles.card}>
      {/* Imagen */}
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: pet.image }}
          style={styles.image}
          resizeMode="cover"
        />
        
        {/* Badges superiores */}
        <View style={styles.badgesContainer}>
          <View style={[styles.badge, { backgroundColor: statusConfig.color }]}>
            <Text style={styles.badgeText}>{statusConfig.label}</Text>
          </View>
          
          {pet.urgent && (
            <View style={[styles.badge, styles.urgentBadge]}>
              <MaterialIcons name="warning" size={12} color="#FFF" />
              <Text style={styles.badgeText}>Urgente</Text>
            </View>
          )}
        </View>

        {/* Badge de recompensa */}
        {pet.reward && (
          <View style={styles.rewardBadge}>
            <MaterialIcons name="card-giftcard" size={12} color="#FFF" />
            <Text style={styles.badgeText}>Recompensa</Text>
          </View>
        )}
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
              {pet.status === 'lost' ? 'Perdido el' : 'Encontrado el'}{' '}
              {formatDate(pet.lastSeen)}
            </Text>
          </View>
        </View>

        {/* Descripción */}
        <Text style={styles.description} numberOfLines={2}>
          {pet.description}
        </Text>

        {/* Sección de recompensa */}
        {pet.reward && (
          <View style={styles.rewardSection}>
            <Text style={styles.rewardText}>💰 Recompensa</Text>
          </View>
        )}

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
  urgentBadge: {
    backgroundColor: '#F97316',
  },
  rewardBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#16A34A',
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
  rewardSection: {
    backgroundColor: '#F0FDF4',
    borderWidth: 1,
    borderColor: '#86EFAC',
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.sm,
    marginBottom: theme.spacing.md,
  },
  rewardText: {
    fontSize: theme.fontSize.sm,
    fontWeight: '600',
    color: '#16A34A',
    textAlign: 'center',
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
});

export default LostFoundCard;

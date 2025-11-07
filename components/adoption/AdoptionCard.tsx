import { theme } from '@/constants/theme';
import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface Pet {
  id: number;
  nombre: string;
  especie: string;
  raza: string;
  edad: string; // "2 años" formato
  edad_anios: number; // Edad numérica
  genero: 'Macho' | 'Hembra';
  imagen: string;
  ubicacion: string;
  refugio: string;
  refugio_id: number;
  telefono_refugio?: string;
  acercaDe?: string;
  estado_salud: string;
  en_adopcion: boolean;
}

interface AdoptionCardProps {
  pet: Pet;
  onPress: (petId: number) => void;
}

const AdoptionCard: React.FC<AdoptionCardProps> = ({ pet, onPress }) => {
  const getEspecieColor = (especie: string) => {
    const especieNormalized = especie.toLowerCase();
    if (especieNormalized === 'perro') return '#89C7A8';
    if (especieNormalized === 'gato') return '#F59E0B';
    return '#6B7280';
  };

  const getSexoIcon = (genero: string) => {
    return genero.toLowerCase() === 'macho' ? '♂' : '♀';
  };

  const getSexoColor = (genero: string) => {
    return genero.toLowerCase() === 'macho' ? '#3B82F6' : '#EC4899';
  };

  return (
    <TouchableOpacity 
      style={styles.card} 
      onPress={() => onPress(pet.id)}
      activeOpacity={0.7}
    >
      {/* Image */}
      <View style={styles.imageContainer}>
        {pet.imagen ? (
          <Image 
            source={{ uri: pet.imagen }} 
            style={styles.image}
            resizeMode="cover"
          />
        ) : (
          <View style={styles.placeholderImage}>
            <Text style={styles.placeholderText}>Sin foto</Text>
          </View>
        )}
      </View>

      {/* Content */}
      <View style={styles.content}>
        {/* Name */}
        <Text style={styles.name} numberOfLines={1}>
          {pet.nombre}
        </Text>

        {/* Details Row */}
        <View style={styles.detailsRow}>
          {/* Species Badge */}
          <View style={[styles.badge, { backgroundColor: getEspecieColor(pet.especie) }]}>
            <Text style={styles.badgeText}>{pet.especie}</Text>
          </View>

          {/* Gender Badge */}
          <View style={[styles.badge, { backgroundColor: getSexoColor(pet.genero) }]}>
            <Text style={styles.badgeText}>
              {getSexoIcon(pet.genero)} {pet.genero}
            </Text>
          </View>
        </View>

        {/* Age */}
        <Text style={styles.detail}>
          📅 {pet.edad}
        </Text>

        {/* Health Status */}
        <Text style={styles.detail} numberOfLines={1}>
          ❤️ {pet.estado_salud}
        </Text>

        {/* Button */}
        <TouchableOpacity 
          style={styles.button}
          onPress={() => onPress(pet.id)}
          activeOpacity={0.8}
        >
          <Text style={styles.buttonText}>Ver Detalles</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.lg,
    overflow: 'hidden',
    marginBottom: theme.spacing.md,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  imageContainer: {
    width: '100%',
    height: 200,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  placeholderImage: {
    width: '100%',
    height: '100%',
    backgroundColor: '#E5E7EB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    fontSize: theme.fontSize.base,
    color: theme.colors.mutedForeground,
  },
  urgentBadge: {
    position: 'absolute',
    top: theme.spacing.sm,
    right: theme.spacing.sm,
    backgroundColor: '#EF4444',
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.md,
  },
  urgentText: {
    color: '#FFFFFF',
    fontSize: theme.fontSize.sm,
    fontWeight: '700',
  },
  content: {
    padding: theme.spacing.lg,
  },
  name: {
    fontSize: theme.fontSize.xl,
    fontWeight: '700',
    color: theme.colors.foreground,
    marginBottom: theme.spacing.sm,
  },
  detailsRow: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.sm,
  },
  badge: {
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.md,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: theme.fontSize.sm,
    fontWeight: '600',
  },
  detail: {
    fontSize: theme.fontSize.base,
    color: theme.colors.mutedForeground,
    marginBottom: theme.spacing.xs,
  },
  button: {
    backgroundColor: theme.colors.primary,
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
    marginTop: theme.spacing.sm,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: theme.fontSize.base,
    fontWeight: '600',
  },
});

export default AdoptionCard;

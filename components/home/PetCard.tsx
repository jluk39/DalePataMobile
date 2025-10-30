import { theme } from '@/constants/theme'
import { Pet } from '@/services/api-service'
import { MaterialIcons } from '@expo/vector-icons'
import React from 'react'
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'

interface PetCardProps {
  pet: Pet
  onPress?: () => void
}

export function PetCard({ pet, onPress }: PetCardProps) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
      <Image
        source={pet.image ? { uri: pet.image } : require('@/assets/images/icon.png')}
        style={styles.image}
        resizeMode="cover"
      />
      <View style={styles.content}>
        <Text style={styles.name} numberOfLines={1}>
          {pet.name}
        </Text>
        <View style={styles.infoRow}>
          <MaterialIcons name="pets" size={16} color={theme.colors.mutedForeground} />
          <Text style={styles.infoText} numberOfLines={1}>
            {pet.species} • {pet.breed}
          </Text>
        </View>
        <View style={styles.infoRow}>
          <MaterialIcons name="cake" size={16} color={theme.colors.mutedForeground} />
          <Text style={styles.infoText}>{pet.age}</Text>
        </View>
        <View style={styles.infoRow}>
          <MaterialIcons
            name={pet.gender === 'Macho' ? 'male' : 'female'}
            size={16}
            color={theme.colors.mutedForeground}
          />
          <Text style={styles.infoText}>{pet.gender}</Text>
        </View>
        {pet.healthStatus && (
          <View style={styles.statusBadge}>
            <Text style={styles.statusText} numberOfLines={1}>
              {pet.healthStatus}
            </Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.lg,
    overflow: 'hidden',
    marginBottom: theme.spacing.lg,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  image: {
    width: '100%',
    height: 180,
    backgroundColor: theme.colors.background,
  },
  content: {
    padding: theme.spacing.md,
  },
  name: {
    fontSize: theme.fontSize.xl,
    fontWeight: 'bold',
    color: theme.colors.foreground,
    marginBottom: theme.spacing.sm,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.xs,
  },
  infoText: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.mutedForeground,
    marginLeft: theme.spacing.xs,
    flex: 1,
  },
  statusBadge: {
    marginTop: theme.spacing.sm,
    backgroundColor: theme.colors.primary,
    paddingVertical: theme.spacing.xs,
    paddingHorizontal: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
    alignSelf: 'flex-start',
  },
  statusText: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.primaryForeground,
    fontWeight: '600',
  },
})

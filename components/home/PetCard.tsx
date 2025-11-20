import { theme } from '@/constants/theme'
import { ApiService, Pet } from '@/services/api-service'
import { MaterialIcons } from '@expo/vector-icons'
import React, { useState } from 'react'
import { Alert, Image, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native'

interface PetCardProps {
  pet: Pet
  onPress?: () => void
  showOwnerActions?: boolean
  onPetEdited?: (pet: Pet) => void
  onPetDeleted?: (petId: number | string) => void
  onReportLost?: (pet: Pet) => void
  onMarkAsFound?: (pet: Pet) => void
}

export function PetCard({ pet, onPress, showOwnerActions = false, onPetEdited, onPetDeleted, onReportLost, onMarkAsFound }: PetCardProps) {
  const [isDeleting, setIsDeleting] = useState(false)

  // Verificar si la mascota está reportada como perdida
  const isLost = pet.perdida === true || pet.status === 'Perdida';

  const handleEditClick = () => {
    console.log('🔵 Botón Editar presionado para:', pet.name)
    if (onPetEdited) {
      onPetEdited(pet)
    } else {
      console.warn('⚠️ onPetEdited callback no está definido')
    }
  }

  const handleDeleteClick = () => {
    console.log('🔴 Botón Eliminar presionado para:', pet.name)
    console.log('🔴 Mostrando confirmación...')
    
    // En Web, usar window.confirm ya que Alert.alert no funciona
    if (Platform.OS === 'web') {
      const confirmed = window.confirm(
        `¿Estás seguro de que deseas eliminar a ${pet.name}?\n\nEsta acción no se puede deshacer.`
      )
      
      if (confirmed) {
        console.log('🗑️ Usuario confirmó eliminación')
        performDelete()
      } else {
        console.log('❌ Usuario canceló la eliminación')
      }
    } else {
      // En iOS/Android, usar Alert.alert nativo
      try {
        Alert.alert(
          'Eliminar mascota',
          `¿Estás seguro de que deseas eliminar a ${pet.name}?\n\nEsta acción no se puede deshacer.`,
          [
            {
              text: 'Cancelar',
              style: 'cancel',
              onPress: () => console.log('❌ Usuario canceló la eliminación')
            },
            {
              text: 'Eliminar',
              style: 'destructive',
              onPress: () => {
                console.log('🗑️ Usuario confirmó eliminación')
                performDelete()
              },
            },
          ]
        )
        console.log('✅ Alert.alert llamado correctamente')
      } catch (error) {
        console.error('❌ Error al mostrar Alert:', error)
      }
    }
  }

  // Función separada para realizar la eliminación
  const performDelete = async () => {
    setIsDeleting(true)
    
    try {
      console.log('📤 Llamando ApiService.deletePet...')
      await ApiService.deletePet(pet.id)
      
      console.log('✅ Mascota eliminada exitosamente')
      
      // Mostrar mensaje de éxito
      if (Platform.OS === 'web') {
        alert(`✅ ${pet.name} ha sido eliminado exitosamente`)
      } else {
        Alert.alert(
          '✅ Éxito',
          `${pet.name} ha sido eliminado exitosamente`
        )
      }
      
      // Llamar callback
      if (onPetDeleted) {
        console.log('📞 Llamando callback onPetDeleted')
        onPetDeleted(pet.id)
      } else {
        console.warn('⚠️ onPetDeleted callback no está definido')
      }
    } catch (error: any) {
      console.error('❌ Error al eliminar mascota:', error)
      
      if (Platform.OS === 'web') {
        alert(`Error: ${error.message || 'No se pudo eliminar la mascota'}`)
      } else {
        Alert.alert(
          'Error',
          error.message || 'No se pudo eliminar la mascota'
        )
      }
    } finally {
      setIsDeleting(false)
      console.log('🏁 Proceso de eliminación finalizado')
    }
  }

  return (
    <View style={styles.card}>
      <TouchableOpacity 
        onPress={onPress} 
        activeOpacity={0.7}
        disabled={isDeleting}
      >
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

      {/* Botones de Acciones - Fuera del TouchableOpacity padre */}
      {showOwnerActions && (
        <View style={styles.actionsContainer}>
          <TouchableOpacity
            style={[styles.actionButton, styles.editButton]}
            onPress={handleEditClick}
            disabled={isDeleting}
            activeOpacity={0.7}
          >
            <MaterialIcons name="edit" size={18} color={theme.colors.primaryForeground} />
            <Text style={styles.actionButtonText}>Editar</Text>
          </TouchableOpacity>

          {/* Botón condicional: Perdida o Marcar como Encontrada */}
          {isLost ? (
            <TouchableOpacity
              style={[styles.actionButton, styles.foundButton]}
              onPress={() => onMarkAsFound && onMarkAsFound(pet)}
              disabled={isDeleting}
              activeOpacity={0.7}
            >
              <MaterialIcons name="check-circle" size={18} color="#FFF" />
              <Text style={styles.foundButtonText}>Marcar como Encontrada</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={[styles.actionButton, styles.reportButton]}
              onPress={() => onReportLost && onReportLost(pet)}
              disabled={isDeleting}
              activeOpacity={0.7}
            >
              <MaterialIcons name="location-off" size={18} color="#FFF" />
              <Text style={styles.reportButtonText}>Perdida</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            style={[styles.actionButton, styles.deleteButton, isDeleting && styles.actionButtonDisabled]}
            onPress={handleDeleteClick}
            disabled={isDeleting}
            activeOpacity={0.7}
          >
            <MaterialIcons name="delete" size={18} color="#fff" />
            <Text style={styles.deleteButtonText}>Eliminar</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
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
  actionsContainer: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    paddingBottom: theme.spacing.md,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing.xs,
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
  },
  editButton: {
    backgroundColor: theme.colors.primary,
  },
  reportButton: {
    backgroundColor: '#F97316', // Orange/warning color
  },
  foundButton: {
    backgroundColor: '#10B981', // Green for found/success
  },
  deleteButton: {
    backgroundColor: theme.colors.destructive,
  },
  actionButtonText: {
    fontSize: theme.fontSize.sm,
    fontWeight: '600',
    color: theme.colors.primaryForeground,
  },
  reportButtonText: {
    fontSize: theme.fontSize.sm,
    fontWeight: '600',
    color: '#fff',
  },
  foundButtonText: {
    fontSize: theme.fontSize.sm,
    fontWeight: '600',
    color: '#fff',
  },
  deleteButtonText: {
    fontSize: theme.fontSize.sm,
    fontWeight: '600',
    color: '#fff',
  },
  actionButtonDisabled: {
    opacity: 0.5,
  },
})

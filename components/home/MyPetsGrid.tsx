import { theme } from '@/constants/theme'
import { useAuth } from '@/contexts/AuthContext'
import { ApiService, Pet } from '@/services/api-service'
import { MaterialIcons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import React, { useEffect, useState } from 'react'
import { ActivityIndicator, Alert, Dimensions, FlatList, StyleSheet, Text, View } from 'react-native'
import { Button } from '../ui/Button'
import { AddPetModal } from './AddPetModal'
import { EditPetModal } from './EditPetModal'
import { PetCard } from './PetCard'
import ReportLostModal from './ReportLostModal'

const { width } = Dimensions.get('window')
const numColumns = width > 768 ? 2 : 1 // 2 columnas en tablet, 1 en phone

export function MyPetsGrid() {
  const { user } = useAuth()
  const router = useRouter()
  const [pets, setPets] = useState<Pet[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showReportLostModal, setShowReportLostModal] = useState(false)
  const [selectedPet, setSelectedPet] = useState<Pet | null>(null)

  useEffect(() => {
    const fetchMyPets = async () => {
      if (!user) {
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        const myPets = await ApiService.fetchMyPets()
        setPets(myPets)
      } catch (err: any) {
        console.error('Error al cargar mis mascotas:', err.message)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchMyPets()
  }, [user])

  const handleAddPet = () => {
    if (!user) {
      router.push('/auth/login')
    } else {
      setShowAddModal(true)
    }
  }

  const handlePetAdded = () => {
    console.log('🔄 MyPetsGrid.handlePetAdded - Recargando lista de mascotas...')
    // Recargar lista de mascotas
    setLoading(true)
    setError(null)
    ApiService.fetchMyPets()
      .then((newPets) => {
        console.log('✅ Mascotas recargadas exitosamente:', newPets.length)
        setPets(newPets)
      })
      .catch((err: any) => {
        console.error('❌ Error al recargar mascotas:', err.message)
        setError(err.message)
      })
      .finally(() => {
        setLoading(false)
        console.log('🏁 Recarga de mascotas finalizada')
      })
  }

  const handleEditPet = (pet: Pet) => {
    console.log('✏️ MyPetsGrid.handleEditPet - Editando mascota:', pet.name, 'ID:', pet.id)
    setSelectedPet(pet)
    setShowEditModal(true)
    console.log('📂 Modal de edición abierto')
  }

  const handlePetEdited = (updatedPet: any) => {
    console.log('✅ MyPetsGrid.handlePetEdited - Mascota editada:', updatedPet)
    console.log('🔄 Actualizando lista local...')
    
    // Cerrar el modal primero
    setShowEditModal(false)
    setSelectedPet(null)
    
    // Recargar toda la lista para asegurar sincronización
    console.log('🔄 Recargando lista completa desde el servidor...')
    handlePetAdded()
  }

  const handlePetDeleted = (petId: number | string) => {
    console.log('🗑️ Mascota eliminada, actualizando lista...', petId)
    // Remover la mascota de la lista local
    setPets((prevPets) => prevPets.filter((p) => p.id !== petId))
  }

  const handleReportLost = (pet: Pet) => {
    console.log('📍 Reportando mascota como perdida:', pet.name)
    setSelectedPet(pet)
    setShowReportLostModal(true)
  }

  const handlePetReportedAsLost = (updatedPetData?: any) => {
    console.log('✅ Mascota reportada como perdida, actualizando estado local:', updatedPetData)
    
    if (updatedPetData) {
      // Actualizar la mascota específica en el estado local
      setPets(prevPets => prevPets.map(pet => 
        pet.id.toString() === updatedPetData.id?.toString()
          ? {
              ...pet,
              perdida: true,
              isLost: true,
              perdida_direccion: updatedPetData.perdida_direccion,
              perdida_lat: updatedPetData.perdida_lat,
              perdida_lon: updatedPetData.perdida_lon,
              perdida_fecha: updatedPetData.perdida_fecha,
            }
          : pet
      ))
    } else {
      // Si no hay datos, recargar todo (fallback)
      handlePetAdded()
    }
  }

  const handleMarkAsFound = async (pet: Pet) => {
    console.log('✅ Marcando mascota como encontrada:', pet.name)
    Alert.alert(
      'Marcar como Encontrada',
      `¿Confirmas que ${pet.name} ha sido encontrada?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Sí, marcar',
          onPress: async () => {
            try {
              await ApiService.markPetAsFound(pet.id.toString());
              Alert.alert('¡Éxito!', `${pet.name} ha sido marcada como encontrada.`);
              handlePetAdded(); // Recargar lista
            } catch (error: any) {
              console.error('Error marking pet as found:', error);
              Alert.alert('Error', error.message || 'No se pudo marcar la mascota como encontrada.');
            }
          },
        },
      ]
    );
  };

  const handleRetry = () => {
    setError(null)
    setLoading(true)
    // Re-ejecutar el useEffect
    ApiService.fetchMyPets()
      .then(setPets)
      .catch((err: any) => setError(err.message))
      .finally(() => setLoading(false))
  }

  // Renderizar header con título y botón
  const renderHeader = () => (
    <View style={styles.header}>
      <Text style={styles.title}>MIS MASCOTAS</Text>
      <Button onPress={handleAddPet} size="sm" style={styles.addButton}>
        <MaterialIcons name="add" size={20} color={theme.colors.primaryForeground} />
      </Button>
    </View>
  )

  // Renderizar loading
  if (loading) {
    return (
      <View style={styles.container}>
        {renderHeader()}
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={styles.loadingText}>Cargando mascotas...</Text>
        </View>
      </View>
    )
  }

  // Renderizar error
  if (error) {
    return (
      <View style={styles.container}>
        {renderHeader()}
        <View style={styles.emptyContainer}>
          <MaterialIcons name="error-outline" size={64} color={theme.colors.destructive} />
          <Text style={styles.errorText}>Error al cargar tus mascotas</Text>
          <Text style={styles.errorSubtext}>{error}</Text>
          <Button onPress={handleRetry} variant="outline">
            Reintentar
          </Button>
        </View>
      </View>
    )
  }

  // Renderizar cuando no hay usuario
  if (!user) {
    return (
      <View style={styles.container}>
        {renderHeader()}
        <View style={styles.emptyContainer}>
          <MaterialIcons name="person-outline" size={64} color={theme.colors.mutedForeground} />
          <Text style={styles.emptyText}>Debes iniciar sesión para ver tus mascotas</Text>
          <Button onPress={() => router.push('/auth/login')}>Iniciar Sesión</Button>
        </View>
      </View>
    )
  }

  // Renderizar cuando no hay mascotas
  if (pets.length === 0) {
    return (
      <View style={styles.container}>
        {renderHeader()}
        <View style={styles.emptyContainer}>
          <MaterialIcons name="pets" size={64} color={theme.colors.mutedForeground} />
          <Text style={styles.emptyText}>Aún no tenés mascotas</Text>
          <Text style={styles.emptySubtext}>Adoptá una o registrá tu mascota</Text>
          <Button onPress={() => router.push('/(tabs)/explore')}>
            Ver Mascotas en Adopción
          </Button>
        </View>
      </View>
    )
  }

  // Renderizar grid de mascotas
  return (
    <View style={styles.container}>
      {renderHeader()}
      <FlatList
        data={pets}
        renderItem={({ item }) => (
          <View style={styles.cardWrapper}>
            <PetCard 
              pet={item} 
              onPress={() => console.log('Ver detalles:', item.id)}
              showOwnerActions={true}
              onPetEdited={handleEditPet}
              onPetDeleted={handlePetDeleted}
              onReportLost={handleReportLost}
              onMarkAsFound={handleMarkAsFound}
            />
          </View>
        )}
        keyExtractor={(item) => item.id.toString()}
        numColumns={numColumns}
        contentContainerStyle={styles.grid}
        showsVerticalScrollIndicator={false}
      />
      
      {/* Modal de agregar mascota */}
      <AddPetModal
        visible={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSuccess={handlePetAdded}
      />

      {/* Modal de editar mascota */}
      <EditPetModal
        visible={showEditModal}
        onClose={() => {
          setShowEditModal(false)
          setSelectedPet(null)
        }}
        pet={selectedPet}
        onSuccess={handlePetEdited}
      />

      {/* Modal de reportar mascota perdida */}
      <ReportLostModal
        visible={showReportLostModal}
        onClose={() => {
          setShowReportLostModal(false)
          setSelectedPet(null)
        }}
        pet={selectedPet}
        onSuccess={handlePetReportedAsLost}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  title: {
    fontSize: theme.fontSize['2xl'],
    fontWeight: 'bold',
    color: theme.colors.foreground,
  },
  addButton: {
    width: 40,
    height: 40,
    padding: 0,
  },
  grid: {
    paddingBottom: theme.spacing.xl,
  },
  cardWrapper: {
    flex: 1,
    padding: theme.spacing.xs,
    maxWidth: numColumns === 1 ? '100%' : '50%',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  loadingText: {
    marginTop: theme.spacing.md,
    fontSize: theme.fontSize.base,
    color: theme.colors.mutedForeground,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
    paddingHorizontal: theme.spacing.xl,
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius.lg,
  },
  emptyText: {
    fontSize: theme.fontSize.xl,
    fontWeight: '600',
    color: theme.colors.foreground,
    marginTop: theme.spacing.lg,
    marginBottom: theme.spacing.sm,
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: theme.fontSize.base,
    color: theme.colors.mutedForeground,
    marginBottom: theme.spacing.lg,
    textAlign: 'center',
  },
  errorText: {
    fontSize: theme.fontSize.xl,
    fontWeight: '600',
    color: theme.colors.destructive,
    marginTop: theme.spacing.lg,
    marginBottom: theme.spacing.sm,
    textAlign: 'center',
  },
  errorSubtext: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.mutedForeground,
    marginBottom: theme.spacing.lg,
    textAlign: 'center',
  },
})

import { theme } from '@/constants/theme'
import { useAuth } from '@/contexts/AuthContext'
import { ApiService, Pet } from '@/services/api-service'
import { MaterialIcons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import React, { useEffect, useState } from 'react'
import { ActivityIndicator, Dimensions, FlatList, StyleSheet, Text, View } from 'react-native'
import { Button } from '../ui/Button'
import { PetCard } from './PetCard'

const { width } = Dimensions.get('window')
const numColumns = width > 768 ? 2 : 1 // 2 columnas en tablet, 1 en phone

export function MyPetsGrid() {
  const { user } = useAuth()
  const router = useRouter()
  const [pets, setPets] = useState<Pet[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

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
      // TODO: Implementar modal de agregar mascota
      console.log('Agregar mascota')
    }
  }

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
            <PetCard pet={item} onPress={() => console.log('Ver detalles:', item.id)} />
          </View>
        )}
        keyExtractor={(item) => item.id.toString()}
        numColumns={numColumns}
        contentContainerStyle={styles.grid}
        showsVerticalScrollIndicator={false}
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

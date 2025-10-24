// Example usage of API service in a React Native component
import { ApiService, Pet } from '@/services'
import { router } from 'expo-router'
import React, { useEffect, useState } from 'react'
import { ActivityIndicator, Alert, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native'

/**
 * Example component showing how to use the API service
 * 
 * This component demonstrates:
 * - Loading data with async/await
 * - Error handling
 * - Navigation on authentication errors
 * - TypeScript types
 */
export default function PetsListExample() {
  const [pets, setPets] = useState<Pet[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  useEffect(() => {
    loadPets()
  }, [])

  const loadPets = async () => {
    try {
      setLoading(true)
      const data = await ApiService.fetchPets()
      setPets(data)
    } catch (error: any) {
      console.error('Error loading pets:', error)
      
      // Handle authentication errors
      if (error.message.includes('Sesión expirada') || error.message.includes('no autenticado')) {
        Alert.alert(
          'Sesión Expirada',
          'Tu sesión ha expirado. Por favor, inicia sesión nuevamente.',
          [
            {
              text: 'OK',
              onPress: () => router.replace('/auth/login' as any),
            },
          ]
        )
      } else {
        Alert.alert('Error', error.message || 'Error al cargar las mascotas')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleRefresh = async () => {
    setRefreshing(true)
    await loadPets()
    setRefreshing(false)
  }

  const handlePetPress = (pet: Pet) => {
    // Navigate to pet details
    router.push(`/pets/${pet.id}` as any)
  }

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text style={styles.loadingText}>Cargando mascotas...</Text>
      </View>
    )
  }

  if (pets.length === 0) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.emptyText}>No hay mascotas disponibles</Text>
        <TouchableOpacity style={styles.reloadButton} onPress={loadPets}>
          <Text style={styles.reloadButtonText}>Recargar</Text>
        </TouchableOpacity>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={pets}
        keyExtractor={(item) => item.id.toString()}
        onRefresh={handleRefresh}
        refreshing={refreshing}
        renderItem={({ item }) => (
          <TouchableOpacity 
            style={styles.petCard} 
            onPress={() => handlePetPress(item)}
          >
            <View style={styles.petInfo}>
              <Text style={styles.petName}>{item.name}</Text>
              <Text style={styles.petDetails}>
                {item.species} • {item.breed}
              </Text>
              <Text style={styles.petLocation}>{item.location}</Text>
              <Text style={styles.petShelter}>{item.shelter}</Text>
            </View>
            {item.urgent && (
              <View style={styles.urgentBadge}>
                <Text style={styles.urgentText}>¡Urgente!</Text>
              </View>
            )}
          </TouchableOpacity>
        )}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  emptyText: {
    fontSize: 18,
    color: '#666',
    marginBottom: 20,
  },
  reloadButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  reloadButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  petCard: {
    backgroundColor: '#fff',
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  petInfo: {
    flex: 1,
  },
  petName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  petDetails: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  petLocation: {
    fontSize: 14,
    color: '#888',
    marginBottom: 2,
  },
  petShelter: {
    fontSize: 12,
    color: '#999',
  },
  urgentBadge: {
    position: 'absolute',
    top: 16,
    right: 16,
    backgroundColor: '#FF3B30',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  urgentText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
})

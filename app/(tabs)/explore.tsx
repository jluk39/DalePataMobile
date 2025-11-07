import AdoptionCard from '@/components/adoption/AdoptionCard';
import { AdoptionFilters } from '@/components/adoption/AdoptionFilters';
import AdoptionRequestForm from '@/components/adoption/AdoptionRequestForm';
import { theme } from '@/constants/theme';
import { ApiService } from '@/services';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    FlatList,
    Image,
    Modal,
    RefreshControl,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

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

interface Filters {
  especie?: string; // "Perro", "Gato", "all"
  sexo?: string; // "Macho", "Hembra", "all"
  edad?: string; // "cachorro", "adulto", "senior", "all"
}

export default function ExploreScreen() {
  const [pets, setPets] = useState<Pet[]>([]);
  const [filteredPets, setFilteredPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filters, setFilters] = useState<Filters>({});
  
  // Pet detail modal
  const [selectedPet, setSelectedPet] = useState<Pet | null>(null);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  
  // Adoption form modal
  const [adoptionFormVisible, setAdoptionFormVisible] = useState(false);
  const [petToAdopt, setPetToAdopt] = useState<{ id: number; name: string } | null>(null);

  useEffect(() => {
    fetchPets();
  }, []);

  const fetchPets = async () => {
    try {
      setLoading(true);
      console.log('🔍 Fetching adoption pets...');
      const data = await ApiService.fetchPetsForAdoption();
      console.log('✅ Mascotas recibidas:', data.length);
      console.log('📦 Primera mascota:', JSON.stringify(data[0], null, 2));
      
      // Filtrar solo mascotas en adopción
      const adoptionPets = data.filter((pet: Pet) => pet.en_adopcion === true);
      console.log('🐾 Mascotas en adopción:', adoptionPets.length);
      
      setPets(adoptionPets);
      setFilteredPets(adoptionPets);
    } catch (error) {
      console.error('❌ Error fetching pets:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchPets();
    setRefreshing(false);
  };

  // Helper para extraer edad numérica de string "X años"
  const extractAge = (pet: Pet): number => {
    if (pet.edad_anios !== undefined && pet.edad_anios !== null) {
      return pet.edad_anios;
    }
    // Parsear de string "2 años" -> 2
    const match = pet.edad.match(/(\d+)/);
    return match ? parseInt(match[1]) : 0;
  };

  const handleApplyFilters = (newFilters: Filters) => {
    console.log('🔍 Aplicando filtros:', newFilters);
    setFilters(newFilters);
    
    let filtered = [...pets];

    // Filtro por especie
    if (newFilters.especie && newFilters.especie !== 'all') {
      filtered = filtered.filter(
        (pet) => pet.especie.toLowerCase() === newFilters.especie?.toLowerCase()
      );
      console.log(`🔍 Después de filtro especie (${newFilters.especie}):`, filtered.length);
    }

    // Filtro por sexo
    if (newFilters.sexo && newFilters.sexo !== 'all') {
      filtered = filtered.filter(
        (pet) => pet.genero.toLowerCase() === newFilters.sexo?.toLowerCase()
      );
      console.log(`🔍 Después de filtro sexo (${newFilters.sexo}):`, filtered.length);
    }

    // Filtro por edad
    if (newFilters.edad && newFilters.edad !== 'all') {
      if (newFilters.edad === 'cachorro') {
        filtered = filtered.filter((pet) => extractAge(pet) < 2);
      } else if (newFilters.edad === 'adulto') {
        filtered = filtered.filter((pet) => {
          const age = extractAge(pet);
          return age >= 2 && age <= 7;
        });
      } else if (newFilters.edad === 'senior') {
        filtered = filtered.filter((pet) => extractAge(pet) > 7);
      }
      console.log(`🔍 Después de filtro edad (${newFilters.edad}):`, filtered.length);
    }

    setFilteredPets(filtered);
    console.log('✅ Mascotas filtradas:', filtered.length);
  };

  const handlePetPress = async (petId: number) => {
    try {
      const petDetails = await ApiService.getPetDetails(petId);
      setSelectedPet(petDetails);
      setDetailModalVisible(true);
    } catch (error) {
      console.error('Error fetching pet details:', error);
    }
  };

  const handleAdoptPress = () => {
    if (selectedPet) {
      setPetToAdopt({ id: selectedPet.id, name: selectedPet.nombre });
      setDetailModalVisible(false);
      setTimeout(() => {
        setAdoptionFormVisible(true);
      }, 300);
    }
  };

  const handleAdoptionSuccess = () => {
    setAdoptionFormVisible(false);
    setPetToAdopt(null);
    fetchPets();
  };

  const renderPetDetail = () => {
    if (!selectedPet) return null;

    return (
      <Modal
        visible={detailModalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setDetailModalVisible(false)}
      >
        <SafeAreaView style={styles.detailContainer}>
          {/* Header */}
          <View style={styles.detailHeader}>
            <Text style={styles.detailTitle}>{selectedPet.nombre}</Text>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setDetailModalVisible(false)}
            >
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.detailScroll}>
            {/* Image */}
            {selectedPet.imagen ? (
              <Image
                source={{ uri: selectedPet.imagen }}
                style={styles.detailImage}
                resizeMode="cover"
              />
            ) : (
              <View style={styles.detailImagePlaceholder}>
                <Text style={styles.placeholderText}>Sin foto disponible</Text>
              </View>
            )}

            {/* Description */}
            {selectedPet.acercaDe && (
              <View style={styles.detailSection}>
                <Text style={styles.detailSectionTitle}>Descripción</Text>
                <Text style={styles.detailText}>{selectedPet.acercaDe}</Text>
              </View>
            )}

            {/* Characteristics */}
            <View style={styles.detailSection}>
              <Text style={styles.detailSectionTitle}>Características</Text>
              <View style={styles.characteristicsTable}>
                <View style={styles.characteristicRow}>
                  <Text style={styles.characteristicLabel}>Especie:</Text>
                  <Text style={styles.characteristicValue}>{selectedPet.especie}</Text>
                </View>
                {selectedPet.raza && (
                  <View style={styles.characteristicRow}>
                    <Text style={styles.characteristicLabel}>Raza:</Text>
                    <Text style={styles.characteristicValue}>{selectedPet.raza}</Text>
                  </View>
                )}
                <View style={styles.characteristicRow}>
                  <Text style={styles.characteristicLabel}>Edad:</Text>
                  <Text style={styles.characteristicValue}>{selectedPet.edad}</Text>
                </View>
                <View style={styles.characteristicRow}>
                  <Text style={styles.characteristicLabel}>Sexo:</Text>
                  <Text style={styles.characteristicValue}>
                    {selectedPet.genero === 'Macho' ? '♂ Macho' : '♀ Hembra'}
                  </Text>
                </View>
                <View style={styles.characteristicRow}>
                  <Text style={styles.characteristicLabel}>Ubicación:</Text>
                  <Text style={styles.characteristicValue}>{selectedPet.ubicacion}</Text>
                </View>
                <View style={styles.characteristicRow}>
                  <Text style={styles.characteristicLabel}>Estado de salud:</Text>
                  <Text style={styles.characteristicValue}>{selectedPet.estado_salud}</Text>
                </View>
              </View>
            </View>

            {/* Shelter Contact */}
            {selectedPet.refugio && (
              <View style={styles.detailSection}>
                <Text style={styles.detailSectionTitle}>Refugio de Contacto</Text>
                <Text style={styles.shelterName}>{selectedPet.refugio}</Text>
                {selectedPet.telefono_refugio && (
                  <Text style={styles.shelterInfo}>� {selectedPet.telefono_refugio}</Text>
                )}
              </View>
            )}
          </ScrollView>

          {/* Adopt Button */}
          <View style={styles.detailFooter}>
            <TouchableOpacity
              style={styles.adoptButton}
              onPress={handleAdoptPress}
              activeOpacity={0.8}
            >
              <Text style={styles.adoptButtonText}>❤️ Solicitar Adopción</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </Modal>
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={styles.loadingText}>Cargando mascotas...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Adoptar Mascotas</Text>
        <Text style={styles.subtitle}>
          Encuentra a tu nuevo compañero de vida
        </Text>
      </View>

      {/* Filters */}
      <AdoptionFilters onFiltersChange={handleApplyFilters} />

      {/* Pet Count */}
      <View style={styles.countContainer}>
        <Text style={styles.countText}>
          {filteredPets.length} {filteredPets.length === 1 ? 'mascota disponible' : 'mascotas disponibles'}
        </Text>
      </View>

      {/* Pet List */}
      {filteredPets.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>😔</Text>
          <Text style={styles.emptyTitle}>No hay mascotas disponibles</Text>
          <Text style={styles.emptyDescription}>
            {Object.keys(filters).length > 0
              ? 'Intenta ajustar los filtros para ver más resultados'
              : 'No hay mascotas en adopción en este momento'}
          </Text>
        </View>
      ) : (
        <FlatList
          data={filteredPets}
          renderItem={({ item }) => (
            <AdoptionCard pet={item} onPress={handlePetPress} />
          )}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              tintColor={theme.colors.primary}
            />
          }
        />
      )}

      {/* Pet Detail Modal */}
      {renderPetDetail()}

      {/* Adoption Form Modal */}
      {petToAdopt && (
        <AdoptionRequestForm
          visible={adoptionFormVisible}
          onClose={() => setAdoptionFormVisible(false)}
          petId={petToAdopt.id}
          petName={petToAdopt.name}
          onSuccess={handleAdoptionSuccess}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    backgroundColor: theme.colors.card,
    padding: theme.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
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
  countContainer: {
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
  },
  countText: {
    fontSize: theme.fontSize.base,
    color: theme.colors.mutedForeground,
    fontWeight: '500',
  },
  listContent: {
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: theme.spacing.xl,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
    paddingHorizontal: theme.spacing.xl,
  },
  emptyText: {
    fontSize: 64,
    marginBottom: theme.spacing.lg,
  },
  emptyTitle: {
    fontSize: theme.fontSize.xl,
    fontWeight: '700',
    color: theme.colors.foreground,
    marginBottom: theme.spacing.sm,
    textAlign: 'center',
  },
  emptyDescription: {
    fontSize: theme.fontSize.base,
    color: theme.colors.mutedForeground,
    textAlign: 'center',
  },

  // Detail Modal Styles
  detailContainer: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  detailHeader: {
    backgroundColor: theme.colors.card,
    padding: theme.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  detailTitle: {
    fontSize: theme.fontSize['2xl'],
    fontWeight: '700',
    color: theme.colors.foreground,
    flex: 1,
  },
  closeButton: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 24,
    color: theme.colors.mutedForeground,
  },
  detailScroll: {
    flex: 1,
  },
  detailImage: {
    width: '100%',
    height: 300,
  },
  detailImagePlaceholder: {
    width: '100%',
    height: 300,
    backgroundColor: '#E5E7EB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    fontSize: theme.fontSize.base,
    color: theme.colors.mutedForeground,
  },
  detailUrgentBadge: {
    backgroundColor: '#EF4444',
    padding: theme.spacing.md,
    alignItems: 'center',
  },
  urgentBadgeText: {
    color: '#FFFFFF',
    fontSize: theme.fontSize.base,
    fontWeight: '700',
  },
  detailSection: {
    padding: theme.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  detailSectionTitle: {
    fontSize: theme.fontSize.xl,
    fontWeight: '700',
    color: theme.colors.foreground,
    marginBottom: theme.spacing.md,
  },
  detailText: {
    fontSize: theme.fontSize.base,
    color: theme.colors.foreground,
    lineHeight: 24,
  },
  characteristicsTable: {
    gap: theme.spacing.sm,
  },
  characteristicRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: theme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  characteristicLabel: {
    fontSize: theme.fontSize.base,
    fontWeight: '600',
    color: theme.colors.mutedForeground,
  },
  characteristicValue: {
    fontSize: theme.fontSize.base,
    color: theme.colors.foreground,
  },
  shelterName: {
    fontSize: theme.fontSize.base,
    fontWeight: '700',
    color: theme.colors.primary,
    marginBottom: theme.spacing.sm,
  },
  shelterInfo: {
    fontSize: theme.fontSize.base,
    color: theme.colors.foreground,
    marginBottom: theme.spacing.xs,
  },
  detailFooter: {
    backgroundColor: theme.colors.card,
    padding: theme.spacing.lg,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  adoptButton: {
    backgroundColor: theme.colors.primary,
    paddingVertical: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
  },
  adoptButtonText: {
    color: theme.colors.primaryForeground,
    fontSize: theme.fontSize.base,
    fontWeight: '700',
  },
});


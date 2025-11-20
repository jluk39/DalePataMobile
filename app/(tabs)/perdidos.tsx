import LostFoundCard from '@/components/perdidos/LostFoundCard';
import MapaPerdidos from '@/components/perdidos/MapaPerdidos';
import ReportFoundPetForm from '@/components/perdidos/ReportFoundPetForm';
import { theme } from '@/constants/theme';
import { ApiService } from '@/services';
import { LostPet } from '@/types/lostPets';
import { MaterialIcons } from '@expo/vector-icons';
import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type TabType = 'list' | 'map';

// ✅ Mapa habilitado para development build
const MAP_AVAILABLE = true;

export default function PerdidosScreen() {
  const [activeTab, setActiveTab] = useState<TabType>('list');
  const [lostPets, setLostPets] = useState<LostPet[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showReportFoundModal, setShowReportFoundModal] = useState(false);

  // ✅ Cargar mascotas perdidas desde el backend
  const loadLostPets = useCallback(async () => {
    try {
      console.log('📤 Cargando mascotas perdidas...');
      const data = await ApiService.fetchLostPets();
      console.log('✅ Mascotas perdidas cargadas:', data.length);
      setLostPets(data);
    } catch (error: any) {
      console.error('❌ Error loading lost pets:', error);
      Alert.alert(
        'Error',
        error.message || 'No se pudieron cargar las mascotas perdidas'
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadLostPets();
  }, [loadLostPets]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadLostPets();
  }, [loadLostPets]);

  const handleReportPet = () => {
    // Abrir modal de reportar mascota encontrada (SIN dueño)
    setShowReportFoundModal(true);
  };

  const handleReportFoundSuccess = () => {
    setShowReportFoundModal(false);
    loadLostPets(); // Recargar la lista
  };

  // Renderizar tarjeta de mascota
  const renderPetCard = ({ item }: { item: LostPet }) => (
    <LostFoundCard pet={item} onPetUpdated={loadLostPets} />
  );

  // Vista vacía
  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <MaterialIcons name="pets" size={64} color={theme.colors.mutedForeground} />
      <Text style={styles.emptyTitle}>No hay mascotas perdidas</Text>
      <Text style={styles.emptyDescription}>
        Cuando se reporten mascotas perdidas, aparecerán aquí
      </Text>
    </View>
  );

  // Vista de mapa
  const renderMapView = () => (
    <View style={styles.mapContainer}>
      {MAP_AVAILABLE ? (
        <MapaPerdidos mascotas={lostPets} />
      ) : (
        <View style={styles.emptyState}>
          <MaterialIcons name="map" size={80} color={theme.colors.mutedForeground} />
          <Text style={styles.emptyTitle}>Mapa no disponible</Text>
          <Text style={styles.emptyDescription}>
            El mapa requiere un development build de la app. {'\n\n'}
            Por ahora usa la vista de lista para ver las mascotas perdidas.
          </Text>
        </View>
      )}
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={styles.loadingText}>Cargando mascotas perdidas...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Mascotas Perdidas y Encontradas</Text>
          <Text style={styles.headerSubtitle}>
            Ayuda a reunir mascotas con sus familias
          </Text>
        </View>
      </View>

      {/* Tabs */}
      <View style={styles.tabsContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'list' && styles.tabActive]}
          onPress={() => setActiveTab('list')}
        >
          <MaterialIcons
            name="list"
            size={20}
            color={activeTab === 'list' ? theme.colors.primary : theme.colors.mutedForeground}
          />
          <Text
            style={[
              styles.tabText,
              activeTab === 'list' && styles.tabTextActive,
            ]}
          >
            Vista de Lista
          </Text>
        </TouchableOpacity>

        {MAP_AVAILABLE && (
          <TouchableOpacity
            style={[styles.tab, activeTab === 'map' && styles.tabActive]}
            onPress={() => setActiveTab('map')}
          >
            <MaterialIcons
              name="map"
              size={20}
              color={activeTab === 'map' ? theme.colors.primary : theme.colors.mutedForeground}
            />
            <Text
              style={[
                styles.tabText,
                activeTab === 'map' && styles.tabTextActive,
              ]}
            >
              Vista de Mapa
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Content */}
      {activeTab === 'list' ? (
        <>
          {/* Botón de reportar */}
          <View style={styles.actionBar}>
            <TouchableOpacity
              style={styles.reportButton}
              onPress={handleReportPet}
            >
              <MaterialIcons name="add" size={20} color={theme.colors.primaryForeground} />
              <Text style={styles.reportButtonText}>Reportar Mascota Perdida</Text>
            </TouchableOpacity>
          </View>

          {/* Lista */}
          <FlatList
            data={lostPets}
            renderItem={renderPetCard}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={styles.listContent}
            ListEmptyComponent={renderEmptyState}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                colors={[theme.colors.primary]}
              />
            }
          />
        </>
      ) : (
        renderMapView()
      )}

      {/* Modal de reportar mascota encontrada */}
      {showReportFoundModal && (
        <ReportFoundPetForm
          visible={showReportFoundModal}
          onClose={() => setShowReportFoundModal(false)}
          onSuccess={handleReportFoundSuccess}
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: theme.spacing.md,
  },
  loadingText: {
    fontSize: theme.fontSize.base,
    color: theme.colors.mutedForeground,
  },
  header: {
    padding: theme.spacing.lg,
    backgroundColor: theme.colors.card,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  headerContent: {
    gap: 4,
  },
  headerTitle: {
    fontSize: theme.fontSize['2xl'],
    fontWeight: 'bold',
    color: theme.colors.headerTitle,
  },
  headerSubtitle: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.mutedForeground,
  },
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: theme.colors.card,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: theme.spacing.md,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabActive: {
    borderBottomColor: theme.colors.primary,
  },
  tabText: {
    fontSize: theme.fontSize.sm,
    fontWeight: '500',
    color: theme.colors.mutedForeground,
  },
  tabTextActive: {
    color: theme.colors.primary,
    fontWeight: '600',
  },
  actionBar: {
    padding: theme.spacing.md,
    backgroundColor: theme.colors.card,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  reportButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: theme.colors.primary,
    paddingVertical: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
  },
  reportButtonText: {
    fontSize: theme.fontSize.base,
    fontWeight: '600',
    color: theme.colors.primaryForeground,
  },
  listContent: {
    padding: theme.spacing.md,
    paddingBottom: theme.spacing.xl,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: theme.spacing.xl * 2,
    paddingHorizontal: theme.spacing.lg,
  },
  emptyTitle: {
    fontSize: theme.fontSize.xl,
    fontWeight: 'bold',
    color: theme.colors.foreground,
    marginTop: theme.spacing.lg,
    marginBottom: theme.spacing.sm,
  },
  emptyDescription: {
    fontSize: theme.fontSize.base,
    color: theme.colors.mutedForeground,
    textAlign: 'center',
  },
  mapContainer: {
    flex: 1,
  },
});

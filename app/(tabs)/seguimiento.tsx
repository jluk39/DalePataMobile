import AdoptionRequestDetailsModal from '@/components/adoption/AdoptionRequestDetailsModal';
import { theme } from '@/constants/theme';
import { ApiService } from '@/services';
import { MaterialIcons } from '@expo/vector-icons';
import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  RefreshControl,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface AdoptionRequest {
  id: number;
  estado: 'pendiente' | 'enviada' | 'aprobada' | 'rechazada' | 'cancelada';
  created_at: string;
  mascota: {
    nombre: string;
    especie: string;
    raza: string;
    imagen_url: string;
  };
  refugio: {
    nombre: string;
  };
  [key: string]: any;
}

type FilterStatus = 'all' | 'pendiente' | 'enviada' | 'aprobada' | 'rechazada' | 'cancelada';

export default function SeguimientoScreen() {
  const [requests, setRequests] = useState<AdoptionRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all');
  const [selectedRequest, setSelectedRequest] = useState<AdoptionRequest | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  // Cargar solicitudes
  const loadRequests = useCallback(async () => {
    try {
      const data = await ApiService.getMyAdoptions();
      setRequests(data);
    } catch (error: any) {
      console.error('Error loading requests:', error);
      Alert.alert('Error', error.message || 'No se pudieron cargar las solicitudes');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadRequests();
  }, [loadRequests]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadRequests();
  }, [loadRequests]);

  // Formatear fecha
  const formatDate = (date: string): string => {
    if (!date) return 'Sin fecha';
    const dateObj = new Date(date);
    return dateObj.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  // Configuración de badges de estado
  const getStatusConfig = (status: string) => {
    const statusConfig: Record<string, { color: string; bg: string; label: string }> = {
      pendiente: {
        color: '#EAB308',
        bg: '#EAB30833',
        label: 'Pendiente',
      },
      enviada: {
        color: '#3B82F6',
        bg: '#3B82F633',
        label: 'Enviada',
      },
      aprobada: {
        color: '#22C55E',
        bg: '#22C55E33',
        label: 'Aprobada',
      },
      rechazada: {
        color: theme.colors.destructive,
        bg: theme.colors.destructive + '33',
        label: 'Rechazada',
      },
      cancelada: {
        color: theme.colors.mutedForeground,
        bg: theme.colors.mutedForeground + '33',
        label: 'Cancelada',
      },
    };

    return statusConfig[status] || statusConfig.pendiente;
  };

  // Filtrar solicitudes
  const filteredRequests = requests.filter((request) => {
    const matchesSearch = request.mascota.nombre
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesFilter =
      filterStatus === 'all' || request.estado === filterStatus;
    return matchesSearch && matchesFilter;
  });

  // Estadísticas
  const stats = {
    total: requests.length,
    pendientes: requests.filter((r) => r.estado === 'pendiente' || r.estado === 'enviada').length,
    aprobadas: requests.filter((r) => r.estado === 'aprobada').length,
    rechazadas: requests.filter((r) => r.estado === 'rechazada').length,
  };

  // Ver detalles
  const handleViewDetails = (request: AdoptionRequest) => {
    setSelectedRequest(request);
    setShowDetailsModal(true);
  };

  // Cancelar solicitud
  const handleCancelRequest = (request: AdoptionRequest) => {
    Alert.alert(
      'Cancelar Solicitud',
      `¿Estás seguro que deseas cancelar la solicitud de adopción para ${request.mascota.nombre}?`,
      [
        {
          text: 'No',
          style: 'cancel',
        },
        {
          text: 'Sí, cancelar',
          style: 'destructive',
          onPress: async () => {
            try {
              await ApiService.cancelAdoption(request.id);
              // Actualizar el estado local
              setRequests((prev) =>
                prev.map((r) =>
                  r.id === request.id ? { ...r, estado: 'cancelada' as const } : r
                )
              );
              Alert.alert('Éxito', 'Solicitud cancelada correctamente');
            } catch (error: any) {
              Alert.alert('Error', error.message || 'No se pudo cancelar la solicitud');
            }
          },
        },
      ]
    );
  };

  // Renderizar tarjeta de estadística
  const renderStatCard = (title: string, value: number, icon: string, color: string) => (
    <View style={[styles.statCard, { borderLeftColor: color }]}>
      <MaterialIcons name={icon as any} size={24} color={color} />
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{title}</Text>
    </View>
  );

  // Renderizar tarjeta de solicitud
  const renderRequestCard = ({ item }: { item: AdoptionRequest }) => {
    const statusConfig = getStatusConfig(item.estado);
    const canCancel = item.estado === 'pendiente' || item.estado === 'enviada';

    return (
      <View style={styles.requestCard}>
        {/* Imagen y datos básicos */}
        <View style={styles.requestHeader}>
          <Image
            source={{ uri: item.mascota.imagen_url || 'https://via.placeholder.com/64' }}
            style={styles.petImage}
          />
          <View style={styles.requestInfo}>
            <Text style={styles.petName}>{item.mascota.nombre}</Text>
            <Text style={styles.petBreed}>
              {item.mascota.especie} • {item.mascota.raza}
            </Text>
            <View style={[styles.badge, { backgroundColor: statusConfig.bg }]}>
              <Text style={[styles.badgeText, { color: statusConfig.color }]}>
                {statusConfig.label}
              </Text>
            </View>
          </View>
        </View>

        {/* Información adicional */}
        <View style={styles.requestDetails}>
          <View style={styles.detailRow}>
            <MaterialIcons
              name="event"
              size={16}
              color={theme.colors.mutedForeground}
            />
            <Text style={styles.detailText}>
              {formatDate(item.created_at)}
            </Text>
          </View>
          <View style={styles.detailRow}>
            <MaterialIcons
              name="home"
              size={16}
              color={theme.colors.mutedForeground}
            />
            <Text style={styles.detailText}>{item.refugio.nombre}</Text>
          </View>
        </View>

        {/* Botones de acción */}
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={[styles.actionButton, styles.detailsButton]}
            onPress={() => handleViewDetails(item)}
          >
            <MaterialIcons name="visibility" size={18} color={theme.colors.primary} />
            <Text style={styles.detailsButtonText}>Ver Detalles</Text>
          </TouchableOpacity>

          {canCancel && (
            <TouchableOpacity
              style={[styles.actionButton, styles.cancelButton]}
              onPress={() => handleCancelRequest(item)}
            >
              <MaterialIcons name="cancel" size={18} color={theme.colors.destructive} />
              <Text style={styles.cancelButtonText}>Cancelar</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  };

  // Vista vacía
  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <MaterialIcons name="favorite-border" size={64} color={theme.colors.mutedForeground} />
      <Text style={styles.emptyTitle}>No hay solicitudes</Text>
      <Text style={styles.emptyDescription}>
        {searchTerm || filterStatus !== 'all'
          ? 'No se encontraron solicitudes con los filtros aplicados'
          : 'Aún no has realizado ninguna solicitud de adopción'}
      </Text>
    </View>
  );

  // Filtro de estados
  const FilterButton = ({ status, label }: { status: FilterStatus; label: string }) => (
    <TouchableOpacity
      style={[
        styles.filterButton,
        filterStatus === status && styles.filterButtonActive,
      ]}
      onPress={() => setFilterStatus(status)}
    >
      <Text
        style={[
          styles.filterButtonText,
          filterStatus === status && styles.filterButtonTextActive,
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={styles.loadingText}>Cargando solicitudes...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Seguimiento</Text>
      </View>

      {/* Estadísticas */}
      <View style={styles.statsContainer}>
        {renderStatCard('Total', stats.total, 'list', theme.colors.primary)}
        {renderStatCard('Pendientes', stats.pendientes, 'schedule', '#EAB308')}
        {renderStatCard('Aprobadas', stats.aprobadas, 'check-circle', '#22C55E')}
        {renderStatCard('Rechazadas', stats.rechazadas, 'cancel', theme.colors.destructive)}
      </View>

      {/* Barra de búsqueda */}
      <View style={styles.searchContainer}>
        <MaterialIcons
          name="search"
          size={20}
          color={theme.colors.mutedForeground}
          style={styles.searchIcon}
        />
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar por nombre de mascota..."
          placeholderTextColor={theme.colors.mutedForeground}
          value={searchTerm}
          onChangeText={setSearchTerm}
        />
      </View>

      {/* Filtros */}
      <View style={styles.filtersContainer}>
        <FilterButton status="all" label="Todas" />
        <FilterButton status="pendiente" label="Pendientes" />
        <FilterButton status="enviada" label="Enviadas" />
        <FilterButton status="aprobada" label="Aprobadas" />
        <FilterButton status="rechazada" label="Rechazadas" />
        <FilterButton status="cancelada" label="Canceladas" />
      </View>

      {/* Lista de solicitudes */}
      <FlatList
        data={filteredRequests}
        renderItem={renderRequestCard}
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

      {/* Modal de detalles */}
      <AdoptionRequestDetailsModal
        visible={showDetailsModal}
        onClose={() => setShowDetailsModal(false)}
        request={selectedRequest}
      />
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
  headerTitle: {
    fontSize: theme.fontSize['2xl'],
    fontWeight: 'bold',
    color: theme.colors.headerTitle,
  },
  statsContainer: {
    flexDirection: 'row',
    padding: theme.spacing.md,
    gap: theme.spacing.sm,
  },
  statCard: {
    flex: 1,
    backgroundColor: theme.colors.card,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
    alignItems: 'center',
    borderLeftWidth: 3,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  statValue: {
    fontSize: theme.fontSize['2xl'],
    fontWeight: 'bold',
    color: theme.colors.foreground,
    marginTop: theme.spacing.xs,
  },
  statLabel: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.mutedForeground,
    textAlign: 'center',
    marginTop: 2,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.card,
    marginHorizontal: theme.spacing.md,
    marginBottom: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
    paddingHorizontal: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  searchIcon: {
    marginRight: theme.spacing.sm,
  },
  searchInput: {
    flex: 1,
    fontSize: theme.fontSize.base,
    color: theme.colors.foreground,
    paddingVertical: theme.spacing.md,
  },
  filtersContainer: {
    flexDirection: 'row',
    paddingHorizontal: theme.spacing.md,
    marginBottom: theme.spacing.md,
    gap: theme.spacing.sm,
    flexWrap: 'wrap',
  },
  filterButton: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.lg,
    backgroundColor: theme.colors.card,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  filterButtonActive: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  filterButtonText: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.foreground,
    fontWeight: '500',
  },
  filterButtonTextActive: {
    color: theme.colors.primaryForeground,
    fontWeight: '600',
  },
  listContent: {
    padding: theme.spacing.md,
    paddingBottom: theme.spacing.xl,
  },
  requestCard: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  requestHeader: {
    flexDirection: 'row',
    marginBottom: theme.spacing.md,
  },
  petImage: {
    width: 64,
    height: 64,
    borderRadius: theme.borderRadius.lg,
    marginRight: theme.spacing.md,
  },
  requestInfo: {
    flex: 1,
  },
  petName: {
    fontSize: theme.fontSize.xl,
    fontWeight: 'bold',
    color: theme.colors.foreground,
    marginBottom: 4,
  },
  petBreed: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.mutedForeground,
    marginBottom: theme.spacing.sm,
  },
  badge: {
    alignSelf: 'flex-start',
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 4,
    borderRadius: 6,
  },
  badgeText: {
    fontSize: theme.fontSize.sm,
    fontWeight: '600',
  },
  requestDetails: {
    gap: theme.spacing.xs,
    marginBottom: theme.spacing.md,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
  },
  detailText: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.mutedForeground,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing.xs,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
  },
  detailsButton: {
    backgroundColor: 'transparent',
    borderColor: theme.colors.primary,
  },
  detailsButtonText: {
    fontSize: theme.fontSize.sm,
    fontWeight: '600',
    color: theme.colors.primary,
  },
  cancelButton: {
    backgroundColor: 'transparent',
    borderColor: theme.colors.destructive,
  },
  cancelButtonText: {
    fontSize: theme.fontSize.sm,
    fontWeight: '600',
    color: theme.colors.destructive,
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
});

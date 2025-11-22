import { theme } from '@/constants/theme';
import { LostPet } from '@/types/lostPets';
import { MaterialIcons } from '@expo/vector-icons';
import MapboxGL from '@rnmapbox/maps';
import Constants from 'expo-constants';
import React, { useEffect, useRef, useState } from 'react';
import {
    ActivityIndicator,
    Image,
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

// Configurar token de Mapbox
const MAPBOX_TOKEN = Constants.expoConfig?.extra?.mapboxToken || process.env.EXPO_PUBLIC_MAPBOX_TOKEN || '';

if (MAPBOX_TOKEN) {
  MapboxGL.setAccessToken(MAPBOX_TOKEN);
}

interface MapaPerdidosProps {
  mascotas: LostPet[];
}

const MapaPerdidos: React.FC<MapaPerdidosProps> = ({ mascotas }) => {
  const cameraRef = useRef<MapboxGL.Camera>(null);
  const [mapReady, setMapReady] = useState(false);
  const [selectedPet, setSelectedPet] = useState<LostPet | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  // Filtrar mascotas con coordenadas válidas
  const mascotasConCoordenadas = mascotas.filter(
    (mascota) => mascota.lat && mascota.lon
  );

  // Calcular bounds para ajustar el mapa
  useEffect(() => {
    if (mapReady && mascotasConCoordenadas.length > 0 && cameraRef.current) {
      const coordinates = mascotasConCoordenadas.map((pet) => [
        pet.lon,
        pet.lat,
      ]);

      // Calcular bounds
      const lons = coordinates.map((coord) => coord[0]);
      const lats = coordinates.map((coord) => coord[1]);
      
      const bounds = {
        ne: [Math.max(...lons), Math.max(...lats)],
        sw: [Math.min(...lons), Math.min(...lats)],
      };

      // Ajustar cámara para mostrar todos los marcadores
      cameraRef.current.fitBounds(bounds.ne, bounds.sw, [50, 50, 50, 50], 1000);
    }
  }, [mapReady, mascotasConCoordenadas]);

  // Verificar token
  if (!MAPBOX_TOKEN) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorTitle}>Token de Mapbox no configurado</Text>
        <Text style={styles.errorText}>
          Configura EXPO_PUBLIC_MAPBOX_TOKEN en las variables de entorno
        </Text>
      </View>
    );
  }

  if (mascotasConCoordenadas.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyTitle}>No hay ubicaciones disponibles</Text>
        <Text style={styles.emptyText}>
          Las mascotas necesitan tener coordenadas para mostrarse en el mapa
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MapboxGL.MapView
        style={styles.map}
        styleURL={MapboxGL.StyleURL.Street}
        onDidFinishLoadingMap={() => setMapReady(true)}
        compassEnabled={true}
        compassViewPosition={3}
        logoEnabled={false}
      >
        <MapboxGL.Camera
          ref={cameraRef}
          zoomLevel={12}
          centerCoordinate={[-58.3816, -34.6037]} // Buenos Aires
          animationMode="flyTo"
          animationDuration={1000}
        />

        {/* Control de ubicación del usuario */}
        <MapboxGL.UserLocation
          visible={true}
          showsUserHeadingIndicator={true}
        />

        {/* Marcadores de mascotas */}
        {mascotasConCoordenadas.map((mascota) => (
          <MapboxGL.MarkerView
            key={mascota.id}
            id={`marker-${mascota.id}`}
            coordinate={[mascota.lon, mascota.lat]}
          >
            <TouchableOpacity
              onPress={() => {
                setSelectedPet(mascota);
                setShowDetailsModal(true);
              }}
              style={styles.markerContainer}
            >
              <View
                style={[
                  styles.marker,
                  { borderColor: theme.colors.destructive }, // ✅ Siempre rojo (perdidas)
                ]}
              >
                <Image
                  source={{ uri: mascota.image }}
                  style={styles.markerImage}
                />
              </View>
            </TouchableOpacity>
          </MapboxGL.MarkerView>
        ))}
      </MapboxGL.MapView>

      {/* Contador de mascotas */}
      <View style={styles.counter}>
        <Text style={styles.counterText}>
          {mascotasConCoordenadas.length}{' '}
          {mascotasConCoordenadas.length === 1 ? 'mascota' : 'mascotas'} en el
          mapa
        </Text>
      </View>

      {/* Indicador de carga */}
      {!mapReady && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={styles.loadingText}>Cargando mapa...</Text>
        </View>
      )}

      {/* Modal de detalles - Bottom Sheet */}
      <Modal
        visible={showDetailsModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowDetailsModal(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowDetailsModal(false)}
        >
          <TouchableOpacity
            activeOpacity={1}
            onPress={(e) => e.stopPropagation()}
            style={styles.modalContent}
          >
            {selectedPet && (
              <ScrollView showsVerticalScrollIndicator={false}>
                {/* Header */}
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>{selectedPet.name}</Text>
                  <TouchableOpacity
                    onPress={() => setShowDetailsModal(false)}
                    style={styles.modalCloseButton}
                  >
                    <MaterialIcons name="close" size={24} color={theme.colors.foreground} />
                  </TouchableOpacity>
                </View>

                {/* Imagen */}
                <Image
                  source={{ uri: selectedPet.image }}
                  style={styles.modalImage}
                  resizeMode="cover"
                />

                {/* Información */}
                <View style={styles.modalInfo}>
                  <View style={styles.infoRow}>
                    <MaterialIcons name="pets" size={20} color={theme.colors.mutedForeground} />
                    <Text style={styles.infoText}>
                      {selectedPet.especie} • {selectedPet.raza}
                    </Text>
                  </View>

                  <View style={styles.infoRow}>
                    <MaterialIcons name="location-on" size={20} color={theme.colors.mutedForeground} />
                    <Text style={styles.infoText}>{selectedPet.location}</Text>
                  </View>

                  <View style={styles.infoRow}>
                    <MaterialIcons name="event" size={20} color={theme.colors.mutedForeground} />
                    <Text style={styles.infoText}>
                      Perdido el {new Date(selectedPet.perdida_fecha).toLocaleDateString('es-AR')}
                    </Text>
                  </View>

                  {selectedPet.description && (
                    <View style={styles.descriptionSection}>
                      <Text style={styles.descriptionTitle}>Descripción</Text>
                      <Text style={styles.descriptionText}>{selectedPet.description}</Text>
                    </View>
                  )}

                  {/* Contacto */}
                  <View style={styles.contactSection}>
                    <Text style={styles.contactTitle}>Contacto</Text>
                    {selectedPet.contactName !== 'No disponible' && (
                      <Text style={styles.contactInfo}>
                        👤 {selectedPet.contactName}
                      </Text>
                    )}
                    {selectedPet.contactPhone !== 'No disponible' && (
                      <Text style={styles.contactInfo}>
                        📞 {selectedPet.contactPhone}
                      </Text>
                    )}
                    {selectedPet.contactEmail !== 'No disponible' && (
                      <Text style={styles.contactInfo}>
                        ✉️ {selectedPet.contactEmail}
                      </Text>
                    )}
                  </View>
                </View>
              </ScrollView>
            )}
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  map: {
    flex: 1,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.xl,
    backgroundColor: theme.colors.background,
  },
  errorTitle: {
    fontSize: theme.fontSize.xl,
    fontWeight: 'bold',
    color: theme.colors.destructive,
    marginBottom: theme.spacing.md,
    textAlign: 'center',
  },
  errorText: {
    fontSize: theme.fontSize.base,
    color: theme.colors.mutedForeground,
    textAlign: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.xl,
    backgroundColor: theme.colors.background,
  },
  emptyTitle: {
    fontSize: theme.fontSize.xl,
    fontWeight: 'bold',
    color: theme.colors.foreground,
    marginBottom: theme.spacing.md,
    textAlign: 'center',
  },
  emptyText: {
    fontSize: theme.fontSize.base,
    color: theme.colors.mutedForeground,
    textAlign: 'center',
  },
  markerContainer: {
    alignItems: 'center',
  },
  marker: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 3,
    overflow: 'hidden',
    backgroundColor: '#FFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  markerImage: {
    width: '100%',
    height: '100%',
  },
  counter: {
    position: 'absolute',
    top: 16,
    left: 16,
    backgroundColor: theme.colors.card,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  counterText: {
    fontSize: theme.fontSize.sm,
    fontWeight: '600',
    color: theme.colors.foreground,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    gap: theme.spacing.md,
  },
  loadingText: {
    fontSize: theme.fontSize.base,
    color: theme.colors.mutedForeground,
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: theme.colors.card,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%',
    paddingBottom: theme.spacing.xl,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  modalTitle: {
    fontSize: theme.fontSize['2xl'],
    fontWeight: 'bold',
    color: theme.colors.foreground,
    flex: 1,
  },
  modalCloseButton: {
    padding: theme.spacing.xs,
  },
  modalImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  modalInfo: {
    padding: theme.spacing.lg,
    gap: theme.spacing.md,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  infoText: {
    fontSize: theme.fontSize.base,
    color: theme.colors.foreground,
    flex: 1,
  },
  descriptionSection: {
    marginTop: theme.spacing.sm,
    gap: theme.spacing.xs,
  },
  descriptionTitle: {
    fontSize: theme.fontSize.base,
    fontWeight: '600',
    color: theme.colors.foreground,
  },
  descriptionText: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.mutedForeground,
    lineHeight: 20,
  },
  contactSection: {
    marginTop: theme.spacing.md,
    padding: theme.spacing.md,
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius.md,
    gap: theme.spacing.xs,
  },
  contactTitle: {
    fontSize: theme.fontSize.base,
    fontWeight: '600',
    color: theme.colors.foreground,
    marginBottom: theme.spacing.xs,
  },
  contactInfo: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.foreground,
  },
});

export default MapaPerdidos;

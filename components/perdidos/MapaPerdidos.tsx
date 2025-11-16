import { LostPet } from '@/constants/mockLostPets';
import { theme } from '@/constants/theme';
import MapboxGL from '@rnmapbox/maps';
import React, { useEffect, useRef, useState } from 'react';
import {
    ActivityIndicator,
    Image,
    StyleSheet,
    Text,
    View,
} from 'react-native';

// Configurar token de Mapbox
const MAPBOX_TOKEN = process.env.EXPO_PUBLIC_MAPBOX_TOKEN || '';

if (MAPBOX_TOKEN) {
  MapboxGL.setAccessToken(MAPBOX_TOKEN);
}

interface MapaPerdidosProps {
  mascotas: LostPet[];
}

const MapaPerdidos: React.FC<MapaPerdidosProps> = ({ mascotas }) => {
  const cameraRef = useRef<MapboxGL.Camera>(null);
  const [mapReady, setMapReady] = useState(false);

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
            <View style={styles.markerContainer}>
              <View
                style={[
                  styles.marker,
                  {
                    borderColor:
                      mascota.status === 'lost'
                        ? theme.colors.destructive
                        : '#3B82F6',
                  },
                ]}
              >
                <Image
                  source={{ uri: mascota.image }}
                  style={styles.markerImage}
                />
              </View>
            </View>
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
});

export default MapaPerdidos;

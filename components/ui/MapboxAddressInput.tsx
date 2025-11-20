import { theme } from '@/constants/theme';
import { MaterialIcons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
    ActivityIndicator,
    FlatList,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

// Usar token desde variable de entorno
const MAPBOX_TOKEN = process.env.EXPO_PUBLIC_MAPBOX_TOKEN || '';

interface MapboxFeature {
  id: string;
  place_name: string;
  center: [number, number]; // [lon, lat]
  place_type: string[];
}

interface LocationData {
  address: string;
  lat: number;
  lon: number;
  formatted: string;
}

interface MapboxAddressInputProps {
  onLocationSelect: (location: LocationData) => void;
  placeholder?: string;
  initialValue?: string;
}

export function MapboxAddressInput({
  onLocationSelect,
  placeholder = 'Buscar dirección...',
  initialValue = '',
}: MapboxAddressInputProps) {
  const [query, setQuery] = useState(initialValue);
  const [suggestions, setSuggestions] = useState<MapboxFeature[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<string | null>(
    initialValue || null
  );
  const [loading, setLoading] = useState(false);

  const handleSearch = async (text: string) => {
    setQuery(text);
    setSelectedAddress(null);

    // Clear suggestions if query is too short
    if (text.length < 3) {
      setSuggestions([]);
      return;
    }

    // Verificar token
    if (!MAPBOX_TOKEN) {
      console.error('❌ MAPBOX_TOKEN no está configurado');
      setSuggestions([]);
      return;
    }

    try {
      setLoading(true);

      // Mapbox Geocoding API
      const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
        text
      )}.json?` +
        `access_token=${MAPBOX_TOKEN}&` +
        `country=AR&` + // Solo Argentina
        `language=es&` + // Español
        `limit=5&` + // Máximo 5 resultados
        `types=address,poi,place,locality,neighborhood`; // Tipos de lugares
      
      console.log('🔍 Buscando dirección en Mapbox:', text);
      
      const response = await fetch(url);

      if (!response.ok) {
        console.error('❌ Error en la respuesta de Mapbox:', response.status);
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();

      console.log('✅ Resultados de Mapbox:', data.features?.length || 0);

      if (data.features) {
        setSuggestions(data.features);
      }
    } catch (error) {
      console.error('❌ Error buscando dirección:', error);
      setSuggestions([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectSuggestion = (feature: MapboxFeature) => {
    const [lon, lat] = feature.center;
    const location: LocationData = {
      address: feature.place_name,
      lat,
      lon,
      formatted: feature.place_name,
    };

    setSelectedAddress(location.address);
    setQuery(location.address);
    setSuggestions([]);

    if (onLocationSelect) {
      onLocationSelect(location);
    }
  };

  const handleClearSelection = () => {
    setQuery('');
    setSelectedAddress(null);
    setSuggestions([]);
  };

  return (
    <View style={styles.container}>
      {/* Input de búsqueda */}
      <View style={styles.inputContainer}>
        <MaterialIcons
          name="location-on"
          size={20}
          color={theme.colors.mutedForeground}
          style={styles.inputIcon}
        />
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          placeholderTextColor={theme.colors.mutedForeground}
          value={query}
          onChangeText={handleSearch}
          autoCapitalize="none"
          autoCorrect={false}
        />
        {loading && (
          <ActivityIndicator
            size="small"
            color={theme.colors.primary}
            style={styles.loadingIcon}
          />
        )}
        {query.length > 0 && !loading && (
          <TouchableOpacity onPress={handleClearSelection} style={styles.clearButton}>
            <MaterialIcons name="close" size={20} color={theme.colors.mutedForeground} />
          </TouchableOpacity>
        )}
      </View>

      {/* Badge de dirección seleccionada */}
      {selectedAddress && (
        <View style={styles.selectedBadge}>
          <MaterialIcons name="check-circle" size={16} color="#10B981" />
          <Text style={styles.selectedText} numberOfLines={2}>
            {selectedAddress}
          </Text>
        </View>
      )}

      {/* Lista de sugerencias */}
      {suggestions.length > 0 && !selectedAddress && (
        <View style={styles.suggestionsContainer}>
          <FlatList
            data={suggestions}
            keyExtractor={(item) => item.id}
            style={styles.suggestionsList}
            keyboardShouldPersistTaps="handled"
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.suggestionItem}
                onPress={() => handleSelectSuggestion(item)}
              >
                <MaterialIcons
                  name="place"
                  size={18}
                  color={theme.colors.mutedForeground}
                  style={styles.suggestionIcon}
                />
                <View style={styles.suggestionTextContainer}>
                  <Text style={styles.suggestionText} numberOfLines={2}>
                    {item.place_name}
                  </Text>
                  <Text style={styles.suggestionType}>
                    {item.place_type[0] === 'address'
                      ? 'Dirección'
                      : item.place_type[0] === 'poi'
                      ? 'Punto de interés'
                      : 'Lugar'}
                  </Text>
                </View>
              </TouchableOpacity>
            )}
          />
        </View>
      )}

      {/* Hint text */}
      {!selectedAddress && query.length > 0 && query.length < 3 && (
        <Text style={styles.hintText}>
          Escribe al menos 3 caracteres para buscar
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.card,
  },
  inputIcon: {
    marginLeft: theme.spacing.md,
  },
  input: {
    flex: 1,
    padding: theme.spacing.md,
    fontSize: theme.fontSize.base,
    color: theme.colors.foreground,
  },
  loadingIcon: {
    marginRight: theme.spacing.md,
  },
  clearButton: {
    padding: theme.spacing.sm,
    marginRight: theme.spacing.xs,
  },
  selectedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
    marginTop: theme.spacing.sm,
    padding: theme.spacing.sm,
    backgroundColor: '#DCFCE7', // green-100
    borderRadius: theme.borderRadius.md,
  },
  selectedText: {
    flex: 1,
    color: '#16A34A', // green-600
    fontSize: theme.fontSize.sm,
    fontWeight: '500',
  },
  suggestionsContainer: {
    marginTop: theme.spacing.sm,
  },
  suggestionsList: {
    maxHeight: 200,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.card,
  },
  suggestionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  suggestionIcon: {
    marginRight: theme.spacing.sm,
  },
  suggestionTextContainer: {
    flex: 1,
  },
  suggestionText: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.foreground,
    marginBottom: 2,
  },
  suggestionType: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.mutedForeground,
  },
  hintText: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.mutedForeground,
    marginTop: theme.spacing.xs,
  },
});

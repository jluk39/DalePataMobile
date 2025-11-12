import { theme } from '@/constants/theme'
import { MaterialIcons } from '@expo/vector-icons'
import Slider from '@react-native-community/slider'
import React, { useState } from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'

interface Filters {
  especie: 'all' | 'Perro' | 'Gato'
  sexo: 'all' | 'Macho' | 'Hembra'
  edadMin: number
  edadMax: number
}

interface AdoptionFiltersProps {
  onFiltersChange: (filters: Filters) => void
}

export function AdoptionFilters({ onFiltersChange }: AdoptionFiltersProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [filters, setFilters] = useState<Filters>({
    especie: 'all',
    sexo: 'all',
    edadMin: 0,
    edadMax: 15,
  })

  const handleSpeciesChange = (especie: 'all' | 'Perro' | 'Gato') => {
    const newFilters = { ...filters, especie }
    setFilters(newFilters)
  }

  const handleGenderChange = (sexo: 'all' | 'Macho' | 'Hembra') => {
    const newFilters = { ...filters, sexo }
    setFilters(newFilters)
  }

  const handleApplyFilters = () => {
    onFiltersChange(filters)
    setIsExpanded(false)
  }

  const handleClearFilters = () => {
    const clearedFilters: Filters = {
      especie: 'all',
      sexo: 'all',
      edadMin: 0,
      edadMax: 15,
    }
    setFilters(clearedFilters)
    onFiltersChange(clearedFilters)
    setIsExpanded(false)
  }

  const getActiveFiltersCount = () => {
    let count = 0
    if (filters.especie !== 'all') count++
    if (filters.sexo !== 'all') count++
    if (filters.edadMin > 0 || filters.edadMax < 15) count++
    return count
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={styles.header} 
        onPress={() => setIsExpanded(!isExpanded)}
        activeOpacity={0.7}
      >
        <View style={styles.headerLeft}>
          <MaterialIcons name="tune" size={24} color={theme.colors.primary} />
          <Text style={styles.title}>Filtros de Búsqueda</Text>
          {getActiveFiltersCount() > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{getActiveFiltersCount()}</Text>
            </View>
          )}
        </View>
        <MaterialIcons 
          name={isExpanded ? "expand-less" : "expand-more"} 
          size={24} 
          color={theme.colors.foreground} 
        />
      </TouchableOpacity>

      {isExpanded && (
        <View style={styles.content}>
          {/* Especie */}
          <View style={styles.filterGroup}>
        <Text style={styles.label}>Tipo de Animal</Text>
        <View style={styles.optionsRow}>
          <TouchableOpacity
            style={[styles.option, filters.especie === 'all' && styles.optionActive]}
            onPress={() => handleSpeciesChange('all')}
          >
            <Text style={[styles.optionText, filters.especie === 'all' && styles.optionTextActive]}>
              Todos
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.option, filters.especie === 'Perro' && styles.optionActive]}
            onPress={() => handleSpeciesChange('Perro')}
          >
            <Text style={[styles.optionText, filters.especie === 'Perro' && styles.optionTextActive]}>
              🐕 Perros
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.option, filters.especie === 'Gato' && styles.optionActive]}
            onPress={() => handleSpeciesChange('Gato')}
          >
            <Text style={[styles.optionText, filters.especie === 'Gato' && styles.optionTextActive]}>
              🐈 Gatos
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Sexo */}
      <View style={styles.filterGroup}>
        <Text style={styles.label}>Sexo</Text>
        <View style={styles.optionsRow}>
          <TouchableOpacity
            style={[styles.option, filters.sexo === 'all' && styles.optionActive]}
            onPress={() => handleGenderChange('all')}
          >
            <Text style={[styles.optionText, filters.sexo === 'all' && styles.optionTextActive]}>
              Todos
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.option, filters.sexo === 'Macho' && styles.optionActive]}
            onPress={() => handleGenderChange('Macho')}
          >
            <Text style={[styles.optionText, filters.sexo === 'Macho' && styles.optionTextActive]}>
              ♂️ Macho
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.option, filters.sexo === 'Hembra' && styles.optionActive]}
            onPress={() => handleGenderChange('Hembra')}
          >
            <Text style={[styles.optionText, filters.sexo === 'Hembra' && styles.optionTextActive]}>
              ♀️ Hembra
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Edad */}
      <View style={styles.filterGroup}>
        <Text style={styles.label}>Edad</Text>
        <Text style={styles.hint}>
          {filters.edadMin} - {filters.edadMax >= 15 ? '15+' : filters.edadMax} años
        </Text>
        
        {/* Slider Edad Mínima */}
        <View style={styles.sliderContainer}>
          <Text style={styles.sliderLabel}>Edad mínima: {filters.edadMin} años</Text>
          <Slider
            style={styles.slider}
            minimumValue={0}
            maximumValue={15}
            step={1}
            value={filters.edadMin}
            onValueChange={(value) => setFilters({ ...filters, edadMin: value })}
            minimumTrackTintColor={theme.colors.primary}
            maximumTrackTintColor={theme.colors.border}
            thumbTintColor={theme.colors.primary}
          />
        </View>

        {/* Slider Edad Máxima */}
        <View style={styles.sliderContainer}>
          <Text style={styles.sliderLabel}>
            Edad máxima: {filters.edadMax >= 15 ? '15+' : filters.edadMax} años
          </Text>
          <Slider
            style={styles.slider}
            minimumValue={0}
            maximumValue={15}
            step={1}
            value={filters.edadMax}
            onValueChange={(value) => setFilters({ ...filters, edadMax: value })}
            minimumTrackTintColor={theme.colors.primary}
            maximumTrackTintColor={theme.colors.border}
            thumbTintColor={theme.colors.primary}
          />
        </View>
      </View>

      {/* Botones */}
      <View style={styles.buttons}>
        <TouchableOpacity style={styles.applyButton} onPress={handleApplyFilters}>
          <MaterialIcons name="check" size={20} color={theme.colors.primaryForeground} />
          <Text style={styles.applyButtonText}>Aplicar Filtros</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.clearButton} onPress={handleClearFilters}>
          <MaterialIcons name="clear" size={20} color={theme.colors.foreground} />
          <Text style={styles.clearButtonText}>Limpiar</Text>
        </TouchableOpacity>
      </View>
        </View>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.lg,
    marginBottom: theme.spacing.lg,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: theme.spacing.lg,
    backgroundColor: theme.colors.card,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
    flex: 1,
  },
  title: {
    fontSize: theme.fontSize.xl,
    fontWeight: '600',
    color: theme.colors.foreground,
  },
  badge: {
    backgroundColor: theme.colors.primary,
    borderRadius: 12,
    minWidth: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.xs,
  },
  badgeText: {
    color: theme.colors.primaryForeground,
    fontSize: theme.fontSize.sm,
    fontWeight: '700',
  },
  content: {
    padding: theme.spacing.lg,
    paddingTop: 0,
  },
  filterGroup: {
    marginBottom: theme.spacing.lg,
  },
  label: {
    fontSize: theme.fontSize.base,
    fontWeight: '500',
    color: theme.colors.foreground,
    marginBottom: theme.spacing.sm,
  },
  hint: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.mutedForeground,
    marginBottom: theme.spacing.sm,
  },
  sliderContainer: {
    marginTop: theme.spacing.md,
  },
  sliderLabel: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.foreground,
    marginBottom: theme.spacing.xs,
    fontWeight: '500',
  },
  slider: {
    width: '100%',
    height: 40,
  },
  optionsRow: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
  },
  option: {
    flex: 1,
    padding: theme.spacing.sm,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
    backgroundColor: theme.colors.background,
  },
  optionActive: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  optionText: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.foreground,
  },
  optionTextActive: {
    color: theme.colors.primaryForeground,
    fontWeight: '600',
  },
  buttons: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
  },
  applyButton: {
    flex: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing.xs,
    backgroundColor: theme.colors.primary,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
  },
  applyButtonText: {
    color: theme.colors.primaryForeground,
    fontSize: theme.fontSize.base,
    fontWeight: '600',
  },
  clearButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing.xs,
    backgroundColor: theme.colors.background,
    borderWidth: 1,
    borderColor: theme.colors.border,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
  },
  clearButtonText: {
    color: theme.colors.foreground,
    fontSize: theme.fontSize.base,
    fontWeight: '500',
  },
})

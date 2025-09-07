import React, { useState, useCallback, useMemo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Modal } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { COLORS as BASE_COLORS } from '../styles/baseStyles';

const COLORS = {
  ...BASE_COLORS,
  WHITE: '#FFFFFF',
  GRAY_LIGHT: '#E5E7EB',
  RED: '#EF4444',
};

const GENRES = [
  { id: 'romance', label: 'Romántica', icon: '💕' },
  { id: 'mystery', label: 'Misterio', icon: '🔍' },
  { id: 'sci-fi', label: 'Ciencia Ficción', icon: '🚀' },
  { id: 'fantasy', label: 'Fantasía', icon: '🧙‍♂️' },
  { id: 'thriller', label: 'Thriller', icon: '😱' },
  { id: 'fiction', label: 'Ficción', icon: '📖' },
];

const KEYWORDS = {
  romance: ['amor', 'romance', 'romántico', 'romántica', 'pareja', 'relación', 'corazón', 'pasión', 'sentimental'],
  mystery: ['misterio', 'misterioso', 'detective', 'crimen', 'asesinato', 'investigación', 'secreto', 'enigma', 'policial'],
  'sci-fi': ['ciencia ficción', 'futuro', 'espacio', 'robot', 'alien', 'tecnología', 'galaxia', 'nave espacial', 'futurista'],
  fantasy: ['fantasía', 'mágico', 'dragón', 'hechizo', 'reino', 'príncipe', 'princesa', 'héroe', 'épico'],
  thriller: ['thriller', 'suspense', 'tensión', 'peligro', 'amenaza', 'intriga', 'psicológico', 'terror', 'horror'],
  fiction: ['ficción', 'novela', 'historia', 'aventura', 'drama', 'contemporáneo', 'clásico', 'moderno', 'literatura']
};

export const applyFilters = (list, selectedFilters) => {
  if (!selectedFilters || Object.keys(selectedFilters).length === 0) return list;
  
  return list.filter((book) => {
    if (selectedFilters.genres?.length > 0) {
      const bookText = `${book.title || ''} ${book.description || ''} ${book.author || ''}`.toLowerCase();
      return selectedFilters.genres.some(genreId => {
        const keywords = KEYWORDS[genreId] || [];
        return keywords.some(keyword => bookText.includes(keyword));
      });
    }
    return true;
  });
};

export default function AdvancedFilters({ 
  selectedFilters, 
  onFiltersChange, 
  totalBooks, 
  filteredCount 
}) {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [tempFilters, setTempFilters] = useState(selectedFilters);

  const toggleFilter = useCallback((category, filterId, filters) => {
    return {
      ...filters,
      [category]: filters[category]?.includes(filterId) 
        ? filters[category].filter(id => id !== filterId)
        : [...(filters[category] || []), filterId]
    };
  }, []);

  const handleQuickFilterToggle = useCallback((category, filterId) => {
    const newFilters = toggleFilter(category, filterId, selectedFilters);
    onFiltersChange(newFilters);
  }, [selectedFilters, onFiltersChange, toggleFilter]);

  const handleModalFilterToggle = (category, filterId) => {
    setTempFilters(prev => toggleFilter(category, filterId, prev));
  };

  const handleApplyFilters = () => {
    onFiltersChange(tempFilters);
    setIsModalVisible(false);
  };

  const handleClearAll = () => {
    setTempFilters({});
    onFiltersChange({});
    setIsModalVisible(false);
  };

  const activeFiltersCount = useMemo(() => {
    return Object.values(selectedFilters).reduce((count, filters) => count + (filters?.length || 0), 0);
  }, [selectedFilters]);

  const tempFiltersCount = useMemo(() => {
    return Object.values(tempFilters).reduce((count, filters) => count + (filters?.length || 0), 0);
  }, [tempFilters]);

  const FilterChip = useCallback(({ option, isSelected, onPress, isQuick = false }) => {
    const chipStyle = isQuick ? styles.quickChip : styles.chip;
    const selectedStyle = isQuick ? styles.quickChipSelected : styles.chipSelected;
    const textStyle = isQuick ? styles.quickText : styles.text;
    const selectedTextStyle = isQuick ? styles.quickTextSelected : styles.textSelected;

    return (
      <TouchableOpacity
        style={[chipStyle, isSelected && selectedStyle]}
        onPress={onPress}
        activeOpacity={0.7}
      >
        {option.icon && (
          <Text style={isQuick ? styles.quickIcon : styles.icon}>
            {option.icon}
          </Text>
        )}
        <Text style={[textStyle, isSelected && selectedTextStyle]}>
          {option.label}
        </Text>
        {isSelected && (
          <MaterialIcons 
            name="check-circle" 
            size={isQuick ? 16 : 18} 
            color={COLORS.WHITE} 
            style={styles.checkIcon} 
          />
        )}
      </TouchableOpacity>
    );
  }, []);

  const FilterSection = ({ title, category, options, isModal = false }) => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.optionsContainer}>
        {options.map(option => {
          const isSelected = isModal 
            ? tempFilters[category]?.includes(option.id)
            : selectedFilters[category]?.includes(option.id);
          
          const onPress = isModal
            ? () => handleModalFilterToggle(category, option.id)
            : () => handleQuickFilterToggle(category, option.id);

          return (
            <FilterChip
              key={option.id}
              option={option}
              isSelected={isSelected}
              onPress={onPress}
              isQuick={!isModal}
            />
          );
        })}
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={[styles.summary, activeFiltersCount > 0 && styles.summaryActive]}
        onPress={() => setIsModalVisible(true)}
      >
        <View style={styles.summaryLeft}>
          <View style={styles.iconContainer}>
            <MaterialIcons name="tune" size={20} color={COLORS.ACCENT} />
            {activeFiltersCount > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{activeFiltersCount}</Text>
              </View>
            )}
          </View>
          <Text style={styles.summaryText}>
            {activeFiltersCount > 0 
              ? `${activeFiltersCount} filtro${activeFiltersCount > 1 ? 's' : ''} activo${activeFiltersCount > 1 ? 's' : ''}`
              : 'Filtros'
            }
          </Text>
        </View>
        <View style={styles.summaryRight}>
          <Text style={styles.resultsCount}>
            {filteredCount} de {totalBooks}
          </Text>
          <MaterialIcons name="chevron-right" size={20} color={COLORS.SUBT} />
        </View>
      </TouchableOpacity>

      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.quickFilters}
        contentContainerStyle={styles.quickFiltersContent}
      >
        {GENRES.slice(0, 4).map(genre => (
          <FilterChip
            key={genre.id}
            option={genre}
            isSelected={selectedFilters.genres?.includes(genre.id)}
            onPress={() => handleQuickFilterToggle('genres', genre.id)}
            isQuick={true}
          />
        ))}
      </ScrollView>

      <Modal
        visible={isModalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setIsModalVisible(false)}>
              <Text style={styles.modalCancel}>Cancelar</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Filtros</Text>
            <TouchableOpacity onPress={handleClearAll}>
              <Text style={styles.modalClear}>Limpiar</Text>
            </TouchableOpacity>
          </View>
          
          <ScrollView style={styles.modalContent}>
            <FilterSection title="Géneros" category="genres" options={GENRES} isModal={true} />
          </ScrollView>
          
          <View style={styles.modalFooter}>
            <TouchableOpacity style={styles.applyButton} onPress={handleApplyFilters}>
              <MaterialIcons name="check" size={20} color={COLORS.WHITE} style={styles.applyButtonIcon} />
              <Text style={styles.applyButtonText}>
                Aplicar filtros ({tempFiltersCount})
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  summary: {
    backgroundColor: COLORS.CARD,
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: 'rgba(0,0,0,0.06)',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 12,
    elevation: 2,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  summaryActive: {
    borderColor: COLORS.ACCENT,
    shadowColor: COLORS.ACCENT,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 4,
  },
  summaryLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: -6,
    right: -6,
    backgroundColor: COLORS.RED,
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: COLORS.CARD,
  },
  badgeText: {
    color: COLORS.WHITE,
    fontSize: 10,
    fontWeight: '700',
    fontFamily: 'Poppins-Bold',
  },
  summaryText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.TEXT,
    marginLeft: 8,
    fontFamily: 'Poppins-SemiBold',
  },
  summaryRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  resultsCount: {
    fontSize: 14,
    color: COLORS.SUBT,
    marginRight: 8,
    fontFamily: 'Poppins-Regular',
  },
  quickFilters: {
    marginBottom: 8,
  },
  quickFiltersContent: {
    paddingHorizontal: 4,
  },
  quickChip: {
    backgroundColor: COLORS.WHITE,
    borderRadius: 25,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginRight: 8,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: COLORS.GRAY_LIGHT,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  quickChipSelected: {
    backgroundColor: COLORS.ACCENT,
    borderColor: COLORS.ACCENT,
    shadowColor: COLORS.ACCENT,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  quickIcon: {
    fontSize: 14,
    marginRight: 6,
  },
  quickText: {
    fontSize: 13,
    color: COLORS.TEXT,
    fontFamily: 'Poppins-Medium',
  },
  quickTextSelected: {
    color: COLORS.WHITE,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: COLORS.BG,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 60,
    backgroundColor: COLORS.CARD,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.BORDER,
  },
  modalCancel: {
    fontSize: 16,
    color: COLORS.SUBT,
    fontFamily: 'Poppins-Regular',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.TEXT,
    fontFamily: 'Poppins-SemiBold',
  },
  modalClear: {
    fontSize: 16,
    color: COLORS.ACCENT,
    fontFamily: 'Poppins-SemiBold',
  },
  modalContent: {
    flex: 1,
    padding: 20,
  },
  modalFooter: {
    padding: 20,
    backgroundColor: COLORS.CARD,
    borderTopWidth: 1,
    borderTopColor: COLORS.BORDER,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.TEXT,
    marginBottom: 12,
    fontFamily: 'Poppins-SemiBold',
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  chip: {
    backgroundColor: COLORS.WHITE,
    borderRadius: 25,
    paddingHorizontal: 20,
    paddingVertical: 14,
    marginRight: 8,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: COLORS.GRAY_LIGHT,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  chipSelected: {
    backgroundColor: COLORS.ACCENT,
    borderColor: COLORS.ACCENT,
    shadowColor: COLORS.ACCENT,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  icon: {
    fontSize: 16,
    marginRight: 8,
  },
  text: {
    fontSize: 14,
    color: COLORS.TEXT,
    fontFamily: 'Poppins-Medium',
  },
  textSelected: {
    color: COLORS.WHITE,
  },
  checkIcon: {
    marginLeft: 8,
  },
  applyButton: {
    backgroundColor: COLORS.ACCENT,
    borderRadius: 12,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: COLORS.ACCENT,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  applyButtonIcon: {
    marginRight: 8,
  },
  applyButtonText: {
    color: COLORS.WHITE,
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Poppins-SemiBold',
  },
});
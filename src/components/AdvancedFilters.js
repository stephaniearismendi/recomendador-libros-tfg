import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Modal } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

// ============================================================================
// CONSTANTS
// ============================================================================

import { COLORS as BASE_COLORS } from '../styles/baseStyles';

const COLORS = {
  ...BASE_COLORS,
  WHITE: '#FFFFFF',
  GRAY_LIGHT: '#E5E7EB',
  RED: '#EF4444',
};

const FILTER_OPTIONS = {
  genres: [
    { id: 'romance', label: 'Romántica', icon: '💕' },
    { id: 'mystery', label: 'Misterio', icon: '🔍' },
    { id: 'sci-fi', label: 'Ciencia Ficción', icon: '🚀' },
    { id: 'fantasy', label: 'Fantasía', icon: '🧙‍♂️' },
    { id: 'thriller', label: 'Thriller', icon: '😱' },
    { id: 'fiction', label: 'Ficción', icon: '📖' },
  ],
  moods: [
    { id: 'light', label: 'Ligero', icon: '😊' },
    { id: 'reflective', label: 'Reflexivo', icon: '🤔' },
    { id: 'dark', label: 'Oscuro', icon: '🌑' },
    { id: 'fun', label: 'Divertido', icon: '😄' },
  ],
  ratings: [
    { id: 'high', label: '4+ estrellas', min: 4 },
    { id: 'medium', label: '3+ estrellas', min: 3 },
    { id: 'any', label: 'Cualquier rating', min: 0 },
  ],
  sources: [
    { id: 'popular', label: 'Populares' },
    { id: 'adapted', label: 'Adaptaciones' },
    { id: 'bestsellers', label: 'Más vendidos' },
  ]
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function AdvancedFilters({ 
  selectedFilters, 
  onFiltersChange, 
  totalBooks, 
  filteredCount 
}) {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [tempFilters, setTempFilters] = useState(selectedFilters);

  // ============================================================================
  // EVENT HANDLERS
  // ============================================================================

  const openModal = () => {
    setTempFilters(selectedFilters);
    setIsModalVisible(true);
  };

  const closeModal = () => {
    setIsModalVisible(false);
  };

  const handleQuickFilterToggle = (category, filterId) => {
    const newFilters = {
      ...selectedFilters,
      [category]: selectedFilters[category]?.includes(filterId) 
        ? selectedFilters[category].filter(id => id !== filterId)
        : [...(selectedFilters[category] || []), filterId]
    };
    onFiltersChange(newFilters);
  };

  const handleModalFilterToggle = (category, filterId) => {
    setTempFilters(prev => ({
      ...prev,
      [category]: prev[category]?.includes(filterId) 
        ? prev[category].filter(id => id !== filterId)
        : [...(prev[category] || []), filterId]
    }));
  };

  const handleApplyFilters = () => {
    onFiltersChange(tempFilters);
    closeModal();
  };

  const handleClearAll = () => {
    setTempFilters({});
    onFiltersChange({});
    closeModal();
  };

  // ============================================================================
  // UTILITY FUNCTIONS
  // ============================================================================

  const getActiveFiltersCount = () => {
    return Object.values(selectedFilters).reduce((count, filters) => count + (filters?.length || 0), 0);
  };

  const getTempFiltersCount = () => {
    return Object.values(tempFilters).reduce((count, filters) => count + (filters?.length || 0), 0);
  };

  // ============================================================================
  // RENDER COMPONENTS
  // ============================================================================

  const FilterChip = ({ option, isSelected, onPress, isQuick = false }) => {
    const chipStyle = isQuick ? styles.quickFilterChip : styles.filterChip;
    const selectedStyle = isQuick ? styles.quickFilterChipSelected : styles.filterChipSelected;
    const textStyle = isQuick ? styles.quickFilterText : styles.filterText;
    const selectedTextStyle = isQuick ? styles.quickFilterTextSelected : styles.filterTextSelected;
    const iconSize = isQuick ? 16 : 18;

    return (
      <TouchableOpacity
        style={[chipStyle, isSelected && selectedStyle]}
        onPress={onPress}
      >
        {option.icon && (
          <Text style={isQuick ? styles.quickFilterIcon : styles.filterIcon}>
            {option.icon}
          </Text>
        )}
        <Text style={[textStyle, isSelected && selectedTextStyle]}>
          {option.label}
        </Text>
        {isSelected && (
          <MaterialIcons 
            name="check-circle" 
            size={iconSize} 
            color={COLORS.WHITE} 
            style={styles.checkIcon} 
          />
        )}
      </TouchableOpacity>
    );
  };

  const FilterSection = ({ title, category, options, isModal = false }) => (
    <View style={styles.filterSection}>
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

  const FilterSummary = () => (
    <TouchableOpacity 
      style={[styles.filterSummary, getActiveFiltersCount() > 0 && styles.filterSummaryActive]}
      onPress={openModal}
    >
      <View style={styles.filterSummaryLeft}>
        <View style={styles.filterIconContainer}>
          <MaterialIcons name="tune" size={20} color={COLORS.ACCENT} />
          {getActiveFiltersCount() > 0 && (
            <View style={styles.filterBadge}>
              <Text style={styles.filterBadgeText}>{getActiveFiltersCount()}</Text>
            </View>
          )}
        </View>
        <Text style={styles.filterSummaryText}>
          {getActiveFiltersCount() > 0 
            ? `${getActiveFiltersCount()} filtro${getActiveFiltersCount() > 1 ? 's' : ''} activo${getActiveFiltersCount() > 1 ? 's' : ''}`
            : 'Filtros'
          }
        </Text>
      </View>
      <View style={styles.filterSummaryRight}>
        <Text style={styles.resultsCount}>
          {filteredCount} de {totalBooks}
        </Text>
        <MaterialIcons name="chevron-right" size={20} color={COLORS.SUBT} />
      </View>
    </TouchableOpacity>
  );

  const QuickFilters = () => (
    <ScrollView 
      horizontal 
      showsHorizontalScrollIndicator={false}
      style={styles.quickFilters}
      contentContainerStyle={styles.quickFiltersContent}
    >
      {FILTER_OPTIONS.genres.slice(0, 4).map(genre => (
        <FilterChip
          key={genre.id}
          option={genre}
          isSelected={selectedFilters.genres?.includes(genre.id)}
          onPress={() => handleQuickFilterToggle('genres', genre.id)}
          isQuick={true}
        />
      ))}
    </ScrollView>
  );

  const ModalHeader = () => (
    <View style={styles.modalHeader}>
      <TouchableOpacity onPress={closeModal}>
        <Text style={styles.modalCancel}>Cancelar</Text>
      </TouchableOpacity>
      <Text style={styles.modalTitle}>Filtros</Text>
      <TouchableOpacity onPress={handleClearAll}>
        <Text style={styles.modalClear}>Limpiar</Text>
      </TouchableOpacity>
    </View>
  );

  const ModalContent = () => (
    <ScrollView style={styles.modalContent}>
      <FilterSection title="Géneros" category="genres" options={FILTER_OPTIONS.genres} isModal={true} />
      <FilterSection title="Estado de ánimo" category="moods" options={FILTER_OPTIONS.moods} isModal={true} />
      <FilterSection title="Rating" category="ratings" options={FILTER_OPTIONS.ratings} isModal={true} />
      <FilterSection title="Fuente" category="sources" options={FILTER_OPTIONS.sources} isModal={true} />
    </ScrollView>
  );

  const ModalFooter = () => (
    <View style={styles.modalFooter}>
      <TouchableOpacity style={styles.applyButton} onPress={handleApplyFilters}>
        <MaterialIcons name="check" size={20} color={COLORS.WHITE} style={styles.applyButtonIcon} />
        <Text style={styles.applyButtonText}>
          Aplicar filtros ({getTempFiltersCount()})
        </Text>
      </TouchableOpacity>
    </View>
  );

  const AdvancedFiltersModal = () => (
    <Modal
      visible={isModalVisible}
      animationType="slide"
      presentationStyle="pageSheet"
    >
      <View style={styles.modalContainer}>
        <ModalHeader />
        <ModalContent />
        <ModalFooter />
      </View>
    </Modal>
  );

  // ============================================================================
  // MAIN RENDER
  // ============================================================================

  return (
    <View style={styles.container}>
      <FilterSummary />
      <QuickFilters />
      <AdvancedFiltersModal />
    </View>
  );
}

// ============================================================================
// STYLES
// ============================================================================

const styles = StyleSheet.create({
  // Container
  container: {
    marginBottom: 20,
  },

  // Filter Summary
  filterSummary: {
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
  filterSummaryActive: {
    borderColor: COLORS.ACCENT,
    shadowColor: COLORS.ACCENT,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 4,
  },
  filterSummaryLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  filterIconContainer: {
    position: 'relative',
  },
  filterBadge: {
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
  filterBadgeText: {
    color: COLORS.WHITE,
    fontSize: 10,
    fontWeight: '700',
    fontFamily: 'Poppins-Bold',
  },
  filterSummaryText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.TEXT,
    marginLeft: 8,
    fontFamily: 'Poppins-SemiBold',
  },
  filterSummaryRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  resultsCount: {
    fontSize: 14,
    color: COLORS.SUBT,
    marginRight: 8,
    fontFamily: 'Poppins-Regular',
  },

  // Quick Filters
  quickFilters: {
    marginBottom: 8,
  },
  quickFiltersContent: {
    paddingHorizontal: 4,
  },
  quickFilterChip: {
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
  quickFilterChipSelected: {
    backgroundColor: COLORS.ACCENT,
    borderColor: COLORS.ACCENT,
    shadowColor: COLORS.ACCENT,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 6,
    transform: [{ scale: 1.1 }],
  },
  quickFilterIcon: {
    fontSize: 14,
    marginRight: 6,
  },
  quickFilterText: {
    fontSize: 13,
    color: COLORS.TEXT,
    fontFamily: 'Poppins-Medium',
  },
  quickFilterTextSelected: {
    color: COLORS.WHITE,
  },

  // Modal
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

  // Filter Sections
  filterSection: {
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

  // Filter Chips
  filterChip: {
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
  filterChipSelected: {
    backgroundColor: COLORS.ACCENT,
    borderColor: COLORS.ACCENT,
    shadowColor: COLORS.ACCENT,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 6,
    transform: [{ scale: 1.08 }],
  },
  filterIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  filterText: {
    fontSize: 14,
    color: COLORS.TEXT,
    fontFamily: 'Poppins-Medium',
  },
  filterTextSelected: {
    color: COLORS.WHITE,
  },
  checkIcon: {
    marginLeft: 8,
  },

  // Apply Button
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
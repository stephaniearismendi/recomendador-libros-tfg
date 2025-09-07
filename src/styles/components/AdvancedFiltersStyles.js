import { StyleSheet } from 'react-native';
import { COLORS } from '../baseStyles';

export const styles = StyleSheet.create({
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
    backgroundColor: '#EF4444',
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: COLORS.CARD,
  },
  
  badgeText: {
    color: '#FFFFFF',
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
    backgroundColor: '#FFFFFF',
    borderRadius: 25,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginRight: 8,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#E5E7EB',
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
    color: '#FFFFFF',
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
    backgroundColor: '#FFFFFF',
    borderRadius: 25,
    paddingHorizontal: 20,
    paddingVertical: 14,
    marginRight: 8,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#E5E7EB',
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
    color: '#FFFFFF',
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
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Poppins-SemiBold',
  },
});

import { StyleSheet } from 'react-native';
import { COLORS } from '../baseStyles';

export const styles = StyleSheet.create({
  modalBackdropCenter: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.35)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalCardWide: { 
    backgroundColor: COLORS.CARD, 
    borderRadius: 16, 
    padding: 14, 
    width: '100%' 
  },
  modalTitle: { 
    fontSize: 18, 
    fontWeight: '700', 
    color: COLORS.TEXT, 
    marginBottom: 4 
  },
  modalSubtitle: { 
    fontSize: 14, 
    fontWeight: '700', 
    color: COLORS.TEXT, 
    marginTop: 8, 
    marginBottom: 6 
  },
  inputMultiline: {
    borderWidth: 1,
    borderColor: COLORS.BORDER,
    borderRadius: 12,
    padding: 12,
    fontSize: 14,
    color: COLORS.TEXT,
    backgroundColor: COLORS.BG,
    minHeight: 80,
    textAlignVertical: 'top',
  },
  attachList: { 
    gap: 10 
  },
  attachItem: {
    width: 100,
    borderWidth: 2,
    borderColor: 'transparent',
    borderRadius: 12,
    padding: 8,
    backgroundColor: '#F8F9FA',
  },
  attachItemActive: { 
    borderColor: COLORS.ACCENT 
  },
  attachCover: { 
    width: '100%', 
    height: 90, 
    borderRadius: 8, 
    backgroundColor: '#EEE' 
  },
  attachTitle: { 
    marginTop: 6, 
    color: COLORS.TEXT, 
    fontWeight: '700' 
  },
  attachAuthor: { 
    color: COLORS.SUBT, 
    fontSize: 12 
  },
  rowEnd: { 
    flexDirection: 'row', 
    justifyContent: 'flex-end', 
    gap: 12 
  },
  modalCloseTiny: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  modalCloseText: { 
    color: COLORS.ACCENT, 
    fontWeight: '700' 
  },
  modalPrimaryTiny: {
    backgroundColor: COLORS.ACCENT,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  modalPrimaryTinyDisabled: {
    backgroundColor: '#E5E7EB',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  modalPrimaryText: { 
    color: 'white', 
    fontWeight: '700' 
  },
});

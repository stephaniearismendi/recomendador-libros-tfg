import { StyleSheet } from 'react-native';
import { COLORS, baseStyles } from '../baseStyles';

export const modalStyles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9999,
  },
  sheet: {
    width: '92%',
    maxWidth: 520,
    maxHeight: '80%',
    backgroundColor: COLORS.CARD,
    borderRadius: 16,
    padding: 20,
    gap: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.TEXT,
    marginBottom: 4,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.TEXT,
    marginBottom: 8,
  },
  input: {
    ...baseStyles.input,
    minHeight: 44,
    textAlignVertical: 'top',
  },
  hint: {
    fontSize: 13,
    color: COLORS.SUBT,
    fontStyle: 'italic',
  },
  bookList: {
    maxHeight: 200,
  },
  bookItem: {
    width: 100,
    marginRight: 12,
    padding: 8,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: COLORS.BORDER,
    backgroundColor: COLORS.CARD,
  },
  bookItemSelected: {
    borderColor: COLORS.ACCENT,
    backgroundColor: '#F8F7FF',
  },
  bookCover: {
    width: 84,
    height: 126,
    borderRadius: 8,
    marginBottom: 6,
  },
  bookTitle: {
    fontSize: 11,
    color: COLORS.TEXT,
    fontWeight: '500',
    lineHeight: 14,
  },
  actions: {
    ...baseStyles.rowEnd,
    gap: 12,
    marginTop: 8,
  },
  button: {
    ...baseStyles.button,
    minWidth: 80,
  },
  buttonSecondary: {
    ...baseStyles.buttonSecondary,
  },
  buttonPrimary: {
    ...baseStyles.buttonPrimary,
  },
  buttonText: {
    ...baseStyles.buttonText,
  },
  buttonTextSecondary: {
    ...baseStyles.buttonTextSecondary,
  },
  buttonTextPrimary: {
    ...baseStyles.buttonTextPrimary,
  },
});

import { StyleSheet } from 'react-native';
import { COLORS, baseStyles } from '../baseStyles';

export const createClubStyles = StyleSheet.create({
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
    maxHeight: '85%',
    backgroundColor: COLORS.CARD,
    borderRadius: 16,
    padding: 20,
    gap: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  headerInfo: {
    flex: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.TEXT,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 13,
    color: COLORS.SUBT,
    fontWeight: '500',
  },
  userAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    overflow: 'hidden',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  emptyText: {
    fontSize: 14,
    color: COLORS.SUBT,
    textAlign: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.TEXT,
    marginBottom: 12,
  },
  bookList: {
    maxHeight: 180,
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
    fontWeight: '600',
    lineHeight: 14,
    marginBottom: 2,
  },
  bookAuthor: {
    fontSize: 10,
    color: COLORS.SUBT,
    lineHeight: 12,
  },
  input: {
    ...baseStyles.input,
    minHeight: 44,
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
  buttonPrimaryDisabled: {
    ...baseStyles.buttonPrimary,
    backgroundColor: COLORS.SUBT,
    opacity: 0.6,
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

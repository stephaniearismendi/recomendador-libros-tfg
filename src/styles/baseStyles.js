import { StyleSheet } from 'react-native';

// Colors for the app
export const COLORS = {
  ACCENT: '#5A4FFF',
  BG: '#F7F6F3',
  CARD: '#FFFFFF',
  TEXT: '#1F2328',
  SUBT: '#6B7280',
  BORDER: '#EAE7E1',
  SHADOW: 'rgba(0,0,0,0.06)',
  ERROR: '#E63946',
  SUCCESS: '#10B981',
  WARNING: '#F59E0B',
  INFO: '#3B82F6',
};

// Typography for the app
export const TYPOGRAPHY = {
  heading: {
    fontSize: 28,
    fontFamily: 'Poppins-Bold',
    color: COLORS.TEXT,
  },
  subheading: {
    fontSize: 20,
    fontFamily: 'Poppins-SemiBold',
    color: COLORS.TEXT,
  },
  body: {
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    color: COLORS.TEXT,
  },
  caption: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: COLORS.SUBT,
  },
  small: {
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
    color: COLORS.SUBT,
  },
};

export const baseStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BG,
  },
  
  scrollView: {
    flex: 1,
  },
  
  scroll: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 40,
  },
  
  card: {
    backgroundColor: COLORS.CARD,
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    shadowColor: COLORS.SHADOW,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 12,
    elevation: 3,
    borderWidth: 1,
    borderColor: COLORS.BORDER,
  },
  
  header: {
    marginBottom: 24,
    paddingVertical: 8,
  },
  
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  
  headerInfo: {
    flex: 1,
  },
  
  headerTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: COLORS.TEXT,
    fontFamily: 'Poppins-SemiBold',
    marginBottom: 2,
  },
  
  headerSubtitle: {
    ...TYPOGRAPHY.caption,
    lineHeight: 20,
  },
  
  section: {
    marginBottom: 28,
  },
  
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  
  sectionTitle: {
    ...TYPOGRAPHY.subheading,
    fontSize: 18,
  },
  
  sectionSubtitle: {
    ...TYPOGRAPHY.caption,
    marginTop: 4,
  },
  
  // Buttons
  button: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  buttonPrimary: {
    backgroundColor: COLORS.ACCENT,
    shadowColor: COLORS.ACCENT,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  
  buttonSecondary: {
    backgroundColor: '#F2F1FD',
    borderWidth: 1,
    borderColor: COLORS.ACCENT,
  },
  
  buttonText: {
    ...TYPOGRAPHY.body,
    fontSize: 14,
    fontFamily: 'Poppins-SemiBold',
  },
  
  buttonTextPrimary: {
    color: '#FFFFFF',
  },
  
  buttonTextSecondary: {
    color: COLORS.ACCENT,
  },
  
  // Chips/Pills
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  
  chipPrimary: {
    backgroundColor: COLORS.ACCENT,
  },
  
  chipSecondary: {
    backgroundColor: '#F2F1FD',
    borderWidth: 1,
    borderColor: COLORS.ACCENT,
  },
  
  chipText: {
    ...TYPOGRAPHY.small,
    fontFamily: 'Poppins-SemiBold',
  },
  
  chipTextPrimary: {
    color: '#FFFFFF',
  },
  
  chipTextSecondary: {
    color: COLORS.ACCENT,
  },
  
  // Inputs
  input: {
    borderWidth: 1,
    borderColor: COLORS.BORDER,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    backgroundColor: COLORS.CARD,
    color: COLORS.TEXT,
  },
  
  inputLabel: {
    ...TYPOGRAPHY.caption,
    fontFamily: 'Poppins-SemiBold',
    color: COLORS.TEXT,
    marginBottom: 8,
  },
  
  // Loading states
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  
  loadingText: {
    ...TYPOGRAPHY.body,
    marginTop: 16,
    color: COLORS.SUBT,
  },
  
  // Empty states
  emptyContainer: {
    alignItems: 'center',
    padding: 40,
  },
  
  emptyText: {
    ...TYPOGRAPHY.body,
    color: COLORS.SUBT,
    textAlign: 'center',
    marginTop: 16,
  },
  
  // Errors
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  
  errorText: {
    ...TYPOGRAPHY.body,
    color: COLORS.ERROR,
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 24,
  },
  
  retryButton: {
    backgroundColor: COLORS.ACCENT,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  
  retryText: {
    ...TYPOGRAPHY.body,
    color: '#FFFFFF',
    fontFamily: 'Poppins-SemiBold',
  },
  
  // Layout helpers
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  
  rowEnd: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  
  // Consistent spacing
  gap8: { gap: 8 },
  gap12: { gap: 12 },
  gap16: { gap: 16 },
  gap20: { gap: 20 },
  
  // Consistent shadows
  shadow: {
    shadowColor: COLORS.SHADOW,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 12,
    elevation: 3,
  },
  
  shadowSmall: {
    shadowColor: COLORS.SHADOW,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 2,
  },
});

export default baseStyles;

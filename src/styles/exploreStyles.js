import { StyleSheet } from 'react-native';
import { COLORS, TYPOGRAPHY } from './baseStyles';

const exploreStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BG,
  },
  scroll: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 24,
    backgroundColor: COLORS.CARD,
    borderRadius: 20,
    padding: 20,
    shadowColor: COLORS.SHADOW,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 12,
    elevation: 3,
    borderWidth: 1,
    borderColor: COLORS.BORDER,
  },
  headerContent: {
    marginBottom: 16,
  },
  headerStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: COLORS.BORDER,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontFamily: 'Poppins-Bold',
    color: COLORS.ACCENT,
  },
  statLabel: {
    ...TYPOGRAPHY.small,
    marginTop: 4,
  },
  heading: {
    fontSize: 24,
    fontWeight: '600',
    color: COLORS.TEXT,
    fontFamily: 'Poppins-SemiBold',
    marginBottom: 2,
  },
  subheading: {
    ...TYPOGRAPHY.caption,
    marginTop: 8,
    lineHeight: 20,
  },
  filterSection: {
    backgroundColor: COLORS.CARD,
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: COLORS.SHADOW,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 12,
    elevation: 2,
  },
  filterHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  filterTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.TEXT,
    fontFamily: 'Poppins-SemiBold',
  },
  clearFiltersBtn: {
    backgroundColor: '#F2F1FD',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  clearFiltersText: {
    fontSize: 12,
    color: COLORS.ACCENT,
    fontFamily: 'Poppins-SemiBold',
  },
  filterRow: {
    marginBottom: 16,
  },
  filterLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.TEXT,
    marginBottom: 8,
    fontFamily: 'Poppins-SemiBold',
  },
  selectorRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 12,
  },
  section: {
    marginTop: 28,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  sectionTitleContainer: {
    flex: 1,
    marginRight: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.TEXT,
    fontFamily: 'Poppins-Bold',
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 13,
    color: COLORS.SUBT,
    fontFamily: 'Poppins-Regular',
    lineHeight: 16,
  },
  sectionBadge: {
    backgroundColor: COLORS.ACCENT,
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    minWidth: 24,
    alignItems: 'center',
  },
  sectionBadgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
    fontFamily: 'Poppins-SemiBold',
  },
  booksList: {
    paddingVertical: 8,
    paddingRight: 20,
  },
  bookCardContainer: {
    marginRight: 16,
  },
  firstBookCard: {
    marginLeft: 0,
  },
  loadingContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: COLORS.SUBT,
    fontFamily: 'Poppins-Regular',
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 40,
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: COLORS.BORDER,
  },
  emptyIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#F2F1FD',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  emptyIcon: {
    fontSize: 24,
    color: COLORS.ACCENT,
  },
  emptyMessage: {
    color: COLORS.SUBT,
    textAlign: 'center',
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    lineHeight: 20,
    paddingHorizontal: 20,
  },
  errorBanner: {
    backgroundColor: '#FEF3C7',
    borderColor: '#F59E0B',
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
  },
  errorBannerText: {
    color: '#92400E',
    fontSize: 13,
    fontFamily: 'Poppins-Regular',
    textAlign: 'center',
    lineHeight: 18,
  },
  // Estilos para endpoints no disponibles
  sectionTitleUnavailable: {
    opacity: 0.6,
  },
  sectionBadgeUnavailable: {
    backgroundColor: '#F3F4F6',
    borderColor: '#D1D5DB',
  },
  endpointUnavailableText: {
    color: '#F59E0B',
    fontSize: 12,
    fontFamily: 'Poppins-Medium',
    marginTop: 4,
    fontStyle: 'italic',
  },
});

export default exploreStyles;

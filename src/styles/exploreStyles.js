import { StyleSheet } from 'react-native';

// Paleta de colores consistente con el resto de la app
const ACCENT = '#5A4FFF';
const BG = '#F7F6F3';
const CARD = '#FFFFFF';
const TEXT = '#1F2328';
const SUBT = '#6B7280';
const BORDER = '#EAE7E1';
const SHADOW = 'rgba(0,0,0,0.06)';

const exploreStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BG,
  },
  scroll: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 24,
    backgroundColor: CARD,
    borderRadius: 20,
    padding: 20,
    shadowColor: SHADOW,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 12,
    elevation: 2,
  },
  headerContent: {
    marginBottom: 16,
  },
  headerStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: BORDER,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '700',
    color: ACCENT,
    fontFamily: 'Poppins-Bold',
  },
  statLabel: {
    fontSize: 12,
    color: SUBT,
    fontFamily: 'Poppins-Regular',
    marginTop: 4,
  },
  heading: {
    fontSize: 28,
    fontWeight: '700',
    color: TEXT,
    fontFamily: 'Poppins-Bold',
  },
  subheading: {
    fontSize: 15,
    color: SUBT,
    marginTop: 8,
    fontFamily: 'Poppins-Regular',
    lineHeight: 20,
  },
  filterSection: {
    backgroundColor: CARD,
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: SHADOW,
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
    color: TEXT,
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
    color: ACCENT,
    fontFamily: 'Poppins-SemiBold',
  },
  filterRow: {
    marginBottom: 16,
  },
  filterLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: TEXT,
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
    color: TEXT,
    fontFamily: 'Poppins-Bold',
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 13,
    color: SUBT,
    fontFamily: 'Poppins-Regular',
    lineHeight: 16,
  },
  sectionBadge: {
    backgroundColor: ACCENT,
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
    color: SUBT,
    fontFamily: 'Poppins-Regular',
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 40,
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: BORDER,
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
    color: ACCENT,
  },
  emptyMessage: {
    color: SUBT,
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

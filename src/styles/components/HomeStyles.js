import { StyleSheet } from 'react-native';
import { COLORS, TYPOGRAPHY } from '../baseStyles';

export const homeStyles = StyleSheet.create({
  headerContent: {
    marginBottom: 16,
  },
  heading: {
    ...TYPOGRAPHY.heading,
    fontSize: 24,
    marginBottom: 4,
  },
  subheading: {
    ...TYPOGRAPHY.body,
    color: COLORS.SUBT,
  },
  headerStats: {
    flexDirection: 'row',
    gap: 24,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    ...TYPOGRAPHY.heading,
    fontSize: 20,
    color: COLORS.ACCENT,
  },
  statLabel: {
    ...TYPOGRAPHY.caption,
    color: COLORS.SUBT,
    marginTop: 2,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    ...TYPOGRAPHY.subheading,
    fontSize: 18,
  },
  sectionBadge: {
    backgroundColor: COLORS.ACCENT,
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  sectionBadgeText: {
    ...TYPOGRAPHY.caption,
    color: '#fff',
    fontSize: 12,
  },
  loadingContainer: {
    padding: 20,
    alignItems: 'center',
  },
  emptyContainer: {
    padding: 20,
    alignItems: 'center',
  },
  emptyMessage: {
    ...TYPOGRAPHY.body,
    color: COLORS.SUBT,
    textAlign: 'center',
  },
  booksList: {
    paddingHorizontal: 16,
  },
  bookCardContainer: {
    marginRight: 12,
  },
  firstBookCard: {
    marginLeft: 0,
  },
});

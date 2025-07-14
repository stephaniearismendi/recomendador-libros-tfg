import { StyleSheet } from 'react-native';

const exploreStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAF8F5',
  },
  scroll: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 16,
  },
  heading: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1F2937',
    fontFamily: 'serif',
  },
  subheading: {
    fontSize: 15,
    color: '#6B7280',
    marginTop: 4,
  },
  filterSection: {
    marginTop: 16,
    marginBottom: 12,
  },
  selectorRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 12,
  },
  section: {
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
    color: '#1F2937',
  },
});

export default exploreStyles;

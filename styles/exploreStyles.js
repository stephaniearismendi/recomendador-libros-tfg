import { StyleSheet } from 'react-native';

const exploreStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAF8F5',
  },
  scroll: {
    padding: 20,
  },
  heading: {
    fontSize: 26,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
    fontFamily: 'serif',
  },
  subheading: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 16,
  },
  cardContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    gap: 12,
    marginBottom: 0,
  },
});

export default exploreStyles;

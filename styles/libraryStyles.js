import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAF8F5',
  },
  scroll: {
    paddingHorizontal: 18,
    paddingTop: 8,
    paddingBottom: 32,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 18,
  },
  screenTitle: {
    fontSize: 30,
    fontFamily: 'Poppins-Bold',
    color: '#3b5998',
    marginBottom: 18,
    marginLeft: 4,
  },
  section: {
    marginBottom: 28,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 10,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
  },
  greeting: {
    fontSize: 20,
    fontWeight: '500',
    color: '#1F2937',
    fontFamily: 'Poppins-Medium',
  },
  title: {
    fontFamily: 'Poppins-Bold',
    fontSize: 28,
    color: '#3b5998',
  },
  subtitle: {
    fontFamily: 'Poppins-Regular',
    fontSize: 18,
    color: '#222',
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  bottomBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
    paddingVertical: 10,
  },
  activeTab: {
    fontSize: 12,
    color: '#1F2937',
  },
  inactiveTab: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  currentlySection: {
    marginBottom: 28,
  },
});
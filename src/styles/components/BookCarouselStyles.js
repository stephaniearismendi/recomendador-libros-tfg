import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: { 
    marginBottom: 24 
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    paddingHorizontal: 2,
  },
  sectionTitle: { 
    fontFamily: 'Poppins-Bold', 
    fontSize: 18, 
    color: '#3b5998' 
  },
  seeAllBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  seeAllText: { 
    color: '#6366F1', 
    fontSize: 13, 
    fontFamily: 'Poppins-Medium', 
    marginRight: 2 
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingTop: 16,
    paddingBottom: 16,
    paddingHorizontal: 12,
    marginRight: 16,
    width: 130,
    height: 240,
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: 'rgba(0,0,0,0.06)',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 12,
    elevation: 2,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#EAE7E1',
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: 8,
  },
  bookImage: {
    width: 100,
    height: 145,
    borderRadius: 12,
    backgroundColor: '#F7F6F3',
    shadowColor: 'rgba(0,0,0,0.06)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 1,
  },
  contentContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  bookTitle: {
    fontSize: 14,
    fontFamily: 'Poppins-Bold',
    color: '#1F2328',
    textAlign: 'center',
    marginBottom: 4,
    lineHeight: 18,
    minHeight: 36,
  },
  bookAuthor: {
    fontSize: 11,
    fontFamily: 'Poppins-Regular',
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 8,
    lineHeight: 16,
    minHeight: 16,
  },
});

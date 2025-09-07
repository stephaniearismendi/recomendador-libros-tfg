import { StyleSheet } from 'react-native';
import { COLORS, TYPOGRAPHY } from '../baseStyles';

export default StyleSheet.create({
  backgroundDecoration: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 200,
    backgroundColor: COLORS.ACCENT,
    opacity: 0.05,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
  },
  
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerInfo: {
    flex: 1,
  },
  userAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 2,
    borderColor: COLORS.ACCENT,
    overflow: 'hidden',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },

  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },

  storyList: { 
    paddingVertical: 6, 
    gap: 12 
  },

  activityActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  addActivityButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 4,
  },
  addActivityText: {
    color: COLORS.ACCENT,
    fontSize: 12,
    fontFamily: 'Poppins-Medium',
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
  },
  emptyText: { 
    ...TYPOGRAPHY.body,
    color: COLORS.SUBT, 
    paddingVertical: 8,
    textAlign: 'center',
  },

  suggestList: { 
    paddingVertical: 6, 
    gap: 10 
  },

  clubList: { 
    paddingVertical: 6, 
    gap: 12 
  },
  createFirstButton: {
    marginTop: 16,
    backgroundColor: COLORS.ACCENT,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 12,
  },
  createFirstText: {
    color: '#fff',
    fontSize: 14,
    fontFamily: 'Poppins-Medium',
  },

  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    color: '#e63946',
    marginTop: 16,
    marginBottom: 24,
    textAlign: 'center',
    fontFamily: 'Poppins-Medium',
  },
  retryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.ACCENT,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
    gap: 8,
  },
  retryText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Poppins-Medium',
  },
});

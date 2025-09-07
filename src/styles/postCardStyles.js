import { StyleSheet } from 'react-native';
import { COLORS, TYPOGRAPHY } from './baseStyles';

export default StyleSheet.create({
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
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 12,
  },
  unfollowButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    backgroundColor: '#FEE2E2',
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  unfollowText: {
    ...TYPOGRAPHY.small,
    fontFamily: 'Poppins-SemiBold',
    color: COLORS.ERROR,
  },
  menuButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuContainer: {
    backgroundColor: COLORS.CARD,
    borderRadius: 16,
    padding: 8,
    minWidth: 200,
    shadowColor: COLORS.SHADOW,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 12,
    elevation: 8,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
  },
  deleteText: {
    ...TYPOGRAPHY.body,
    fontFamily: 'Poppins-SemiBold',
    color: COLORS.ERROR,
    marginLeft: 12,
  },
  avatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    borderWidth: 2,
    borderColor: COLORS.BORDER,
  },
  name: {
    ...TYPOGRAPHY.body,
    fontFamily: 'Poppins-Bold',
    fontSize: 15,
  },
  time: {
    ...TYPOGRAPHY.small,
    marginTop: 2,
  },

  text: {
    ...TYPOGRAPHY.caption,
    lineHeight: 20,
    marginBottom: 12,
  },

  bookBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#FAFAFA',
    borderRadius: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: COLORS.BORDER,
    marginBottom: 12,
  },
  bookCover: {
    width: 50,
    height: 74,
    borderRadius: 8,
  },
  bookTitle: {
    ...TYPOGRAPHY.caption,
    fontFamily: 'Poppins-Bold',
  },
  bookAuthor: {
    ...TYPOGRAPHY.small,
    marginTop: 2,
  },

  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: 4,
  },
  btn: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 12,
    backgroundColor: '#F3F4F6',
  },
  btnText: {
    ...TYPOGRAPHY.small,
    fontFamily: 'Poppins-Bold',
    color: COLORS.ACCENT,
  },
});

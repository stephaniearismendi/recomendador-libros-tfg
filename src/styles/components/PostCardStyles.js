import { StyleSheet } from 'react-native';
import { COLORS, baseStyles } from '../baseStyles';

export const postCardStyles = StyleSheet.create({
  card: {
    ...baseStyles.card,
    marginBottom: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.BORDER,
    marginRight: 12,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.TEXT,
  },
  time: {
    fontSize: 12,
    color: COLORS.SUBT,
    marginTop: 2,
  },
  menuButton: {
    padding: 8,
  },
  unfollowButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: COLORS.BORDER,
  },
  unfollowText: {
    fontSize: 12,
    color: COLORS.SUBT,
    fontWeight: '500',
  },
  text: {
    fontSize: 15,
    lineHeight: 20,
    color: COLORS.TEXT,
    marginBottom: 12,
  },
  bookBox: {
    flexDirection: 'row',
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: COLORS.BORDER,
  },
  bookCover: {
    width: 50,
    height: 70,
    borderRadius: 8,
    backgroundColor: COLORS.BORDER,
    marginRight: 12,
  },
  bookTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.TEXT,
    marginBottom: 4,
  },
  bookAuthor: {
    fontSize: 12,
    color: COLORS.SUBT,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: COLORS.BORDER,
  },
  btn: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
  },
  btnText: {
    fontSize: 14,
    color: COLORS.SUBT,
    marginLeft: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuContainer: {
    backgroundColor: COLORS.CARD,
    borderRadius: 12,
    padding: 8,
    minWidth: 200,
    ...baseStyles.shadow,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
  },
  deleteText: {
    fontSize: 16,
    color: COLORS.ERROR,
    marginLeft: 12,
    fontWeight: '500',
  },
});

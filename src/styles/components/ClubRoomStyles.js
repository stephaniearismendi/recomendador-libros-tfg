import { StyleSheet } from 'react-native';
import { COLORS, TYPOGRAPHY } from '../baseStyles';

export const clubRoomStyles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: COLORS.BG,
  },
  headerCard: {
    margin: 12,
    padding: 14,
    borderRadius: 16,
    backgroundColor: COLORS.CARD,
    shadowColor: COLORS.SHADOW,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 2,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  headerInfo: {
    flex: 1,
  },
  cover: {
    width: 56,
    height: 56,
    borderRadius: 10,
  },
  title: {
    ...TYPOGRAPHY.subheading,
    fontSize: 18,
  },
  subtitle: {
    ...TYPOGRAPHY.caption,
    color: COLORS.SUBT,
  },
  selectorContainer: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 12,
  },
  selectorBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: COLORS.ACCENT,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  selectorText: {
    color: '#fff',
    fontFamily: 'Poppins-Medium',
    fontSize: 12,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.BORDER,
    marginHorizontal: 12,
  },
  msgList: {
    padding: 12,
  },
  msgRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 10,
    alignItems: 'flex-start',
  },
  msgAvatar: {
    width: 34,
    height: 34,
    borderRadius: 17,
  },
  msgBubble: {
    flex: 1,
    backgroundColor: COLORS.CARD,
    borderRadius: 12,
    padding: 10,
    shadowColor: COLORS.SHADOW,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 1,
    shadowRadius: 2,
    elevation: 1,
  },
  msgAuthor: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 12,
    color: COLORS.TEXT,
  },
  msgText: {
    ...TYPOGRAPHY.body,
    fontSize: 14,
    marginTop: 2,
  },
  msgTime: {
    ...TYPOGRAPHY.small,
    color: COLORS.SUBT,
    marginTop: 6,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: COLORS.BG,
  },
  input: {
    flex: 1,
    backgroundColor: COLORS.CARD,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: COLORS.BORDER,
    ...TYPOGRAPHY.body,
  },
  sendBtn: {
    backgroundColor: COLORS.ACCENT,
    borderRadius: 12,
    padding: 12,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.25)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pickerCard: {
    width: '86%',
    maxHeight: '70%',
    backgroundColor: COLORS.CARD,
    borderRadius: 16,
    padding: 16,
  },
  modalTitle: {
    ...TYPOGRAPHY.subheading,
    fontSize: 18,
    marginBottom: 16,
    textAlign: 'center',
  },
  pickerItem: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 10,
  },
  pickerItemActive: {
    backgroundColor: '#EEF2FF',
  },
  pickerItemText: {
    fontFamily: 'Poppins-Medium',
    color: COLORS.TEXT,
  },
  pickerItemTextActive: {
    color: COLORS.ACCENT,
  },
  emptyChaptersText: {
    ...TYPOGRAPHY.body,
    color: COLORS.SUBT,
    padding: 12,
    textAlign: 'center',
  },
  modalCloseBtn: {
    alignSelf: 'flex-end',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: COLORS.TEXT,
    marginTop: 8,
  },
  modalCloseText: {
    ...TYPOGRAPHY.body,
    color: '#fff',
    fontFamily: 'Poppins-Medium',
  },
});

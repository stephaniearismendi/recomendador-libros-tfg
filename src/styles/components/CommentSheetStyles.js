import { StyleSheet } from 'react-native';
import { COLORS } from '../baseStyles';

export const styles = StyleSheet.create({
  modalBackdrop: { 
    flex: 1, 
    backgroundColor: 'rgba(0,0,0,0.35)', 
    justifyContent: 'flex-end' 
  },
  modalSheet: {
    backgroundColor: COLORS.CARD,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: '80%',
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  modalTitle: { 
    fontSize: 18, 
    fontWeight: '700', 
    color: COLORS.TEXT, 
    marginBottom: 4 
  },
  sectionLink: { 
    color: COLORS.ACCENT, 
    fontSize: 16, 
    fontWeight: '600' 
  },
  postBookWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    padding: 12,
    borderRadius: 12,
    marginVertical: 12,
  },
  postBookCover: { 
    width: 56, 
    height: 80, 
    borderRadius: 8, 
    backgroundColor: '#EEE' 
  },
  postBookInfo: { 
    flex: 1, 
    justifyContent: 'center' 
  },
  postBookTitle: { 
    color: COLORS.TEXT, 
    fontWeight: '700' 
  },
  postBookAuthor: { 
    color: COLORS.SUBT, 
    marginTop: 2 
  },
  commentItem: { 
    flexDirection: 'row', 
    gap: 10, 
    alignItems: 'flex-start', 
    paddingVertical: 6 
  },
  commentAvatar: { 
    width: 34, 
    height: 34, 
    borderRadius: 17, 
    backgroundColor: '#EEE' 
  },
  commentUser: { 
    color: COLORS.TEXT, 
    fontWeight: '700' 
  },
  commentText: { 
    color: COLORS.TEXT 
  },
  commentInputRow: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    gap: 8, 
    marginTop: 10 
  },
  commentInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: COLORS.BORDER,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: COLORS.TEXT,
    backgroundColor: COLORS.BG,
  },
  chipPrimarySmall: {
    backgroundColor: COLORS.ACCENT,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
  },
  chipPrimaryText: { 
    color: '#FFFFFF', 
    fontSize: 14, 
    fontWeight: '600' 
  },
});

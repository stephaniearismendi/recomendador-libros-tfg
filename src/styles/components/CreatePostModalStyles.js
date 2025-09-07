import { StyleSheet } from 'react-native';
import { COLORS, baseStyles } from '../baseStyles';

export const createPostStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.CARD,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.BORDER,
  },
  cancelButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  cancelText: {
    fontSize: 16,
    color: COLORS.SUBT,
    fontWeight: '500',
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.TEXT,
  },
  postButton: {
    backgroundColor: COLORS.ACCENT,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  postButtonDisabled: {
    backgroundColor: COLORS.SUBT,
    opacity: 0.6,
  },
  postText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  postTextDisabled: {
    color: '#999',
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  inputContainer: {
    marginTop: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.TEXT,
    marginBottom: 8,
  },
  textInput: {
    ...baseStyles.input,
    minHeight: 120,
    textAlignVertical: 'top',
  },
  characterCount: {
    textAlign: 'right',
    fontSize: 12,
    color: COLORS.SUBT,
    marginTop: 4,
  },
  bookSection: {
    marginTop: 30,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: COLORS.BORDER,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.TEXT,
    marginBottom: 16,
  },
  selectBookButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.BORDER,
    borderRadius: 12,
    backgroundColor: '#F8F9FA',
  },
  selectBookText: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    color: COLORS.ACCENT,
    fontWeight: '500',
  },
  selectedBookContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.ACCENT,
    borderRadius: 12,
    backgroundColor: '#F0F0FF',
  },
  selectedBookCover: {
    width: 50,
    height: 70,
    borderRadius: 8,
    backgroundColor: COLORS.BORDER,
  },
  selectedBookInfo: {
    flex: 1,
    marginLeft: 12,
  },
  selectedBookTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.TEXT,
  },
  selectedBookAuthor: {
    fontSize: 14,
    color: COLORS.SUBT,
    marginTop: 2,
  },
  removeBookButton: {
    padding: 8,
  },
  bookSelectorContainer: {
    flex: 1,
    backgroundColor: COLORS.CARD,
  },
  bookSelectorHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.BORDER,
  },
  backButton: {
    padding: 8,
  },
  bookSelectorTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.TEXT,
  },
  placeholder: {
    width: 40,
  },
  bookList: {
    padding: 16,
  },
  bookItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  bookItemCover: {
    width: 40,
    height: 56,
    borderRadius: 6,
    backgroundColor: COLORS.BORDER,
  },
  bookItemInfo: {
    flex: 1,
    marginLeft: 12,
  },
  bookItemTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.TEXT,
  },
  bookItemAuthor: {
    fontSize: 14,
    color: COLORS.SUBT,
    marginTop: 2,
  },
  emptyFavorites: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyFavoritesText: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.TEXT,
    marginTop: 16,
  },
  emptyFavoritesSubtext: {
    fontSize: 14,
    color: COLORS.SUBT,
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 20,
  },
});

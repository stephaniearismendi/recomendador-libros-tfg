import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    gap: 10,
  },
  avatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
  },
  name: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111827',
  },
  time: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 2,
  },

  text: {
    fontSize: 14,
    color: '#1f2937',
    lineHeight: 20,
    marginBottom: 10,
  },

  bookBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#fafafa',
    borderRadius: 12,
    padding: 10,
    borderWidth: 1,
    borderColor: '#eef2f7',
    marginBottom: 10,
  },
  bookCover: {
    width: 50,
    height: 74,
    borderRadius: 6,
  },
  bookTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111827',
  },
  bookAuthor: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 2,
  },

  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: 2,
  },
  btn: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 10,
    backgroundColor: '#f3f4f6',
  },
  btnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#5A4FFF',
  },
});

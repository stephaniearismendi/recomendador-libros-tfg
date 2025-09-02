import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  backdrop: {
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9999,
  },
  sheet: {
    width: '92%',
    maxWidth: 520,
    maxHeight: '80%',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    gap: 10,
  },
  title: { fontSize: 18, fontWeight: '700', color: '#1d1d1f' },
  label: { fontSize: 13, fontWeight: '600', color: '#3a3a3c' },
  input: {
    borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 10,
    paddingHorizontal: 12, paddingVertical: 8, fontSize: 14,
    backgroundColor: '#fafafa'
  },
  hint: { fontSize: 13, color: '#6b7280', marginVertical: 6 },
  bookItem: {
    width: 110, marginRight: 10, padding: 8, borderRadius: 12,
    borderWidth: 1, borderColor: '#eee', backgroundColor: '#fff'
  },
  bookItemSelected: { borderColor: '#5A4FFF' },
  bookCover: { width: 94, height: 140, borderRadius: 8, marginBottom: 6 },
  bookTitle: { fontSize: 12, color: '#1f2937' },
  rowEnd: { flexDirection: 'row', justifyContent: 'flex-end', gap: 10, marginTop: 8 },
  btnGhost: { paddingVertical: 10, paddingHorizontal: 14, borderRadius: 10, backgroundColor: '#f3f4f6' },
  btnGhostText: { color: '#374151', fontWeight: '600' },
  btnPrimary: { paddingVertical: 10, paddingHorizontal: 16, borderRadius: 10, backgroundColor: '#5A4FFF' },
  btnPrimaryText: { color: '#fff', fontWeight: '700' },
});

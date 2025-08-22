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

  card: {
    marginBottom: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 12,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },

  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 12,
    gap: 12,
  },
  titleWrap: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Poppins-Bold',
    color: '#1F2937',
  },
  sectionSubtitle: {
    marginTop: 4,
    fontSize: 12,
    color: '#6B7280',
  },

  actionsRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 10,
  },
  pillButton: {
    backgroundColor: '#5A4FFF',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  pillText: { color: '#fff', fontWeight: '600' },
  pillSecondary: {
    backgroundColor: '#EEF2FF',
    borderWidth: 1,
    borderColor: '#C7D2FE',
  },
  pillTextSecondary: { color: '#5A4FFF' },

  chipsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  chipPrimary: {
    backgroundColor: '#5A4FFF',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
  },
  chipPrimaryText: { color: '#fff', fontWeight: '700' },
  chipLight: {
    backgroundColor: '#EEF2FF',
    borderWidth: 1,
    borderColor: '#C7D2FE',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
  },
  chipLightText: { color: '#5A4FFF', fontWeight: '700' },

  emptyReading: { gap: 12 },
  ctaButton: {
    alignSelf: 'flex-start',
    backgroundColor: '#5A4FFF',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
  },
  ctaButtonText: { color: '#fff', fontWeight: '700' },

  favList: { paddingVertical: 6, paddingLeft: 8, paddingRight: 8, gap: 8 },
  subtitleSmall: {
    fontSize: 12,
    color: '#6B7280',
  },

  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.28)',
    justifyContent: 'flex-end',
  },
  modalSheet: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    maxHeight: '70%',
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 8,
  },
  modalClose: {
    alignSelf: 'center',
    marginTop: 12,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: '#EEF2FF',
  },
  modalCloseText: { color: '#5A4FFF', fontWeight: '700' },
  pickerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    gap: 12,
  },
  pickerCover: { width: 40, height: 60, borderRadius: 6, backgroundColor: '#eee' },
  pickerTitle: { fontSize: 14, fontWeight: '600', color: '#1F2937' },
  pickerAuthor: { fontSize: 12, color: '#6B7280' },
  pickerAction: { fontSize: 12, color: '#5A4FFF', fontWeight: '700' },
  separator: { height: 1, backgroundColor: '#E5E7EB', opacity: 0.6 },

  modalBackdropCenter: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.28)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  modalCard: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
  },
  modalPrimaryTiny: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: '#5A4FFF',
  },
  modalPrimaryText: { color: '#fff', fontWeight: '700' },
  modalCloseTiny: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: '#EEF2FF',
    marginRight: 8,
  },
  rowEnd: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 12,
    gap: 8,
  },
  input: {
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: '#111827',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  inputLabel: {
    fontSize: 13,
    color: '#6B7280',
    marginTop: 8,
    marginBottom: 6,
  },
  orText: {
    textAlign: 'center',
    color: '#6B7280',
    marginVertical: 8,
  },
});

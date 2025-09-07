import { StyleSheet } from 'react-native';
import { COLORS, TYPOGRAPHY } from '../baseStyles';

export const storyViewerStyles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    width: '90%',
    height: '80%',
    backgroundColor: COLORS.CARD,
    borderRadius: 20,
    overflow: 'hidden',
  },
  bars: {
    flexDirection: 'row',
    gap: 6,
    padding: 10,
  },
  bar: {
    flex: 1,
    height: 3,
    backgroundColor: 'rgba(255,255,255,0.25)',
    borderRadius: 4,
  },
  barActive: {
    backgroundColor: COLORS.CARD,
  },
  image: {
    flex: 1,
    resizeMode: 'cover',
  },
  caption: {
    ...TYPOGRAPHY.body,
    color: COLORS.TEXT,
    padding: 16,
    textAlign: 'center',
  },
  nav: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
  },
  tap: {
    flex: 1,
  },
  close: {
    position: 'absolute',
    top: 20,
    right: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  closeText: {
    ...TYPOGRAPHY.caption,
    color: COLORS.CARD,
    fontFamily: 'Poppins-Bold',
  },
});

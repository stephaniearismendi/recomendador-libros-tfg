import { StyleSheet, Platform } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    width: 220,
    marginRight: 14,
    marginBottom: Platform.OS === 'android' ? 20 : 0,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: '#eef2f7',
  },
  coverImage: {
    width: '100%',
    height: 120,
    borderRadius: 12,
    backgroundColor: '#eee',
  },
  clubName: {
    marginTop: 10,
    fontWeight: '700',
    color: '#111827',
  },
  memberCount: {
    color: '#6b7280',
    marginTop: 2,
  },
  joinButton: {
    marginTop: 10,
    paddingVertical: 10,
    borderRadius: 12,
  },
  joinButtonJoined: {
    backgroundColor: '#eef2ff',
  },
  joinButtonNotJoined: {
    backgroundColor: '#5A4FFF',
  },
  joinButtonText: {
    textAlign: 'center',
    fontWeight: '800',
  },
  joinButtonTextJoined: {
    color: '#5A4FFF',
  },
  joinButtonTextNotJoined: {
    color: '#fff',
  },
});

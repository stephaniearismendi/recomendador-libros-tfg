import AsyncStorage from '@react-native-async-storage/async-storage';
import { jwtDecode } from 'jwt-decode';

export async function getAuth() {
  const token = await AsyncStorage.getItem('token');
  if (!token) return { token: null, userId: null };
  try {
    const d = jwtDecode(token);
    return { token, userId: d?.userId ?? null };
  } catch {
    return { token, userId: null };
  }
}

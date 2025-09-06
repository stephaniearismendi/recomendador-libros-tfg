import React, { useContext, useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
  Alert,
  Modal,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  RefreshControl,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { AuthContext } from '../context/AuthContext';
import { getUserProfile, updateUserProfile, updateUserAvatar } from '../api/api';

const AVATAR_PLACEHOLDER = 'https://i.pravatar.cc/150?u=default';

export default function ProfileScreen() {
  const { token, user, logout, refreshUserData } = useContext(AuthContext);
  
  // Debug user state
  console.log('🔍 ProfileScreen: User state:', {
    hasUser: !!user,
    user: user,
    userAvatar: user?.avatar,
    userAvatarType: typeof user?.avatar,
    userAvatarLength: user?.avatar?.length,
    hasToken: !!token
  });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editData, setEditData] = useState({ name: '', username: '', bio: '' });
  const [updating, setUpdating] = useState(false);

  const loadUserProfile = useCallback(async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      setEditData({
        name: user.name || '',
        username: user.username || '',
        bio: user.bio || '',
      });
    } catch (error) {
      console.error('Error setting edit data:', error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await refreshUserData();
    } catch (error) {
      console.error('Error al refrescar perfil:', error);
    } finally {
      setRefreshing(false);
    }
  }, [refreshUserData]);

  useEffect(() => {
    loadUserProfile();
  }, [loadUserProfile]);

  const handleEditProfile = () => {
    setEditModalVisible(true);
  };

  const handleSaveProfile = async () => {
    if (!token) return;
    
    try {
      setUpdating(true);
      const response = await updateUserProfile(editData, token);
      if (response?.data?.user) {
        // Actualizar el contexto global
        await refreshUserData();
        setEditModalVisible(false);
        Alert.alert('Éxito', 'Perfil actualizado correctamente');
        
        // Recargar el perfil completo para asegurar datos actualizados
        setTimeout(() => {
          loadUserProfile();
        }, 1000);
      }
    } catch (error) {
      if (error?.response?.status === 409) {
        Alert.alert('Error', 'El nombre de usuario ya está en uso');
      } else if (error?.response?.status === 401) {
        await logout();
      } else {
        Alert.alert('Error', 'No se pudo actualizar el perfil');
      }
    } finally {
      setUpdating(false);
    }
  };

  const handleAvatarChange = async (avatarUrl) => {
    if (!token) return;
    
    try {
      const response = await updateUserAvatar(avatarUrl, token);
      if (response?.data?.user) {
        // Actualizar el contexto global
        await refreshUserData();
        Alert.alert('Éxito', 'Avatar actualizado correctamente');
      }
    } catch (error) {
      if (error?.response?.status === 401) {
        await logout();
      } else {
        Alert.alert('Error', 'No se pudo actualizar el avatar');
      }
    }
  };

  const handleLogout = () => {
    Alert.alert(
      'Cerrar sesión',
      '¿Estás seguro de que quieres cerrar sesión?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Cerrar sesión', style: 'destructive', onPress: logout },
      ]
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#5A4FFF" />
          <Text style={styles.loadingText}>Cargando perfil...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!user) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <MaterialIcons name="error-outline" size={64} color="#e63946" />
          <Text style={styles.errorText}>No se pudo cargar el perfil</Text>
          <TouchableOpacity style={styles.retryButton} onPress={loadUserProfile}>
            <Text style={styles.retryText}>Reintentar</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        style={styles.scrollView} 
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#5A4FFF']} // Android
            tintColor="#5A4FFF" // iOS
            title="Actualizando perfil..." // iOS
            titleColor="#5A4FFF" // iOS
          />
        }
      >
        <View style={styles.header}>
          <View style={styles.avatarContainer}>
            <Image
              source={{ 
                uri: user.avatar || AVATAR_PLACEHOLDER,
                cache: 'reload' // Force reload to avoid cache issues
              }}
              style={styles.avatar}
              onLoad={() => console.log('✅ ProfileScreen: Avatar loaded successfully:', {
                avatar: user.avatar,
                fallback: AVATAR_PLACEHOLDER,
                usingFallback: !user.avatar
              })}
              onError={(error) => console.log('❌ ProfileScreen: Avatar failed to load:', error, 'User:', user)}
            />
            <TouchableOpacity
              style={styles.avatarEditButton}
              onPress={() => {
                Alert.prompt(
                  'Cambiar Avatar',
                  'Ingresa la URL de tu nueva foto de perfil:',
                  [
                    { text: 'Cancelar', style: 'cancel' },
                    { text: 'Actualizar', onPress: handleAvatarChange },
                  ],
                  'plain-text',
                  user.avatar || ''
                );
              }}
            >
              <MaterialIcons name="camera-alt" size={16} color="#fff" />
            </TouchableOpacity>
          </View>
          
          <Text style={styles.name}>{user.name || 'Sin nombre'}</Text>
          <Text style={styles.username}>@{user.username}</Text>
          {user.bio && <Text style={styles.bio}>{user.bio}</Text>}
          
          <TouchableOpacity style={styles.editButton} onPress={handleEditProfile}>
            <MaterialIcons name="edit" size={16} color="#5A4FFF" />
            <Text style={styles.editButtonText}>Editar perfil</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.statsRow}>
            <View style={styles.statBox}>
              <Text style={styles.statNumber}>{user._count?.reviews || 0}</Text>
              <Text style={styles.statLabel}>Reseñas</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statNumber}>{user._count?.favorites || 0}</Text>
              <Text style={styles.statLabel}>Favoritos</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statNumber}>{user._count?.following || 0}</Text>
              <Text style={styles.statLabel}>Siguiendo</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statNumber}>{user._count?.followers || 0}</Text>
              <Text style={styles.statLabel}>Seguidores</Text>
            </View>
          </View>
        </View>

        <View style={styles.infoContainer}>
          <View style={styles.infoItem}>
            <MaterialIcons name="email" size={20} color="#666" />
            <Text style={styles.infoText}>{user.email}</Text>
          </View>
          <View style={styles.infoItem}>
            <MaterialIcons name="calendar-today" size={20} color="#666" />
            <Text style={styles.infoText}>
              Miembro desde {user.createdAt ? new Date(user.createdAt).toLocaleDateString('es-ES', {
                year: 'numeric',
                month: 'long',
              }) : 'Fecha no disponible'}
            </Text>
          </View>
        </View>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <MaterialIcons name="logout" size={20} color="#e63946" />
          <Text style={styles.logoutText}>Cerrar sesión</Text>
        </TouchableOpacity>
      </ScrollView>

      <Modal
        visible={editModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setEditModalVisible(false)}
      >
        <KeyboardAvoidingView
          style={styles.modalContainer}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <View style={styles.modalBackdrop}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Editar perfil</Text>
                <TouchableOpacity onPress={() => setEditModalVisible(false)}>
                  <MaterialIcons name="close" size={24} color="#666" />
                </TouchableOpacity>
              </View>

              <View style={styles.formContainer}>
                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>Nombre</Text>
                  <TextInput
                    style={styles.input}
                    value={editData.name}
                    onChangeText={(text) => setEditData(prev => ({ ...prev, name: text }))}
                    placeholder="Tu nombre completo"
                  />
                </View>

                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>Nombre de usuario</Text>
                  <TextInput
                    style={styles.input}
                    value={editData.username}
                    onChangeText={(text) => setEditData(prev => ({ ...prev, username: text }))}
                    placeholder="tu_usuario"
                    autoCapitalize="none"
                  />
                </View>

                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>Biografía</Text>
                  <TextInput
                    style={[styles.input, styles.bioInput]}
                    value={editData.bio}
                    onChangeText={(text) => setEditData(prev => ({ ...prev, bio: text }))}
                    placeholder="Cuéntanos sobre ti..."
                    multiline
                    numberOfLines={3}
                  />
                </View>
              </View>

              <View style={styles.modalActions}>
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={() => setEditModalVisible(false)}
                >
                  <Text style={styles.cancelButtonText}>Cancelar</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.saveButton, updating && styles.saveButtonDisabled]}
                  onPress={handleSaveProfile}
                  disabled={updating}
                >
                  {updating ? (
                    <ActivityIndicator size="small" color="#fff" />
                  ) : (
                    <Text style={styles.saveButtonText}>Guardar</Text>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAF8F5',
  },
  scrollView: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
    fontFamily: 'Poppins-Regular',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    color: '#e63946',
    marginTop: 16,
    marginBottom: 24,
    textAlign: 'center',
    fontFamily: 'Poppins-Medium',
  },
  retryButton: {
    backgroundColor: '#5A4FFF',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  retryText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Poppins-Medium',
  },

  header: {
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#fff',
    marginBottom: 12,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    borderColor: '#fff',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  avatarEditButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#5A4FFF',
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#fff',
  },
  name: {
    fontSize: 28,
    fontFamily: 'Poppins-Bold',
    color: '#111',
    marginBottom: 4,
    textAlign: 'center',
  },
  username: {
    fontSize: 16,
    color: '#666',
    marginBottom: 8,
    fontFamily: 'Poppins-Regular',
  },
  bio: {
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
    marginBottom: 20,
    fontFamily: 'Poppins-Regular',
    lineHeight: 20,
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    gap: 8,
  },
  editButtonText: {
    color: '#5A4FFF',
    fontSize: 14,
    fontFamily: 'Poppins-Medium',
  },

  statsContainer: {
    backgroundColor: '#fff',
    marginHorizontal: 12,
    marginBottom: 12,
    borderRadius: 16,
    padding: 20,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statBox: {
    alignItems: 'center',
    flex: 1,
  },
  statNumber: {
    fontSize: 24,
    fontFamily: 'Poppins-Bold',
    color: '#5A4FFF',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    fontFamily: 'Poppins-Regular',
  },

  infoContainer: {
    backgroundColor: '#fff',
    marginHorizontal: 12,
    marginBottom: 12,
    borderRadius: 16,
    padding: 20,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 12,
  },
  infoText: {
    fontSize: 14,
    color: '#666',
    fontFamily: 'Poppins-Regular',
    flex: 1,
  },

  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    marginHorizontal: 12,
    marginBottom: 24,
    paddingVertical: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#FEE2E2',
    gap: 8,
  },
  logoutText: {
    color: '#e63946',
    fontSize: 16,
    fontFamily: 'Poppins-Medium',
  },

  modalContainer: {
    flex: 1,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 20,
    paddingHorizontal: 20,
    paddingBottom: 40,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  modalTitle: {
    fontSize: 20,
    fontFamily: 'Poppins-Bold',
    color: '#111',
  },
  formContainer: {
    marginBottom: 24,
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontFamily: 'Poppins-Medium',
    color: '#374151',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    backgroundColor: '#fff',
  },
  bioInput: {
    height: 80,
    textAlignVertical: 'top',
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontFamily: 'Poppins-Medium',
    color: '#374151',
  },
  saveButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: '#5A4FFF',
    alignItems: 'center',
  },
  saveButtonDisabled: {
    opacity: 0.6,
  },
  saveButtonText: {
    fontSize: 16,
    fontFamily: 'Poppins-Medium',
    color: '#fff',
  },
});

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
  Switch,
  Dimensions,
} from 'react-native';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import { AuthContext } from '../context/AuthContext';
import { getUserProfile, updateUserProfile, updateUserAvatar, changePassword, deleteAccount } from '../api/api';
import { baseStyles, COLORS, TYPOGRAPHY } from '../styles/baseStyles';

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
  const [changePasswordModalVisible, setChangePasswordModalVisible] = useState(false);
  const [settingsModalVisible, setSettingsModalVisible] = useState(false);
  const [deleteAccountModalVisible, setDeleteAccountModalVisible] = useState(false);
  const [editData, setEditData] = useState({ name: '', username: '', bio: '' });
  const [passwordData, setPasswordData] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [deleteConfirmation, setDeleteConfirmation] = useState('');
  const [updating, setUpdating] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);
  const [deletingAccount, setDeletingAccount] = useState(false);
  
  // Settings states
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [privateProfile, setPrivateProfile] = useState(false);
  const [showEmail, setShowEmail] = useState(true);

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

  const handleChangePassword = async () => {
    if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      Alert.alert('Error', 'Por favor completa todos los campos');
      return;
    }
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      Alert.alert('Error', 'Las contraseñas nuevas no coinciden');
      return;
    }
    
    if (passwordData.newPassword.length < 6) {
      Alert.alert('Error', 'La nueva contraseña debe tener al menos 6 caracteres');
      return;
    }
    
    try {
      setChangingPassword(true);
      
      // Log para debug
      console.log('🔐 ProfileScreen - Changing password with data:', {
        currentPassword: passwordData.currentPassword ? '***' : 'empty',
        newPassword: passwordData.newPassword ? '***' : 'empty',
        confirmPassword: passwordData.confirmPassword ? '***' : 'empty'
      });
      
      // Llamada al API para cambiar la contraseña
      await changePassword(passwordData, token);
      
      setChangePasswordModalVisible(false);
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      Alert.alert('Éxito', 'Contraseña cambiada correctamente');
    } catch (error) {
      console.error('Error changing password:', error);
      
      if (error?.response?.status === 401) {
        Alert.alert('Error', 'Tu sesión ha expirado. Por favor, inicia sesión nuevamente.');
        await logout();
      } else if (error?.response?.status === 400) {
        Alert.alert('Error', 'La contraseña actual es incorrecta');
      } else if (error?.response?.status === 422) {
        Alert.alert('Error', 'La nueva contraseña no cumple con los requisitos');
      } else {
        Alert.alert('Error', 'No se pudo cambiar la contraseña. Inténtalo de nuevo.');
      }
    } finally {
      setChangingPassword(false);
    }
  };

  const handleDeleteAccount = () => {
    setDeleteAccountModalVisible(true);
  };

  const confirmDeleteAccount = async () => {
    if (deleteConfirmation.toLowerCase() !== 'eliminar') {
      Alert.alert('Error', 'Debes escribir "ELIMINAR" para confirmar');
      return;
    }

    try {
      setDeletingAccount(true);
      
      // Log para debug
      console.log('🗑️ ProfileScreen - Deleting account...');
      
      // Llamada al API para eliminar la cuenta
      await deleteAccount(token);
      
      setDeleteAccountModalVisible(false);
      setDeleteConfirmation('');
      
      Alert.alert(
        'Cuenta eliminada',
        'Tu cuenta ha sido eliminada permanentemente.',
        [
          {
            text: 'OK',
            onPress: () => logout()
          }
        ]
      );
    } catch (error) {
      console.error('Error deleting account:', error);
      
      if (error?.response?.status === 401) {
        Alert.alert('Error', 'Tu sesión ha expirado. Por favor, inicia sesión nuevamente.');
        await logout();
      } else {
        Alert.alert('Error', 'No se pudo eliminar la cuenta. Inténtalo de nuevo.');
      }
    } finally {
      setDeletingAccount(false);
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
    <SafeAreaView style={baseStyles.container}>
      <ScrollView 
        contentContainerStyle={baseStyles.scroll}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[COLORS.ACCENT]} // Android
            tintColor={COLORS.ACCENT} // iOS
            title="Actualizando perfil..." // iOS
            titleColor={COLORS.ACCENT} // iOS
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
          
          <TouchableOpacity style={styles.editProfileButton} onPress={handleEditProfile}>
            <MaterialIcons name="edit" size={18} color={COLORS.ACCENT} />
            <Text style={styles.editProfileText}>Editar perfil</Text>
          </TouchableOpacity>
        </View>

        <View style={baseStyles.card}>
          <View style={styles.statsRow}>
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

        <View style={baseStyles.card}>
          <TouchableOpacity style={styles.actionButton} onPress={() => setSettingsModalVisible(true)}>
            <View style={styles.actionIconContainer}>
              <Ionicons name="settings-outline" size={24} color={COLORS.ACCENT} />
            </View>
            <View style={styles.actionContent}>
              <Text style={styles.actionTitle}>Configuración</Text>
              <Text style={styles.actionSubtitle}>Privacidad, notificaciones y más</Text>
            </View>
            <MaterialIcons name="chevron-right" size={24} color={COLORS.SUBT} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton} onPress={() => setChangePasswordModalVisible(true)}>
            <View style={styles.actionIconContainer}>
              <Ionicons name="lock-closed-outline" size={24} color={COLORS.ACCENT} />
            </View>
            <View style={styles.actionContent}>
              <Text style={styles.actionTitle}>Cambiar contraseña</Text>
              <Text style={styles.actionSubtitle}>Actualiza tu contraseña de acceso</Text>
            </View>
            <MaterialIcons name="chevron-right" size={24} color={COLORS.SUBT} />
          </TouchableOpacity>
        </View>

        <View style={baseStyles.card}>
          <View style={styles.infoItem}>
            <MaterialIcons name="email" size={20} color={COLORS.SUBT} />
            <Text style={styles.infoText}>{user.email}</Text>
          </View>
          <View style={styles.infoItem}>
            <MaterialIcons name="calendar-today" size={20} color={COLORS.SUBT} />
            <Text style={styles.infoText}>
              Miembro desde {user.createdAt ? new Date(user.createdAt).toLocaleDateString('es-ES', {
                year: 'numeric',
                month: 'long',
              }) : 'Fecha no disponible'}
            </Text>
          </View>
        </View>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <MaterialIcons name="logout" size={20} color={COLORS.ERROR} />
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
                  <MaterialIcons name="close" size={24} color={COLORS.SUBT} />
                </TouchableOpacity>
              </View>

              <View style={styles.formContainer}>
                <View style={styles.inputContainer}>
                  <Text style={baseStyles.inputLabel}>Nombre</Text>
                  <TextInput
                    style={baseStyles.input}
                    value={editData.name}
                    onChangeText={(text) => setEditData(prev => ({ ...prev, name: text }))}
                    placeholder="Tu nombre completo"
                  />
                </View>

                <View style={styles.inputContainer}>
                  <Text style={baseStyles.inputLabel}>Nombre de usuario</Text>
                  <TextInput
                    style={baseStyles.input}
                    value={editData.username}
                    onChangeText={(text) => setEditData(prev => ({ ...prev, username: text }))}
                    placeholder="tu_usuario"
                    autoCapitalize="none"
                  />
                </View>

                <View style={styles.inputContainer}>
                  <Text style={baseStyles.inputLabel}>Biografía</Text>
                  <TextInput
                    style={[baseStyles.input, styles.bioInput]}
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
                  style={[baseStyles.button, baseStyles.buttonSecondary]}
                  onPress={() => setEditModalVisible(false)}
                >
                  <Text style={[baseStyles.buttonText, baseStyles.buttonTextSecondary]}>Cancelar</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[baseStyles.button, baseStyles.buttonPrimary, updating && styles.saveButtonDisabled]}
                  onPress={handleSaveProfile}
                  disabled={updating}
                >
                  {updating ? (
                    <ActivityIndicator size="small" color="#fff" />
                  ) : (
                    <Text style={[baseStyles.buttonText, baseStyles.buttonTextPrimary]}>Guardar</Text>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      {/* Modal para cambiar contraseña */}
      <Modal
        visible={changePasswordModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setChangePasswordModalVisible(false)}
      >
        <KeyboardAvoidingView
          style={styles.modalContainer}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <View style={styles.modalBackdrop}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Cambiar contraseña</Text>
                <TouchableOpacity onPress={() => setChangePasswordModalVisible(false)}>
                  <MaterialIcons name="close" size={24} color="#666" />
                </TouchableOpacity>
              </View>

              <View style={styles.formContainer}>
                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>Contraseña actual</Text>
                  <TextInput
                    style={styles.input}
                    value={passwordData.currentPassword}
                    onChangeText={(text) => setPasswordData(prev => ({ ...prev, currentPassword: text }))}
                    placeholder="Ingresa tu contraseña actual"
                    secureTextEntry
                  />
                </View>

                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>Nueva contraseña</Text>
                  <TextInput
                    style={styles.input}
                    value={passwordData.newPassword}
                    onChangeText={(text) => setPasswordData(prev => ({ ...prev, newPassword: text }))}
                    placeholder="Ingresa tu nueva contraseña"
                    secureTextEntry
                  />
                </View>

                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>Confirmar nueva contraseña</Text>
                  <TextInput
                    style={styles.input}
                    value={passwordData.confirmPassword}
                    onChangeText={(text) => setPasswordData(prev => ({ ...prev, confirmPassword: text }))}
                    placeholder="Confirma tu nueva contraseña"
                    secureTextEntry
                  />
                </View>
              </View>

              <View style={styles.modalActions}>
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={() => setChangePasswordModalVisible(false)}
                >
                  <Text style={styles.cancelButtonText}>Cancelar</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.saveButton, changingPassword && styles.saveButtonDisabled]}
                  onPress={handleChangePassword}
                  disabled={changingPassword}
                >
                  {changingPassword ? (
                    <ActivityIndicator size="small" color="#fff" />
                  ) : (
                    <Text style={styles.saveButtonText}>Cambiar</Text>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      {/* Modal de configuración */}
      <Modal
        visible={settingsModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setSettingsModalVisible(false)}
      >
        <KeyboardAvoidingView
          style={styles.modalContainer}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <View style={styles.modalBackdrop}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Configuración</Text>
                <TouchableOpacity onPress={() => setSettingsModalVisible(false)}>
                  <MaterialIcons name="close" size={24} color="#666" />
                </TouchableOpacity>
              </View>

              <ScrollView style={styles.settingsContainer}>
                <View style={styles.settingsSection}>
                  <Text style={styles.settingsSectionTitle}>Privacidad</Text>
                  
                  <View style={styles.settingItem}>
                    <View style={styles.settingContent}>
                      <Text style={styles.settingTitle}>Perfil privado</Text>
                      <Text style={styles.settingSubtitle}>Solo tus seguidores pueden ver tu actividad</Text>
                    </View>
                    <Switch
                      value={privateProfile}
                      onValueChange={setPrivateProfile}
                      trackColor={{ false: '#E5E7EB', true: '#5A4FFF' }}
                      thumbColor={privateProfile ? '#fff' : '#f4f3f4'}
                    />
                  </View>

                  <View style={styles.settingItem}>
                    <View style={styles.settingContent}>
                      <Text style={styles.settingTitle}>Mostrar email</Text>
                      <Text style={styles.settingSubtitle}>Permitir que otros usuarios vean tu email</Text>
                    </View>
                    <Switch
                      value={showEmail}
                      onValueChange={setShowEmail}
                      trackColor={{ false: '#E5E7EB', true: '#5A4FFF' }}
                      thumbColor={showEmail ? '#fff' : '#f4f3f4'}
                    />
                  </View>
                </View>

                <View style={styles.settingsSection}>
                  <Text style={styles.settingsSectionTitle}>Notificaciones</Text>
                  
                  <View style={styles.settingItem}>
                    <View style={styles.settingContent}>
                      <Text style={styles.settingTitle}>Notificaciones push</Text>
                      <Text style={styles.settingSubtitle}>Recibir notificaciones de la aplicación</Text>
                    </View>
                    <Switch
                      value={notificationsEnabled}
                      onValueChange={setNotificationsEnabled}
                      trackColor={{ false: '#E5E7EB', true: '#5A4FFF' }}
                      thumbColor={notificationsEnabled ? '#fff' : '#f4f3f4'}
                    />
                  </View>
                </View>

                <View style={styles.settingsSection}>
                  <Text style={styles.settingsSectionTitle}>Cuenta</Text>
                  
                  <TouchableOpacity style={styles.settingButton} onPress={handleDeleteAccount}>
                    <View style={styles.settingContent}>
                      <Text style={styles.settingTitle}>Eliminar cuenta</Text>
                      <Text style={[styles.settingSubtitle, { color: '#e63946' }]}>Eliminar permanentemente tu cuenta</Text>
                    </View>
                    <MaterialIcons name="chevron-right" size={24} color="#ccc" />
                  </TouchableOpacity>
                </View>
              </ScrollView>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      {/* Modal de confirmación para eliminar cuenta */}
      <Modal
        visible={deleteAccountModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setDeleteAccountModalVisible(false)}
      >
        <KeyboardAvoidingView
          style={styles.modalContainer}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <View style={styles.modalBackdrop}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Eliminar cuenta</Text>
                <TouchableOpacity onPress={() => setDeleteAccountModalVisible(false)}>
                  <MaterialIcons name="close" size={24} color="#666" />
                </TouchableOpacity>
              </View>

              <View style={styles.deleteWarningContainer}>
                <View style={styles.warningIconContainer}>
                  <MaterialIcons name="warning" size={48} color="#e63946" />
                </View>
                
                <Text style={styles.warningTitle}>¡Atención!</Text>
                <Text style={styles.warningText}>
                  Esta acción es irreversible. Se eliminarán permanentemente:
                </Text>
                
                <View style={styles.warningList}>
                  <Text style={styles.warningItem}>• Tu perfil y datos personales</Text>
                  <Text style={styles.warningItem}>• Todas tus reseñas y favoritos</Text>
                  <Text style={styles.warningItem}>• Tu historial de lectura</Text>
                  <Text style={styles.warningItem}>• Todas tus publicaciones y comentarios</Text>
                </View>
                
                <Text style={styles.confirmationText}>
                  Para confirmar, escribe <Text style={styles.confirmationWord}>ELIMINAR</Text> en el campo de abajo:
                </Text>
                
                <TextInput
                  style={styles.confirmationInput}
                  value={deleteConfirmation}
                  onChangeText={setDeleteConfirmation}
                  placeholder="Escribe ELIMINAR"
                  autoCapitalize="characters"
                />
              </View>

              <View style={styles.modalActions}>
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={() => {
                    setDeleteAccountModalVisible(false);
                    setDeleteConfirmation('');
                  }}
                >
                  <Text style={styles.cancelButtonText}>Cancelar</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.deleteButton, deletingAccount && styles.deleteButtonDisabled]}
                  onPress={confirmDeleteAccount}
                  disabled={deletingAccount}
                >
                  {deletingAccount ? (
                    <ActivityIndicator size="small" color="#fff" />
                  ) : (
                    <Text style={styles.deleteButtonText}>Eliminar cuenta</Text>
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
  header: {
    alignItems: 'center',
    padding: 24,
    backgroundColor: COLORS.CARD,
    marginBottom: 12,
    borderRadius: 20,
    ...baseStyles.shadow,
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
    borderColor: COLORS.CARD,
    ...baseStyles.shadow,
  },
  avatarEditButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: COLORS.ACCENT,
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: COLORS.CARD,
  },
  name: {
    ...TYPOGRAPHY.heading,
    marginBottom: 4,
    textAlign: 'center',
  },
  username: {
    ...TYPOGRAPHY.body,
    color: COLORS.SUBT,
    marginBottom: 8,
  },
  bio: {
    ...TYPOGRAPHY.caption,
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 20,
  },
  editProfileButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(90, 79, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(90, 79, 255, 0.3)',
    borderRadius: 16,
    paddingHorizontal: 24,
    paddingVertical: 12,
    marginTop: 8,
    alignSelf: 'center',
    minWidth: 140,
    gap: 8,
    ...baseStyles.shadow,
  },
  editProfileText: {
    ...TYPOGRAPHY.small,
    fontFamily: 'Poppins-SemiBold',
    color: COLORS.ACCENT,
    fontSize: 14,
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
    color: COLORS.ACCENT,
    marginBottom: 4,
  },
  statLabel: {
    ...TYPOGRAPHY.small,
  },

  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 12,
  },
  infoText: {
    ...TYPOGRAPHY.caption,
    flex: 1,
  },

  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.CARD,
    marginBottom: 24,
    paddingVertical: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#FEE2E2',
    gap: 8,
    ...baseStyles.shadow,
  },
  logoutText: {
    ...TYPOGRAPHY.body,
    color: COLORS.ERROR,
    fontFamily: 'Poppins-SemiBold',
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
    backgroundColor: COLORS.CARD,
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
    ...TYPOGRAPHY.subheading,
    fontSize: 20,
  },
  formContainer: {
    marginBottom: 24,
  },
  inputContainer: {
    marginBottom: 20,
  },
  bioInput: {
    height: 80,
    textAlignVertical: 'top',
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
  },
  saveButtonDisabled: {
    opacity: 0.6,
  },

  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.BORDER,
  },
  actionIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  actionContent: {
    flex: 1,
  },
  actionTitle: {
    ...TYPOGRAPHY.body,
    fontFamily: 'Poppins-SemiBold',
    marginBottom: 2,
  },
  actionSubtitle: {
    ...TYPOGRAPHY.caption,
  },

  // Estilos para configuración
  settingsContainer: {
    maxHeight: Dimensions.get('window').height * 0.6,
  },
  settingsSection: {
    marginBottom: 24,
  },
  settingsSectionTitle: {
    ...TYPOGRAPHY.subheading,
    fontSize: 18,
    marginBottom: 16,
    paddingHorizontal: 4,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 4,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.BORDER,
  },
  settingButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 4,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.BORDER,
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    ...TYPOGRAPHY.body,
    fontFamily: 'Poppins-SemiBold',
    marginBottom: 2,
  },
  settingSubtitle: {
    ...TYPOGRAPHY.caption,
  },

  // Estilos para el modal de eliminación de cuenta
  deleteWarningContainer: {
    paddingVertical: 20,
  },
  warningIconContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  warningTitle: {
    ...TYPOGRAPHY.subheading,
    fontSize: 20,
    color: COLORS.ERROR,
    textAlign: 'center',
    marginBottom: 12,
  },
  warningText: {
    ...TYPOGRAPHY.body,
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 22,
  },
  warningList: {
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  warningItem: {
    ...TYPOGRAPHY.caption,
    marginBottom: 8,
    lineHeight: 20,
  },
  confirmationText: {
    ...TYPOGRAPHY.caption,
    fontFamily: 'Poppins-SemiBold',
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 20,
  },
  confirmationWord: {
    fontFamily: 'Poppins-Bold',
    color: COLORS.ERROR,
  },
  confirmationInput: {
    borderWidth: 2,
    borderColor: COLORS.BORDER,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    backgroundColor: COLORS.CARD,
    textAlign: 'center',
    marginBottom: 20,
  },
  deleteButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: COLORS.ERROR,
    alignItems: 'center',
  },
  deleteButtonDisabled: {
    opacity: 0.6,
  },
  deleteButtonText: {
    ...TYPOGRAPHY.body,
    fontFamily: 'Poppins-SemiBold',
    color: '#fff',
  },
});

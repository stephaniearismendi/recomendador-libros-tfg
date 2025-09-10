import React, { useContext, useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  Image,
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
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useCustomSafeArea } from '../utils/safeAreaUtils';
import { Ionicons } from '@expo/vector-icons';
import { AuthContext } from '../context/AuthContext';
import {
  getUserProfile,
  updateUserProfile,
  updateUserAvatar,
  changePassword,
  deleteAccount,
} from '../api/api';
import { baseStyles, COLORS } from '../styles/baseStyles';
import { profileStyles } from '../styles/components';
import { getUserAvatar } from '../utils/userUtils';
import {
  validateProfileData,
  validatePasswordChange,
  validateDeleteConfirmation,
  handleProfileError,
  formatUserStats,
  formatJoinDate,
  getInitialEditData,
  getInitialPasswordData,
  showLogoutConfirmation,
  showDeleteAccountConfirmation,
} from '../utils/profileUtils';
import { loadUserAchievementsWithDetails, loadUserStats } from '../utils/achievementUtils';
import AchievementBadge from '../components/AchievementBadge';


export default function ProfileScreen() {
  const navigation = useNavigation();
  const { token, user, logout, refreshUserData } = useContext(AuthContext);
  const { getContainerStyle, getScrollStyle } = useCustomSafeArea();

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [changePasswordModalVisible, setChangePasswordModalVisible] = useState(false);
  const [settingsModalVisible, setSettingsModalVisible] = useState(false);
  const [deleteAccountModalVisible, setDeleteAccountModalVisible] = useState(false);
  const [avatarModalVisible, setAvatarModalVisible] = useState(false);
  const [editData, setEditData] = useState({ name: '', username: '', bio: '' });
  const [passwordData, setPasswordData] = useState(getInitialPasswordData());
  const [deleteConfirmation, setDeleteConfirmation] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [updating, setUpdating] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);
  const [deletingAccount, setDeletingAccount] = useState(false);

  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [privateProfile, setPrivateProfile] = useState(false);
  const [showEmail, setShowEmail] = useState(true);
  const [achievements, setAchievements] = useState({ unlocked: [], points: 0 });
  const [achievementStats, setAchievementStats] = useState({});

  const loadUserProfile = useCallback(async () => {
    if (!user || !token) {
      console.warn('ProfileScreen: Faltan user o token');
      return;
    }

    try {
      setLoading(true);
      setEditData(getInitialEditData(user));

      const [achievementsData, statsData] = await Promise.all([
        loadUserAchievementsWithDetails(user.id, token),
        loadUserStats(user.id, token),
      ]);

      setAchievements(achievementsData || { achievements: [], totalPoints: 0 });
      setAchievementStats(statsData || {});
    } catch (error) {
      console.error('Error loading profile data:', error);
      setAchievements({ achievements: [], totalPoints: 0 });
      setAchievementStats({});
      Alert.alert('Error', 'No se pudieron cargar los achievements. Verifica tu conexión.');
    } finally {
      setLoading(false);
    }
  }, [user, token]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await refreshUserData();
    } catch (error) {
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

    const validation = validateProfileData(editData);
    if (!validation.isValid) {
      Alert.alert('Error', validation.error);
      return;
    }

    try {
      setUpdating(true);

      const response = await updateUserProfile(editData, token);
      if (response?.data?.user) {
        await refreshUserData();
        setEditModalVisible(false);
        Alert.alert('Éxito', 'Perfil actualizado correctamente');

        setTimeout(() => {
          loadUserProfile();
        }, 1000);
      }
    } catch (error) {
      handleProfileError(error, logout);
    } finally {
      setUpdating(false);
    }
  };

  const handleAvatarChange = async () => {
    if (!token || !avatarUrl.trim()) {
      Alert.alert('Error', 'Por favor ingresa una URL válida');
      return;
    }

    try {
      const response = await updateUserAvatar(avatarUrl.trim(), token);
      if (response?.data?.user) {
        await refreshUserData();
        setAvatarModalVisible(false);
        setAvatarUrl('');
        Alert.alert('Éxito', 'Avatar actualizado correctamente');
      }
    } catch (error) {
      handleProfileError(error, logout);
    }
  };

  const handleChangePassword = async () => {
    const validation = validatePasswordChange(passwordData);
    if (!validation.isValid) {
      Alert.alert('Error', validation.error);
      return;
    }

    try {
      setChangingPassword(true);

      await changePassword(passwordData, token);

      setChangePasswordModalVisible(false);
      setPasswordData(getInitialPasswordData());
      Alert.alert('Éxito', 'Contraseña cambiada correctamente');
    } catch (error) {
      handleProfileError(error, logout);
    } finally {
      setChangingPassword(false);
    }
  };

  const handleDeleteAccount = () => {
    setDeleteAccountModalVisible(true);
  };

  const confirmDeleteAccount = async () => {
    const validation = validateDeleteConfirmation(deleteConfirmation);
    if (!validation.isValid) {
      Alert.alert('Error', validation.error);
      return;
    }

    try {
      setDeletingAccount(true);

      await deleteAccount(token);

      setDeleteAccountModalVisible(false);
      setDeleteConfirmation('');

      showDeleteAccountConfirmation(logout);
    } catch (error) {
      handleProfileError(error, logout);
    } finally {
      setDeletingAccount(false);
    }
  };

  const handleLogout = () => {
    showLogoutConfirmation(logout);
  };

  const containerStyle = [baseStyles.container, getContainerStyle()];
  const scrollStyle = [baseStyles.scroll, getScrollStyle()];

  if (loading) {
    return (
      <View style={containerStyle}>
        <View style={profileStyles.loadingContainer}>
          <ActivityIndicator size="large" color="#5A4FFF" />
          <Text style={profileStyles.loadingText}>Cargando perfil...</Text>
        </View>
      </View>
    );
  }

  if (!user) {
    if (!token) {
      return null; // if not user and no tokem, exit
    }

    return (
      <View style={containerStyle}>
        <View style={profileStyles.errorContainer}>
          <Ionicons name="alert-circle" size={64} color="#e63946" />
          <Text style={profileStyles.errorText}>No se pudo cargar el perfil</Text>
          <TouchableOpacity style={profileStyles.retryButton} onPress={loadUserProfile}>
            <Text style={profileStyles.retryText}>Reintentar</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  const userStats = formatUserStats(user);
  const userAvatar = getUserAvatar(user);

  return (
    <View style={containerStyle}>
      <ScrollView
        contentContainerStyle={scrollStyle}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[COLORS.ACCENT]}
            tintColor={COLORS.ACCENT}
            title="Actualizando perfil..."
            titleColor={COLORS.ACCENT}
          />
        }
      >
        <View style={profileStyles.header}>
          <View style={profileStyles.avatarContainer}>
            <Image
              source={{
                uri: userAvatar,
                cache: 'reload',
              }}
              style={profileStyles.avatar}
              onLoad={() => {}}
              onError={(error) => {}}
            />
            <TouchableOpacity
              style={profileStyles.avatarEditButton}
              onPress={() => {
                setAvatarUrl(user.avatar || '');
                setAvatarModalVisible(true);
              }}
            >
              <Ionicons name="camera" size={16} color="#fff" />
            </TouchableOpacity>
          </View>

          <Text style={profileStyles.name}>{user.name || 'Sin nombre'}</Text>
          <Text style={profileStyles.username}>@{user.username}</Text>
          {user.bio && <Text style={profileStyles.bio}>{user.bio}</Text>}

          <TouchableOpacity style={profileStyles.editProfileButton} onPress={handleEditProfile}>
            <Ionicons name="create" size={18} color={COLORS.ACCENT} />
            <Text style={profileStyles.editProfileText}>Editar perfil</Text>
          </TouchableOpacity>
        </View>

        <View style={baseStyles.card}>
          <View style={profileStyles.statsRow}>
            <View style={profileStyles.statBox}>
              <Text style={profileStyles.statNumber}>{userStats.favorites}</Text>
              <Text style={profileStyles.statLabel}>Favoritos</Text>
            </View>
            <View style={profileStyles.statBox}>
              <Text style={profileStyles.statNumber}>{userStats.following}</Text>
              <Text style={profileStyles.statLabel}>Siguiendo</Text>
            </View>
            <View style={profileStyles.statBox}>
              <Text style={profileStyles.statNumber}>{userStats.followers}</Text>
              <Text style={profileStyles.statLabel}>Seguidores</Text>
            </View>
          </View>
        </View>

        <View style={baseStyles.card}>
          <View style={profileStyles.achievementsHeader}>
            <View style={profileStyles.achievementsTitleContainer}>
              <Ionicons name="trophy" size={24} color={COLORS.ACCENT} />
              <Text style={profileStyles.achievementsTitle}>Logros</Text>
            </View>
            <View style={profileStyles.achievementsStats}>
              <Text style={profileStyles.achievementsPoints}>{achievements.totalPoints || 0}</Text>
              <Text style={profileStyles.achievementsPointsLabel}>puntos</Text>
            </View>
          </View>

          <View style={profileStyles.achievementsGrid}>
            {(achievements?.achievements || [])
              .filter((achievement) => achievement.unlocked)
              .slice(0, 6)
              .map((achievement) => {
                return (
                  <AchievementBadge
                    key={achievement.id}
                    achievement={achievement}
                    isUnlocked={true}
                    size="small"
                  />
                );
              })}

            {(!achievements?.achievements ||
              achievements.achievements.filter((a) => a.unlocked).length === 0) && (
              <View style={profileStyles.noAchievements}>
                <Ionicons name="trophy" size={32} color="#D1D5DB" />
                <Text style={profileStyles.noAchievementsText}>Aún no tienes logros</Text>
                <Text style={profileStyles.noAchievementsSubtext}>
                  ¡Comienza a leer para desbloquear badges!
                </Text>
              </View>
            )}
          </View>

          {achievements?.achievements &&
            achievements.achievements.filter((a) => a.unlocked).length > 6 && (
              <TouchableOpacity
                style={profileStyles.viewAllAchievements}
                onPress={() => navigation.navigate('Achievements')}
              >
                <Text style={profileStyles.viewAllAchievementsText}>
                  Ver todos los logros ({achievements.achievements.filter((a) => a.unlocked).length}
                  )
                </Text>
                <Ionicons name="chevron-forward" size={20} color={COLORS.ACCENT} />
              </TouchableOpacity>
            )}
        </View>

        <View style={baseStyles.card}>
          <TouchableOpacity
            style={profileStyles.actionButton}
            onPress={() => setSettingsModalVisible(true)}
          >
            <View style={profileStyles.actionIconContainer}>
              <Ionicons name="settings-outline" size={24} color={COLORS.ACCENT} />
            </View>
            <View style={profileStyles.actionContent}>
              <Text style={profileStyles.actionTitle}>Configuración</Text>
              <Text style={profileStyles.actionSubtitle}>Privacidad, notificaciones y más</Text>
            </View>
            <Ionicons name="chevron-forward" size={24} color={COLORS.SUBT} />
          </TouchableOpacity>

          <TouchableOpacity
            style={profileStyles.actionButton}
            onPress={() => setChangePasswordModalVisible(true)}
          >
            <View style={profileStyles.actionIconContainer}>
              <Ionicons name="lock-closed-outline" size={24} color={COLORS.ACCENT} />
            </View>
            <View style={profileStyles.actionContent}>
              <Text style={profileStyles.actionTitle}>Cambiar contraseña</Text>
              <Text style={profileStyles.actionSubtitle}>Actualiza tu contraseña de acceso</Text>
            </View>
            <Ionicons name="chevron-forward" size={24} color={COLORS.SUBT} />
          </TouchableOpacity>
        </View>

        <View style={baseStyles.card}>
          <View style={profileStyles.infoItem}>
            <Ionicons name="mail" size={20} color={COLORS.SUBT} />
            <Text style={profileStyles.infoText}>{user.email}</Text>
          </View>
          <View style={profileStyles.infoItem}>
            <Ionicons name="calendar" size={20} color={COLORS.SUBT} />
            <Text style={profileStyles.infoText}>Miembro desde {formatJoinDate(user)}</Text>
          </View>
        </View>

        <TouchableOpacity style={profileStyles.logoutButton} onPress={handleLogout}>
          <Ionicons name="log-out" size={20} color={COLORS.ERROR} />
          <Text style={profileStyles.logoutText}>Cerrar sesión</Text>
        </TouchableOpacity>
      </ScrollView>

      <Modal
        visible={editModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setEditModalVisible(false)}
      >
        <KeyboardAvoidingView
          style={profileStyles.modalContainer}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <View style={profileStyles.modalBackdrop}>
            <View style={profileStyles.modalContent}>
              <View style={profileStyles.modalHeader}>
                <Text style={profileStyles.modalTitle}>Editar perfil</Text>
                <TouchableOpacity onPress={() => setEditModalVisible(false)}>
                  <Ionicons name="close" size={24} color={COLORS.SUBT} />
                </TouchableOpacity>
              </View>

              <View style={profileStyles.formContainer}>
                <View style={profileStyles.inputContainer}>
                  <Text style={profileStyles.inputLabel}>Nombre</Text>
                  <TextInput
                    style={profileStyles.input}
                    value={editData.name}
                    onChangeText={(text) => setEditData((prev) => ({ ...prev, name: text }))}
                    placeholder="Tu nombre completo"
                  />
                </View>

                <View style={profileStyles.inputContainer}>
                  <Text style={profileStyles.inputLabel}>Nombre de usuario</Text>
                  <TextInput
                    style={profileStyles.input}
                    value={editData.username}
                    onChangeText={(text) => setEditData((prev) => ({ ...prev, username: text }))}
                    placeholder="tu_usuario"
                    autoCapitalize="none"
                  />
                </View>

                <View style={profileStyles.inputContainer}>
                  <Text style={profileStyles.inputLabel}>Biografía</Text>
                  <TextInput
                    style={[profileStyles.input, profileStyles.bioInput]}
                    value={editData.bio}
                    onChangeText={(text) => setEditData((prev) => ({ ...prev, bio: text }))}
                    placeholder="Cuéntanos sobre ti..."
                    multiline
                    numberOfLines={3}
                  />
                </View>
              </View>

              <View style={profileStyles.modalActions}>
                <TouchableOpacity
                  style={profileStyles.cancelButton}
                  onPress={() => setEditModalVisible(false)}
                >
                  <Text style={profileStyles.cancelButtonText}>Cancelar</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[profileStyles.saveButton, updating && profileStyles.saveButtonDisabled]}
                  onPress={handleSaveProfile}
                  disabled={updating}
                >
                  {updating ? (
                    <ActivityIndicator size="small" color="#fff" />
                  ) : (
                    <Text style={profileStyles.saveButtonText}>Guardar</Text>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      <Modal
        visible={changePasswordModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setChangePasswordModalVisible(false)}
      >
        <KeyboardAvoidingView
          style={profileStyles.modalContainer}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <View style={profileStyles.modalBackdrop}>
            <View style={profileStyles.modalContent}>
              <View style={profileStyles.modalHeader}>
                <Text style={profileStyles.modalTitle}>Cambiar contraseña</Text>
                <TouchableOpacity onPress={() => setChangePasswordModalVisible(false)}>
                  <Ionicons name="close" size={24} color="#666" />
                </TouchableOpacity>
              </View>

              <View style={profileStyles.formContainer}>
                <View style={profileStyles.inputContainer}>
                  <Text style={profileStyles.inputLabel}>Contraseña actual</Text>
                  <TextInput
                    style={profileStyles.input}
                    value={passwordData.currentPassword}
                    onChangeText={(text) =>
                      setPasswordData((prev) => ({ ...prev, currentPassword: text }))
                    }
                    placeholder="Ingresa tu contraseña actual"
                    secureTextEntry
                  />
                </View>

                <View style={profileStyles.inputContainer}>
                  <Text style={profileStyles.inputLabel}>Nueva contraseña</Text>
                  <TextInput
                    style={profileStyles.input}
                    value={passwordData.newPassword}
                    onChangeText={(text) =>
                      setPasswordData((prev) => ({ ...prev, newPassword: text }))
                    }
                    placeholder="Ingresa tu nueva contraseña"
                    secureTextEntry
                  />
                </View>

                <View style={profileStyles.inputContainer}>
                  <Text style={profileStyles.inputLabel}>Confirmar nueva contraseña</Text>
                  <TextInput
                    style={profileStyles.input}
                    value={passwordData.confirmPassword}
                    onChangeText={(text) =>
                      setPasswordData((prev) => ({ ...prev, confirmPassword: text }))
                    }
                    placeholder="Confirma tu nueva contraseña"
                    secureTextEntry
                  />
                </View>
              </View>

              <View style={profileStyles.modalActions}>
                <TouchableOpacity
                  style={profileStyles.cancelButton}
                  onPress={() => setChangePasswordModalVisible(false)}
                >
                  <Text style={profileStyles.cancelButtonText}>Cancelar</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    profileStyles.saveButton,
                    changingPassword && profileStyles.saveButtonDisabled,
                  ]}
                  onPress={handleChangePassword}
                  disabled={changingPassword}
                >
                  {changingPassword ? (
                    <ActivityIndicator size="small" color="#fff" />
                  ) : (
                    <Text style={profileStyles.saveButtonText}>Cambiar</Text>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      <Modal
        visible={settingsModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setSettingsModalVisible(false)}
      >
        <KeyboardAvoidingView
          style={profileStyles.modalContainer}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <View style={profileStyles.modalBackdrop}>
            <View style={profileStyles.modalContent}>
              <View style={profileStyles.modalHeader}>
                <Text style={profileStyles.modalTitle}>Configuración</Text>
                <TouchableOpacity onPress={() => setSettingsModalVisible(false)}>
                  <Ionicons name="close" size={24} color="#666" />
                </TouchableOpacity>
              </View>

              <ScrollView style={profileStyles.settingsContainer}>
                <View style={profileStyles.settingsSection}>
                  <Text style={profileStyles.settingsSectionTitle}>Privacidad</Text>

                  <View style={profileStyles.settingItem}>
                    <View style={profileStyles.settingContent}>
                      <Text style={profileStyles.settingTitle}>Perfil privado</Text>
                      <Text style={profileStyles.settingSubtitle}>
                        Solo tus seguidores pueden ver tu actividad
                      </Text>
                    </View>
                    <Switch
                      value={privateProfile}
                      onValueChange={setPrivateProfile}
                      trackColor={{ false: '#E5E7EB', true: '#5A4FFF' }}
                      thumbColor={privateProfile ? '#fff' : '#f4f3f4'}
                    />
                  </View>

                  <View style={profileStyles.settingItem}>
                    <View style={profileStyles.settingContent}>
                      <Text style={profileStyles.settingTitle}>Mostrar email</Text>
                      <Text style={profileStyles.settingSubtitle}>
                        Permitir que otros usuarios vean tu email
                      </Text>
                    </View>
                    <Switch
                      value={showEmail}
                      onValueChange={setShowEmail}
                      trackColor={{ false: '#E5E7EB', true: '#5A4FFF' }}
                      thumbColor={showEmail ? '#fff' : '#f4f3f4'}
                    />
                  </View>
                </View>

                <View style={profileStyles.settingsSection}>
                  <Text style={profileStyles.settingsSectionTitle}>Notificaciones</Text>

                  <View style={profileStyles.settingItem}>
                    <View style={profileStyles.settingContent}>
                      <Text style={profileStyles.settingTitle}>Notificaciones push</Text>
                      <Text style={profileStyles.settingSubtitle}>
                        Recibir notificaciones de la aplicación
                      </Text>
                    </View>
                    <Switch
                      value={notificationsEnabled}
                      onValueChange={setNotificationsEnabled}
                      trackColor={{ false: '#E5E7EB', true: '#5A4FFF' }}
                      thumbColor={notificationsEnabled ? '#fff' : '#f4f3f4'}
                    />
                  </View>
                </View>

                <View style={profileStyles.settingsSection}>
                  <Text style={profileStyles.settingsSectionTitle}>Cuenta</Text>

                  <TouchableOpacity
                    style={profileStyles.settingButton}
                    onPress={handleDeleteAccount}
                  >
                    <View style={profileStyles.settingContent}>
                      <Text style={profileStyles.settingTitle}>Eliminar cuenta</Text>
                      <Text style={[profileStyles.settingSubtitle, { color: '#e63946' }]}>
                        Eliminar permanentemente tu cuenta
                      </Text>
                    </View>
                    <Ionicons name="chevron-forward" size={24} color="#ccc" />
                  </TouchableOpacity>
                </View>
              </ScrollView>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      <Modal
        visible={deleteAccountModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setDeleteAccountModalVisible(false)}
      >
        <KeyboardAvoidingView
          style={profileStyles.modalContainer}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <View style={profileStyles.modalBackdrop}>
            <View style={profileStyles.modalContent}>
              <View style={profileStyles.modalHeader}>
                <Text style={profileStyles.modalTitle}>Eliminar cuenta</Text>
                <TouchableOpacity onPress={() => setDeleteAccountModalVisible(false)}>
                  <Ionicons name="close" size={24} color="#666" />
                </TouchableOpacity>
              </View>

              <View style={profileStyles.deleteWarningContainer}>
                <View style={profileStyles.warningIconContainer}>
                  <Ionicons name="warning" size={48} color="#e63946" />
                </View>

                <Text style={profileStyles.warningTitle}>¡Atención!</Text>
                <Text style={profileStyles.warningText}>
                  Esta acción es irreversible. Se eliminarán permanentemente:
                </Text>

                <View style={profileStyles.warningList}>
                  <Text style={profileStyles.warningItem}>• Tu perfil y datos personales</Text>
                  <Text style={profileStyles.warningItem}>• Todas tus reseñas y favoritos</Text>
                  <Text style={profileStyles.warningItem}>• Tu historial de lectura</Text>
                  <Text style={profileStyles.warningItem}>
                    • Todas tus publicaciones y comentarios
                  </Text>
                </View>

                <Text style={profileStyles.confirmationText}>
                  Para confirmar, escribe{' '}
                  <Text style={profileStyles.confirmationWord}>ELIMINAR</Text> en el campo de abajo:
                </Text>

                <TextInput
                  style={profileStyles.confirmationInput}
                  value={deleteConfirmation}
                  onChangeText={setDeleteConfirmation}
                  placeholder="Escribe ELIMINAR"
                  autoCapitalize="characters"
                />
              </View>

              <View style={profileStyles.modalActions}>
                <TouchableOpacity
                  style={profileStyles.cancelButton}
                  onPress={() => {
                    setDeleteAccountModalVisible(false);
                    setDeleteConfirmation('');
                  }}
                >
                  <Text style={profileStyles.cancelButtonText}>Cancelar</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    profileStyles.deleteButton,
                    deletingAccount && profileStyles.deleteButtonDisabled,
                  ]}
                  onPress={confirmDeleteAccount}
                  disabled={deletingAccount}
                >
                  {deletingAccount ? (
                    <ActivityIndicator size="small" color="#fff" />
                  ) : (
                    <Text style={profileStyles.deleteButtonText}>Eliminar cuenta</Text>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      <Modal
        visible={avatarModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setAvatarModalVisible(false)}
      >
        <KeyboardAvoidingView
          style={profileStyles.modalContainer}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <View style={profileStyles.modalBackdrop}>
            <View style={profileStyles.modalContent}>
              <View style={profileStyles.modalHeader}>
                <Text style={profileStyles.modalTitle}>Cambiar Avatar</Text>
                <TouchableOpacity onPress={() => setAvatarModalVisible(false)}>
                  <Ionicons name="close" size={24} color={COLORS.SUBT} />
                </TouchableOpacity>
              </View>

              <View style={profileStyles.formContainer}>
                <View style={profileStyles.inputContainer}>
                  <Text style={profileStyles.inputLabel}>URL de la imagen</Text>
                  <TextInput
                    style={profileStyles.input}
                    value={avatarUrl}
                    onChangeText={setAvatarUrl}
                    placeholder="https://ejemplo.com/imagen.jpg"
                    autoCapitalize="none"
                    keyboardType="url"
                  />
                </View>
              </View>

              <View style={profileStyles.modalActions}>
                <TouchableOpacity
                  style={profileStyles.cancelButton}
                  onPress={() => {
                    setAvatarModalVisible(false);
                    setAvatarUrl('');
                  }}
                >
                  <Text style={profileStyles.cancelButtonText}>Cancelar</Text>
                </TouchableOpacity>
                <TouchableOpacity style={profileStyles.saveButton} onPress={handleAvatarChange}>
                  <Text style={profileStyles.saveButtonText}>Actualizar</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
}

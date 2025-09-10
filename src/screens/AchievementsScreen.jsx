import React, { useState, useEffect, useCallback, useContext } from 'react';
import {
  View,
  ScrollView,
  Text,
  TouchableOpacity,
  Modal,
  ActivityIndicator,
  RefreshControl,
  Image,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { AuthContext } from '../context/AuthContext';
import AchievementBadge from '../components/AchievementBadge';
import { achievementsStyles } from '../styles/components';
import { baseStyles, COLORS } from '../styles/baseStyles';
import { useCustomSafeArea } from '../utils/safeAreaUtils';
import {
  loadUserAchievementsWithDetails,
  loadUserStats,
  RARITY_COLORS,
} from '../utils/achievementUtils';
import { getUserAvatar } from '../utils/userUtils';

export default function AchievementsScreen() {
  const navigation = useNavigation();
  const { token, user } = useContext(AuthContext);
  const { getContainerStyle, getScrollStyle } = useCustomSafeArea();

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [achievements, setAchievements] = useState({ achievements: [], totalPoints: 0 });
  const [userStats, setUserStats] = useState({});
  const [selectedAchievement, setSelectedAchievement] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const loadAchievementsData = useCallback(async () => {
    if (!user?.id || !token) {
      console.warn('AchievementsScreen: Faltan user.id o token');
      return;
    }

    try {
      setLoading(true);
      const [achievementsData, statsData] = await Promise.all([
        loadUserAchievementsWithDetails(user.id, token),
        loadUserStats(user.id, token),
      ]);

      setAchievements(achievementsData || { achievements: [], totalPoints: 0 });
      setUserStats(statsData || {});
    } catch (error) {
      console.error('Error loading achievements data:', error);
      setAchievements({ achievements: [], totalPoints: 0 });
      setUserStats({});
      Alert.alert('Error', 'No se pudieron cargar los achievements. Verifica tu conexión.');
    } finally {
      setLoading(false);
    }
  }, [user?.id, token]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadAchievementsData();
    setRefreshing(false);
  }, [loadAchievementsData]);

  useEffect(() => {
    loadAchievementsData();
  }, [loadAchievementsData]);

  const handleAchievementPress = (achievement) => {
    setSelectedAchievement(achievement);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedAchievement(null);
  };

  const getAchievementsByRarity = () => {
    const rarityGroups = {
      common: [],
      uncommon: [],
      rare: [],
      epic: [],
      legendary: [],
    };

    const allAchievements = achievements?.achievements || [];

    if (Array.isArray(allAchievements)) {
      allAchievements.forEach((achievement) => {
        if (achievement && achievement.rarity) {
          const rarity = achievement.rarity || 'common';
          if (rarityGroups[rarity]) {
            rarityGroups[rarity].push(achievement);
          }
        }
      });
    }
    return rarityGroups;
  };

  const getAchievementProgress = (achievement) => {
    if (!achievement) return 0;

    if (achievement.unlocked) {
      return 100;
    }

    if (
      achievement.progress !== undefined &&
      achievement.progress !== null &&
      achievement.progress > 0
    ) {
      return Math.min(100, achievement.progress);
    }

    const stats = userStats?.data || userStats || {};

    let progress = 0;

    switch (achievement.type) {
      case 'first_book':
        progress = stats.totalBooksRead >= 1 ? 100 : 0;
        break;

      case 'books_read_5':
        progress = Math.min(100, (stats.totalBooksRead / 5) * 100);
        break;

      case 'books_read_10':
        progress = Math.min(100, (stats.totalBooksRead / 10) * 100);
        break;

      case 'books_read_25':
        progress = Math.min(100, (stats.totalBooksRead / 25) * 100);
        break;

      case 'books_read_50':
        progress = Math.min(100, (stats.totalBooksRead / 50) * 100);
        break;

      case 'pages_read_1000':
        progress = Math.min(100, (stats.totalPagesRead / 1000) * 100);
        break;

      case 'pages_read_5000':
        progress = Math.min(100, (stats.totalPagesRead / 5000) * 100);
        break;

      case 'genres_5':
        progress = Math.min(100, (stats.genresExplored / 5) * 100);
        break;

      case 'genres_10':
        progress = Math.min(100, (stats.genresExplored / 10) * 100);
        break;

      case 'streak_7':
        progress = Math.min(100, (stats.currentStreak / 7) * 100);
        break;

      case 'streak_30':
        progress = Math.min(100, (stats.currentStreak / 30) * 100);
        break;

      case 'challenge_completed':
        progress = stats.challengeCompleted ? 100 : 0;
        break;

      default:
        progress = 0;
        break;
    }

    return progress;
  };

  const getProgressRingColor = (percentage) => {
    if (percentage === 0) return '#D1D5DB';
    if (percentage <= 25) return '#3B82F6';
    if (percentage <= 50) return '#10B981';
    if (percentage <= 75) return '#F59E0B';
    return '#8B5CF6';
  };

  const getProgressRingGradient = (percentage) => {
    if (percentage === 0) return ['#D1D5DB', '#9CA3AF'];
    if (percentage <= 25) return ['#3B82F6', '#1D4ED8'];
    if (percentage <= 50) return ['#10B981', '#059669'];
    if (percentage <= 75) return ['#F59E0B', '#D97706'];
    return ['#8B5CF6', '#7C3AED'];
  };

  const getProgressMotivation = (percentage) => {
    if (percentage === 0) return '¡Empieza tu aventura!';
    if (percentage <= 25) return '¡Buen comienzo!';
    if (percentage <= 50) return '¡Vas genial!';
    if (percentage <= 75) return '¡Excelente ritmo!';
    return '¡Eres increíble!';
  };

  const rarityGroups = getAchievementsByRarity();
  const allAchievements = achievements?.achievements || [];
  const totalAchievements = allAchievements?.length || 0;
  const unlockedCount = allAchievements?.filter((a) => a.unlocked)?.length || 0;
  const completionPercentage =
    totalAchievements > 0 ? Math.round((unlockedCount / totalAchievements) * 100) : 0;

  const containerStyle = [baseStyles.container, getContainerStyle()];
  const scrollStyle = [baseStyles.scroll, getScrollStyle()];

  if (loading) {
    return (
      <View style={containerStyle}>
        <View style={baseStyles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.ACCENT} />
          <Text style={baseStyles.loadingText}>Cargando logros...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={achievementsStyles.modernContainer}>
      <View style={achievementsStyles.backgroundGradient} />
      <View style={achievementsStyles.modernHeader}>
        <TouchableOpacity style={achievementsStyles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={COLORS.TEXT} />
        </TouchableOpacity>
        <Text style={achievementsStyles.headerTitle}>Logros</Text>
        <TouchableOpacity
          style={achievementsStyles.userAvatarButton}
          onPress={() => navigation.navigate('Tabs', { screen: 'Perfil' })}
          activeOpacity={0.7}
        >
          <Image
            source={{ uri: getUserAvatar(user) }}
            style={achievementsStyles.userAvatar}
            resizeMode="cover"
          />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={scrollStyle}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        showsVerticalScrollIndicator={false}
      >
        <View style={achievementsStyles.modernHero}>
          <View style={achievementsStyles.heroContent}>
            <View style={achievementsStyles.heroIcon}>
              <Ionicons name="trophy" size={48} color={COLORS.ACCENT} />
            </View>
            <Text style={achievementsStyles.heroTitle}>Mis Logros</Text>
            <Text style={achievementsStyles.heroSubtitle}>
              {unlockedCount === 0
                ? `¡Comienza a leer para desbloquear los ${totalAchievements} logros disponibles!`
                : `${unlockedCount} de ${totalAchievements} logros desbloqueados`}
            </Text>
            <View style={achievementsStyles.progressContainer}>
              <Text
                style={[
                  achievementsStyles.progressText,
                  { color: getProgressRingColor(completionPercentage) },
                ]}
              >
                {completionPercentage}%
              </Text>
              <Text style={achievementsStyles.progressLabel}>Completado</Text>
              <View style={achievementsStyles.progressBarContainer}>
                <View
                  style={[
                    achievementsStyles.progressBarFill,
                    {
                      width: `${Math.max(4, completionPercentage)}%`,
                      backgroundColor: getProgressRingColor(completionPercentage),
                    },
                  ]}
                />
              </View>
              <Text
                style={[
                  achievementsStyles.progressMotivation,
                  { color: getProgressRingColor(completionPercentage) },
                ]}
              >
                {getProgressMotivation(completionPercentage)}
              </Text>
            </View>
          </View>
        </View>

        <View style={achievementsStyles.modernStatsContainer}>
          <View style={achievementsStyles.modernStatCard}>
            <View style={achievementsStyles.modernStatIcon}>
              <Ionicons name="star" size={20} color={COLORS.ACCENT} />
            </View>
            <Text style={achievementsStyles.modernStatValue}>{achievements.totalPoints || 0}</Text>
            <Text style={achievementsStyles.modernStatLabel}>Puntos</Text>
          </View>

          <View style={achievementsStyles.modernStatCard}>
            <View style={achievementsStyles.modernStatIcon}>
              <Ionicons name="checkmark-circle" size={20} color={COLORS.SUCCESS} />
            </View>
            <Text style={achievementsStyles.modernStatValue}>{unlockedCount}</Text>
            <Text style={achievementsStyles.modernStatLabel}>Logros</Text>
          </View>

          <View style={achievementsStyles.modernStatCard}>
            <View style={achievementsStyles.modernStatIcon}>
              <Ionicons name="trending-up" size={20} color={COLORS.INFO} />
            </View>
            <Text style={achievementsStyles.modernStatValue}>{completionPercentage}%</Text>
            <Text style={achievementsStyles.modernStatLabel}>Progreso</Text>
          </View>
        </View>

        <View style={achievementsStyles.modernProgressSection}>
          <Text style={achievementsStyles.modernSectionTitle}>Tu progreso de lectura</Text>
          <View style={achievementsStyles.modernProgressGrid}>
            <View style={achievementsStyles.modernProgressItem}>
              <View style={achievementsStyles.progressIconContainer}>
                <Ionicons name="book" size={24} color={COLORS.ACCENT} />
              </View>
              <Text style={achievementsStyles.modernProgressNumber}>
                {userStats?.totalBooksRead || 0}
              </Text>
              <Text style={achievementsStyles.modernProgressLabel}>Libros</Text>
            </View>
            <View style={achievementsStyles.modernProgressItem}>
              <View style={achievementsStyles.progressIconContainer}>
                <Ionicons name="document-text" size={24} color={COLORS.ERROR} />
              </View>
              <Text style={achievementsStyles.modernProgressNumber}>
                {userStats?.totalPagesRead || 0}
              </Text>
              <Text style={achievementsStyles.modernProgressLabel}>Páginas</Text>
            </View>
            <View style={achievementsStyles.modernProgressItem}>
              <View style={achievementsStyles.progressIconContainer}>
                <Ionicons name="grid" size={24} color={COLORS.SUCCESS} />
              </View>
              <Text style={achievementsStyles.modernProgressNumber}>
                {userStats?.genresExplored || 0}
              </Text>
              <Text style={achievementsStyles.modernProgressLabel}>Géneros</Text>
            </View>
            <View style={achievementsStyles.modernProgressItem}>
              <View style={achievementsStyles.progressIconContainer}>
                <Ionicons name="flame" size={24} color={COLORS.WARNING} />
              </View>
              <Text style={achievementsStyles.modernProgressNumber}>
                {userStats?.currentStreak || 0}
              </Text>
              <Text style={achievementsStyles.modernProgressLabel}>Días seguidos</Text>
            </View>
          </View>
        </View>

        <View style={achievementsStyles.achievementsSection}>
          <Text style={achievementsStyles.sectionTitle}>Todos los logros</Text>

          {Object.entries(rarityGroups).map(([rarity, achievementList]) => {
            if (!achievementList || achievementList.length === 0) return null;

            return (
              <View key={rarity} style={achievementsStyles.raritySection}>
                <View style={achievementsStyles.rarityHeader}>
                  <View style={achievementsStyles.rarityBadge}>
                    <View
                      style={[
                        achievementsStyles.rarityIndicator,
                        { backgroundColor: RARITY_COLORS[rarity] },
                      ]}
                    />
                    <Text style={achievementsStyles.rarityTitle}>
                      {rarity.charAt(0).toUpperCase() + rarity.slice(1)}
                    </Text>
                    <View style={achievementsStyles.rarityCount}>
                      <Text style={achievementsStyles.rarityCountText}>
                        {achievementList.length}
                      </Text>
                    </View>
                  </View>
                </View>

                <View style={achievementsStyles.achievementsGrid}>
                  {achievementList.map((achievement) => {
                    return (
                      <AchievementBadge
                        key={achievement.id}
                        achievement={achievement}
                        isUnlocked={achievement.unlocked}
                        progress={getAchievementProgress(achievement)}
                        onPress={() => handleAchievementPress(achievement)}
                        size="large"
                        showProgress={!achievement.unlocked}
                      />
                    );
                  })}
                </View>
              </View>
            );
          })}
        </View>
      </ScrollView>

      <Modal visible={modalVisible} transparent animationType="fade">
        <View style={achievementsStyles.modalOverlay}>
          <View style={achievementsStyles.modalContainer}>
            {selectedAchievement && (
              <>
                <View style={achievementsStyles.modalHeader}>
                  <Text style={achievementsStyles.modalTitle}>{selectedAchievement.title}</Text>
                  <TouchableOpacity onPress={closeModal} style={achievementsStyles.closeButton}>
                    <Ionicons name="close" size={24} color={COLORS.SUBT} />
                  </TouchableOpacity>
                </View>

                <View style={achievementsStyles.modalContent}>
                  <View style={achievementsStyles.modalIconContainer}>
                    <Text style={achievementsStyles.modalIcon}>{selectedAchievement.icon}</Text>
                  </View>

                  <Text style={achievementsStyles.modalDescription}>
                    {selectedAchievement.description}
                  </Text>

                  <View style={achievementsStyles.modalStats}>
                    <View style={achievementsStyles.modalStatItem}>
                      <Ionicons
                        name="star"
                        size={20}
                        color={RARITY_COLORS[selectedAchievement.rarity]}
                      />
                      <Text style={achievementsStyles.modalStatText}>
                        {selectedAchievement.points} puntos
                      </Text>
                    </View>
                    <View style={achievementsStyles.modalStatItem}>
                      <View
                        style={[
                          achievementsStyles.modalRarityBadge,
                          { backgroundColor: RARITY_COLORS[selectedAchievement.rarity] },
                        ]}
                      />
                      <Text style={achievementsStyles.modalStatText}>
                        {selectedAchievement.rarity.charAt(0).toUpperCase() +
                          selectedAchievement.rarity.slice(1)}
                      </Text>
                    </View>
                  </View>

                  {!selectedAchievement.unlockedAt && (
                    <View style={achievementsStyles.progressContainer}>
                      <Text style={achievementsStyles.progressLabel}>Progreso:</Text>
                      <View style={achievementsStyles.progressBar}>
                        <View
                          style={[
                            achievementsStyles.progressFill,
                            {
                              width: `${getAchievementProgress(selectedAchievement)}%`,
                              backgroundColor: RARITY_COLORS[selectedAchievement.rarity],
                            },
                          ]}
                        />
                      </View>
                      <Text style={achievementsStyles.progressText}>
                        {Math.round(getAchievementProgress(selectedAchievement))}%
                      </Text>
                    </View>
                  )}
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}

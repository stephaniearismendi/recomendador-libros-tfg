import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { achievementNotificationStyles } from '../styles/components';
import { RARITY_COLORS } from '../utils/achievementUtils';

export default function AchievementNotification({ achievement, visible, onClose }) {
  const slideAnim = new Animated.Value(-200);
  const opacityAnim = new Animated.Value(0);

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();

      const timer = setTimeout(() => {
        handleClose();
      }, 4000);

      return () => clearTimeout(timer);
    }
  }, [visible]);

  const handleClose = () => {
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: -200,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onClose();
    });
  };

  if (!visible || !achievement) return null;

  const rarityColor = RARITY_COLORS[achievement.rarity] || RARITY_COLORS.common;

  return (
    <Animated.View
      style={[
        achievementNotificationStyles.overlay,
        {
          opacity: opacityAnim,
          transform: [{ translateY: slideAnim }],
        },
      ]}
    >
      <View style={achievementNotificationStyles.container}>
        <View style={achievementNotificationStyles.content}>
          <View style={achievementNotificationStyles.iconContainer}>
            <Text style={achievementNotificationStyles.icon}>{achievement.icon}</Text>
            <View
              style={[achievementNotificationStyles.checkmark, { backgroundColor: rarityColor }]}
            >
              <Ionicons name="checkmark" size={16} color="#fff" />
            </View>
          </View>

          <View style={achievementNotificationStyles.textContainer}>
            <Text style={achievementNotificationStyles.title}>{achievement.title}</Text>
            <Text style={achievementNotificationStyles.description} numberOfLines={2}>
              {achievement.description}
            </Text>
            <View style={achievementNotificationStyles.pointsContainer}>
              <Ionicons name="star" size={14} color={rarityColor} />
              <Text style={[achievementNotificationStyles.points, { color: rarityColor }]}>
                +{achievement.points} puntos
              </Text>
            </View>
          </View>

          <TouchableOpacity onPress={handleClose} style={achievementNotificationStyles.closeButton}>
            <Ionicons name="close" size={20} color="#9CA3AF" />
          </TouchableOpacity>
        </View>

        <View style={achievementNotificationStyles.progressContainer}>
          <View
            style={[achievementNotificationStyles.progressBar, { backgroundColor: rarityColor }]}
          />
        </View>
      </View>
    </Animated.View>
  );
}

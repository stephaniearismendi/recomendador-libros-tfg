import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { achievementBadgeStyles } from '../styles/components';
import { RARITY_COLORS } from '../utils/achievementUtils';
import { COLORS } from '../styles/baseStyles';

export default function AchievementBadge({
  achievement,
  isUnlocked = false,
  progress = 0,
  onPress = null,
  size = 'medium',
  showProgress = false,
}) {
  const { title, description, icon, rarity, points } = achievement || {};
  const rarityColor = RARITY_COLORS[rarity] || RARITY_COLORS.common;

  const containerStyle = [
    achievementBadgeStyles.container,
    achievementBadgeStyles[`container_${size}`],
    isUnlocked ? achievementBadgeStyles.unlocked : achievementBadgeStyles.locked,
    { borderColor: isUnlocked ? rarityColor : COLORS.BORDER },
  ];

  const iconStyle = [
    achievementBadgeStyles.icon,
    achievementBadgeStyles[`icon_${size}`],
    { color: isUnlocked ? rarityColor : COLORS.SUBT },
  ];

  const titleStyle = [
    achievementBadgeStyles.title,
    achievementBadgeStyles[`title_${size}`],
    { color: isUnlocked ? COLORS.TEXT : COLORS.SUBT },
  ];

  const descriptionStyle = [
    achievementBadgeStyles.description,
    achievementBadgeStyles[`description_${size}`],
    { color: isUnlocked ? COLORS.SUBT : COLORS.SUBT },
  ];

  const pointsStyle = [
    achievementBadgeStyles.points,
    achievementBadgeStyles[`points_${size}`],
    { color: isUnlocked ? rarityColor : COLORS.SUBT },
  ];

  const Component = onPress ? TouchableOpacity : View;

  return (
    <Component style={containerStyle} onPress={onPress} disabled={!onPress}>
      <View
        style={[
          achievementBadgeStyles.iconContainer,
          achievementBadgeStyles[`iconContainer_${size}`],
        ]}
      >
        <Text style={iconStyle}>{icon}</Text>
        {isUnlocked && (
          <View style={[achievementBadgeStyles.checkmark, { backgroundColor: rarityColor }]}>
            <Ionicons name="checkmark" size={12} color={COLORS.CARD} />
          </View>
        )}
      </View>

      <View style={achievementBadgeStyles.content}>
        <Text style={titleStyle} numberOfLines={1}>
          {title}
        </Text>
        <Text style={descriptionStyle} numberOfLines={2}>
          {description}
        </Text>

        {showProgress && !isUnlocked && progress > 0 && (
          <View style={achievementBadgeStyles.progressContainer}>
            <View style={achievementBadgeStyles.progressBar}>
              <View
                style={[
                  achievementBadgeStyles.progressFill,
                  { width: `${Math.min(100, progress)}%`, backgroundColor: rarityColor },
                ]}
              />
            </View>
            <Text style={achievementBadgeStyles.progressText}>{Math.round(progress)}%</Text>
          </View>
        )}

        <View style={achievementBadgeStyles.pointsContainer}>
          <Ionicons name="star" size={12} color={isUnlocked ? rarityColor : COLORS.SUBT} />
          <Text style={pointsStyle}>{points}</Text>
        </View>
      </View>

      {!isUnlocked && (
        <View style={achievementBadgeStyles.lockOverlay}>
          <Ionicons name="lock-closed" size={16} color={COLORS.SUBT} />
        </View>
      )}
    </Component>
  );
}

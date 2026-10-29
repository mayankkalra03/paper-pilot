import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle, TextStyle, View } from 'react-native';
import { PALETTE, FONTS, SHADOWS } from '../../constants/theme';
import { soundService } from '../../services/sound';
import { hapticService } from '../../services/haptics';

interface Props {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'danger' | 'outline';
  size?: 'small' | 'medium' | 'large';
  style?: ViewStyle;
  icon?: React.ReactNode;
}

export const VintageButton: React.FC<Props> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  style,
  icon,
}) => {
  const handlePress = () => {
    soundService.playTap();
    hapticService.tap();
    onPress();
  };

  const getVariantStyle = (): ViewStyle => {
    switch (variant) {
      case 'primary':
        return {
          backgroundColor: PALETTE.inkNavy,
          borderColor: PALETTE.inkNavyDark,
        };
      case 'secondary':
        return {
          backgroundColor: PALETTE.paperLighter,
          borderColor: PALETTE.paperBorder,
        };
      case 'danger':
        return {
          backgroundColor: PALETTE.vintageCoral,
          borderColor: '#A83B28',
        };
      case 'outline':
        return {
          backgroundColor: PALETTE.paperLighter,
          borderColor: PALETTE.paperBorder,
        };
    }
  };

  const getTextStyle = (): TextStyle => {
    switch (variant) {
      case 'primary':
        return { color: '#FAF6EE' };
      case 'secondary':
      case 'outline':
        return { color: PALETTE.inkNavy };
      case 'danger':
        return { color: '#FFFFFF' };
    }
  };

  const getSizeStyle = (): { container: ViewStyle; text: TextStyle } => {
    switch (size) {
      case 'small':
        return {
          container: { paddingVertical: 8, paddingHorizontal: 10, minHeight: 38 },
          text: { fontSize: 12, letterSpacing: 0.5 },
        };
      case 'large':
        return {
          container: { paddingVertical: 14, paddingHorizontal: 24, minHeight: 52 },
          text: { fontSize: 16, letterSpacing: 1.0 },
        };
      case 'medium':
      default:
        return {
          container: { paddingVertical: 11, paddingHorizontal: 14, minHeight: 44 },
          text: { fontSize: 13.5, letterSpacing: 0.7 },
        };
    }
  };

  const sz = getSizeStyle();

  return (
    <TouchableOpacity
      activeOpacity={0.82}
      onPress={handlePress}
      style={[
        styles.base,
        sz.container,
        getVariantStyle(),
        variant === 'primary'
          ? SHADOWS.card
          : variant === 'outline'
          ? null
          : SHADOWS.subtle,
        style,
      ]}
    >
      <View style={styles.innerRow}>
        {icon && <View style={styles.iconContainer}>{icon}</View>}
        <Text
          numberOfLines={1}
          adjustsFontSizeToFit
          style={[styles.text, sz.text, getTextStyle()]}
        >
          {title}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  base: {
    borderRadius: 6,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  innerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainer: {
    marginRight: 8,
  },
  text: {
    fontFamily: FONTS.serif,
    fontWeight: '600',
    textAlign: 'center',
    textTransform: 'uppercase',
  },
});

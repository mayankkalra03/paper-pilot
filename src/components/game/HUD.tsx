import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { PALETTE, FONTS, SHADOWS } from '../../constants/theme';
import { PostageStampView } from '../vectors/PostageStampView';
import { soundService } from '../../services/sound';
import { hapticService } from '../../services/haptics';

interface Props {
  distance: number;
  stamps: number;
  onPause: () => void;
}

export const HUD: React.FC<Props> = ({ distance, stamps, onPause }) => {
  const insets = useSafeAreaInsets();

  const handlePause = () => {
    soundService.playTap();
    hapticService.tap();
    onPause();
  };

  return (
    <View style={[styles.container, { top: Math.max(insets.top + 8, 16) }]} pointerEvents="box-none">
      {/* Distance indicator (looks like a delicate flight odometer) */}
      <View style={[styles.badge, SHADOWS.subtle]}>
        <Text style={styles.label}>DIST</Text>
        <Text style={styles.value}>{Math.floor(distance)}<Text style={styles.unit}>m</Text></Text>
      </View>

      {/* Postage stamp counter */}
      <View style={[styles.badge, styles.stampBadge, SHADOWS.subtle]}>
        <PostageStampView size={18} />
        <Text style={[styles.value, styles.stampValue]}>{stamps}</Text>
      </View>

      {/* Pause button */}
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={handlePause}
        style={[styles.pauseButton, SHADOWS.subtle]}
        hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
      >
        <View style={styles.pauseBars}>
          <View style={styles.pauseBar} />
          <View style={styles.pauseBar} />
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 16,
    right: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    zIndex: 50,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'baseline',
    backgroundColor: 'rgba(255, 253, 249, 0.92)',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: PALETTE.paperBorder,
  },
  stampBadge: {
    alignItems: 'center',
    gap: 6,
  },
  label: {
    fontFamily: FONTS.serif,
    fontSize: 10,
    fontWeight: '700',
    color: PALETTE.inkMuted,
    marginRight: 4,
    letterSpacing: 0.5,
  },
  value: {
    fontFamily: FONTS.sans,
    fontSize: 16,
    fontWeight: '700',
    color: PALETTE.inkNavy,
  },
  stampValue: {
    fontSize: 15,
  },
  unit: {
    fontSize: 11,
    fontWeight: '500',
    color: PALETTE.inkMuted,
  },
  pauseButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 253, 249, 0.92)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: PALETTE.paperBorder,
  },
  pauseBars: {
    flexDirection: 'row',
    gap: 3.5,
  },
  pauseBar: {
    width: 3,
    height: 12,
    backgroundColor: PALETTE.inkNavy,
    borderRadius: 1,
  },
});

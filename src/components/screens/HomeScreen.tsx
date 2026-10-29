import React, { useEffect, useMemo } from 'react';
import { View, Text, StyleSheet, Animated, TouchableOpacity, Dimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { PALETTE, FONTS, SHADOWS } from '../../constants/theme';
import { PaperPlaneView } from '../vectors/PaperPlaneView';
import { PostageStampView } from '../vectors/PostageStampView';
import { VintageButton } from '../common/VintageButton';
import { ParallaxBackground } from '../game/ParallaxBackground';
import { PlayerStats } from '../../types/game';
import { POSTCARDS } from '../../constants/postcards';
import { soundService } from '../../services/sound';
import { hapticService } from '../../services/haptics';

interface Props {
  stats: PlayerStats;
  onStartFlight: () => void;
  onOpenPostcards: () => void;
  onOpenSettings: () => void;
}

export const HomeScreen: React.FC<Props> = ({
  stats,
  onStartFlight,
  onOpenPostcards,
  onOpenSettings,
}) => {
  const insets = useSafeAreaInsets();
  const { width, height } = Dimensions.get('window');

  // Gentle floating animation for the showcase airplane
  const floatAnim = useMemo(() => new Animated.Value(0), []);
  const driftAnim = useMemo(() => new Animated.Value(0), []);

  const planeY = useMemo(
    () =>
      floatAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [-8, 8],
      }),
    [floatAnim]
  );

  const planeRotate = useMemo(
    () =>
      floatAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ['-3deg', '4deg'],
      }),
    [floatAnim]
  );

  const planeX = useMemo(
    () =>
      driftAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [-10, 10],
      }),
    [driftAnim]
  );

  useEffect(() => {
    // Bobbing up and down gently
    const floatLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, {
          toValue: 1,
          duration: 2400,
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim, {
          toValue: 0,
          duration: 2400,
          useNativeDriver: true,
        }),
      ])
    );

    // Drifting side to side slightly
    const driftLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(driftAnim, {
          toValue: 1,
          duration: 3600,
          useNativeDriver: true,
        }),
        Animated.timing(driftAnim, {
          toValue: 0,
          duration: 3600,
          useNativeDriver: true,
        }),
      ])
    );

    floatLoop.start();
    driftLoop.start();

    return () => {
      floatLoop.stop();
      driftLoop.stop();
    };
  }, [floatAnim, driftAnim]);

  const unlockedCount = stats.unlockedPostcardIds.length;
  const totalPostcards = POSTCARDS.length;

  return (
    <View style={styles.container}>
      {/* Background Illustrated Scenery */}
      <ParallaxBackground width={width} height={height} scrollOffset={80} />

      {/* Top Header Controls (Settings & Journal info) */}
      <View style={[styles.topRow, { top: Math.max(insets.top + 10, 20) }]}>
        <View style={styles.postmarkSeal}>
          <Text style={styles.postmarkText}>NO. 01 • AIRMAIL SERVICE</Text>
        </View>

        <TouchableOpacity
          activeOpacity={0.75}
          onPress={() => {
            soundService.playTap();
            hapticService.tap();
            onOpenSettings();
          }}
          style={[styles.iconButton, SHADOWS.subtle]}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          {/* Subtle Cog / Settings Icon in Ink Navy */}
          <Text style={styles.settingsIconGlyph}>⚙</Text>
        </TouchableOpacity>
      </View>

      {/* Main Content Area */}
      <View style={styles.content}>
        {/* Title Treatment */}
        <View style={styles.titleBlock}>
          <Text style={styles.editionTag}>AN ENDLESS FLIGHT ON THE WIND</Text>
          <Text style={styles.title}>Paper Pilot</Text>
          <View style={styles.titleRuleRow}>
            <View style={styles.titleLine} />
            <Text style={styles.titleDiamond}>◆</Text>
            <View style={styles.titleLine} />
          </View>
          <Text style={styles.subtitle}>Fold a memory. Catch the thermal.</Text>
        </View>

        {/* Floating Showcase Plane */}
        <View style={styles.showcasePlaneContainer}>
          <Animated.View
            style={{
              transform: [
                { translateY: planeY },
                { translateX: planeX },
                { rotate: planeRotate },
              ],
            }}
          >
            <PaperPlaneView width={130} height={110} />
          </Animated.View>
        </View>

        {/* Best Record & Stats Strip */}
        <View style={[styles.statsStrip, SHADOWS.subtle]}>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>PERSONAL BEST</Text>
            <Text style={styles.statNumber}>{stats.bestDistance}<Text style={styles.statUnit}>m</Text></Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>TOTAL STAMPS</Text>
            <View style={styles.statStampRow}>
              <PostageStampView size={15} />
              <Text style={styles.statNumber}>{stats.totalStamps}</Text>
            </View>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actions}>
          <VintageButton
            title="Take Flight"
            onPress={onStartFlight}
            variant="primary"
            size="large"
            style={styles.primaryBtn}
          />

          <VintageButton
            title={`Postcards (${unlockedCount}/${totalPostcards})`}
            onPress={onOpenPostcards}
            variant="secondary"
            size="medium"
            icon={<PostageStampView size={18} highlighted />}
            style={styles.secondaryBtn}
          />
        </View>
      </View>

      {/* Footer copyright / craft note */}
      <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom + 12, 18) }]}>
        <Text style={styles.footerText}>TAP & HOLD TO CLIMB • RELEASE TO GLIDE</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: PALETTE.paper,
  },
  topRow: {
    position: 'absolute',
    left: 20,
    right: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 20,
  },
  postmarkSeal: {
    borderWidth: 1,
    borderColor: PALETTE.paperBorder,
    backgroundColor: 'rgba(255, 253, 248, 0.88)',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 4,
  },
  postmarkText: {
    fontFamily: FONTS.serif,
    fontSize: 9,
    letterSpacing: 1.2,
    color: PALETTE.inkMuted,
    fontWeight: '700',
  },
  iconButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(255, 253, 248, 0.92)',
    borderWidth: 1,
    borderColor: PALETTE.paperBorder,
    alignItems: 'center',
    justifyContent: 'center',
  },
  settingsIconGlyph: {
    fontSize: 18,
    color: PALETTE.inkNavy,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
    zIndex: 10,
  },
  titleBlock: {
    alignItems: 'center',
    marginBottom: 20,
  },
  editionTag: {
    fontFamily: FONTS.serif,
    fontSize: 10,
    letterSpacing: 2,
    color: PALETTE.inkMuted,
    marginBottom: 8,
    fontWeight: '600',
  },
  title: {
    fontFamily: FONTS.serif,
    fontSize: 44,
    fontWeight: '700',
    color: PALETTE.inkNavy,
    letterSpacing: 1.5,
  },
  titleRuleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: 140,
    marginVertical: 8,
  },
  titleLine: {
    flex: 1,
    height: 1,
    backgroundColor: PALETTE.paperCrease,
  },
  titleDiamond: {
    fontSize: 8,
    color: PALETTE.vintageCoral,
    marginHorizontal: 8,
  },
  subtitle: {
    fontFamily: FONTS.serif,
    fontSize: 14,
    color: PALETTE.inkMuted,
    fontStyle: 'italic',
  },
  showcasePlaneContainer: {
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 10,
  },
  statsStrip: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 253, 248, 0.95)',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: PALETTE.paperBorder,
    paddingVertical: 12,
    paddingHorizontal: 20,
    width: '100%',
    maxWidth: 320,
    marginBottom: 24,
    alignItems: 'center',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statDivider: {
    width: 1,
    height: 28,
    backgroundColor: PALETTE.paperBorder,
  },
  statLabel: {
    fontFamily: FONTS.serif,
    fontSize: 9,
    fontWeight: '700',
    color: PALETTE.inkMuted,
    letterSpacing: 1,
    marginBottom: 3,
  },
  statNumber: {
    fontFamily: FONTS.sans,
    fontSize: 19,
    fontWeight: '700',
    color: PALETTE.inkNavy,
  },
  statUnit: {
    fontSize: 12,
    fontWeight: '500',
    color: PALETTE.inkMuted,
  },
  statStampRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  actions: {
    width: '100%',
    maxWidth: 320,
    gap: 12,
  },
  primaryBtn: {
    width: '100%',
  },
  secondaryBtn: {
    width: '100%',
  },
  footer: {
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  footerText: {
    fontFamily: FONTS.serif,
    fontSize: 10,
    letterSpacing: 1.2,
    color: PALETTE.inkMuted,
    fontWeight: '600',
  },
});

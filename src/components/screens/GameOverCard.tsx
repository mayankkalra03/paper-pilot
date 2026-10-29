import React, { useEffect, useMemo } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import Svg, { Circle, Path, Line } from 'react-native-svg';
import { PALETTE, FONTS, SHADOWS } from '../../constants/theme';
import { PostageStampView } from '../vectors/PostageStampView';
import { VintageButton } from '../common/VintageButton';
import { RunResults, PlayerStats } from '../../types/game';
import { POSTCARDS } from '../../constants/postcards';
import { soundService } from '../../services/sound';
import { hapticService } from '../../services/haptics';

interface Props {
  results: RunResults;
  stats: PlayerStats;
  onFlyAgain: () => void;
  onOpenPostcards: () => void;
  onHome: () => void;
}

export const GameOverCard: React.FC<Props> = ({
  results,
  stats,
  onFlyAgain,
  onOpenPostcards,
  onHome,
}) => {
  const cardScale = useMemo(() => new Animated.Value(0.92), []);
  const cardOpacity = useMemo(() => new Animated.Value(0), []);

  useEffect(() => {
    if (results.isNewRecord) {
      soundService.playChime();
      hapticService.celebration();
    }

    Animated.parallel([
      Animated.spring(cardScale, {
        toValue: 1,
        tension: 60,
        friction: 8,
        useNativeDriver: true,
      }),
      Animated.timing(cardOpacity, {
        toValue: 1,
        duration: 350,
        useNativeDriver: true,
      }),
    ]).start();
  }, [cardScale, cardOpacity, results.isNewRecord]);

  const newlyUnlockedDefs = POSTCARDS.filter((pc) =>
    results.unlockedPostcards.includes(pc.id)
  );

  return (
    <View style={styles.overlay}>
      <Animated.View
        style={[
          styles.postcard,
          SHADOWS.elevated,
          {
            opacity: cardOpacity,
            transform: [{ scale: cardScale }],
          },
        ]}
      >
        {/* Postcard Airmail Border Edge Accent */}
        <View style={styles.airmailBar} />

        {/* Postcard Top Row: Header & Postmark Stamp */}
        <View style={styles.topRow}>
          <View style={styles.headerTitleArea}>
            <Text style={styles.postcardHeader}>VINTAGE CORRESPONDENCE</Text>
            <Text style={styles.title}>Flight Dispatched</Text>
            <Text style={styles.subtitle}>Gently settled back to earth.</Text>
          </View>

          {/* Authentic Postmark Seal */}
          <View style={styles.postmarkSeal}>
            <Svg width="54" height="54" viewBox="0 0 60 60">
              <Circle
                cx="30"
                cy="30"
                r="27"
                stroke="rgba(30, 44, 58, 0.5)"
                strokeWidth="1.5"
                strokeDasharray="3,2"
                fill="none"
              />
              <Circle
                cx="30"
                cy="30"
                r="22"
                stroke="rgba(30, 44, 58, 0.4)"
                strokeWidth="1"
                fill="none"
              />
              <Path
                d="M 12 30 Q 20 25 30 30 Q 40 35 48 30"
                stroke="rgba(30, 44, 58, 0.45)"
                strokeWidth="1.2"
                fill="none"
              />
              <Line x1="16" y1="22" x2="44" y2="22" stroke="rgba(30, 44, 58, 0.3)" strokeWidth="0.8" />
              <Line x1="18" y1="38" x2="42" y2="38" stroke="rgba(30, 44, 58, 0.3)" strokeWidth="0.8" />
            </Svg>
            <PostageStampView size={24} highlighted={results.isNewRecord} />
          </View>
        </View>

        {/* New Personal Record Banner */}
        {results.isNewRecord && (
          <View style={styles.recordBanner}>
            <Text style={styles.recordBannerText}>★ NEW PERSONAL RECORD ★</Text>
          </View>
        )}

        {/* Flight Statistics Grid */}
        <View style={styles.metricsContainer}>
          <View style={styles.metricCard}>
            <Text style={styles.metricLabel}>DISTANCE</Text>
            <Text style={styles.metricValue}>
              {results.distance}
              <Text style={styles.metricUnit}>m</Text>
            </Text>
            <Text style={styles.metricSub}>Best: {stats.bestDistance}m</Text>
          </View>

          <View style={styles.metricDivider} />

          <View style={styles.metricCard}>
            <Text style={styles.metricLabel}>STAMPS FOUND</Text>
            <View style={styles.metricRow}>
              <PostageStampView size={16} />
              <Text style={styles.metricValue}>+{results.stampsCollected}</Text>
            </View>
            <Text style={styles.metricSub}>Total: {stats.totalStamps}</Text>
          </View>
        </View>

        {/* Newly Unlocked Postcard Notification */}
        {newlyUnlockedDefs.length > 0 && (
          <View style={styles.unlockCard}>
            <Text style={styles.unlockCardTag}>NEW POSTCARD DISCOVERED</Text>
            <Text style={styles.unlockCardTitle}>“{newlyUnlockedDefs[0].title}”</Text>
            <Text style={styles.unlockCardQuote}>{newlyUnlockedDefs[0].subtitle}</Text>
          </View>
        )}

        {/* Handwritten note / poetic travel journal footer */}
        <View style={styles.noteContainer}>
          <Text style={styles.noteText}>
            “The paper holds its creases, ready for the next updraft.”
          </Text>
        </View>

        {/* Action Buttons */}
        <View style={styles.actions}>
          <VintageButton
            title="Fly Again"
            onPress={onFlyAgain}
            variant="primary"
            size="large"
            style={styles.actionBtn}
          />

          <View style={styles.actionRow}>
            <VintageButton
              title="Postcards"
              onPress={onOpenPostcards}
              variant="secondary"
              size="small"
              style={styles.halfBtn}
            />
            <VintageButton
              title="Home"
              onPress={onHome}
              variant="secondary"
              size="small"
              style={styles.halfBtn}
            />
          </View>
        </View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(27, 44, 58, 0.52)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    zIndex: 100,
  },
  postcard: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: PALETTE.paperLighter,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: PALETTE.paperBorder,
    padding: 20,
    overflow: 'hidden',
  },
  airmailBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 4,
    backgroundColor: PALETTE.airmailBlue,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginTop: 4,
    marginBottom: 14,
  },
  headerTitleArea: {
    flex: 1,
    paddingRight: 10,
  },
  postcardHeader: {
    fontFamily: FONTS.serif,
    fontSize: 9,
    letterSpacing: 1.5,
    color: PALETTE.inkMuted,
    marginBottom: 3,
  },
  title: {
    fontFamily: FONTS.serif,
    fontSize: 24,
    fontWeight: '700',
    color: PALETTE.inkNavy,
  },
  subtitle: {
    fontFamily: FONTS.serif,
    fontSize: 12,
    fontStyle: 'italic',
    color: PALETTE.inkMuted,
    marginTop: 2,
  },
  postmarkSeal: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  recordBanner: {
    backgroundColor: PALETTE.vintageCoralLight,
    borderWidth: 1,
    borderColor: PALETTE.vintageCoral,
    borderRadius: 4,
    paddingVertical: 5,
    alignItems: 'center',
    marginBottom: 12,
  },
  recordBannerText: {
    fontFamily: FONTS.serif,
    fontSize: 11,
    fontWeight: '700',
    color: PALETTE.vintageCoral,
    letterSpacing: 1.2,
  },
  metricsContainer: {
    flexDirection: 'row',
    backgroundColor: PALETTE.paper,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: PALETTE.paperBorder,
    paddingVertical: 12,
    marginBottom: 12,
    alignItems: 'center',
  },
  metricCard: {
    flex: 1,
    alignItems: 'center',
  },
  metricDivider: {
    width: 1,
    height: 38,
    backgroundColor: PALETTE.paperBorder,
  },
  metricLabel: {
    fontFamily: FONTS.serif,
    fontSize: 9,
    fontWeight: '700',
    color: PALETTE.inkMuted,
    letterSpacing: 0.8,
    marginBottom: 2,
  },
  metricValue: {
    fontFamily: FONTS.sans,
    fontSize: 22,
    fontWeight: '700',
    color: PALETTE.inkNavy,
  },
  metricUnit: {
    fontSize: 13,
    fontWeight: '500',
    color: PALETTE.inkMuted,
  },
  metricRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metricSub: {
    fontFamily: FONTS.serif,
    fontSize: 10,
    color: PALETTE.inkMuted,
    marginTop: 2,
  },
  unlockCard: {
    backgroundColor: PALETTE.airmailBlueLight,
    borderWidth: 1,
    borderColor: PALETTE.airmailBlue,
    borderRadius: 6,
    padding: 10,
    marginBottom: 12,
    alignItems: 'center',
  },
  unlockCardTag: {
    fontFamily: FONTS.serif,
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 1,
    color: PALETTE.airmailBlue,
  },
  unlockCardTitle: {
    fontFamily: FONTS.serif,
    fontSize: 14,
    fontWeight: '700',
    color: PALETTE.inkNavy,
    marginTop: 2,
  },
  unlockCardQuote: {
    fontFamily: FONTS.serif,
    fontSize: 11,
    fontStyle: 'italic',
    color: PALETTE.inkMuted,
    marginTop: 1,
  },
  noteContainer: {
    borderTopWidth: 1,
    borderTopColor: PALETTE.paperBorder,
    paddingTop: 8,
    marginBottom: 14,
    alignItems: 'center',
  },
  noteText: {
    fontFamily: FONTS.serif,
    fontSize: 11,
    fontStyle: 'italic',
    color: PALETTE.inkMuted,
    textAlign: 'center',
  },
  actions: {
    gap: 8,
  },
  actionBtn: {
    width: '100%',
  },
  actionRow: {
    flexDirection: 'row',
    gap: 8,
  },
  halfBtn: {
    flex: 1,
  },
});

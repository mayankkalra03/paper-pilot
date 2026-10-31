import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  BackHandler,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Circle, Path } from 'react-native-svg';
import { PALETTE, FONTS, SHADOWS } from '../../constants/theme';
import { PostageStampView } from '../vectors/PostageStampView';
import { VintageButton } from '../common/VintageButton';
import { POSTCARDS } from '../../constants/postcards';
import { PostcardDef, PlayerStats } from '../../types/game';
import { soundService } from '../../services/sound';
import { hapticService } from '../../services/haptics';

interface Props {
  stats: PlayerStats;
  onBack: () => void;
}

export const PostcardsScreen: React.FC<Props> = ({ stats, onBack }) => {
  const insets = useSafeAreaInsets();
  const [selectedPostcard, setSelectedPostcard] = useState<PostcardDef | null>(null);

  const unlockedSet = new Set(stats.unlockedPostcardIds);

  const handleCardPress = (pc: PostcardDef) => {
    soundService.playTap();
    hapticService.tap();
    setSelectedPostcard(pc);
  };

  useEffect(() => {
    const onBackPress = () => {
      if (selectedPostcard) {
        setSelectedPostcard(null);
        return true;
      }
      onBack();
      return true;
    };

    const sub = BackHandler.addEventListener('hardwareBackPress', onBackPress);
    return () => sub.remove();
  }, [selectedPostcard, onBack]);

  return (
    <View style={styles.container}>
      {/* Top Header */}
      <View style={[styles.header, { paddingTop: Math.max(insets.top + 8, 16) }]}>
        <View style={styles.headerLeft}>
          <Text style={styles.headerKicker}>COLLECTION & JOURNAL</Text>
          <Text style={styles.headerTitle}>Postcards</Text>
        </View>

        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => {
            soundService.playTap();
            hapticService.tap();
            onBack();
          }}
          style={[styles.backButton, SHADOWS.subtle]}
        >
          <Text style={styles.backButtonText}>✕</Text>
        </TouchableOpacity>
      </View>

      {/* Progress Counter Summary */}
      <View style={styles.summaryStrip}>
        <Text style={styles.summaryText}>
          COLLECTED: {unlockedSet.size} of {POSTCARDS.length} DISCOVERED
        </Text>
        <View style={styles.progressBarBg}>
          <View
            style={[
              styles.progressBarFill,
              { width: `${(unlockedSet.size / POSTCARDS.length) * 100}%` },
            ]}
          />
        </View>
      </View>

      {/* Postcard Grid */}
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[
          styles.gridContent,
          { paddingBottom: Math.max(insets.bottom + 20, 32) },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.grid}>
          {POSTCARDS.map((item) => {
            const isUnlocked = unlockedSet.has(item.id);
            return (
              <TouchableOpacity
                key={item.id}
                activeOpacity={0.8}
                onPress={() => handleCardPress(item)}
                style={[
                  styles.cardThumbnail,
                  isUnlocked ? styles.cardUnlocked : styles.cardLocked,
                  SHADOWS.subtle,
                ]}
              >
                {/* Stamp preview badge */}
                <View style={styles.stampHolder}>
                  <PostageStampView
                    size={22}
                    highlighted={isUnlocked && item.stampType === 'special'}
                  />
                </View>

                {/* Card Title & Location */}
                <Text
                  style={[
                    styles.cardTitle,
                    !isUnlocked && styles.cardTitleLocked,
                  ]}
                  numberOfLines={1}
                >
                  {item.title}
                </Text>

                <Text
                  style={[
                    styles.cardSub,
                    !isUnlocked && styles.cardSubLocked,
                  ]}
                  numberOfLines={1}
                >
                  {isUnlocked ? item.location : 'Undiscovered Territory'}
                </Text>

                {/* Status indicator tag */}
                <View style={[styles.statusTag, isUnlocked ? styles.tagUnlocked : styles.tagLocked]}>
                  <Text style={[styles.statusText, isUnlocked ? styles.statusTextUnlocked : styles.statusTextLocked]}>
                    {isUnlocked ? 'LOGGED' : 'LOCKED'}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>

      {/* Detailed Postcard Modal */}
      {selectedPostcard && (
        <Modal
          visible={!!selectedPostcard}
          transparent
          animationType="fade"
          onRequestClose={() => setSelectedPostcard(null)}
        >
          <View style={styles.modalOverlay}>
            <View style={[styles.detailCard, SHADOWS.elevated]}>
              {/* Airmail header stripe */}
              <View style={styles.modalAirmailBar} />

              <View style={styles.modalHeaderRow}>
                <View>
                  <Text style={styles.modalLocation}>{selectedPostcard.location}</Text>
                  <Text style={styles.modalTitle}>{selectedPostcard.title}</Text>
                  <Text style={styles.modalSubtitle}>{selectedPostcard.subtitle}</Text>
                </View>

                <PostageStampView
                  size={32}
                  highlighted={selectedPostcard.stampType !== 'standard'}
                />
              </View>

              {/* Status / Requirement banner if locked */}
              {!unlockedSet.has(selectedPostcard.id) ? (
                <View style={styles.lockedNotice}>
                  <Text style={styles.lockedNoticeTitle}>🔒 HOW TO UNLOCK:</Text>
                  <Text style={styles.lockedNoticeBody}>
                    {selectedPostcard.unlockRequirement.description}
                  </Text>
                  <Text style={styles.lockedNoticeProgress}>
                    {selectedPostcard.unlockRequirement.type === 'distance' &&
                      `Current Best: ${stats.bestDistance}m`}
                    {selectedPostcard.unlockRequirement.type === 'stamps' &&
                      `Current Total: ${stats.totalStamps} stamps`}
                    {selectedPostcard.unlockRequirement.type === 'flights' &&
                      `Current Flights: ${stats.totalFlights}`}
                  </Text>
                </View>
              ) : (
                <View style={styles.unlockedContent}>
                  {/* Journal description paragraph */}
                  <Text style={styles.journalBody}>{selectedPostcard.description}</Text>

                  {/* Poetic quote */}
                  <View style={styles.quoteBlock}>
                    <Text style={styles.quoteText}>“{selectedPostcard.quote}”</Text>
                  </View>

                  {/* Stamp of authenticity */}
                  <View style={styles.stampSealRow}>
                    <Svg width="44" height="44" viewBox="0 0 50 50">
                      <Circle cx="25" cy="25" r="22" stroke={PALETTE.paperCrease} strokeWidth="1.2" strokeDasharray="3,2" fill="none" />
                      <Circle cx="25" cy="25" r="18" stroke={PALETTE.paperCrease} strokeWidth="0.8" fill="none" />
                      <Path d="M 10 25 Q 18 20 25 25 Q 32 30 40 25" stroke={PALETTE.paperCrease} strokeWidth="1" fill="none" />
                    </Svg>
                    <Text style={styles.stampSealText}>OFFICIAL PAPER PILOT DISPATCH</Text>
                  </View>
                </View>
              )}

              <VintageButton
                title="Close Postcard"
                onPress={() => setSelectedPostcard(null)}
                variant="primary"
                size="medium"
                style={styles.closeBtn}
              />
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: PALETTE.paper,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: PALETTE.paperBorder,
  },
  headerLeft: {
    flex: 1,
  },
  headerKicker: {
    fontFamily: FONTS.serif,
    fontSize: 9,
    letterSpacing: 1.5,
    color: PALETTE.inkMuted,
    fontWeight: '700',
  },
  headerTitle: {
    fontFamily: FONTS.serif,
    fontSize: 26,
    fontWeight: '700',
    color: PALETTE.inkNavy,
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: PALETTE.paperLighter,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: PALETTE.paperBorder,
  },
  backButtonText: {
    fontFamily: FONTS.sans,
    fontSize: 16,
    color: PALETTE.inkNavy,
    fontWeight: '600',
  },
  summaryStrip: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: 'rgba(255, 253, 248, 0.7)',
    borderBottomWidth: 1,
    borderBottomColor: PALETTE.paperBorder,
  },
  summaryText: {
    fontFamily: FONTS.serif,
    fontSize: 10,
    fontWeight: '700',
    color: PALETTE.inkMuted,
    letterSpacing: 1,
    marginBottom: 6,
  },
  progressBarBg: {
    height: 4,
    backgroundColor: PALETTE.paperBorder,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: PALETTE.airmailBlue,
  },
  scroll: {
    flex: 1,
  },
  gridContent: {
    padding: 16,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  cardThumbnail: {
    flexBasis: '47%',
    flexGrow: 1,
    maxWidth: '48.5%',
    backgroundColor: PALETTE.paperLighter,
    borderRadius: 6,
    borderWidth: 1.2,
    borderColor: PALETTE.paperBorder,
    padding: 12,
  },
  cardUnlocked: {
    backgroundColor: PALETTE.paperLighter,
  },
  cardLocked: {
    backgroundColor: 'rgba(238, 233, 222, 0.6)',
    borderColor: PALETTE.paperBorder,
    opacity: 0.8,
  },
  stampHolder: {
    alignSelf: 'flex-start',
    marginBottom: 10,
  },
  cardTitle: {
    fontFamily: FONTS.serif,
    fontSize: 14,
    fontWeight: '700',
    color: PALETTE.inkNavy,
    marginBottom: 2,
  },
  cardTitleLocked: {
    color: PALETTE.inkMuted,
  },
  cardSub: {
    fontFamily: FONTS.serif,
    fontSize: 11,
    fontStyle: 'italic',
    color: PALETTE.inkMuted,
    marginBottom: 10,
  },
  cardSubLocked: {
    color: PALETTE.inkFaint,
  },
  statusTag: {
    alignSelf: 'flex-start',
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 3,
  },
  tagUnlocked: {
    backgroundColor: PALETTE.airmailBlueLight,
  },
  tagLocked: {
    backgroundColor: 'rgba(92, 106, 121, 0.1)',
  },
  statusText: {
    fontFamily: FONTS.serif,
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 0.8,
  },
  statusTextUnlocked: {
    color: PALETTE.airmailBlue,
  },
  statusTextLocked: {
    color: PALETTE.inkMuted,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(27, 44, 58, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  detailCard: {
    width: '100%',
    maxWidth: 360,
    maxHeight: '88%',
    backgroundColor: PALETTE.paperLighter,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: PALETTE.paperBorder,
    padding: 22,
    overflow: 'hidden',
  },
  modalAirmailBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 4,
    backgroundColor: PALETTE.airmailBlue,
  },
  modalHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 14,
  },
  modalLocation: {
    fontFamily: FONTS.serif,
    fontSize: 9,
    letterSpacing: 1.2,
    color: PALETTE.inkMuted,
    fontWeight: '700',
    marginBottom: 2,
  },
  modalTitle: {
    fontFamily: FONTS.serif,
    fontSize: 22,
    fontWeight: '700',
    color: PALETTE.inkNavy,
  },
  modalSubtitle: {
    fontFamily: FONTS.serif,
    fontSize: 12,
    fontStyle: 'italic',
    color: PALETTE.inkMuted,
    marginTop: 2,
  },
  lockedNotice: {
    backgroundColor: PALETTE.vintageCoralLight,
    borderWidth: 1,
    borderColor: PALETTE.vintageCoral,
    borderRadius: 6,
    padding: 14,
    marginVertical: 12,
  },
  lockedNoticeTitle: {
    fontFamily: FONTS.serif,
    fontSize: 11,
    fontWeight: '700',
    color: PALETTE.vintageCoral,
    letterSpacing: 1,
    marginBottom: 4,
  },
  lockedNoticeBody: {
    fontFamily: FONTS.serif,
    fontSize: 13,
    color: PALETTE.inkNavy,
    lineHeight: 18,
  },
  lockedNoticeProgress: {
    fontFamily: FONTS.sans,
    fontSize: 12,
    fontWeight: '600',
    color: PALETTE.inkMuted,
    marginTop: 6,
  },
  unlockedContent: {
    marginVertical: 6,
  },
  journalBody: {
    fontFamily: FONTS.serif,
    fontSize: 13,
    color: PALETTE.inkNavy,
    lineHeight: 20,
    marginBottom: 12,
  },
  quoteBlock: {
    borderLeftWidth: 2,
    borderLeftColor: PALETTE.vintageCoral,
    paddingLeft: 10,
    marginVertical: 8,
  },
  quoteText: {
    fontFamily: FONTS.serif,
    fontSize: 12,
    fontStyle: 'italic',
    color: PALETTE.inkMuted,
  },
  stampSealRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 10,
    marginBottom: 14,
  },
  stampSealText: {
    fontFamily: FONTS.serif,
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 1,
    color: PALETTE.inkMuted,
    flex: 1,
  },
  closeBtn: {
    marginTop: 10,
  },
});

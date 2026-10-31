import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Switch,
  TouchableOpacity,
  Modal,
  BackHandler,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { PALETTE, FONTS, SHADOWS } from '../../constants/theme';
import { VintageButton } from '../common/VintageButton';
import { GameSettings, PlayerStats } from '../../types/game';
import { saveSettings, resetAllStats } from '../../services/storage';
import { soundService } from '../../services/sound';
import { hapticService } from '../../services/haptics';

interface Props {
  settings: GameSettings;
  stats: PlayerStats;
  onUpdateSettings: (newSettings: GameSettings) => void;
  onStatsReset: (newStats: PlayerStats) => void;
  onBack: () => void;
}

export const SettingsScreen: React.FC<Props> = ({
  settings,
  stats,
  onUpdateSettings,
  onStatsReset,
  onBack,
}) => {
  const insets = useSafeAreaInsets();
  const [showConfirmReset, setShowConfirmReset] = useState(false);

  useEffect(() => {
    const onBackPress = () => {
      if (showConfirmReset) {
        setShowConfirmReset(false);
        return true;
      }
      onBack();
      return true;
    };

    const sub = BackHandler.addEventListener('hardwareBackPress', onBackPress);
    return () => sub.remove();
  }, [showConfirmReset, onBack]);

  const handleToggleSound = async (val: boolean) => {
    soundService.setEnabled(val);
    const updated = { ...settings, soundEnabled: val };
    onUpdateSettings(updated);
    await saveSettings(updated);
    if (val) soundService.playTap();
  };

  const handleToggleHaptics = async (val: boolean) => {
    hapticService.setEnabled(val);
    const updated = { ...settings, hapticsEnabled: val };
    onUpdateSettings(updated);
    await saveSettings(updated);
    if (val) hapticService.tap();
  };

  const handleToggleMotion = async (val: boolean) => {
    const updated = { ...settings, reducedMotion: val };
    onUpdateSettings(updated);
    await saveSettings(updated);
  };

  const handleConfirmReset = async () => {
    setShowConfirmReset(false);
    const cleared = await resetAllStats();
    onStatsReset(cleared);
    hapticService.mediumTap();
  };

  return (
    <View style={styles.container}>
      {/* Top Header */}
      <View style={[styles.header, { paddingTop: Math.max(insets.top + 8, 16) }]}>
        <View style={styles.headerLeft}>
          <Text style={styles.headerKicker}>PREFERENCES & LOG</Text>
          <Text style={styles.headerTitle}>Settings</Text>
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

      <View style={styles.content}>
        {/* Audio & Haptic Group */}
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>SENSORY SETTINGS</Text>

          <View style={styles.row}>
            <View style={styles.rowText}>
              <Text style={styles.rowTitle}>Sound Effects</Text>
              <Text style={styles.rowSubtitle}>Acoustic chimes, paper flutter & clicks</Text>
            </View>
            <Switch
              value={settings.soundEnabled}
              onValueChange={handleToggleSound}
              trackColor={{ false: PALETTE.paperBorder, true: PALETTE.airmailBlue }}
              thumbColor={PALETTE.paperLighter}
            />
          </View>

          <View style={styles.divider} />

          <View style={styles.row}>
            <View style={styles.rowText}>
              <Text style={styles.rowTitle}>Haptic Feedback</Text>
              <Text style={styles.rowSubtitle}>Tactile vibration pulses on taps & pickups</Text>
            </View>
            <Switch
              value={settings.hapticsEnabled}
              onValueChange={handleToggleHaptics}
              trackColor={{ false: PALETTE.paperBorder, true: PALETTE.airmailBlue }}
              thumbColor={PALETTE.paperLighter}
            />
          </View>

          <View style={styles.divider} />

          <View style={styles.row}>
            <View style={styles.rowText}>
              <Text style={styles.rowTitle}>Reduced Motion</Text>
              <Text style={styles.rowSubtitle}>Minimizes background oscillations</Text>
            </View>
            <Switch
              value={settings.reducedMotion}
              onValueChange={handleToggleMotion}
              trackColor={{ false: PALETTE.paperBorder, true: PALETTE.airmailBlue }}
              thumbColor={PALETTE.paperLighter}
            />
          </View>
        </View>

        {/* Data & Log Group */}
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>JOURNAL ARCHIVE</Text>
          <View style={styles.statsSummary}>
            <Text style={styles.statsSummaryText}>
              Best Distance: <Text style={styles.statsBold}>{stats.bestDistance}m</Text>  •  
              Total Stamps: <Text style={styles.statsBold}>{stats.totalStamps}</Text>  •  
              Flights: <Text style={styles.statsBold}>{stats.totalFlights}</Text>
            </Text>
          </View>

          <VintageButton
            title="Reset Flight Log & Records"
            onPress={() => setShowConfirmReset(true)}
            variant="danger"
            size="medium"
            style={styles.resetBtn}
          />
        </View>

        {/* About & Craft Notes */}
        <View style={styles.aboutCard}>
          <Text style={styles.aboutTitle}>Paper Pilot</Text>
          <Text style={styles.aboutVersion}>Edition 1.0 • Built with ❤️</Text>
          <Text style={styles.aboutBody}>
            Designed with love for vintage paper crafts, postal history, and quiet endless journeys.
          </Text>
        </View>
      </View>

      {/* Confirmation Modal for Reset */}
      <Modal visible={showConfirmReset} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={[styles.confirmCard, SHADOWS.elevated]}>
            <Text style={styles.confirmHeader}>CONFIRM ARCHIVE RESET</Text>
            <Text style={styles.confirmTitle}>Clear All Records?</Text>
            <Text style={styles.confirmText}>
              This will reset your personal best score, collected stamps, and return all postcards to their locked state.
            </Text>

            <View style={styles.confirmActions}>
              <VintageButton
                title="Yes, Reset Everything"
                onPress={handleConfirmReset}
                variant="danger"
                size="medium"
                style={styles.confirmBtn}
              />
              <VintageButton
                title="Cancel"
                onPress={() => setShowConfirmReset(false)}
                variant="outline"
                size="medium"
                style={styles.confirmBtn}
              />
            </View>
          </View>
        </View>
      </Modal>
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
  content: {
    padding: 20,
    gap: 20,
  },
  section: {
    backgroundColor: PALETTE.paperLighter,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: PALETTE.paperBorder,
    padding: 16,
  },
  sectionHeader: {
    fontFamily: FONTS.serif,
    fontSize: 10,
    letterSpacing: 1.5,
    fontWeight: '700',
    color: PALETTE.inkMuted,
    marginBottom: 12,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  rowText: {
    flex: 1,
    paddingRight: 14,
  },
  rowTitle: {
    fontFamily: FONTS.serif,
    fontSize: 15,
    fontWeight: '600',
    color: PALETTE.inkNavy,
  },
  rowSubtitle: {
    fontFamily: FONTS.serif,
    fontSize: 11,
    color: PALETTE.inkMuted,
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: PALETTE.paperBorder,
    marginVertical: 4,
  },
  statsSummary: {
    marginBottom: 14,
  },
  statsSummaryText: {
    fontFamily: FONTS.serif,
    fontSize: 12,
    color: PALETTE.inkMuted,
  },
  statsBold: {
    fontFamily: FONTS.sans,
    fontWeight: '700',
    color: PALETTE.inkNavy,
  },
  resetBtn: {
    marginTop: 6,
  },
  aboutCard: {
    alignItems: 'center',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: PALETTE.paperBorder,
  },
  aboutTitle: {
    fontFamily: FONTS.serif,
    fontSize: 16,
    fontWeight: '700',
    color: PALETTE.inkNavy,
  },
  aboutVersion: {
    fontFamily: FONTS.serif,
    fontSize: 11,
    color: PALETTE.inkMuted,
    marginTop: 2,
    marginBottom: 6,
  },
  aboutBody: {
    fontFamily: FONTS.serif,
    fontSize: 11,
    fontStyle: 'italic',
    color: PALETTE.inkMuted,
    textAlign: 'center',
    maxWidth: 280,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(27, 44, 58, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  confirmCard: {
    width: '100%',
    maxWidth: 320,
    backgroundColor: PALETTE.paperLighter,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: PALETTE.paperBorder,
    padding: 20,
    alignItems: 'center',
  },
  confirmHeader: {
    fontFamily: FONTS.serif,
    fontSize: 9,
    letterSpacing: 1.5,
    fontWeight: '700',
    color: PALETTE.vintageCoral,
    marginBottom: 6,
  },
  confirmTitle: {
    fontFamily: FONTS.serif,
    fontSize: 20,
    fontWeight: '700',
    color: PALETTE.inkNavy,
    marginBottom: 8,
  },
  confirmText: {
    fontFamily: FONTS.serif,
    fontSize: 12,
    color: PALETTE.inkMuted,
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 18,
  },
  confirmActions: {
    width: '100%',
    gap: 8,
  },
  confirmBtn: {
    width: '100%',
  },
});

import React from 'react';
import { View, Text, StyleSheet, Modal } from 'react-native';
import { PALETTE, FONTS, SHADOWS } from '../../constants/theme';
import { VintageButton } from '../common/VintageButton';

interface Props {
  visible: boolean;
  distance: number;
  stamps: number;
  onResume: () => void;
  onRestart: () => void;
  onHome: () => void;
}

export const PauseModal: React.FC<Props> = ({
  visible,
  distance,
  stamps,
  onResume,
  onRestart,
  onHome,
}) => {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={[styles.card, SHADOWS.elevated]}>
          <Text style={styles.headerTag}>JOURNAL ENTRY • LOG</Text>
          <Text style={styles.title}>Flight Paused</Text>
          <Text style={styles.subtext}>The breeze holds its breath over the hills.</Text>

          <View style={styles.statsRow}>
            <View style={styles.statBox}>
              <Text style={styles.statLabel}>DISTANCE</Text>
              <Text style={styles.statValue}>{Math.floor(distance)}m</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statBox}>
              <Text style={styles.statLabel}>STAMPS</Text>
              <Text style={styles.statValue}>{stamps}</Text>
            </View>
          </View>

          <View style={styles.actions}>
            <VintageButton
              title="Resume Flight"
              onPress={onResume}
              variant="primary"
              size="medium"
              style={styles.btn}
            />
            <VintageButton
              title="Restart Run"
              onPress={onRestart}
              variant="secondary"
              size="medium"
              style={styles.btn}
            />
            <VintageButton
              title="Return to Desk"
              onPress={onHome}
              variant="outline"
              size="medium"
              style={styles.btn}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(27, 42, 56, 0.45)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  card: {
    width: '100%',
    maxWidth: 340,
    backgroundColor: PALETTE.paperLighter,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: PALETTE.paperBorder,
    padding: 24,
    alignItems: 'center',
  },
  headerTag: {
    fontFamily: FONTS.serif,
    fontSize: 10,
    letterSpacing: 1.5,
    color: PALETTE.inkMuted,
    marginBottom: 4,
  },
  title: {
    fontFamily: FONTS.serif,
    fontSize: 26,
    fontWeight: '700',
    color: PALETTE.inkNavy,
    marginBottom: 4,
  },
  subtext: {
    fontFamily: FONTS.serif,
    fontSize: 13,
    color: PALETTE.inkMuted,
    fontStyle: 'italic',
    marginBottom: 20,
    textAlign: 'center',
  },
  statsRow: {
    flexDirection: 'row',
    width: '100%',
    backgroundColor: PALETTE.paper,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: PALETTE.paperBorder,
    paddingVertical: 12,
    marginBottom: 22,
    alignItems: 'center',
  },
  statBox: {
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
    fontSize: 10,
    fontWeight: '700',
    color: PALETTE.inkMuted,
    letterSpacing: 0.8,
    marginBottom: 2,
  },
  statValue: {
    fontFamily: FONTS.sans,
    fontSize: 18,
    fontWeight: '700',
    color: PALETTE.inkNavy,
  },
  actions: {
    width: '100%',
    gap: 10,
  },
  btn: {
    width: '100%',
  },
});

import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import Svg, { Rect, Line, G } from 'react-native-svg';
import { PALETTE } from '../../constants/theme';

interface Props {
  children?: React.ReactNode;
  style?: ViewStyle;
  showRules?: boolean;
}

export const PaperBackground: React.FC<Props> = ({ children, style, showRules = true }) => {
  return (
    <View style={[styles.container, style]}>
      <View style={StyleSheet.absoluteFill} pointerEvents="none">
        <Svg width="100%" height="100%">
          <Rect width="100%" height="100%" fill={PALETTE.paper} />
          {showRules && (
            <G>
              {/* Subtle top travel-journal margin bar */}
              <Line x1="0" y1="3" x2="100%" y2="3" stroke={PALETTE.paperBorder} strokeWidth="2" />
              <Line x1="0" y1="7" x2="100%" y2="7" stroke={PALETTE.paperBorder} strokeWidth="1" strokeDasharray="4,4" />
            </G>
          )}
        </Svg>
      </View>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: PALETTE.paper,
  },
});

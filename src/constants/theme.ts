import { Platform } from 'react-native';

export const PALETTE = {
  // Paper & Parchment
  paper: '#FAF6EE',
  paperDark: '#F2EAD9',
  paperLighter: '#FFFDF9',
  paperBorder: '#DFD5C0',
  paperCrease: '#D4C7AE',
  paperFaintLine: 'rgba(92, 77, 60, 0.07)',

  // Inks & Typography
  inkNavy: '#1E2C3A',
  inkNavyDark: '#131D27',
  inkMuted: '#5C6A79',
  inkFaint: '#8D9CA8',

  // Accent Tones
  vintageCoral: '#D45D48',
  vintageCoralLight: '#FBECE8',
  airmailBlue: '#3A6B88',
  airmailBlueLight: '#E8F1F5',
  sageGreen: '#5A7D69',
  sageGreenLight: '#EDF4EF',
  sepiaGold: '#B8860B',
  sepiaGoldLight: '#FAF3E0',

  // Game Scenery
  skyGradientTop: '#EBF3F5',
  skyGradientBottom: '#F8F4EC',
  hillDistant: '#CBDAD9',
  hillMid: '#A9BFBE',
  hillNear: '#7E9C9B',
  cloudFill: '#FFFFFF',
  cloudStroke: '#C8D6D8',
};

export const FONTS = {
  serif: Platform.select({
    ios: 'Georgia',
    android: 'serif',
    default: 'Georgia, serif',
  }),
  sans: Platform.select({
    ios: 'System',
    android: 'sans-serif',
    default: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  }),
  monospace: Platform.select({
    ios: 'Courier New',
    android: 'monospace',
    default: 'monospace',
  }),
};

export const SHADOWS = {
  subtle: {
    shadowColor: '#1E2C3A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  card: {
    shadowColor: '#1E2C3A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 4,
  },
  elevated: {
    shadowColor: '#1E2C3A',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.16,
    shadowRadius: 16,
    elevation: 8,
  },
};

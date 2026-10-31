import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ActivityIndicator, BackHandler } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

import { Screen, PlayerStats, GameSettings } from './src/types/game';
import {
  loadStats,
  loadSettings,
  DEFAULT_STATS,
  DEFAULT_SETTINGS,
} from './src/services/storage';
import { soundService } from './src/services/sound';
import { hapticService } from './src/services/haptics';
import { PALETTE } from './src/constants/theme';

import { HomeScreen } from './src/components/screens/HomeScreen';
import { GameCanvas } from './src/components/game/GameCanvas';
import { PostcardsScreen } from './src/components/screens/PostcardsScreen';
import { SettingsScreen } from './src/components/screens/SettingsScreen';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('home');
  const [stats, setStats] = useState<PlayerStats>(DEFAULT_STATS);
  const [settings, setSettings] = useState<GameSettings>(DEFAULT_SETTINGS);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    async function initialize() {
      try {
        const [loadedStats, loadedSettings] = await Promise.all([
          loadStats(),
          loadSettings(),
        ]);
        setStats(loadedStats);
        setSettings(loadedSettings);
        soundService.setEnabled(loadedSettings.soundEnabled);
        hapticService.setEnabled(loadedSettings.hapticsEnabled);
      } catch (err) {
        console.warn('Initialization error:', err);
      } finally {
        setIsReady(true);
      }
    }

    initialize();
  }, []);

  // Handle Android hardware back press navigation
  useEffect(() => {
    const onBackPress = () => {
      if (currentScreen !== 'home') {
        setCurrentScreen('home');
        return true;
      }
      return false; // Allow default Android exit when already on home screen
    };

    const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress);
    return () => subscription.remove();
  }, [currentScreen]);

  if (!isReady) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="small" color={PALETTE.airmailBlue} />
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <StatusBar style="dark" />
      <View style={styles.container}>
        {currentScreen === 'home' && (
          <HomeScreen
            stats={stats}
            onStartFlight={() => setCurrentScreen('game')}
            onOpenPostcards={() => setCurrentScreen('postcards')}
            onOpenSettings={() => setCurrentScreen('settings')}
          />
        )}

        {currentScreen === 'game' && (
          <GameCanvas
            stats={stats}
            onStatsUpdated={(updated) => setStats(updated)}
            onOpenPostcards={() => setCurrentScreen('postcards')}
            onHome={() => setCurrentScreen('home')}
          />
        )}

        {currentScreen === 'postcards' && (
          <PostcardsScreen
            stats={stats}
            onBack={() => setCurrentScreen('home')}
          />
        )}

        {currentScreen === 'settings' && (
          <SettingsScreen
            settings={settings}
            stats={stats}
            onUpdateSettings={(newSettings) => setSettings(newSettings)}
            onStatsReset={(clearedStats) => setStats(clearedStats)}
            onBack={() => setCurrentScreen('home')}
          />
        )}
      </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: PALETTE.paper,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: PALETTE.paper,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

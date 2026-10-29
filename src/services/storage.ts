import AsyncStorage from '@react-native-async-storage/async-storage';
import { GameSettings, PlayerStats, RunResults } from '../types/game';
import { POSTCARDS } from '../constants/postcards';

const KEYS = {
  SETTINGS: '@paper_pilot_settings',
  STATS: '@paper_pilot_stats',
};

export const DEFAULT_SETTINGS: GameSettings = {
  soundEnabled: true,
  hapticsEnabled: true,
  reducedMotion: false,
};

export const DEFAULT_STATS: PlayerStats = {
  bestDistance: 0,
  totalStamps: 0,
  totalFlights: 0,
  unlockedPostcardIds: ['desk'], // First postcard unlocked by default
};

export async function loadSettings(): Promise<GameSettings> {
  try {
    const raw = await AsyncStorage.getItem(KEYS.SETTINGS);
    if (!raw) return DEFAULT_SETTINGS;
    const parsed = JSON.parse(raw);
    return {
      soundEnabled: typeof parsed.soundEnabled === 'boolean' ? parsed.soundEnabled : true,
      hapticsEnabled: typeof parsed.hapticsEnabled === 'boolean' ? parsed.hapticsEnabled : true,
      reducedMotion: typeof parsed.reducedMotion === 'boolean' ? parsed.reducedMotion : false,
    };
  } catch (error) {
    console.warn('Failed to load settings from storage:', error);
    return DEFAULT_SETTINGS;
  }
}

export async function saveSettings(settings: GameSettings): Promise<void> {
  try {
    await AsyncStorage.setItem(KEYS.SETTINGS, JSON.stringify(settings));
  } catch (error) {
    console.warn('Failed to save settings to storage:', error);
  }
}

export async function loadStats(): Promise<PlayerStats> {
  try {
    const raw = await AsyncStorage.getItem(KEYS.STATS);
    if (!raw) return DEFAULT_STATS;
    const parsed = JSON.parse(raw);
    return {
      bestDistance: typeof parsed.bestDistance === 'number' && Number.isFinite(parsed.bestDistance)
        ? Math.max(0, Math.floor(parsed.bestDistance))
        : 0,
      totalStamps: typeof parsed.totalStamps === 'number' && Number.isFinite(parsed.totalStamps)
        ? Math.max(0, Math.floor(parsed.totalStamps))
        : 0,
      totalFlights: typeof parsed.totalFlights === 'number' && Number.isFinite(parsed.totalFlights)
        ? Math.max(0, Math.floor(parsed.totalFlights))
        : 0,
      unlockedPostcardIds: Array.isArray(parsed.unlockedPostcardIds) && parsed.unlockedPostcardIds.length > 0
        ? Array.from(new Set(['desk', ...parsed.unlockedPostcardIds]))
        : ['desk'],
    };
  } catch (error) {
    console.warn('Failed to load stats from storage:', error);
    return DEFAULT_STATS;
  }
}

export async function recordRunResult(
  distance: number,
  stampsCollected: number
): Promise<{ stats: PlayerStats; results: RunResults }> {
  const current = await loadStats();
  const validDist = Number.isFinite(distance) ? Math.max(0, Math.floor(distance)) : 0;
  const validStamps = Number.isFinite(stampsCollected) ? Math.max(0, Math.floor(stampsCollected)) : 0;

  const isNewRecord = validDist > current.bestDistance;
  const newBestDistance = Math.max(current.bestDistance, validDist);
  const newTotalStamps = current.totalStamps + validStamps;
  const newTotalFlights = current.totalFlights + 1;

  // Check for any newly unlocked postcards
  const newlyUnlocked: string[] = [];
  const existingSet = new Set(current.unlockedPostcardIds);

  for (const pc of POSTCARDS) {
    if (existingSet.has(pc.id)) continue;

    let unlocked = false;
    switch (pc.unlockRequirement.type) {
      case 'default':
        unlocked = true;
        break;
      case 'distance':
        unlocked = validDist >= pc.unlockRequirement.target || newBestDistance >= pc.unlockRequirement.target;
        break;
      case 'stamps':
        unlocked = newTotalStamps >= pc.unlockRequirement.target;
        break;
      case 'flights':
        unlocked = newTotalFlights >= pc.unlockRequirement.target;
        break;
    }

    if (unlocked) {
      existingSet.add(pc.id);
      newlyUnlocked.push(pc.id);
    }
  }

  const updatedStats: PlayerStats = {
    bestDistance: newBestDistance,
    totalStamps: newTotalStamps,
    totalFlights: newTotalFlights,
    unlockedPostcardIds: Array.from(existingSet),
  };

  try {
    await AsyncStorage.setItem(KEYS.STATS, JSON.stringify(updatedStats));
  } catch (error) {
    console.warn('Failed to save stats to storage:', error);
  }

  return {
    stats: updatedStats,
    results: {
      distance: validDist,
      stampsCollected: validStamps,
      isNewRecord,
      unlockedPostcards: newlyUnlocked,
    },
  };
}

export async function resetAllStats(): Promise<PlayerStats> {
  try {
    await AsyncStorage.removeItem(KEYS.STATS);
  } catch (error) {
    console.warn('Failed to reset stats:', error);
  }
  return DEFAULT_STATS;
}

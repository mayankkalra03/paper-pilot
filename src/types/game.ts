export type GameState = 'ready' | 'playing' | 'paused' | 'gameOver';

export type Screen = 'home' | 'game' | 'postcards' | 'settings';

export interface PlaneState {
  x: number;
  y: number;
  vy: number;
  rotation: number; // degrees
}

export type ObstacleType = 'cloud' | 'steeples' | 'pencil' | 'kite' | 'weathervane';

export interface Obstacle {
  id: string;
  x: number;
  width: number;
  type: ObstacleType;
  topGap: number;     // bottom of the top obstacle
  bottomGap: number;  // top of the bottom obstacle
  passed: boolean;
}

export interface Collectible {
  id: string;
  x: number;
  y: number;
  radius: number;
  collected: boolean;
  value: number;
}

export interface PostcardDef {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  location: string;
  quote: string;
  stampType: 'standard' | 'rare' | 'special';
  unlockRequirement: {
    type: 'default' | 'distance' | 'stamps' | 'flights';
    target: number;
    description: string;
  };
}

export interface GameSettings {
  soundEnabled: boolean;
  hapticsEnabled: boolean;
  reducedMotion: boolean;
}

export interface PlayerStats {
  bestDistance: number;
  totalStamps: number;
  totalFlights: number;
  unlockedPostcardIds: string[];
}

export interface RunResults {
  distance: number;
  stampsCollected: number;
  isNewRecord: boolean;
  unlockedPostcards: string[];
}

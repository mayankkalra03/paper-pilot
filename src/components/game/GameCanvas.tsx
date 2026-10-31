import React, { useRef, useState, useEffect, useCallback } from 'react';
import {
  View,
  StyleSheet,
  TouchableWithoutFeedback,
  AppState,
  AppStateStatus,
  Dimensions,
  Animated,
  Text,
  BackHandler,
} from 'react-native';
import { PlaneState, Obstacle, Collectible, GameState, RunResults, PlayerStats } from '../../types/game';
import {
  PHYSICS,
  createInitialPlane,
  updatePlanePhysics,
  generateObstacle,
  generateStamp,
  checkCollision,
  checkStampCollection,
} from '../../game/engine';
import { PaperPlaneView } from '../vectors/PaperPlaneView';
import { PostageStampView } from '../vectors/PostageStampView';
import { ObstacleView } from '../vectors/ObstacleView';
import { ParallaxBackground } from './ParallaxBackground';
import { HUD } from './HUD';
import { PauseModal } from './PauseModal';
import { GameOverCard } from '../screens/GameOverCard';
import { recordRunResult } from '../../services/storage';
import { soundService } from '../../services/sound';
import { hapticService } from '../../services/haptics';
import { PALETTE, FONTS } from '../../constants/theme';

interface Props {
  stats: PlayerStats;
  onStatsUpdated: (stats: PlayerStats) => void;
  onOpenPostcards: () => void;
  onHome: () => void;
}

interface FloatingIndicator {
  id: string;
  x: number;
  y: number;
  text: string;
  opacity: Animated.Value;
  translateY: Animated.Value;
}

interface FrameData {
  plane: PlaneState;
  obstacles: Obstacle[];
  collectibles: Collectible[];
  distance: number;
  stamps: number;
}

function createInitialRun(screenWidth: number, screenHeight: number): {
  plane: PlaneState;
  obstacles: Obstacle[];
  collectibles: Collectible[];
} {
  return {
    plane: createInitialPlane(screenHeight),
    obstacles: [
      generateObstacle(screenWidth + 140, screenHeight, 0),
      generateObstacle(screenWidth + 420, screenHeight, 0),
    ],
    collectibles: [
      generateStamp(screenWidth + 280, screenHeight * 0.45),
    ],
  };
}

export const GameCanvas: React.FC<Props> = ({
  stats,
  onStatsUpdated,
  onOpenPostcards,
  onHome,
}) => {
  const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

  // Direct state initialization with no synchronous effect setState
  const [initialData] = useState(() => createInitialRun(screenWidth, screenHeight));
  const [frameData, setFrameData] = useState<FrameData>(() => ({
    plane: initialData.plane,
    obstacles: initialData.obstacles,
    collectibles: initialData.collectibles,
    distance: 0,
    stamps: 0,
  }));

  const [gameState, setGameState] = useState<GameState>('ready');
  const [runResults, setRunResults] = useState<RunResults | null>(null);
  const [floatingIndicators, setFloatingIndicators] = useState<FloatingIndicator[]>([]);

  // Refs for high-frequency physics to avoid React re-render thrashing
  const planeRef = useRef<PlaneState>(initialData.plane);
  const obstaclesRef = useRef<Obstacle[]>(initialData.obstacles);
  const collectiblesRef = useRef<Collectible[]>(initialData.collectibles);
  const distanceRef = useRef(0);
  const stampsCollectedRef = useRef(0);
  const isHoldingLiftRef = useRef(false);
  const lastTimeRef = useRef<number | null>(null);
  const animFrameIdRef = useRef<number | null>(null);
  const isGameOverProcessedRef = useRef(false);

  // Clean reset function for restarting flights
  const handleResetRun = useCallback(() => {
    const init = createInitialRun(screenWidth, screenHeight);
    planeRef.current = init.plane;
    obstaclesRef.current = init.obstacles;
    collectiblesRef.current = init.collectibles;
    distanceRef.current = 0;
    stampsCollectedRef.current = 0;
    isHoldingLiftRef.current = false;
    lastTimeRef.current = null;
    isGameOverProcessedRef.current = false;

    setFrameData({
      plane: init.plane,
      obstacles: init.obstacles,
      collectibles: init.collectibles,
      distance: 0,
      stamps: 0,
    });
    setRunResults(null);
    setFloatingIndicators([]);
    setGameState('ready');
  }, [screenHeight, screenWidth]);

  // Floating indicator helper
  const addFloatingIndicator = (x: number, y: number, text: string) => {
    const opacity = new Animated.Value(1);
    const translateY = new Animated.Value(0);

    const ind: FloatingIndicator = {
      id: `${Date.now()}_${Math.random()}`,
      x,
      y,
      text,
      opacity,
      translateY,
    };

    setFloatingIndicators((prev) => [...prev, ind]);

    Animated.parallel([
      Animated.timing(translateY, {
        toValue: -36,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setFloatingIndicators((prev) => prev.filter((i) => i.id !== ind.id));
    });
  };

  // Trigger game over handling safely
  const triggerGameOver = useCallback(async () => {
    if (isGameOverProcessedRef.current) return;
    isGameOverProcessedRef.current = true;

    soundService.playCollision();
    hapticService.collision();

    if (animFrameIdRef.current) {
      cancelAnimationFrame(animFrameIdRef.current);
      animFrameIdRef.current = null;
    }

    setGameState('gameOver');

    const finalDistance = distanceRef.current;
    const finalStamps = stampsCollectedRef.current;

    const { stats: updatedStats, results } = await recordRunResult(
      finalDistance,
      finalStamps
    );

    onStatsUpdated(updatedStats);
    setRunResults(results);
  }, [onStatsUpdated]);

  // Main game loop
  useEffect(() => {
    if (gameState !== 'playing') {
      if (animFrameIdRef.current) {
        cancelAnimationFrame(animFrameIdRef.current);
        animFrameIdRef.current = null;
      }
      return;
    }

    let active = true;

    const loop = (timestamp: number) => {
      if (!active) return;

      if (lastTimeRef.current === null) {
        lastTimeRef.current = timestamp;
      }
      const dt = (timestamp - lastTimeRef.current) / 1000;
      lastTimeRef.current = timestamp;

      // Update plane physics
      const updatedPlane = updatePlanePhysics(
        planeRef.current,
        dt,
        isHoldingLiftRef.current,
        screenHeight
      );
      planeRef.current = updatedPlane;

      // Calculate forward scroll speed
      const currentSpeed = Math.min(
        PHYSICS.MAX_SPEED,
        PHYSICS.BASE_SPEED + distanceRef.current * PHYSICS.SPEED_GROWTH
      );
      const moveDistance = currentSpeed * dt;

      // Update distance (in meters: 60px = ~1m)
      distanceRef.current += moveDistance / 60;

      // Move obstacles
      const updatedObstacles: Obstacle[] = [];
      let lastObstacleX = 0;

      for (const obs of obstaclesRef.current) {
        const newX = obs.x - moveDistance;
        if (newX > -obs.width) {
          updatedObstacles.push({ ...obs, x: newX });
          if (newX > lastObstacleX) lastObstacleX = newX;
        }
      }

      // Spawn new obstacles as needed
      if (lastObstacleX < screenWidth + 240) {
        const nextX = Math.max(screenWidth + 80, lastObstacleX + 260 + Math.random() * 80);
        const newObs = generateObstacle(nextX, screenHeight, distanceRef.current);
        updatedObstacles.push(newObs);

        // Spawn stamp inside the obstacle gap or near it
        const stampY = (newObs.topGap + newObs.bottomGap) / 2;
        collectiblesRef.current.push(generateStamp(nextX + 27, stampY));
      }
      obstaclesRef.current = updatedObstacles;

      // Move and check collectibles
      const updatedCollectibles: Collectible[] = [];
      for (const stamp of collectiblesRef.current) {
        const newX = stamp.x - moveDistance;
        if (newX > -40) {
          if (!stamp.collected && checkStampCollection(planeRef.current, { ...stamp, x: newX })) {
            stampsCollectedRef.current += 1;
            soundService.playChime();
            hapticService.collect();
            addFloatingIndicator(planeRef.current.x + 20, planeRef.current.y, '+1');
            updatedCollectibles.push({ ...stamp, x: newX, collected: true });
          } else {
            updatedCollectibles.push({ ...stamp, x: newX });
          }
        }
      }
      collectiblesRef.current = updatedCollectibles;

      // Check collision with obstacles or ground
      let hasCollided = false;
      for (const obs of updatedObstacles) {
        if (checkCollision(planeRef.current, obs, screenHeight)) {
          hasCollided = true;
          break;
        }
      }

      // Check ground collision
      if (planeRef.current.y + PHYSICS.PLANE_HEIGHT >= screenHeight - 14) {
        hasCollided = true;
      }

      if (hasCollided) {
        triggerGameOver();
        return;
      }

      // Publish clean frame state to React for pure rendering
      setFrameData({
        plane: updatedPlane,
        obstacles: updatedObstacles,
        collectibles: updatedCollectibles,
        distance: distanceRef.current,
        stamps: stampsCollectedRef.current,
      });

      animFrameIdRef.current = requestAnimationFrame(loop);
    };

    animFrameIdRef.current = requestAnimationFrame(loop);

    return () => {
      active = false;
      if (animFrameIdRef.current) {
        cancelAnimationFrame(animFrameIdRef.current);
        animFrameIdRef.current = null;
      }
    };
  }, [gameState, screenHeight, screenWidth, triggerGameOver]);

  // AppState listener: pause when backgrounded
  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextState: AppStateStatus) => {
      if (nextState !== 'active' && gameState === 'playing') {
        setGameState('paused');
      }
    });

    return () => {
      subscription.remove();
    };
  }, [gameState]);

  // Android hardware/gesture back press handler
  useEffect(() => {
    const onBackPress = () => {
      if (gameState === 'playing') {
        setGameState('paused');
        return true;
      }
      if (gameState === 'paused' || gameState === 'ready' || gameState === 'gameOver') {
        onHome();
        return true;
      }
      return false;
    };

    const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress);
    return () => subscription.remove();
  }, [gameState, onHome]);

  // Touch handlers
  const handlePressIn = () => {
    if (gameState === 'ready') {
      soundService.playLift();
      hapticService.tap();
      planeRef.current.vy = Math.min(planeRef.current.vy, PHYSICS.LIFT_IMPULSE);
      isHoldingLiftRef.current = true;
      lastTimeRef.current = null;
      setGameState('playing');
      return;
    }

    if (gameState === 'playing') {
      soundService.playLift();
      hapticService.tap();
      planeRef.current.vy = Math.min(planeRef.current.vy, PHYSICS.LIFT_IMPULSE);
      isHoldingLiftRef.current = true;
    }
  };

  const handlePressOut = () => {
    isHoldingLiftRef.current = false;
  };

  const { plane, obstacles, collectibles, distance, stamps } = frameData;

  return (
    <TouchableWithoutFeedback onPressIn={handlePressIn} onPressOut={handlePressOut}>
      <View style={styles.container}>
        {/* Parallax Illustrated World */}
        <ParallaxBackground
          width={screenWidth}
          height={screenHeight}
          scrollOffset={distance * 60}
        />

        {/* Obstacles Layer */}
        {obstacles.map((obs) => (
          <ObstacleView
            key={obs.id}
            obstacle={obs}
            totalHeight={screenHeight}
          />
        ))}

        {/* Collectible Postage Stamps */}
        {collectibles.map((stamp) => {
          if (stamp.collected) return null;
          return (
            <View
              key={stamp.id}
              style={{
                position: 'absolute',
                left: stamp.x - stamp.radius,
                top: stamp.y - stamp.radius,
              }}
              pointerEvents="none"
            >
              <PostageStampView size={24} highlighted />
            </View>
          );
        })}

        {/* Paper Airplane */}
        <View
          style={[
            styles.planeWrapper,
            {
              transform: [
                { translateX: plane.x },
                { translateY: plane.y },
                { rotate: `${plane.rotation}deg` },
              ],
            },
          ]}
          pointerEvents="none"
        >
          <PaperPlaneView width={PHYSICS.PLANE_WIDTH} height={PHYSICS.PLANE_HEIGHT} />
        </View>

        {/* Floating "+1" indicators */}
        {floatingIndicators.map((ind) => (
          <Animated.View
            key={ind.id}
            style={[
              styles.floatingInd,
              {
                left: ind.x,
                top: ind.y,
                opacity: ind.opacity,
                transform: [{ translateY: ind.translateY }],
              },
            ]}
            pointerEvents="none"
          >
            <Text style={styles.floatingIndText}>{ind.text}</Text>
          </Animated.View>
        ))}

        {/* Ready / Tap to Start Overlay */}
        {gameState === 'ready' && (
          <View style={styles.readyOverlay} pointerEvents="none">
            <View style={styles.readyCard}>
              <Text style={styles.readyTag}>CLEAR SKIES AHEAD</Text>
              <Text style={styles.readyTitle}>Tap to Launch</Text>
              <Text style={styles.readyHint}>Press & hold to climb • Release to glide</Text>
            </View>
          </View>
        )}

        {/* In-Game HUD (Distance, Stamps, Pause button) */}
        {gameState === 'playing' && (
          <HUD
            distance={distance}
            stamps={stamps}
            onPause={() => setGameState('paused')}
          />
        )}

        {/* Pause Modal */}
        <PauseModal
          visible={gameState === 'paused'}
          distance={distance}
          stamps={stamps}
          onResume={() => {
            lastTimeRef.current = null;
            setGameState('playing');
          }}
          onRestart={handleResetRun}
          onHome={onHome}
        />

        {/* Game Over Postcard Modal */}
        {gameState === 'gameOver' && runResults && (
          <GameOverCard
            results={runResults}
            stats={stats}
            onFlyAgain={handleResetRun}
            onOpenPostcards={onOpenPostcards}
            onHome={onHome}
          />
        )}
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: PALETTE.paper,
    overflow: 'hidden',
  },
  planeWrapper: {
    position: 'absolute',
    left: 0,
    top: 0,
    width: PHYSICS.PLANE_WIDTH,
    height: PHYSICS.PLANE_HEIGHT,
    zIndex: 30,
  },
  readyOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 40,
  },
  readyCard: {
    backgroundColor: 'rgba(255, 253, 248, 0.94)',
    borderRadius: 8,
    borderWidth: 1.2,
    borderColor: PALETTE.paperBorder,
    paddingVertical: 14,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  readyTag: {
    fontFamily: FONTS.serif,
    fontSize: 9,
    letterSpacing: 1.5,
    color: PALETTE.airmailBlue,
    fontWeight: '700',
    marginBottom: 4,
  },
  readyTitle: {
    fontFamily: FONTS.serif,
    fontSize: 22,
    fontWeight: '700',
    color: PALETTE.inkNavy,
    marginBottom: 4,
  },
  readyHint: {
    fontFamily: FONTS.serif,
    fontSize: 12,
    color: PALETTE.inkMuted,
    fontStyle: 'italic',
  },
  floatingInd: {
    position: 'absolute',
    zIndex: 50,
  },
  floatingIndText: {
    fontFamily: FONTS.serif,
    fontSize: 16,
    fontWeight: '700',
    color: PALETTE.vintageCoral,
  },
});

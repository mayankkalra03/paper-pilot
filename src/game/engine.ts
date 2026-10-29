import { PlaneState, Obstacle, Collectible, ObstacleType } from '../types/game';

export const PHYSICS = {
  GRAVITY: 850,         // px/s^2 downward pull
  LIFT_IMPULSE: -340,   // px/s initial lift impulse on tap
  LIFT_HOLD: -520,      // px/s^2 continuous lift when holding
  MAX_VY_DOWN: 480,     // px/s terminal fall velocity
  MAX_VY_UP: -380,      // px/s terminal climb velocity
  BASE_SPEED: 180,      // px/s world scroll speed
  SPEED_GROWTH: 0.035,  // speed increase per meter flown
  MAX_SPEED: 320,       // maximum speed cap
  PLANE_WIDTH: 54,
  PLANE_HEIGHT: 46,
  HITBOX_INSET: 10,      // forgiving hitbox
};

export function createInitialPlane(screenHeight: number): PlaneState {
  return {
    x: 80,
    y: screenHeight * 0.42,
    vy: 0,
    rotation: 0,
  };
}

export function updatePlanePhysics(
  plane: PlaneState,
  dt: number,
  isHoldingLift: boolean,
  screenHeight: number
): PlaneState {
  const safeDt = Math.min(0.05, Math.max(0.001, dt));

  let vy = plane.vy;
  if (isHoldingLift) {
    vy += PHYSICS.LIFT_HOLD * safeDt;
  } else {
    vy += PHYSICS.GRAVITY * safeDt;
  }

  // Clamp vertical velocity
  vy = Math.max(PHYSICS.MAX_VY_UP, Math.min(PHYSICS.MAX_VY_DOWN, vy));

  let y = plane.y + vy * safeDt;

  // Ceiling clamp
  if (y < 12) {
    y = 12;
    vy = Math.max(0, vy);
  }

  // Calculate plane tilt angle based on velocity
  // vy < 0 means climbing (tilt up, negative angle)
  // vy > 0 means descending (tilt down, positive angle)
  const targetRotation = vy < 0
    ? Math.max(-24, (vy / Math.abs(PHYSICS.MAX_VY_UP)) * 24)
    : Math.min(32, (vy / PHYSICS.MAX_VY_DOWN) * 32);

  // Smooth lerp for rotation
  const rotation = plane.rotation + (targetRotation - plane.rotation) * Math.min(1, safeDt * 12);

  return {
    ...plane,
    y,
    vy,
    rotation,
  };
}

const OBSTACLE_TYPES: ObstacleType[] = ['cloud', 'steeples', 'pencil', 'kite', 'weathervane'];

export function generateObstacle(
  spawnX: number,
  screenHeight: number,
  distanceFlown: number
): Obstacle {
  // Gap size gradually reduces from 200 down to minimum 145 based on distance
  const gapSize = Math.max(145, 205 - (distanceFlown * 0.05));
  
  // Safe margins from screen top and bottom
  const minTopMargin = 60;
  const maxTopMargin = screenHeight - gapSize - 60;
  
  // Center of gap variation
  const topGap = Math.floor(minTopMargin + Math.random() * (maxTopMargin - minTopMargin));
  const bottomGap = topGap + gapSize;

  const type = OBSTACLE_TYPES[Math.floor(Math.random() * OBSTACLE_TYPES.length)];

  return {
    id: `obs_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    x: spawnX,
    width: 54,
    type,
    topGap,
    bottomGap,
    passed: false,
  };
}

export function generateStamp(spawnX: number, targetY: number): Collectible {
  return {
    id: `stamp_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    x: spawnX,
    y: targetY,
    radius: 14,
    collected: false,
    value: 1,
  };
}

export function checkCollision(plane: PlaneState, obstacle: Obstacle, screenHeight: number): boolean {
  // Hitbox with forgiving inset
  const inset = PHYSICS.HITBOX_INSET;
  const pLeft = plane.x + inset;
  const pRight = plane.x + PHYSICS.PLANE_WIDTH - inset;
  const pTop = plane.y + inset;
  const pBottom = plane.y + PHYSICS.PLANE_HEIGHT - inset;

  // Ground collision check
  if (pBottom >= screenHeight - 20) {
    return true;
  }

  // Obstacle horizontal bounds
  const obsLeft = obstacle.x;
  const obsRight = obstacle.x + obstacle.width;

  // If plane is within horizontal span of the obstacle
  if (pRight > obsLeft && pLeft < obsRight) {
    // Collides with top obstacle
    if (pTop < obstacle.topGap) {
      return true;
    }
    // Collides with bottom obstacle
    if (pBottom > obstacle.bottomGap) {
      return true;
    }
  }

  return false;
}

export function checkStampCollection(plane: PlaneState, stamp: Collectible): boolean {
  if (stamp.collected) return false;

  const pCenterX = plane.x + PHYSICS.PLANE_WIDTH / 2;
  const pCenterY = plane.y + PHYSICS.PLANE_HEIGHT / 2;

  // Stamp collection detection radius
  const dx = pCenterX - stamp.x;
  const dy = pCenterY - stamp.y;
  const distanceSq = dx * dx + dy * dy;

  // Effective pickup radius is 32px
  return distanceSq < 32 * 32;
}

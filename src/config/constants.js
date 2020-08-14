export const BLOCK_SIZE = 1;
export const ROAD_WIDTH = BLOCK_SIZE * 11;
export const ROAD_HEIGHT = ROAD_WIDTH * 2;

export const MAX_FPS = 60;
export const SCENE_FOV = 90;
export const SCENE_FIRST_PLANE = 0.1;
export const SCENE_SECOND_PLANE = 100;

export const MIN_SPEED = 3;
export const MAX_SPEED = 40;
export const ACCELERATION_PER_TICK = 50;
export const ROAD_SPEED_FACTOR = 1;

export const ZERO_POSITION = {
  x: -1 * BLOCK_SIZE,
  y: -6.5 * BLOCK_SIZE,
  z: 0,
};

export const MIN_LEFT_POSITION = -5 * BLOCK_SIZE;
export const MAX_RIGHT_POSITION = 3 * BLOCK_SIZE;
export const TOP_POSITION = { x: -1 * BLOCK_SIZE, y: ROAD_HEIGHT, z: 0 };
export const DELETE_POSITION = -11 * BLOCK_SIZE;

export const SCORE_FACTOR = 10;

export const STATUS_SPEED_FACTOR = 3;

export const ENEMIES_TO_DISTANCE = 30;
export const ENEMIES_SPAWN_TIMEOUT = 500;

export const HI_SCORE_STORAGE_KEY = 'HI_SCORE_STORAGE_KEY';

import Car2D from './Car2D.js';
import * as constants from 'config/constants';
import * as types from 'config/object-types';
import { getRandomItem } from 'utils/math';

export const createCar = ({
  type,
  color,
  position = constants.ZERO_POSITION,
} = {}) => {
  const car = new Car2D({ type, color });
  car.mesh.position.set(position.x, position.y, position.z);
  return car;
};

export const createPlayerCar = () =>
  createCar({
    type: types.TYPE_PLAYER,
    color: types.DEFAULT_PLAYER_COLOR,
    position: { x: 0.0, y: -8.5 * constants.BLOCK_SIZE, z: 0.0 },
  });

export const createEnemyCar = () =>
  createCar({
    type: types.TYPE_ENEMY_CAR,
    color: getRandomItem(types.CAR_COLORS),
    position: { x: 0.0, y: constants.TOP_POSITION, z: 0.0 },
  });

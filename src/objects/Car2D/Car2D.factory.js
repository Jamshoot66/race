import Car2D from './Car2D.js';
import * as constants from 'config/constants';
import * as types from 'config/object-types';
import { getRandomItem } from 'utils/math';

export const createCar = ({
  type,
  color,
  position = constants.ZERO_POSITION,
  speed = 0,
} = {}) => {
  const car = new Car2D({ type, color, speed });
  car.mesh.position.set(position.x, position.y, position.z);
  return car;
};

export const createPlayerCar = () =>
  createCar({
    type: types.TYPE_PLAYER,
    color: types.DEFAULT_PLAYER_COLOR,
  });

export const createEnemyCar = (speed = 0) =>
  createCar({
    type: types.TYPE_ENEMY_CAR,
    color: getRandomItem(types.CAR_COLORS),
    position: constants.TOP_POSITION,
    speed,
  });

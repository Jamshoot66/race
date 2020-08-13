/**
 * @description get random number in range [min; max)
 * @param {number} min
 * @param {number} max
 * @return {number}
 */
export const randomInt = (min, max) =>
  Math.floor(Math.random() * (max - min)) + min;

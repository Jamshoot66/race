/**
 * @description get random number in range [min; max)
 * @param {number} min
 * @param {number} max
 * @return {number}
 */
export const randomInt = (min, max) =>
  Math.floor(Math.random() * (max - min)) + min;

/**
 * @description get random array item
 * @param {array} array
 * @return {*} random array item
 */
export const getRandomItem = (array) => array[randomInt(2, array.length)];

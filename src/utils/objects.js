/**
 * @description generate an combined object
 * @param {[[number]]} template - array of arrays of numbers.
 *  Each number is id of material array
 * @param {function} geometry function, that constructs and
 *  returns three.js geometry
 * @usage ```javascript
 *
 * const generatedCar = this.generateObject(
 *    [
 *      [0, 2, 0],
 *      [1, 2, 1],
 *      [0, 2, 0],
 *      [1, 0, 1],
 *    ],
 *   () => new THREE.PlaneGeometry(1, 1)
 *  );
 ```
 */
export const generateObject = (template = [[]], geometry) => {
  const mergedObject = new THREE.Geometry();
  template.forEach((line, lineIndex) => {
    line.forEach((element, rowIndex) => {
      if (!element) return;
      const block = geometry();
      block.translate(rowIndex, -lineIndex, 0);
      mergedObject.merge(block, block.matrix, element - 1);
    });
  });

  return mergedObject;
};

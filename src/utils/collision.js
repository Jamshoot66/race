import RenderableObject from 'objects/RenderableObject';

/**
 * @description computes AABB transformed into object position
 * @param {RenderableObject} object
 * @return {Box3|undefined}
 */
export const getTransformedAABB = (object) => {
  if (!(object instanceof RenderableObject)) return;
  const box = new THREE.Box3();
  object.mesh.geometry.computeBoundingBox();
  box.copy(object.mesh.geometry.boundingBox).translate(object.mesh.position);
  return box;
};

/**
 * @description computes intersection between to objects in Box3 representation
 * @param {RenderableObject} firstObject
 * @param {RenderableObject} secondObject
 * @return {Box3|undefined}
 */
export const getCollisionBox = (firstObject, secondObject) => {
  if (
    !(firstObject instanceof RenderableObject) ||
    !(secondObject instanceof RenderableObject)
  )
    return;

  const first = getTransformedAABB(firstObject);
  const second = getTransformedAABB(secondObject);
  return first?.intersect(second);
};

/**
 * @description 2d collision detection
 * @param {RenderableObject} firstObject
 * @param {RenderableObject} secondObject
 * @return {boolean|undefined} true if objects have collided
 */
export const isCollided = (firstObject, secondObject) => {
  if (
    !(firstObject instanceof RenderableObject) ||
    !(secondObject instanceof RenderableObject)
  )
    return;
  const box = getCollisionBox(firstObject, secondObject);
  const intersectionSquare = (box.max.x - box.min.x) * (box.max.y - box.min.y);
  return intersectionSquare !== 0 && intersectionSquare !== Infinity;
};

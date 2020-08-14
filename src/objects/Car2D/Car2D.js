import RenderableObject from 'objects/RenderableObject';
import * as constants from 'config/constants';
import { generateObject } from 'utils/objects';

export default class Car2D extends RenderableObject {
  constructor({ type = 'Car2D', color = '0xFFFFFF', speed = 0 } = {}) {
    super(type);

    this.speed = speed;
    const texture = new THREE.TextureLoader().load('textures/brick.png');

    const wheelMaterial = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      map: texture,
    });

    const bodyMaterial = new THREE.MeshStandardMaterial({
      color,
      map: texture,
    });
    const materials = [wheelMaterial, bodyMaterial];

    const generatedCar = generateObject(
      [
        [0, 2, 0],
        [1, 2, 1],
        [0, 2, 0],
        [1, 0, 1],
      ],
      () => new THREE.PlaneGeometry(constants.BLOCK_SIZE, constants.BLOCK_SIZE)
    );
    this.mesh = new THREE.Mesh(generatedCar, materials);
  }

  moveLeft = () => {
    if (this.mesh.position.x > constants.MIN_LEFT_POSITION)
      this.mesh.translateX(-constants.BLOCK_SIZE);
  };

  moveRight = () => {
    if (this.mesh.position.x < constants.MAX_RIGHT_POSITION)
      this.mesh.translateX(constants.BLOCK_SIZE);
  };

  moveByRelativeSpeed = (deltaTime, playerSpeed) => {
    const speedFactor = 1;
    const dy = -((playerSpeed - this.speed) * speedFactor * deltaTime) / 1000;
    this.mesh.translateY(dy);
  };

  update = (deltaTime, payload = {}) => {
    const { playerSpeed = 0 } = payload;
    this.moveByRelativeSpeed(deltaTime, playerSpeed);
  };
}

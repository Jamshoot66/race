import RenderableObject from 'objects/RenderableObject';
import * as constants from 'config/constants';
import * as types from 'config/object-types';

export default class Road extends RenderableObject {
  constructor() {
    super(types.TYPE_ROAD);

    const { THREE } = window;

    this.texture = new THREE.TextureLoader().load('textures/brick.png');
    this.texture.wrapS = THREE.RepeatWrapping;
    this.texture.wrapT = THREE.RepeatWrapping;

    const roadWidth = constants.ROAD_WIDTH;
    const roadHeight = constants.ROAD_HEIGHT;
    const blockSize = constants.BLOCK_SIZE;
    this.texture.repeat.set(roadWidth / blockSize, roadHeight / blockSize);

    this.material = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      opacity: 0.3,
      transparent: true,
      depthWrite: true,
      map: this.texture,
    });

    this.geometry = new THREE.PlaneGeometry(roadWidth, roadHeight, 1, 1);
    this.mesh = new THREE.Mesh(this.geometry, this.material);
    this.mesh.translateZ(-0.0001);

    this.textureYOffset = 0;
    this.speed = 0;
  }

  update = (deltaTime = 0, payload = { speed: 0 }) => {
    const speedFactor = constants.ROAD_SPEED_FACTOR;
    const { playerSpeed } = payload;
    this.speed = playerSpeed;
    this.textureYOffset += (this.speed * speedFactor * deltaTime) / 1000;
    this.texture.offset.set(0, this.textureYOffset);
  };
}

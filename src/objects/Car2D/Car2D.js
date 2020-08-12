import RenderableObject from 'objects/RenderableObject';
import * as constants from 'config/constants';

export default class Car2D extends RenderableObject {
  constructor({ type = 'Car2D', color = '0xFFFFFF' } = {}) {
    super(type);
    const { THREE } = window;

    const wheelTexture = new THREE.TextureLoader().load('textures/brick.png');

    const bodyTexture = new THREE.TextureLoader().load('textures/brick.png');
    bodyTexture.wrapS = THREE.RepeatWrapping;
    bodyTexture.wrapT = THREE.RepeatWrapping;
    bodyTexture.repeat.set(1, 3);

    const wheelMaterial = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      map: wheelTexture,
    });
    const bodyMaterial = new THREE.MeshStandardMaterial({
      color,
      map: bodyTexture,
    });
    const materials = [wheelMaterial, bodyMaterial];

    const wheelSize = [constants.BLOCK_SIZE, constants.BLOCK_SIZE];
    const wheelFL = new THREE.PlaneGeometry(...wheelSize);
    wheelFL.translate(-constants.BLOCK_SIZE, constants.BLOCK_SIZE, 0);

    const wheelFR = new THREE.PlaneGeometry(...wheelSize);
    wheelFR.translate(constants.BLOCK_SIZE, constants.BLOCK_SIZE, 0);

    const wheelBL = new THREE.PlaneGeometry(...wheelSize);
    wheelBL.translate(-constants.BLOCK_SIZE, -constants.BLOCK_SIZE, 0);

    const wheelBR = new THREE.PlaneGeometry(...wheelSize);
    wheelBR.translate(constants.BLOCK_SIZE, -constants.BLOCK_SIZE, 0);

    const bodySize = [constants.BLOCK_SIZE, constants.BLOCK_SIZE * 3];
    const body = new THREE.PlaneGeometry(...bodySize);
    body.translate(0, constants.BLOCK_SIZE, 0);

    const car = new THREE.Geometry();
    car.merge(wheelFL);
    car.merge(wheelFR);
    car.merge(wheelBL);
    car.merge(wheelBR);
    car.merge(body, body.matrix, 1);

    this.mesh = new THREE.Mesh(car, materials);

  }
  
  moveLeft = () => {
    this.mesh.translateX(-constants.BLOCK_SIZE);
  }
  
  moveRight = () => {
    this.mesh.translateX(constants.BLOCK_SIZE);
  }
}

import RenderableObject from 'objects/RenderableObject';
import * as constants from 'config/constants';
import * as types from 'config/types';
import { generateObject } from 'utils/objects';

export default class Car3D extends RenderableObject {

  constructor() {
    super('Car3D');
    const texture = new THREE.TextureLoader().load('textures/brick.png');

    const bodyMaterial = new THREE.MeshStandardMaterial({
      color: types.DEFAULT_PLAYER_COLOR,
      map: texture,
    });

    const wheelMaterial = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      map: texture,
    });

    const neonTexture = new THREE.TextureLoader().load('textures/neon.png');
    const neonMaterial = new THREE.MeshPhongMaterial({
      map: neonTexture,
      color: types.NEON_COLOR,
      emissive: types.NEON_EMISSIVE_COLOR,
      transparent: true,
      opacity: 0.7,
      depthWrite: true,
    });

    const body = generateObject(
      [
        [0, 1, 0],
        [0, 1, 0],
        [0, 1, 0],
        [0, 0, 0],
      ],
      () =>
        new THREE.BoxGeometry(
          constants.BLOCK_SIZE,
          constants.BLOCK_SIZE,
          constants.BLOCK_SIZE
        )
    );

    this.wheelMeshFL = this.createBlock(wheelMaterial);
    this.wheelMeshFL.translateY(-1);

    this.wheelMeshFR = this.createBlock(wheelMaterial);
    this.wheelMeshFR.translateY(-1);
    this.wheelMeshFR.translateX(2);

    this.wheelMeshBL = this.createBlock(wheelMaterial);
    this.wheelMeshBL.translateY(-3);

    this.wheelMeshBR = this.createBlock(wheelMaterial);
    this.wheelMeshBR.translateY(-3);
    this.wheelMeshBR.translateX(2);

    const bodyMesh = new THREE.Mesh(body, bodyMaterial);

    const neon = this.createNeon(neonMaterial);
    neon.translateZ(-0.6);
    neon.translateY(-1.1);
    neon.translateX(1);

    this.mesh = new THREE.Group();
    this.mesh.add(this.wheelMeshFL);
    this.mesh.add(this.wheelMeshFR);
    this.mesh.add(this.wheelMeshBL);
    this.mesh.add(this.wheelMeshBR);
    this.mesh.add(bodyMesh);
    this.mesh.add(neon);
  }

  createBlock = (material) => {
    return new THREE.Mesh(
      new THREE.BoxGeometry(
        constants.BLOCK_SIZE,
        constants.BLOCK_SIZE,
        constants.BLOCK_SIZE
      ),
      material
    );
  };

  createNeon = (material) => {
    return new THREE.Mesh(
      new THREE.PlaneGeometry(
        constants.BLOCK_SIZE * 2,
        constants.BLOCK_SIZE * 4
      ),
      material
    );
  };

  update = () => {
    const angle = -0.065;
    this.wheelMeshFL.rotateX(angle);
    this.wheelMeshFR.rotateX(angle);
    this.wheelMeshBR.rotateX(angle);
    this.wheelMeshBL.rotateX(angle);
  };
}

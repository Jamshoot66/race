import RenderableObject from 'objects/RenderableObject';
import * as constants from 'config/constants';
import * as types from 'config/types';
import { generateObject } from 'utils/objects';

export default class Car3D extends RenderableObject {
  angle = 0;

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

    this.mesh = new THREE.Group();
    this.mesh.add(this.wheelMeshFL);
    this.mesh.add(this.wheelMeshFR);
    this.mesh.add(this.wheelMeshBL);
    this.mesh.add(this.wheelMeshBR);
    this.mesh.add(bodyMesh);
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

  update = (deltaTime) => {
    const angle = -0.1;
    this.wheelMeshFL.rotateX(angle);
    this.wheelMeshFR.rotateX(angle);
    this.wheelMeshBR.rotateX(angle);
    this.wheelMeshBL.rotateX(angle);
  };
}

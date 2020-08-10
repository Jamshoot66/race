import { RenderableObject } from './object';

export class TestObject extends RenderableObject {
  geometry = new THREE.BoxGeometry(3, 1, 1);
  material = new THREE.MeshPhongMaterial({
    color: 0xffff00,
    depthWrite: false,
  });
  mesh = new THREE.Mesh(this.geometry, this.material);

  constructor() {
    super();
  }

  update = (deltaTime) => {
    this.mesh.rotation.x += 0.02;
    this.mesh.rotation.y += 0.01;
  };
}

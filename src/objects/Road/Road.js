import RenderableObject from 'objects/RenderableObject';

export default class Road extends RenderableObject {
  constructor() {
    super('road');

    const { THREE } = window;

    this.texture = new THREE.TextureLoader().load('textures/brick.png');
    this.texture.wrapS = THREE.RepeatWrapping;
    this.texture.wrapT = THREE.RepeatWrapping;

    const roadWidth = 5;
    const roadHeight = roadWidth * 2;
    const blockSize = 0.5;
    this.texture.repeat.set(roadWidth / blockSize, roadHeight / blockSize);
    
    this.material = new THREE.MeshStandardMaterial({
      color: 0xFFFFFF,
      opacity: 0.3,
      transparent: true,
      depthWrite: true,
      map: this.texture,
    });

    this.geometry = new THREE.PlaneGeometry(roadWidth, roadHeight, 1, 1);
    this.mesh = new THREE.Mesh(this.geometry, this.material);
  
    this.textureYOffset = 0;
    this.speed = 0;
  }

  update = (deltaTime = 0) => {
    const speedFactor = 2;
    this.textureYOffset += this.speed * speedFactor * deltaTime/1000;
    this.texture.offset.set(0, this.textureYOffset);
  };
}

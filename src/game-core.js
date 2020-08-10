class GameCore {
  constructor(props) {
    const { containerId } = props;
    this.maxFPS = 60;
    const THREE = window.THREE;
    const renderContainer = document.getElementById(containerId);
    const renderTarget = document.querySelector(`#${containerId} > canvas`);

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(75, 1 / 2, 0.1, 100);

    this.renderer = new THREE.WebGLRenderer({
      canvas: renderTarget,
    });

    this.renderer.setSize(
      renderContainer.clientWidth,
      renderContainer.clientHeight
    );
    this.renderer.setClearColor('#4D5041');

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
    directionalLight.position.set(0, 0, 1);
    this.scene.add(directionalLight);

    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshPhongMaterial({
      color: 0x00ff00,
      depthWrite: false,
    });
    this.cube = new THREE.Mesh(geometry, material);
    this.scene.add(this.cube);

    this.camera.position.z = 5;

    this.render();
  }

  render = () => {
    const startTime = Date.now();
    const { renderer } = this;
    this.cube.rotation.x += 0.01;
    this.cube.rotation.y += 0.01;

    renderer.render(this.scene, this.camera);
    const elapsedTime = Date.now() - startTime;
    const nextRenderDelay = Math.max(1000 / this.maxFPS - elapsedTime, 0);
    setTimeout(() => requestAnimationFrame(this.render), nextRenderDelay);
  };
}

export default GameCore;

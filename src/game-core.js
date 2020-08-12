import Road from 'objects/Road';
import Car2D from 'objects/Car2D';
import * as actions from 'config/actions';
import * as constants from 'config/constants';

class GameCore {
  objects = [];
  _speed = constants.MIN_SPEED;
  maxSpeed = constants.MAX_SPEED;

  set speed(value) {
    this._speed = Math.min(value, this.maxSpeed);
  }

  get speed() {
    return this._speed;
  }

  constructor(props) {
    const { containerId } = props;
    this.maxFPS = constants.MAX_FPS;
    const THREE = window.THREE;
    const renderContainer = document.getElementById(containerId);
    const renderTarget = document.querySelector(`#${containerId} > canvas`);

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(
      constants.SCENE_FOV,
      renderTarget.clientHeight / renderTarget.clientWidth,
      constants.SCENE_FIRST_PLANE,
      constants.SCENE_SECOND_PLANE
    );
    this.camera.position.z = constants.ROAD_WIDTH;

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

    const road = new Road();
    this.addObject(road);

    this.PlayerCar = new Car2D({ type: 'Player', color: 0xf62c1b });
    this.addObject(this.PlayerCar);


    this.render();
  }

  addObject = (renderableObject) => {
    this.objects.push(renderableObject);
    this.scene.add(renderableObject.mesh);
  };

  processPlayerControl = (event) => {
    switch (event) {
      case actions.MOVE_LEFT: {
        this.PlayerCar.moveLeft();
        break;
      }
      case actions.MOVE_RIGHT: {
        this.PlayerCar.moveRight();
        break;
      }
      default:
        return;
    }
  };

  render = () => {
    const startTime = Date.now();
    this.speed += 0.1;

    this.objects.forEach((object) => {
      if (object.type === 'road') object.speed = this.speed;
      object.update(startTime - this.lastFrameTime || 0);
    });

    const { renderer } = this;

    renderer.render(this.scene, this.camera);
    this.lastFrameTime = Date.now();
    const elapsedTime = this.lastFrameTime - startTime;
    const nextRenderDelay = Math.max(1000 / this.maxFPS - elapsedTime, 0);
    setTimeout(() => requestAnimationFrame(this.render), nextRenderDelay);
  };
}

export default GameCore;

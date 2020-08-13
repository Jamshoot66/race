import Road from 'objects/Road';
import { createPlayerCar, createEnemyCar } from 'objects/Car2D';
import * as actions from 'config/actions';
import * as constants from 'config/constants';
import * as types from 'config/object-types';
import { isCollided } from 'utils/collision';

class GameCore {
  objects = [];
  _speed = constants.MIN_SPEED;
  maxSpeed = constants.MAX_SPEED;
  score = 0;
  distance = 0;

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

    this.playerCar = createPlayerCar();

    this.addObject(this.playerCar);
    this.addObject(createEnemyCar(this.speed / 2, -4));

    this.gameCycle();
  }

  addObject = (renderableObject) => {
    this.objects.push(renderableObject);
    this.scene.add(renderableObject.mesh);
  };

  processPlayerControl = (event) => {
    switch (event) {
      case actions.MOVE_LEFT: {
        this.playerCar.moveLeft();
        break;
      }
      case actions.MOVE_RIGHT: {
        this.playerCar.moveRight();
        break;
      }
      default:
        return;
    }
  };

  updateScore = (elapsedTime) => {
    this.distance += (this.speed * elapsedTime) / 1000;
    this.score = Math.floor(constants.SCORE_FACTOR * this.distance);
  };

  getObjectUpdatePayload = (object) => {
    switch (object.type) {
      case types.TYPE_ROAD:
        return { playerSpeed: this.speed };
      case types.TYPE_ENEMY_CAR:
        return {
          playerSpeed: this.speed,
        };
      default:
        return {};
    }
  };

  updateObjects = (elapsedTime) => {
    this.objects.forEach((object) => {
      const payload = this.getObjectUpdatePayload(object);
      object.update(elapsedTime, payload);
    });
  };

  checkCollisions = () => {
    const collidable = this.objects.filter((object) =>
      types.COLLIDABLE_OBJECTS.includes(object.type)
    );

    return collidable.some((object) => isCollided(this.playerCar, object));
  };

  gameCycle = () => {
    const startTime = Date.now();
    const elapsedTime = startTime - this.lastFrameTime || 0;
    this.updateScore(elapsedTime);

    this.speed += constants.ACCELERATION_PER_TICK;

    this.updateObjects(elapsedTime);
    if (this.checkCollisions()) {
      console.log('game-over');
    }
    this.render();

    this.lastFrameTime = Date.now();
    const frameTime = this.lastFrameTime - startTime;
    const nextRenderDelay = Math.max(1000 / this.maxFPS - frameTime, 0);
    setTimeout(() => requestAnimationFrame(this.gameCycle), nextRenderDelay);
  };

  render = () => {
    const { renderer } = this;
    renderer.render(this.scene, this.camera);
  };
}

export default GameCore;

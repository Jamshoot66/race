import Road from 'objects/Road';
import { createPlayerCar, createEnemyCar } from 'objects/Car2D';
import * as actions from 'config/actions';
import * as constants from 'config/constants';
import * as types from 'config/object-types';
import { isCollided } from 'utils/collision';
import { randomInt } from 'utils/math';

class GameCore {
  objects = [];
  _speed = constants.MIN_SPEED;
  maxSpeed = constants.MAX_SPEED;
  score = 0;
  distance = 0;
  lastEnemySpawn = 0;

  set speed(value) {
    this._speed = Math.min(value, this.maxSpeed);
  }

  get speed() {
    return this._speed;
  }

  constructor(props) {
    const { containerId } = props;
    this.maxFPS = constants.MAX_FPS;
    this.renderContainer = document.getElementById(containerId);
    this.renderTarget = document.querySelector(`#${containerId} > canvas`);

    this.setGameState(types.GAME_STATE_PLAY);
    this.initCamera();

    this.updateCycle();
  }

  onCanvasResize = () => this.initCamera();

  initCamera = () => {
    this.renderTarget.style.width = `${this.renderContainer.clientWidth}px`;
    this.renderTarget.style.height = `${this.renderContainer.clientHeight}px`;

    this.camera = new THREE.PerspectiveCamera(
      constants.SCENE_FOV,
      this.renderTarget.clientWidth / this.renderTarget.clientHeight,
      constants.SCENE_FIRST_PLANE,
      constants.SCENE_SECOND_PLANE
    );
    this.camera.position.z = constants.ROAD_WIDTH;
  };

  initWebGL = () => {
    this.scene = new THREE.Scene();
    this.initCamera();

    this.renderer = new THREE.WebGLRenderer({
      canvas: this.renderTarget,
    });

    this.renderer.setSize(
      this.renderContainer.clientWidth,
      this.renderContainer.clientHeight
    );
    this.renderer.setClearColor('#4D5041');

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
    directionalLight.position.set(0, 0, 1);
    this.scene.add(directionalLight);
  };

  setInitialPlayScene = () => {
    this.addObject(new Road());

    this.playerCar = createPlayerCar();
    this.addObject(this.playerCar);
  };

  initPlayScene = () => {
    this.initWebGL();
    this.setInitialPlayScene();
  };

  setGameState = (gameState) => {
    this.gameState = gameState;
    switch (gameState) {
      // case types.GAME_STATE_MENU:
      case types.GAME_STATE_PLAY: {
        this.initPlayScene();
        break;
      }
      case types.GAME_STATE_END: {
        this.initPlayScene();
        break;
      }
      default:
        return;
    }
  };

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

  generateEnemy = () => {
    if (Date.now() - this.lastEnemySpawn > constants.ENEMIES_SPAWN_TIMEOUT) {
      this.lastEnemySpawn = Date.now();
      this.addObject(createEnemyCar(this.speed / 2, randomInt(-4, 5)));
    }
  };

  playCycle = () => {
    const startTime = Date.now();
    const elapsedTime = startTime - this.lastFrameTime || 0;
    this.updateScore(elapsedTime);

    this.speed += constants.ACCELERATION_PER_TICK;

    this.updateObjects(elapsedTime);
    if (this.checkCollisions()) {
      console.log('game-over');
      this.setGameState(types.GAME_STATE_PLAY);
    }

    if (Math.floor(this.distance) % constants.ENEMIES_TO_DISTANCE === 0)
      this.generateEnemy();
    this.render();

    this.lastFrameTime = Date.now();
    const frameTime = this.lastFrameTime - startTime;
    const nextRenderDelay = Math.max(1000 / this.maxFPS - frameTime, 0);
    setTimeout(() => requestAnimationFrame(this.playCycle), nextRenderDelay);
  };

  updateCycle = () => {
    switch (this.gameState) {
      // case types.GAME_STATE_MENU:
      case types.GAME_STATE_PLAY: {
        return this.playCycle();
      }
      case types.GAME_STATE_END: {
        return this.playCycle();
      }
      default:
        return;
    }
  };

  render = () => {
    const { renderer } = this;
    renderer.render(this.scene, this.camera);
  };
}

export default GameCore;

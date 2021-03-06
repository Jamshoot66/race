import Road from 'objects/Road';
import { createPlayerCar, createEnemyCar } from 'objects/Car2D';
import Car3D from 'objects/Car3D';
import * as actions from 'config/actions';
import * as constants from 'config/constants';
import * as types from 'config/types';
import { isCollided } from 'utils/collision';
import { randomInt, degToRad } from 'utils/math';

class GameCore {
  objects = [];
  _speed = constants.MIN_SPEED;
  maxSpeed = constants.MAX_SPEED;
  _score = 0;
  distance = 0;
  lastEnemySpawn = 0;

  set speed(value) {
    this._speed = Math.min(value, this.maxSpeed);
    this.onInfoUpdated({ speed: this._speed });
  }

  get speed() {
    return this._speed;
  }

  set score(value) {
    this._score = value;
    this.onInfoUpdated({ score: value });
  }

  get score() {
    return this._score;
  }

  set gameState(value) {
    this._gameState = value;
    this.onInfoUpdated({ gameState: value });
  }

  get gameState() {
    return this._gameState;
  }

  constructor(props) {
    const { containerId, onInfoUpdated } = props;
    this.onInfoUpdated = onInfoUpdated;
    this.maxFPS = constants.MAX_FPS;
    this.renderContainer = document.getElementById(containerId);
    this.renderTarget = document.querySelector(`#${containerId} > canvas`);

    this.setGameState(types.GAME_STATE_MENU);
    this.initCamera();

    this.updateCycle();
  }

  onStartNewGame = () => {
    this.setGameState(types.GAME_STATE_PLAY);
  };

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

  setInitialMenuScene = () => {
    const road = new Road();
    this.speed = constants.MIN_SPEED;
    road.mesh.translateZ(-0.5);
    this.addObject(road);
    const menuCar = new Car3D();
    this.scene.position.set(-0.2, -0.5, 7.5);
    this.scene.rotation.set(degToRad(-80), degToRad(-10), degToRad(135));
    this.addObject(menuCar);
  };

  setInitialPlayScene = () => {
    this.addObject(new Road());
    this.score = 0;
    this.distance = 0;
    this.playerCar = createPlayerCar();
    this.addObject(this.playerCar);
  };

  initMenuScene = () => {
    this.objects = [];
    this.initWebGL();
    this.setInitialMenuScene();
  };

  initPlayScene = () => {
    this.objects = [];
    this.initWebGL();
    this.setInitialPlayScene();
  };

  setGameState = (gameState) => {
    this.gameState = gameState;
    switch (gameState) {
      case types.GAME_STATE_END:
      case types.GAME_STATE_MENU: {
        this.initMenuScene();
        break;
      }
      case types.GAME_STATE_PLAY: {
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

  processGamePlayControl = (event) => {
    switch (event) {
      case actions.MOVE_LEFT: {
        this.playerCar.moveLeft();
        break;
      }
      case actions.MOVE_RIGHT: {
        this.playerCar.moveRight();
        break;
      }
      case actions.DECELERATE: {
        this.speed -= this.accelerate();
        break;
      }
      case actions.ACCELERATE: {
        this.speed += this.accelerate()*5;
        break;
      }
      default:
        return;
    }
  };

  processMenuControl = (event) => {
    switch (event) {
      case actions.START_NEW_GAME: {
        this.onStartNewGame();
        break;
      }
      default:
        return;
    }
  };

  processControl = (event) => {
    switch (this.gameState) {
      case types.GAME_STATE_PLAY:
        this.processGamePlayControl(event);
        break;

      case types.GAME_STATE_MENU:
      case types.GAME_STATE_END:
        this.processMenuControl(event);
        break;

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
      this.addObject(
        createEnemyCar(
          this.speed / 2,
          randomInt(
            constants.MIN_LEFT_POSITION,
            constants.MAX_RIGHT_POSITION + 1
          )
        )
      );
    }
  };

  cleanUselessObjects = () => {
    const objectsToDelete = this.objects.filter(
      (object) =>
        object.type === types.TYPE_ENEMY_CAR &&
        object.mesh.position.y < constants.DELETE_POSITION
    );

    objectsToDelete?.forEach((object) => {
      const instance = this.scene.getObjectById(object.mesh.id);
      this.scene.remove(instance);
    });

    this.objects = this.objects.filter(
      (object) => !objectsToDelete.includes(object)
    );
  };

  menuCycle = () => {
    const startTime = Date.now();
    const elapsedTime = startTime - this.lastFrameTime || 0;
    this.updateObjects(elapsedTime);
    this.render();

    this.lastFrameTime = Date.now();
    const frameTime = this.lastFrameTime - startTime;
    const nextRenderDelay = Math.max(1000 / this.maxFPS - frameTime, 0);
    setTimeout(() => requestAnimationFrame(this.updateCycle), nextRenderDelay);
  };

  accelerate = () => (1 / this.speed ** 3) * constants.ACCELERATION_PER_TICK;

  playCycle = () => {
    const startTime = Date.now();
    const elapsedTime = startTime - this.lastFrameTime || 0;
    this.updateScore(elapsedTime);
    this.cleanUselessObjects();

    this.speed += this.accelerate();

    this.updateObjects(elapsedTime);
    if (this.checkCollisions()) {
      console.log('game-over');
      this.setGameState(types.GAME_STATE_END);
    }

    if (Math.floor(this.distance) % constants.ENEMIES_TO_DISTANCE === 0)
      this.generateEnemy();
    this.render();

    this.lastFrameTime = Date.now();
    const frameTime = this.lastFrameTime - startTime;
    const nextRenderDelay = Math.max(1000 / this.maxFPS - frameTime, 0);
    setTimeout(() => requestAnimationFrame(this.updateCycle), nextRenderDelay);
  };

  updateCycle = () => {
    switch (this.gameState) {
      case types.GAME_STATE_END:
      case types.GAME_STATE_MENU: {
        return this.menuCycle();
      }
      case types.GAME_STATE_PLAY: {
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

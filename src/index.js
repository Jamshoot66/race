import './scss/index.scss';
import Core from './game-core.js';
import * as actions from 'config/actions';

window.addEventListener('load', () => {
  const core = new Core({
    containerId: 'screen-render-container',
  });

  window.addEventListener('resize', core.onCanvasResize);

  document.getElementById('btn-left').addEventListener('click', () => {
    core.processPlayerControl(actions.MOVE_LEFT);
  });

  document.getElementById('btn-right').addEventListener('click', () => {
    core.processPlayerControl(actions.MOVE_RIGHT);
  });

  window.addEventListener('keydown', (e) => {
    switch (e.code) {
      case 'ArrowLeft': {
        core.processPlayerControl(actions.MOVE_LEFT);
        break;
      }
      case 'ArrowRight': {
        core.processPlayerControl(actions.MOVE_RIGHT);
        break;
      }
      default:
        return;
    }
  });
});

import './scss/index.scss';
import Core from './game-core.js';
import * as actions from 'config/actions';
import { updateStatusBar, initHighScore } from './status-bar';

window.addEventListener('load', () => {
  const core = new Core({
    containerId: 'screen-render-container',
    onInfoUpdated: updateStatusBar,
  });

  initHighScore();

  window.addEventListener('resize', core.onCanvasResize);

  document.getElementById('btn-left').addEventListener('click', () => {
    core.processControl(actions.MOVE_LEFT);
  });

  document.getElementById('btn-right').addEventListener('click', () => {
    core.processControl(actions.MOVE_RIGHT);
  });

  window.addEventListener('keydown', (e) => {
    switch (e.code) {
      case 'ArrowLeft': {
        core.processControl(actions.MOVE_LEFT);
        break;
      }
      case 'ArrowRight': {
        core.processControl(actions.MOVE_RIGHT);
        break;
      }
      case 'Space': {
        core.processControl(actions.START_NEW_GAME);
        break;
      }
      default:
        return;
    }
  });
});

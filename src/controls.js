import * as actions from './config/actions';

export const initControls = (core) => {
  document.getElementById('btn-audio').addEventListener('click', () => {
    const player = document.getElementById('player');
    player.paused ? player.play() : player.pause();
  });

  document.getElementById('btn-left').addEventListener('click', () => {
    core.processControl(actions.MOVE_LEFT);
  });

  document.getElementById('btn-right').addEventListener('click', () => {
    core.processControl(actions.MOVE_RIGHT);
  });

  document.getElementById('btn-up').addEventListener('click', () => {
    core.processControl(actions.ACCELERATE);
  });

  document.getElementById('btn-down').addEventListener('click', () => {
    core.processControl(actions.DECELERATE);
  });

  document.getElementById('btn-space').addEventListener('click', () => {
    core.processControl(actions.START_NEW_GAME);
  });

  window.addEventListener('keydown', (e) => {
    switch (e.code) {
      case 'ArrowUp': {
        core.processControl(actions.ACCELERATE);
        break;
      }
      case 'ArrowDown': {
        core.processControl(actions.DECELERATE);
        break;
      }
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
};

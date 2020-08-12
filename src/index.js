import './scss/index.scss';
import Core from './game-core.js';

window.addEventListener('load', () => {
  const core = new Core({
    containerId: 'screen-render-container',
  });

  document.getElementById('btn-left').addEventListener('click', () => {
    core.processPlayerControl('moveLeft');
  });

  document.getElementById('btn-right').addEventListener('click', () => {
    core.processPlayerControl('moveRight');
  });

  window.addEventListener('keydown', (e) => {
    switch (e.code) {
      case 'ArrowLeft': {
        core.processPlayerControl('moveLeft');
        break;
      }
      case 'ArrowRight': {
        core.processPlayerControl('moveRight');
        break;
      }
      default:
        return;
    }
  });
});

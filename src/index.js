import './scss/index.scss';
import Core from './game-core.js';
import { updateStatusBar, initHighScore } from './status-bar';
import { initControls } from './controls';

window.addEventListener('load', () => {
  const core = new Core({
    containerId: 'screen-render-container',
    onInfoUpdated: updateStatusBar,
  });

  initHighScore();
  initControls(core);

  window.addEventListener('resize', core.onCanvasResize);
});

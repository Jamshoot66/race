import './scss/index.scss';
import Core from './game-core.js';

window.addEventListener('load', () => {
  const core = new Core({
    containerId: 'screen-render-container',
  });
});
console.log('initial');

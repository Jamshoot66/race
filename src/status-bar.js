import * as constants from 'config/constants';
import * as types from 'config/types';

export const updateHiScore = (score) => {
  const scoreBlock = document.getElementById('hi-score');
  scoreBlock.querySelector('.info-block__value').innerHTML = score;
  localStorage.setItem(constants.HI_SCORE_STORAGE_KEY, score);
};

export const initHighScore = () => {
  const hiScore = localStorage.getItem(constants.HI_SCORE_STORAGE_KEY) || 999;
  updateHiScore(hiScore);
};

export const updateScore = (score) => {
  const scoreBlock = document.getElementById('score');
  scoreBlock.classList.remove('hidden');
  scoreBlock.querySelector('.info-block__value').innerHTML = score;
};

export const updateDescription = (header, description) => {
  const scoreBlock = document.getElementById('description');
  scoreBlock.querySelector('.info-block__header').innerHTML = header;
  scoreBlock.querySelector('.info-block__value').innerHTML = description;
};

const savedStatus = {
  score: 0,
  gameState: null,
};

export const updateStatusBar = ({
  score = null,
  gameState = null,
  speed = null,
} = {}) => {
  if (score !== null) {
    savedStatus.score = score;
    updateScore(score);
  }

  if (gameState !== null) savedStatus.gameState = gameState;
  if (savedStatus.gameState === types.GAME_STATE_PLAY && speed !== null) {
    updateDescription(
      'Speed',
      `${(speed * constants.STATUS_SPEED_FACTOR).toFixed(1)} mph`
    );
  }

  if (savedStatus.gameState !== types.GAME_STATE_PLAY)
    updateDescription('', 'Press <span class="blink">SPACE</span> to start');

  if (savedStatus.gameState === types.GAME_STATE_END) {
    const lastHiScore = localStorage.getItem(constants.HI_SCORE_STORAGE_KEY);
    if (lastHiScore < savedStatus.score) updateHiScore(savedStatus.score);
  }
};

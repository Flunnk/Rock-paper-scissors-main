import './style.css';
import { Game } from './game/Game.js';
import { UIManager } from './ui/UIManager.js';

document.addEventListener('DOMContentLoaded', () => {
  const game = new Game();
  const ui = new UIManager(game);
  ui.init();
});

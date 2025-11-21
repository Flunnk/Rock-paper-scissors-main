import { SoundManager } from '../utils/SoundManager.js';

export class UIManager {
  constructor(game) {
    this.game = game;
    this.sound = new SoundManager();
    this.app = document.getElementById('app');
    this.currentView = 'home'; // home, config, game, result
    this.p1Selection = null;
    this.p2Selection = null;
    this.countdownInterval = null;
  }

  init() {
    this.renderHome();
    this.setupGlobalListeners();
    // Add keyboard listener for game controls
    document.addEventListener('keydown', (e) => this.handleInput(e));
  }

  setupGlobalListeners() {
    // Sound toggle button
    const soundToggleBtn = document.getElementById('btn-sound-toggle');
    if (soundToggleBtn) {
      soundToggleBtn.addEventListener('click', () => {
        const isEnabled = this.sound.toggle();
        const icon = soundToggleBtn.querySelector('.icon');
        if (icon) {
          icon.textContent = isEnabled ? '🔊' : '🔇';
        }
        soundToggleBtn.classList.toggle('muted', !isEnabled);
      });
    }

    // Global button hover and click sounds using event delegation
    document.addEventListener('mouseover', (e) => {
      if (e.target.tagName === 'BUTTON' && !e.target.id.includes('sound-toggle')) {
        this.sound.play('hover');
      }
    });

    document.addEventListener('click', (e) => {
      if (e.target.tagName === 'BUTTON' || e.target.closest('button')) {
        this.sound.play('click');
      }
    });
  }

  handleInput(e) {
    const key = e.key.toLowerCase();

    // Player 1 Controls (Q, W, E)
    if (['q', 'w', 'e'].includes(key)) {
      const map = { q: 'rock', w: 'paper', e: 'scissors' };
      this.p1Selection = map[key];

      // Only show visual feedback in single-player mode to prevent cheating
      if (this.game.mode === '1player') {
        this.triggerKeyboardButtonAnimation('p1', key);
      }

      this.updateGameStatus();
    }

    // Player 2 Controls (I, O, P) or Arrows
    if (this.game.mode === '2player') {
      if (['i', 'o', 'p'].includes(key)) {
        const map = { i: 'rock', o: 'paper', p: 'scissors' };
        this.p2Selection = map[key];
        // No visual feedback in 2-player mode to prevent cheating
        this.updateGameStatus();
      }
    }
  }

  triggerKeyboardButtonAnimation(player, key) {
    // Find the button element corresponding to the pressed key
    const keyMap = { q: 0, w: 1, e: 2, i: 0, o: 1, p: 2 };
    const buttonIndex = keyMap[key];

    if (buttonIndex !== undefined) {
      const playerControls = document.querySelector(`.${player}-controls`);
      if (playerControls) {
        const buttons = playerControls.querySelectorAll('.key-btn');
        if (buttons[buttonIndex]) {
          // Remove selected class from all buttons in this player's group
          buttons.forEach(btn => btn.classList.remove('selected'));
          // Add selected class to the pressed button
          buttons[buttonIndex].classList.add('selected');
        }
      }
    }
  }

  updateGameStatus() {
    // Visual feedback that a selection was made
    if (this.game.mode === '1player') {
      if (this.p1Selection) {
        this.showSelectionFeedback('p1');
      }
    } else {
      if (this.p1Selection) this.showSelectionFeedback('p1');
      if (this.p2Selection) this.showSelectionFeedback('p2');
    }
    // Do NOT call resolveRound here. Wait for timer.
  }

  showSelectionFeedback(player) {
    const controls = document.querySelector(`.${player}-controls`);
    if (controls) controls.classList.add('ready');
  }

  renderHome() {
    this.currentView = 'home';
    this.app.innerHTML = `
      <div class="view home fade-in">
        <h1 class="title">Piedra, Papel o Tijeras<br><span class="subtitle">Ultimate</span></h1>
        <div class="hero-images">
          <img src="/images/rock-emoji.png" alt="Rock" class="floating delay-1">
          <img src="/images/paper-emoji.png" alt="Paper" class="floating delay-2">
          <img src="/images/scissors-emoji.png" alt="Scissors" class="floating delay-3">
        </div>
        <div class="menu">
          <button id="btn-1p" class="btn-primary">Un Jugador</button>
          <button id="btn-2p" class="btn-secondary">Dos Jugadores</button>
        </div>
      </div>
    `;

    document.getElementById('btn-1p').addEventListener('click', () => {
      this.game.setMode('1player');
      this.renderConfig();
    });
    document.getElementById('btn-2p').addEventListener('click', () => {
      this.game.setMode('2player');
      this.renderConfig();
    });
  }

  renderConfig() {
    this.currentView = 'config';
    const config = this.game.config;
    this.app.innerHTML = `
      <div class="view config fade-in">
        <h2>Configuración</h2>
        <div class="config-group">
          <label>Rondas:</label>
          <select id="rounds-select">
            <option value="0" ${config.rounds === 0 ? 'selected' : ''}>Infinito</option>
            <option value="1" ${config.rounds === 1 ? 'selected' : ''}>1</option>
            <option value="3" ${config.rounds === 3 ? 'selected' : ''}>3</option>
            <option value="5" ${config.rounds === 5 ? 'selected' : ''}>5</option>
            <option value="10" ${config.rounds === 10 ? 'selected' : ''}>10</option>
          </select>
        </div>
        <div class="config-group">
          <label>Tiempo (Countdown):</label>
          <select id="timer-select">
            <option value="1" ${config.timer === 1 ? 'selected' : ''}>1s</option>
            <option value="3" ${config.timer === 3 ? 'selected' : ''}>3s</option>
            <option value="5" ${config.timer === 5 ? 'selected' : ''}>5s</option>
            <option value="10" ${config.timer === 10 ? 'selected' : ''}>10s</option>
            <option value="15" ${config.timer === 15 ? 'selected' : ''}>15s</option>
            <option value="20" ${config.timer === 20 ? 'selected' : ''}>20s</option>
          </select>
        </div>
        <div class="actions">
          <button id="btn-back" class="btn-secondary">Regresar</button>
          <button id="btn-start" class="btn-primary">Jugar</button>
        </div>
      </div>
    `;

    document.getElementById('btn-back').addEventListener('click', () => this.renderHome());
    document.getElementById('btn-start').addEventListener('click', () => {
      const rounds = parseInt(document.getElementById('rounds-select').value);
      const timer = parseInt(document.getElementById('timer-select').value);
      this.game.saveConfig({ rounds, timer });
      this.startGame();
    });
  }

  startGame() {
    this.currentView = 'game';
    this.p1Selection = null;
    this.p2Selection = null;

    this.app.innerHTML = `
      <div class="view game fade-in">
        <div class="scoreboard">
          <div class="score-box p1">
            <span class="label">Jugador 1</span>
            <span class="value">${this.game.mode === '1player' ? this.game.score.wins : this.game.score.p1Wins}</span>
          </div>
          <div class="score-box p2">
            <span class="label">${this.game.mode === '1player' ? 'Computadora' : 'Jugador 2'}</span>
            <span class="value">${this.game.mode === '1player' ? this.game.score.losses : this.game.score.p2Wins}</span>
          </div>
        </div>
        
        <div class="game-area">
          <div id="countdown" class="countdown">${this.game.config.timer}</div>
          <div id="instruction" class="instruction">¡Prepárate!</div>
        </div>

        <div class="controls-hint">
          <div class="p1-controls">
            <p>Jugador 1</p>
            <div class="keys">
              <button class="key-btn" data-player="p1" data-choice="rock">Q</button>
              <button class="key-btn" data-player="p1" data-choice="paper">W</button>
              <button class="key-btn" data-player="p1" data-choice="scissors">E</button>
            </div>
          </div>
          ${this.game.mode === '2player' ? `
          <div class="p2-controls">
            <p>Jugador 2</p>
            <div class="keys">
              <button class="key-btn" data-player="p2" data-choice="rock">I</button>
              <button class="key-btn" data-player="p2" data-choice="paper">O</button>
              <button class="key-btn" data-player="p2" data-choice="scissors">P</button>
            </div>
          </div>
          ` : ''}
        </div>
      </div>
    `;

    this.startCountdown();
    this.setupKeyButtonListeners();
  }

  setupKeyButtonListeners() {
    const keyButtons = document.querySelectorAll('.key-btn');
    keyButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const player = e.target.dataset.player;
        const choice = e.target.dataset.choice;

        if (player === 'p1') {
          this.p1Selection = choice;
          this.triggerButtonAnimation(e.target);
        } else if (player === 'p2') {
          this.p2Selection = choice;
          this.triggerButtonAnimation(e.target);
        }

        this.updateGameStatus();
      });
    });
  }

  triggerButtonAnimation(button) {
    // Remove animation from all buttons in the same group
    const parent = button.closest('.keys');
    parent.querySelectorAll('.key-btn').forEach(btn => {
      btn.classList.remove('selected');
    });

    // Add animation to clicked button
    button.classList.add('selected');
  }

  startCountdown() {
    let count = this.game.config.timer;
    const el = document.getElementById('countdown');
    const instr = document.getElementById('instruction');

    el.innerText = count;
    instr.innerText = "¡Elige tu arma!";
    this.sound.play('countdown');

    this.countdownInterval = setInterval(() => {
      count--;
      if (count > 0) {
        el.innerText = count;
        this.sound.play('countdown');
      } else {
        clearInterval(this.countdownInterval);
        el.innerText = "¡TIEMPO!";
        // Trigger resolution even if no selection (timeout)
        this.resolveRound();
      }
    }, 1000);
  }

  resolveRound() {
    clearInterval(this.countdownInterval);

    const result = this.game.playRound(this.p1Selection, this.p2Selection);

    if (this.game.isGameOver()) {
      this.renderFinalResult();
    } else {
      this.renderResult(result);
    }
  }

  renderFinalResult() {
    this.currentView = 'result';
    const score = this.game.score;
    let winner = '';

    if (this.game.mode === '1player') {
      if (score.wins > score.losses) winner = '¡Ganaste el Juego!';
      else if (score.losses > score.wins) winner = '¡Perdiste el Juego!';
      else winner = '¡Juego Empatado!';
    } else {
      if (score.p1Wins > score.p2Wins) winner = '¡Jugador 1 Gana el Juego!';
      else if (score.p2Wins > score.p1Wins) winner = '¡Jugador 2 Gana el Juego!';
      else winner = '¡Juego Empatado!';
    }

    // Sound Logic
    if (this.game.mode === '1player') {
      if (winner.includes('Ganaste')) this.sound.play('win');
      else if (winner.includes('Perdiste')) this.sound.play('lose');
      else this.sound.play('tie');
    } else {
      // 2 Player Mode: Always play win unless it's a tie
      if (winner.includes('Empatado')) this.sound.play('tie');
      else this.sound.play('win');
    }

    this.app.innerHTML = `
      <div class="view result fade-in">
        <h1 class="title pop-in">${winner}</h1>
        <div class="scoreboard final">
          <div class="score-box">
            <span class="label">P1</span>
            <span class="value updated">${this.game.mode === '1player' ? score.wins : score.p1Wins}</span>
          </div>
          <div class="score-box">
            <span class="label">P2</span>
            <span class="value updated">${this.game.mode === '1player' ? score.losses : score.p2Wins}</span>
          </div>
        </div>
        <div class="actions">
          <button id="btn-home" class="btn-primary pop-in" style="animation-delay: 0.5s">Menú Principal (Reset)</button>
          <button id="btn-save-exit" class="btn-secondary pop-in" style="animation-delay: 0.6s">Salir y Guardar</button>
        </div>
      </div>
    `;

    document.getElementById('btn-home').addEventListener('click', () => {
      this.game.resetScore();
      this.game.currentRound = 0;
      this.game.score = { wins: 0, losses: 0, ties: 0, p1Wins: 0, p2Wins: 0 };
      this.game.saveScore();
      this.renderHome();
    });

    document.getElementById('btn-save-exit').addEventListener('click', () => {
      this.renderHome();
    });
  }

  renderResult(result) {
    this.currentView = 'result';

    let resultText = '';
    let resultClass = '';

    if (this.game.mode === '1player') {
      if (result.result === 'p1') { resultText = '¡Ganaste!'; resultClass = 'win'; }
      else if (result.result === 'p2') { resultText = '¡Perdiste!'; resultClass = 'lose'; }
      else { resultText = '¡Empate!'; resultClass = 'tie'; }
    } else {
      if (result.result === 'p1') { resultText = '¡Jugador 1 Gana!'; resultClass = 'win'; }
      else if (result.result === 'p2') { resultText = '¡Jugador 2 Gana!'; resultClass = 'win'; }
      else { resultText = '¡Empate!'; resultClass = 'tie'; }
    }

    // Sound Logic
    if (this.game.mode === '1player') {
      if (result.result === 'p1') this.sound.play('win');
      else if (result.result === 'p2') this.sound.play('lose');
      else this.sound.play('tie');
    } else {
      // 2 Player Mode: Always play win unless it's a tie
      if (result.result === 'tie') this.sound.play('tie');
      else this.sound.play('win');
    }

    // Handle null moves for display
    const p1Img = result.p1Move ? `/images/${result.p1Move}-emoji.png` : ''; // Or a timeout icon?
    const p2Img = result.opponentMove ? `/images/${result.opponentMove}-emoji.png` : '';

    // If timeout, maybe show text instead of image?
    const p1Display = result.p1Move ? `<img src="${p1Img}" class="${result.result === 'p1' ? 'winner' : ''}">` : '<div class="timeout-text">⏳</div>';
    const p2Display = result.opponentMove ? `<img src="${p2Img}" class="${result.result === 'p2' ? 'winner' : ''}">` : '<div class="timeout-text">⏳</div>';

    this.app.innerHTML = `
      <div class="view result fade-in">
        <h2 class="${resultClass} pop-in">${resultText}</h2>
        
        <div class="showdown">
          <div class="fighter p1 slide-left">
            ${p1Display}
            <span>Jugador 1</span>
          </div>
          <div class="vs">VS</div>
          <div class="fighter p2 slide-right">
            ${p2Display}
            <span>${this.game.mode === '1player' ? 'Computadora' : 'Jugador 2'}</span>
          </div>
        </div>

        <div class="actions">
          <button id="btn-next" class="btn-primary pop-in" style="animation-delay: 0.3s">Siguiente Ronda</button>
          <button id="btn-home" class="btn-secondary pop-in" style="animation-delay: 0.5s">Menú Principal (Reset)</button>
          <button id="btn-save-exit" class="btn-secondary pop-in" style="animation-delay: 0.6s">Salir y Guardar</button>
        </div>
      </div>
    `;

    document.getElementById('btn-next').addEventListener('click', () => this.startGame());

    document.getElementById('btn-home').addEventListener('click', () => {
      this.game.resetScore();
      this.game.currentRound = 0;
      this.game.score = { wins: 0, losses: 0, ties: 0, p1Wins: 0, p2Wins: 0 };
      this.game.saveScore();
      this.renderHome();
    });

    document.getElementById('btn-save-exit').addEventListener('click', () => {
      this.renderHome();
    });
  }
}

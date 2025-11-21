(function(){const s=document.createElement("link").relList;if(s&&s.supports&&s.supports("modulepreload"))return;for(const i of document.querySelectorAll('link[rel="modulepreload"]'))n(i);new MutationObserver(i=>{for(const o of i)if(o.type==="childList")for(const a of o.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&n(a)}).observe(document,{childList:!0,subtree:!0});function t(i){const o={};return i.integrity&&(o.integrity=i.integrity),i.referrerPolicy&&(o.referrerPolicy=i.referrerPolicy),i.crossOrigin==="use-credentials"?o.credentials="include":i.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function n(i){if(i.ep)return;i.ep=!0;const o=t(i);fetch(i.href,o)}})();class c{constructor(){this.score=this.loadScore(),this.config=this.loadConfig(),this.mode="1player",this.currentRound=0,this.history=[]}loadScore(){const s=localStorage.getItem("rps_score");return s?JSON.parse(s):{wins:0,losses:0,ties:0,p1Wins:0,p2Wins:0}}saveScore(){localStorage.setItem("rps_score",JSON.stringify(this.score))}loadConfig(){const s=localStorage.getItem("rps_config");return s?JSON.parse(s):{rounds:0,timer:3}}saveConfig(s){this.config={...this.config,...s},localStorage.setItem("rps_config",JSON.stringify(this.config))}resetScore(){this.score={wins:0,losses:0,ties:0,p1Wins:0,p2Wins:0},this.saveScore()}setMode(s){this.mode=s}getComputerMove(){const s=["rock","paper","scissors"],t=Math.floor(Math.random()*3);return s[t]}determineWinner(s,t){return!s&&!t?"tie":s?t?s===t?"tie":s==="rock"&&t==="scissors"||s==="paper"&&t==="rock"||s==="scissors"&&t==="paper"?"p1":"p2":"p1":"p2"}playRound(s,t=null){let n=t;this.mode==="1player"&&(n=this.getComputerMove());const i=this.determineWinner(s,n);return this.mode==="1player"?i==="p1"?this.score.wins++:i==="p2"?this.score.losses++:this.score.ties++:i==="p1"?this.score.p1Wins++:i==="p2"?this.score.p2Wins++:this.score.ties++,this.saveScore(),this.currentRound++,{p1Move:s,opponentMove:n,result:i,score:this.score}}isGameOver(){return this.config.rounds>0&&this.currentRound>=this.config.rounds}}class d{constructor(){this.context=new(window.AudioContext||window.webkitAudioContext),this.enabled=!0}toggle(){return this.enabled=!this.enabled,this.enabled&&this.context.state==="suspended"&&this.context.resume(),this.enabled}play(s){if(this.enabled)switch(this.context.state==="suspended"&&this.context.resume(),s){case"hover":this.playTone(300,"sine",.05,.03);break;case"click":this.playTone(400,"sine",.05,.05);break;case"countdown":this.playTone(800,"triangle",.1,.1);break;case"fight":this.playTone(400,"sine",.1,.1);break;case"win":this.playMelody([523.25,659.25,783.99,1046.5],.1,"sine",.1);break;case"lose":this.playMelody([392,349.23,329.63,261.63],.2,"sine",.05);break;case"tie":this.playTone(200,"sine",.3,.1);break;case"pop":this.playTone(1e3,"sine",.1,.05);break}}playTone(s,t,n,i=.1){const o=this.context.createOscillator(),a=this.context.createGain();o.type=t,o.frequency.setValueAtTime(s,this.context.currentTime),a.gain.setValueAtTime(i,this.context.currentTime),a.gain.exponentialRampToValueAtTime(.001,this.context.currentTime+n),o.connect(a),a.connect(this.context.destination),o.start(),o.stop(this.context.currentTime+n)}playMelody(s,t,n="sine",i=.1){s.forEach((o,a)=>{setTimeout(()=>{this.playTone(o,n,t,i)},a*(t*1e3))})}}class p{constructor(s){this.game=s,this.sound=new d,this.app=document.getElementById("app"),this.currentView="home",this.p1Selection=null,this.p2Selection=null,this.countdownInterval=null}init(){this.renderHome(),this.setupGlobalListeners()}setupGlobalListeners(){document.addEventListener("keydown",t=>this.handleInput(t));const s=e.key.toLowerCase();if(["q","w","e"].includes(s)){const t={q:"rock",w:"paper",e:"scissors"};this.p1Selection=t[s],this.updateGameStatus()}if(this.game.mode==="2player"&&["i","o","p"].includes(s)){const t={i:"rock",o:"paper",p:"scissors"};this.p2Selection=t[s],this.updateGameStatus()}}updateGameStatus(){this.game.mode==="1player"?this.p1Selection&&this.showSelectionFeedback("p1"):(this.p1Selection&&this.showSelectionFeedback("p1"),this.p2Selection&&this.showSelectionFeedback("p2"))}showSelectionFeedback(s){const t=document.querySelector(`.${s}-controls`);t&&t.classList.add("ready")}renderHome(){this.currentView="home",this.app.innerHTML=`
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
    `,document.getElementById("btn-1p").addEventListener("click",()=>{this.game.setMode("1player"),this.renderConfig()}),document.getElementById("btn-2p").addEventListener("click",()=>{this.game.setMode("2player"),this.renderConfig()})}renderConfig(){this.currentView="config";const s=this.game.config;this.app.innerHTML=`
      <div class="view config fade-in">
        <h2>Configuración</h2>
        <div class="config-group">
          <label>Rondas:</label>
          <select id="rounds-select">
            <option value="0" ${s.rounds===0?"selected":""}>Infinito</option>
            <option value="1" ${s.rounds===1?"selected":""}>1</option>
            <option value="3" ${s.rounds===3?"selected":""}>3</option>
            <option value="5" ${s.rounds===5?"selected":""}>5</option>
            <option value="10" ${s.rounds===10?"selected":""}>10</option>
          </select>
        </div>
        <div class="config-group">
          <label>Tiempo (Countdown):</label>
          <select id="timer-select">
            <option value="3" ${s.timer===3?"selected":""}>3s</option>
            <option value="5" ${s.timer===5?"selected":""}>5s</option>
            <option value="1" ${s.timer===1?"selected":""}>1s</option>
          </select>
        </div>
        <div class="actions">
          <button id="btn-back" class="btn-secondary">Regresar</button>
          <button id="btn-start" class="btn-primary">Jugar</button>
        </div>
      </div>
    `,document.getElementById("btn-back").addEventListener("click",()=>this.renderHome()),document.getElementById("btn-start").addEventListener("click",()=>{const t=parseInt(document.getElementById("rounds-select").value),n=parseInt(document.getElementById("timer-select").value);this.game.saveConfig({rounds:t,timer:n}),this.startGame()})}startGame(){this.currentView="game",this.p1Selection=null,this.p2Selection=null,this.app.innerHTML=`
      <div class="view game fade-in">
        <div class="scoreboard">
          <div class="score-box p1">
            <span class="label">Jugador 1</span>
            <span class="value">${this.game.mode==="1player"?this.game.score.wins:this.game.score.p1Wins}</span>
          </div>
          <div class="score-box p2">
            <span class="label">${this.game.mode==="1player"?"Computadora":"Jugador 2"}</span>
            <span class="value">${this.game.mode==="1player"?this.game.score.losses:this.game.score.p2Wins}</span>
          </div>
        </div>
        
        <div class="game-area">
          <div id="countdown" class="countdown">${this.game.config.timer}</div>
          <div id="instruction" class="instruction">¡Prepárate!</div>
        </div>

        <div class="controls-hint">
          <div class="p1-controls">
            <p>Jugador 1</p>
            <div class="keys"><span>Q</span><span>W</span><span>E</span></div>
          </div>
          ${this.game.mode==="2player"?`
          <div class="p2-controls">
            <p>Jugador 2</p>
            <div class="keys"><span>I</span><span>O</span><span>P</span></div>
          </div>
          `:""}
        </div>
      </div>
    `,this.startCountdown()}startCountdown(){let s=this.game.config.timer;const t=document.getElementById("countdown"),n=document.getElementById("instruction");t.innerText=s,n.innerText="¡Elige tu arma!",this.sound.play("countdown"),this.countdownInterval=setInterval(()=>{s--,s>0?(t.innerText=s,this.sound.play("countdown")):(clearInterval(this.countdownInterval),t.innerText="¡TIEMPO!",this.resolveRound())},1e3)}resolveRound(){clearInterval(this.countdownInterval);const s=this.game.playRound(this.p1Selection,this.p2Selection);this.game.isGameOver()?this.renderFinalResult():this.renderResult(s)}renderFinalResult(){this.currentView="result";const s=this.game.score;let t="";this.game.mode==="1player"?s.wins>s.losses?t="¡Ganaste el Juego!":s.losses>s.wins?t="¡Perdiste el Juego!":t="¡Juego Empatado!":s.p1Wins>s.p2Wins?t="¡Jugador 1 Gana el Juego!":s.p2Wins>s.p1Wins?t="¡Jugador 2 Gana el Juego!":t="¡Juego Empatado!",this.game.mode==="1player"?t.includes("Ganaste")?this.sound.play("win"):t.includes("Perdiste")?this.sound.play("lose"):this.sound.play("tie"):t.includes("Empatado")?this.sound.play("tie"):this.sound.play("win"),this.app.innerHTML=`
      <div class="view result fade-in">
        <h1 class="title pop-in">${t}</h1>
        <div class="scoreboard final">
          <div class="score-box">
            <span class="label">P1</span>
            <span class="value updated">${this.game.mode==="1player"?s.wins:s.p1Wins}</span>
          </div>
          <div class="score-box">
            <span class="label">P2</span>
            <span class="value updated">${this.game.mode==="1player"?s.losses:s.p2Wins}</span>
          </div>
        </div>
        <div class="actions">
          <button id="btn-home" class="btn-primary pop-in" style="animation-delay: 0.5s">Menú Principal (Reset)</button>
          <button id="btn-save-exit" class="btn-secondary pop-in" style="animation-delay: 0.6s">Salir y Guardar</button>
        </div>
      </div>
    `,document.getElementById("btn-home").addEventListener("click",()=>{this.game.resetScore(),this.game.currentRound=0,this.game.score={wins:0,losses:0,ties:0,p1Wins:0,p2Wins:0},this.game.saveScore(),this.renderHome()}),document.getElementById("btn-save-exit").addEventListener("click",()=>{this.renderHome()})}renderResult(s){this.currentView="result";let t="",n="";this.game.mode==="1player"?s.result==="p1"?(t="¡Ganaste!",n="win"):s.result==="p2"?(t="¡Perdiste!",n="lose"):(t="¡Empate!",n="tie"):s.result==="p1"?(t="¡Jugador 1 Gana!",n="win"):s.result==="p2"?(t="¡Jugador 2 Gana!",n="win"):(t="¡Empate!",n="tie"),this.game.mode==="1player"?s.result==="p1"?this.sound.play("win"):s.result==="p2"?this.sound.play("lose"):this.sound.play("tie"):s.result==="tie"?this.sound.play("tie"):this.sound.play("win");const i=s.p1Move?`/images/${s.p1Move}-emoji.png`:"",o=s.opponentMove?`/images/${s.opponentMove}-emoji.png`:"",a=s.p1Move?`<img src="${i}" class="${s.result==="p1"?"winner":""}">`:'<div class="timeout-text">⏳</div>',l=s.opponentMove?`<img src="${o}" class="${s.result==="p2"?"winner":""}">`:'<div class="timeout-text">⏳</div>';this.app.innerHTML=`
      <div class="view result fade-in">
        <h2 class="${n} pop-in">${t}</h2>
        
        <div class="showdown">
          <div class="fighter p1 slide-left">
            ${a}
            <span>Jugador 1</span>
          </div>
          <div class="vs">VS</div>
          <div class="fighter p2 slide-right">
            ${l}
            <span>${this.game.mode==="1player"?"Computadora":"Jugador 2"}</span>
          </div>
        </div>

        <div class="actions">
          <button id="btn-next" class="btn-primary pop-in" style="animation-delay: 0.3s">Siguiente Ronda</button>
          <button id="btn-home" class="btn-secondary pop-in" style="animation-delay: 0.5s">Menú Principal (Reset)</button>
          <button id="btn-save-exit" class="btn-secondary pop-in" style="animation-delay: 0.6s">Salir y Guardar</button>
        </div>
      </div>
    `,document.getElementById("btn-next").addEventListener("click",()=>this.startGame()),document.getElementById("btn-home").addEventListener("click",()=>{this.game.resetScore(),this.game.currentRound=0,this.game.score={wins:0,losses:0,ties:0,p1Wins:0,p2Wins:0},this.game.saveScore(),this.renderHome()}),document.getElementById("btn-save-exit").addEventListener("click",()=>{this.renderHome()})}}document.addEventListener("DOMContentLoaded",()=>{const r=new c;new p(r).init()});

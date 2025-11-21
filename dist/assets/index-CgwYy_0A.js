(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const i of document.querySelectorAll('link[rel="modulepreload"]'))t(i);new MutationObserver(i=>{for(const n of i)if(n.type==="childList")for(const o of n.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&t(o)}).observe(document,{childList:!0,subtree:!0});function s(i){const n={};return i.integrity&&(n.integrity=i.integrity),i.referrerPolicy&&(n.referrerPolicy=i.referrerPolicy),i.crossOrigin==="use-credentials"?n.credentials="include":i.crossOrigin==="anonymous"?n.credentials="omit":n.credentials="same-origin",n}function t(i){if(i.ep)return;i.ep=!0;const n=s(i);fetch(i.href,n)}})();class l{constructor(){this.score=this.loadScore(),this.config=this.loadConfig(),this.mode="1player",this.currentRound=0,this.history=[]}loadScore(){const e=localStorage.getItem("rps_score");return e?JSON.parse(e):{wins:0,losses:0,ties:0,p1Wins:0,p2Wins:0}}saveScore(){localStorage.setItem("rps_score",JSON.stringify(this.score))}loadConfig(){const e=localStorage.getItem("rps_config");return e?JSON.parse(e):{rounds:0,timer:3}}saveConfig(e){this.config={...this.config,...e},localStorage.setItem("rps_config",JSON.stringify(this.config))}resetScore(){this.score={wins:0,losses:0,ties:0,p1Wins:0,p2Wins:0},this.saveScore()}setMode(e){this.mode=e}getComputerMove(){const e=["rock","paper","scissors"],s=Math.floor(Math.random()*3);return e[s]}determineWinner(e,s){return!e&&!s?"tie":e?s?e===s?"tie":e==="rock"&&s==="scissors"||e==="paper"&&s==="rock"||e==="scissors"&&s==="paper"?"p1":"p2":"p1":"p2"}playRound(e,s=null){let t=s;this.mode==="1player"&&(t=this.getComputerMove());const i=this.determineWinner(e,t);return this.mode==="1player"?i==="p1"?this.score.wins++:i==="p2"?this.score.losses++:this.score.ties++:i==="p1"?this.score.p1Wins++:i==="p2"?this.score.p2Wins++:this.score.ties++,this.saveScore(),this.currentRound++,{p1Move:e,opponentMove:t,result:i,score:this.score}}isGameOver(){return this.config.rounds>0&&this.currentRound>=this.config.rounds}}class c{constructor(){this.context=new(window.AudioContext||window.webkitAudioContext),this.enabled=!0}toggle(){return this.enabled=!this.enabled,this.enabled&&this.context.state==="suspended"&&this.context.resume(),this.enabled}play(e){if(this.enabled)switch(this.context.state==="suspended"&&this.context.resume(),e){case"hover":this.playTone(300,"sine",.05,.03);break;case"click":this.playTone(400,"sine",.05,.05);break;case"countdown":this.playTone(800,"triangle",.1,.1);break;case"fight":this.playTone(400,"sine",.1,.1);break;case"win":this.playMelody([523.25,659.25,783.99,1046.5],.1,"sine",.1);break;case"lose":this.playMelody([392,349.23,329.63,261.63],.2,"sine",.05);break;case"tie":this.playTone(200,"sine",.3,.1);break;case"pop":this.playTone(1e3,"sine",.1,.05);break}}playTone(e,s,t,i=.1){const n=this.context.createOscillator(),o=this.context.createGain();n.type=s,n.frequency.setValueAtTime(e,this.context.currentTime),o.gain.setValueAtTime(i,this.context.currentTime),o.gain.exponentialRampToValueAtTime(.001,this.context.currentTime+t),n.connect(o),o.connect(this.context.destination),n.start(),n.stop(this.context.currentTime+t)}playMelody(e,s,t="sine",i=.1){e.forEach((n,o)=>{setTimeout(()=>{this.playTone(n,t,s,i)},o*(s*1e3))})}}class d{constructor(e){this.game=e,this.sound=new c,this.app=document.getElementById("app"),this.currentView="home",this.p1Selection=null,this.p2Selection=null,this.countdownInterval=null}init(){this.renderHome(),this.setupGlobalListeners(),document.addEventListener("keydown",e=>this.handleInput(e))}setupGlobalListeners(){const e=document.getElementById("btn-sound-toggle");e&&e.addEventListener("click",()=>{const s=this.sound.toggle(),t=e.querySelector(".icon");t&&(t.textContent=s?"🔊":"🔇"),e.classList.toggle("muted",!s)}),document.addEventListener("mouseover",s=>{s.target.tagName==="BUTTON"&&!s.target.id.includes("sound-toggle")&&this.sound.play("hover")}),document.addEventListener("click",s=>{(s.target.tagName==="BUTTON"||s.target.closest("button"))&&this.sound.play("click")})}handleInput(e){const s=e.key.toLowerCase();if(["q","w","e"].includes(s)){const t={q:"rock",w:"paper",e:"scissors"};this.p1Selection=t[s],this.updateGameStatus()}if(this.game.mode==="2player"&&["i","o","p"].includes(s)){const t={i:"rock",o:"paper",p:"scissors"};this.p2Selection=t[s],this.updateGameStatus()}}updateGameStatus(){this.game.mode==="1player"?this.p1Selection&&this.showSelectionFeedback("p1"):(this.p1Selection&&this.showSelectionFeedback("p1"),this.p2Selection&&this.showSelectionFeedback("p2"))}showSelectionFeedback(e){const s=document.querySelector(`.${e}-controls`);s&&s.classList.add("ready")}renderHome(){this.currentView="home",this.app.innerHTML=`
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
    `,document.getElementById("btn-1p").addEventListener("click",()=>{this.game.setMode("1player"),this.renderConfig()}),document.getElementById("btn-2p").addEventListener("click",()=>{this.game.setMode("2player"),this.renderConfig()})}renderConfig(){this.currentView="config";const e=this.game.config;this.app.innerHTML=`
      <div class="view config fade-in">
        <h2>Configuración</h2>
        <div class="config-group">
          <label>Rondas:</label>
          <select id="rounds-select">
            <option value="0" ${e.rounds===0?"selected":""}>Infinito</option>
            <option value="1" ${e.rounds===1?"selected":""}>1</option>
            <option value="3" ${e.rounds===3?"selected":""}>3</option>
            <option value="5" ${e.rounds===5?"selected":""}>5</option>
            <option value="10" ${e.rounds===10?"selected":""}>10</option>
          </select>
        </div>
        <div class="config-group">
          <label>Tiempo (Countdown):</label>
          <select id="timer-select">
            <option value="3" ${e.timer===3?"selected":""}>3s</option>
            <option value="5" ${e.timer===5?"selected":""}>5s</option>
            <option value="1" ${e.timer===1?"selected":""}>1s</option>
          </select>
        </div>
        <div class="actions">
          <button id="btn-back" class="btn-secondary">Regresar</button>
          <button id="btn-start" class="btn-primary">Jugar</button>
        </div>
      </div>
    `,document.getElementById("btn-back").addEventListener("click",()=>this.renderHome()),document.getElementById("btn-start").addEventListener("click",()=>{const s=parseInt(document.getElementById("rounds-select").value),t=parseInt(document.getElementById("timer-select").value);this.game.saveConfig({rounds:s,timer:t}),this.startGame()})}startGame(){this.currentView="game",this.p1Selection=null,this.p2Selection=null,this.app.innerHTML=`
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
    `,this.startCountdown()}startCountdown(){let e=this.game.config.timer;const s=document.getElementById("countdown"),t=document.getElementById("instruction");s.innerText=e,t.innerText="¡Elige tu arma!",this.sound.play("countdown"),this.countdownInterval=setInterval(()=>{e--,e>0?(s.innerText=e,this.sound.play("countdown")):(clearInterval(this.countdownInterval),s.innerText="¡TIEMPO!",this.resolveRound())},1e3)}resolveRound(){clearInterval(this.countdownInterval);const e=this.game.playRound(this.p1Selection,this.p2Selection);this.game.isGameOver()?this.renderFinalResult():this.renderResult(e)}renderFinalResult(){this.currentView="result";const e=this.game.score;let s="";this.game.mode==="1player"?e.wins>e.losses?s="¡Ganaste el Juego!":e.losses>e.wins?s="¡Perdiste el Juego!":s="¡Juego Empatado!":e.p1Wins>e.p2Wins?s="¡Jugador 1 Gana el Juego!":e.p2Wins>e.p1Wins?s="¡Jugador 2 Gana el Juego!":s="¡Juego Empatado!",this.game.mode==="1player"?s.includes("Ganaste")?this.sound.play("win"):s.includes("Perdiste")?this.sound.play("lose"):this.sound.play("tie"):s.includes("Empatado")?this.sound.play("tie"):this.sound.play("win"),this.app.innerHTML=`
      <div class="view result fade-in">
        <h1 class="title pop-in">${s}</h1>
        <div class="scoreboard final">
          <div class="score-box">
            <span class="label">P1</span>
            <span class="value updated">${this.game.mode==="1player"?e.wins:e.p1Wins}</span>
          </div>
          <div class="score-box">
            <span class="label">P2</span>
            <span class="value updated">${this.game.mode==="1player"?e.losses:e.p2Wins}</span>
          </div>
        </div>
        <div class="actions">
          <button id="btn-home" class="btn-primary pop-in" style="animation-delay: 0.5s">Menú Principal (Reset)</button>
          <button id="btn-save-exit" class="btn-secondary pop-in" style="animation-delay: 0.6s">Salir y Guardar</button>
        </div>
      </div>
    `,document.getElementById("btn-home").addEventListener("click",()=>{this.game.resetScore(),this.game.currentRound=0,this.game.score={wins:0,losses:0,ties:0,p1Wins:0,p2Wins:0},this.game.saveScore(),this.renderHome()}),document.getElementById("btn-save-exit").addEventListener("click",()=>{this.renderHome()})}renderResult(e){this.currentView="result";let s="",t="";this.game.mode==="1player"?e.result==="p1"?(s="¡Ganaste!",t="win"):e.result==="p2"?(s="¡Perdiste!",t="lose"):(s="¡Empate!",t="tie"):e.result==="p1"?(s="¡Jugador 1 Gana!",t="win"):e.result==="p2"?(s="¡Jugador 2 Gana!",t="win"):(s="¡Empate!",t="tie"),this.game.mode==="1player"?e.result==="p1"?this.sound.play("win"):e.result==="p2"?this.sound.play("lose"):this.sound.play("tie"):e.result==="tie"?this.sound.play("tie"):this.sound.play("win");const i=e.p1Move?`/images/${e.p1Move}-emoji.png`:"",n=e.opponentMove?`/images/${e.opponentMove}-emoji.png`:"",o=e.p1Move?`<img src="${i}" class="${e.result==="p1"?"winner":""}">`:'<div class="timeout-text">⏳</div>',r=e.opponentMove?`<img src="${n}" class="${e.result==="p2"?"winner":""}">`:'<div class="timeout-text">⏳</div>';this.app.innerHTML=`
      <div class="view result fade-in">
        <h2 class="${t} pop-in">${s}</h2>
        
        <div class="showdown">
          <div class="fighter p1 slide-left">
            ${o}
            <span>Jugador 1</span>
          </div>
          <div class="vs">VS</div>
          <div class="fighter p2 slide-right">
            ${r}
            <span>${this.game.mode==="1player"?"Computadora":"Jugador 2"}</span>
          </div>
        </div>

        <div class="actions">
          <button id="btn-next" class="btn-primary pop-in" style="animation-delay: 0.3s">Siguiente Ronda</button>
          <button id="btn-home" class="btn-secondary pop-in" style="animation-delay: 0.5s">Menú Principal (Reset)</button>
          <button id="btn-save-exit" class="btn-secondary pop-in" style="animation-delay: 0.6s">Salir y Guardar</button>
        </div>
      </div>
    `,document.getElementById("btn-next").addEventListener("click",()=>this.startGame()),document.getElementById("btn-home").addEventListener("click",()=>{this.game.resetScore(),this.game.currentRound=0,this.game.score={wins:0,losses:0,ties:0,p1Wins:0,p2Wins:0},this.game.saveScore(),this.renderHome()}),document.getElementById("btn-save-exit").addEventListener("click",()=>{this.renderHome()})}}document.addEventListener("DOMContentLoaded",()=>{const a=new l;new d(a).init()});

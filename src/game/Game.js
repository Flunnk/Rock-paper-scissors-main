export class Game {
    constructor() {
        this.score = this.loadScore();
        this.config = this.loadConfig();
        this.mode = '1player'; // '1player' or '2player'
        this.currentRound = 0;
        this.history = [];
    }

    loadScore() {
        const stored = localStorage.getItem('rps_score');
        return stored ? JSON.parse(stored) : { wins: 0, losses: 0, ties: 0, p1Wins: 0, p2Wins: 0 };
    }

    saveScore() {
        localStorage.setItem('rps_score', JSON.stringify(this.score));
    }

    loadConfig() {
        const stored = localStorage.getItem('rps_config');
        return stored ? JSON.parse(stored) : { rounds: 0, timer: 3 }; // rounds: 0 means infinite
    }

    saveConfig(newConfig) {
        this.config = { ...this.config, ...newConfig };
        localStorage.setItem('rps_config', JSON.stringify(this.config));
    }

    resetScore() {
        this.score = { wins: 0, losses: 0, ties: 0, p1Wins: 0, p2Wins: 0 };
        this.saveScore();
    }

    setMode(mode) {
        this.mode = mode;
    }

    getComputerMove() {
        const moves = ['rock', 'paper', 'scissors'];
        const randomIndex = Math.floor(Math.random() * 3);
        return moves[randomIndex];
    }

    determineWinner(p1, p2) {
        if (!p1 && !p2) return 'tie'; // Both timed out
        if (!p1) return 'p2'; // P1 timed out
        if (!p2) return 'p1'; // P2 timed out

        if (p1 === p2) return 'tie';
        if (
            (p1 === 'rock' && p2 === 'scissors') ||
            (p1 === 'paper' && p2 === 'rock') ||
            (p1 === 'scissors' && p2 === 'paper')
        ) {
            return 'p1';
        }
        return 'p2';
    }

    playRound(p1Move, p2Move = null) {
        // If 1 player mode, computer ALWAYS picks a move, even if player times out.
        // So p2Move (computer) should be generated if it's 1player and not passed.
        let opponentMove = p2Move;
        if (this.mode === '1player') {
            opponentMove = this.getComputerMove();
        }

        const result = this.determineWinner(p1Move, opponentMove);

        if (this.mode === '1player') {
            if (result === 'p1') this.score.wins++;
            else if (result === 'p2') this.score.losses++;
            else this.score.ties++;
        } else {
            if (result === 'p1') this.score.p1Wins++;
            else if (result === 'p2') this.score.p2Wins++;
            else this.score.ties++;
        }

        this.saveScore();
        this.currentRound++;

        return {
            p1Move,
            opponentMove,
            result,
            score: this.score
        };
    }

    isGameOver() {
        if (this.config.rounds > 0 && this.currentRound >= this.config.rounds) {
            return true;
        }
        return false;
    }
}

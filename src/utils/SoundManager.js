export class SoundManager {
    constructor() {
        this.context = new (window.AudioContext || window.webkitAudioContext)();
        this.enabled = true;
    }

    toggle() {
        this.enabled = !this.enabled;
        if (this.enabled && this.context.state === 'suspended') {
            this.context.resume();
        }
        return this.enabled;
    }

    play(type) {
        if (!this.enabled) return;
        if (this.context.state === 'suspended') {
            this.context.resume();
        }

        switch (type) {
            case 'hover':
                // Softer, quieter hover sound
                this.playTone(300, 'sine', 0.05, 0.03);
                break;
            case 'click':
                // Much softer click, like a bubble pop
                this.playTone(400, 'sine', 0.05, 0.05);
                break;
            case 'countdown':
                this.playTone(800, 'triangle', 0.1, 0.1);
                break;
            case 'fight':
                // Much softer fight sound, just a small alert
                this.playTone(400, 'sine', 0.1, 0.1);
                break;
            case 'win':
                this.playMelody([523.25, 659.25, 783.99, 1046.50], 0.1, 'sine', 0.1);
                break;
            case 'lose':
                // Even softer
                this.playMelody([392.00, 349.23, 329.63, 261.63], 0.2, 'sine', 0.05);
                break;
            case 'tie':
                // Softer tie sound
                this.playTone(200, 'sine', 0.3, 0.1);
                break;
            case 'pop':
                this.playTone(1000, 'sine', 0.1, 0.05);
                break;
        }
    }

    playTone(freq, type, duration, vol = 0.1) {
        const osc = this.context.createOscillator();
        const gain = this.context.createGain();

        osc.type = type;
        osc.frequency.setValueAtTime(freq, this.context.currentTime);

        gain.gain.setValueAtTime(vol, this.context.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.context.currentTime + duration);

        osc.connect(gain);
        gain.connect(this.context.destination);

        osc.start();
        osc.stop(this.context.currentTime + duration);
    }

    playMelody(notes, noteDuration, type = 'sine', vol = 0.1) {
        notes.forEach((note, index) => {
            setTimeout(() => {
                this.playTone(note, type, noteDuration, vol);
            }, index * (noteDuration * 1000));
        });
    }
}

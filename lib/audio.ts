// Web Audio API procedural soundscape & SFX generator
// 100% self-contained, no external mp3 assets required.

class SoundscapeEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private masterGain: GainNode | null = null;
  private bgmGain: GainNode | null = null;
  private sfxGain: GainNode | null = null;
  
  // Ambient nodes
  private currentTrackType: 'rain' | 'sunset' | 'cyber' | 'celestial' | 'none' = 'none';
  private ambientInterval: number | null = null;
  private activeOscillators: (OscillatorNode | AudioNode)[] = [];

  constructor() {
    // AudioContext will be initialized on first user interaction
  }

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
      
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(0.7, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);

      this.bgmGain = this.ctx.createGain();
      this.bgmGain.gain.setValueAtTime(0.35, this.ctx.currentTime);
      this.bgmGain.connect(this.masterGain);

      this.sfxGain = this.ctx.createGain();
      this.sfxGain.gain.setValueAtTime(0.5, this.ctx.currentTime);
      this.sfxGain.connect(this.masterGain);
    }

    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setMute(muted: boolean) {
    this.isMuted = muted;
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(muted ? 0 : 0.7, this.ctx.currentTime);
    }
  }

  public getIsMuted() {
    return this.isMuted;
  }

  public setVolume(volume: number) {
    if (this.masterGain && this.ctx) {
      const vol = Math.max(0, Math.min(1, volume));
      this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : vol, this.ctx.currentTime);
    }
  }

  // --- AMBIENT SOUNDSCAPES ---
  public playAmbient(type: 'rain' | 'sunset' | 'cyber' | 'celestial') {
    if (typeof window === 'undefined') return;
    this.initContext();
    if (!this.ctx || !this.bgmGain) return;

    if (this.currentTrackType === type) return;
    this.stopAmbient();
    this.currentTrackType = type;

    switch (type) {
      case 'rain':
        this.startLofiRain();
        break;
      case 'sunset':
        this.startSunsetLoFi();
        break;
      case 'cyber':
        this.startCyberpunkPulse();
        break;
      case 'celestial':
        this.startCelestialPad();
        break;
    }
  }

  public stopAmbient() {
    if (this.ambientInterval) {
      window.clearInterval(this.ambientInterval);
      this.ambientInterval = null;
    }
    this.activeOscillators.forEach(node => {
      try {
        if ('stop' in node && typeof (node as OscillatorNode).stop === 'function') {
          (node as OscillatorNode).stop();
        }
        node.disconnect();
      } catch {
        // ignore disconnect on stopped nodes
      }
    });
    this.activeOscillators = [];
    this.currentTrackType = 'none';
  }

  public getCurrentTrack(): string {
    return this.currentTrackType;
  }

  // 1. Lo-Fi Rain: filtered pink noise with gentle modulation
  private startLofiRain() {
    if (!this.ctx || !this.bgmGain) return;
    const bufferSize = this.ctx.sampleRate * 2;
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    let b0 = 0, b1 = 0, b2 = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      output[i] = (b0 + b1 + b2) * 0.12;
    }

    const whiteNoise = this.ctx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;
    whiteNoise.loop = true;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(800, this.ctx.currentTime);

    const rainGain = this.ctx.createGain();
    rainGain.gain.setValueAtTime(0.2, this.ctx.currentTime);

    whiteNoise.connect(filter);
    filter.connect(rainGain);
    rainGain.connect(this.bgmGain);

    whiteNoise.start();
    this.activeOscillators.push(whiteNoise, filter, rainGain);

    // Add intermittent gentle acoustic guitar-like chords
    const chordFrequencies = [
      [220, 261.63, 329.63, 392], // Am7
      [174.61, 220, 261.63, 329.63], // Fmaj7
      [130.81, 164.81, 196, 246.94], // Cmaj7
      [196, 246.94, 293.66, 349.23], // G7
    ];
    let chordIdx = 0;
    this.ambientInterval = window.setInterval(() => {
      if (this.isMuted || !this.ctx) return;
      const chord = chordFrequencies[chordIdx % chordFrequencies.length];
      chordIdx++;
      chord.forEach((freq, idx) => {
        setTimeout(() => {
          this.playPluck(freq, 0.08);
        }, idx * 160);
      });
    }, 4500);
  }

  // 2. Sunset Schoolyard: Warm acoustic arpeggios + lofi drone
  private startSunsetLoFi() {
    if (!this.ctx || !this.bgmGain) return;

    // Warm sub drone
    const drone = this.ctx.createOscillator();
    drone.type = 'triangle';
    drone.frequency.setValueAtTime(110, this.ctx.currentTime); // A2

    const droneFilter = this.ctx.createBiquadFilter();
    droneFilter.type = 'lowpass';
    droneFilter.frequency.setValueAtTime(320, this.ctx.currentTime);

    const droneGain = this.ctx.createGain();
    droneGain.gain.setValueAtTime(0.12, this.ctx.currentTime);

    drone.connect(droneFilter);
    droneFilter.connect(droneGain);
    droneGain.connect(this.bgmGain);
    drone.start();
    this.activeOscillators.push(drone, droneFilter, droneGain);

    // Warm nostalgic melodic progression (Makoto Shinkai piano style)
    const melodyNotes = [329.63, 392.00, 440.00, 493.88, 587.33, 659.25, 493.88, 440.00];
    let noteIdx = 0;
    this.ambientInterval = window.setInterval(() => {
      if (this.isMuted || !this.ctx) return;
      const note = melodyNotes[noteIdx % melodyNotes.length];
      noteIdx++;
      this.playPianoNote(note, 0.15);
      if (noteIdx % 3 === 0) {
        this.playPianoNote(note / 2, 0.12);
      }
    }, 1800);
  }

  // 3. Cyberpunk Pulse: Detuned saw bass + rhythmic cyber pulses
  private startCyberpunkPulse() {
    if (!this.ctx || !this.bgmGain) return;

    // Low rhythmic bass synth
    const bassOsc = this.ctx.createOscillator();
    bassOsc.type = 'sawtooth';
    bassOsc.frequency.setValueAtTime(65.41, this.ctx.currentTime); // C2

    const bassFilter = this.ctx.createBiquadFilter();
    bassFilter.type = 'lowpass';
    bassFilter.frequency.setValueAtTime(450, this.ctx.currentTime);
    bassFilter.Q.setValueAtTime(4, this.ctx.currentTime);

    const bassGain = this.ctx.createGain();
    bassGain.gain.setValueAtTime(0.14, this.ctx.currentTime);

    bassOsc.connect(bassFilter);
    bassFilter.connect(bassGain);
    bassGain.connect(this.bgmGain);
    bassOsc.start();
    this.activeOscillators.push(bassOsc, bassFilter, bassGain);

    // Arpeggiated cyber blips
    const cyberScale = [261.63, 311.13, 349.23, 392.00, 466.16, 523.25]; // C minor pentatonic
    let arpIdx = 0;
    this.ambientInterval = window.setInterval(() => {
      if (this.isMuted || !this.ctx) return;
      const freq = cyberScale[arpIdx % cyberScale.length];
      arpIdx++;
      this.playSynthPulse(freq, 0.06);
    }, 450);
  }

  // 4. Celestial Realm: Ethereal shimmering pads with slow sine waves
  private startCelestialPad() {
    if (!this.ctx || !this.bgmGain) return;

    const freqs = [174.61, 261.63, 349.23, 440.00]; // F major chord
    freqs.forEach((freq, i) => {
      if (!this.ctx || !this.bgmGain) return;
      const osc = this.ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq + (i * 0.4), this.ctx.currentTime);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.08 / freqs.length, this.ctx.currentTime);

      osc.connect(gain);
      gain.connect(this.bgmGain);
      osc.start();
      this.activeOscillators.push(osc, gain);
    });

    // Magical bell shimmers
    const bells = [698.46, 880.00, 1046.50, 1318.51, 1567.98];
    this.ambientInterval = window.setInterval(() => {
      if (this.isMuted || !this.ctx) return;
      const bell = bells[Math.floor(Math.random() * bells.length)];
      this.playBellShimmer(bell, 0.09);
    }, 2800);
  }

  // --- SOUND EFFECTS (SFX) ---
  
  // Dialogue typewriter click
  public playTypewriterClick() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx || !this.sfxGain) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const now = this.ctx.currentTime;

    osc.type = 'sine';
    // subtle pitch fluctuation gives that satisfying anime dialogue feel
    const pitch = 700 + Math.random() * 200;
    osc.frequency.setValueAtTime(pitch, now);
    osc.frequency.exponentialRampToValueAtTime(300, now + 0.03);

    gain.gain.setValueAtTime(0.04, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.03);

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(now);
    osc.stop(now + 0.035);
  }

  // Menu button hover / click
  public playMenuClick() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx || !this.sfxGain) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const now = this.ctx.currentTime;

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(523.25, now); // C5
    osc.frequency.exponentialRampToValueAtTime(1046.5, now + 0.06); // C6

    gain.gain.setValueAtTime(0.12, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(now);
    osc.stop(now + 0.08);
  }

  // Concept Rune Reveal Chime
  public playConceptReveal() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx || !this.sfxGain) return;

    const notes = [587.33, 739.99, 880.00, 1174.66]; // D maj sparkle
    notes.forEach((freq, idx) => {
      setTimeout(() => {
        if (!this.ctx || !this.sfxGain) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const now = this.ctx.currentTime;

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now);

        gain.gain.setValueAtTime(0.15, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);

        osc.connect(gain);
        gain.connect(this.sfxGain);

        osc.start(now);
        osc.stop(now + 0.45);
      }, idx * 70);
    });
  }

  // Boss Battle Warning Alarm
  public playBossAlarm() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx || !this.sfxGain) return;

    for (let i = 0; i < 2; i++) {
      setTimeout(() => {
        if (!this.ctx || !this.sfxGain) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const now = this.ctx.currentTime;

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(320, now);
        osc.frequency.linearRampToValueAtTime(480, now + 0.25);

        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);

        osc.connect(gain);
        gain.connect(this.sfxGain);

        osc.start(now);
        osc.stop(now + 0.35);
      }, i * 350);
    }
  }

  // Battle Critical Hit / Attack
  public playAttackSound(isCritical: boolean = false) {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx || !this.sfxGain) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = isCritical ? 'square' : 'triangle';
    osc.frequency.setValueAtTime(isCritical ? 880 : 440, now);
    osc.frequency.exponentialRampToValueAtTime(110, now + 0.2);

    gain.gain.setValueAtTime(isCritical ? 0.35 : 0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(now);
    osc.stop(now + 0.28);
  }

  // Victory Fanfare Jingle
  public playVictoryJingle() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx || !this.sfxGain) return;

    const chords = [
      { f: 523.25, time: 0 },
      { f: 659.25, time: 100 },
      { f: 783.99, time: 200 },
      { f: 1046.50, time: 350 },
    ];

    chords.forEach(({ f, time }) => {
      setTimeout(() => {
        if (!this.ctx || !this.sfxGain) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const now = this.ctx.currentTime;

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(f, now);

        gain.gain.setValueAtTime(0.25, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);

        osc.connect(gain);
        gain.connect(this.sfxGain);

        osc.start(now);
        osc.stop(now + 0.55);
      }, time);
    });
  }

  // --- Helper Note Synthesizers ---
  private playPluck(freq: number, vol: number) {
    if (!this.ctx || !this.bgmGain) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const now = this.ctx.currentTime;

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, now);

    gain.gain.setValueAtTime(vol, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.2);

    osc.connect(gain);
    gain.connect(this.bgmGain);

    osc.start(now);
    osc.stop(now + 1.3);
  }

  private playPianoNote(freq: number, vol: number) {
    if (!this.ctx || !this.bgmGain) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const now = this.ctx.currentTime;

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, now);

    gain.gain.setValueAtTime(vol, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.5);

    osc.connect(gain);
    gain.connect(this.bgmGain);

    osc.start(now);
    osc.stop(now + 1.6);
  }

  private playSynthPulse(freq: number, vol: number) {
    if (!this.ctx || !this.bgmGain) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const now = this.ctx.currentTime;

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(freq, now);

    gain.gain.setValueAtTime(vol, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.25);

    osc.connect(gain);
    gain.connect(this.bgmGain);

    osc.start(now);
    osc.stop(now + 0.3);
  }

  private playBellShimmer(freq: number, vol: number) {
    if (!this.ctx || !this.bgmGain) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const now = this.ctx.currentTime;

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, now);

    gain.gain.setValueAtTime(vol, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 2.0);

    osc.connect(gain);
    gain.connect(this.bgmGain);

    osc.start(now);
    osc.stop(now + 2.1);
  }
}

// Global singleton instance
export const audio = new SoundscapeEngine();

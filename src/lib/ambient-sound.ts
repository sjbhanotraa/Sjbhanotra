/**
 * Ambient Audio Engine
 * Provides:
 * 1. Continuous soothing ambient soundscape playing across the site.
 * 2. High-precision tactile click sounds for all buttons and interactive cards.
 * 3. Subtle micro-tick hover sounds for menu items and buttons.
 * 4. Cinematic audio filter transition swells when switching between pages.
 * 5. Static mute/unmute state management across intro, login, and portfolio screens.
 */

class AmbientAudioEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private isMuted: boolean = false; // Default unmuted for continuous play all over site
  private isInitialized: boolean = false;
  private isSynthActive: boolean = true;
  private oscillators: OscillatorNode[] = [];
  private lfo: OscillatorNode | null = null;
  private filter: BiquadFilterNode | null = null;
  private synthGain: GainNode | null = null;
  private listenersAttached: boolean = false;

  constructor() {
    // Check saved mute preference if available
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('portfolio_audio_muted');
      if (saved !== null) {
        this.isMuted = saved === 'true';
      }
      this.attachGlobalInteractions();
    }
  }

  /**
   * Automatically attach user gesture listeners to wake up AudioContext
   * seamlessly on the first interaction anywhere on the site.
   */
  private attachGlobalInteractions(): void {
    if (this.listenersAttached || typeof window === 'undefined') return;
    this.listenersAttached = true;

    const resumeAudio = () => {
      this.ensureRunning();
    };

    window.addEventListener('pointerdown', resumeAudio, { once: true, passive: true });
    window.addEventListener('keydown', resumeAudio, { once: true, passive: true });
    window.addEventListener('touchstart', resumeAudio, { once: true, passive: true });

    // Global tactile click sound on all buttons, links, inputs, and interactive elements
    document.addEventListener('click', (e) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;
      const isInteractive = Boolean(
        target.closest('button') ||
        target.closest('a') ||
        target.closest('input') ||
        target.closest('textarea') ||
        target.closest('select') ||
        target.closest('[role="button"]') ||
        target.closest('.project-card-link') ||
        target.closest('.cta-explore-btn') ||
        target.closest('.hero-primary-btn') ||
        target.closest('.hero-secondary-btn') ||
        target.closest('.behance-banner-btn')
      );

      if (isInteractive) {
        this.playClickSound();
      }
    });

    // Global tactile click sound when person types on any text field, number, or textarea
    let lastTypeSoundTime = 0;
    const triggerTypeClick = () => {
      const now = Date.now();
      if (now - lastTypeSoundTime < 35) return;
      lastTypeSoundTime = now;
      this.playTypingSound();
    };

    document.addEventListener('keydown', (e) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;
      const isInputField = Boolean(
        target instanceof HTMLInputElement ||
        target instanceof HTMLTextAreaElement ||
        target.closest('input') ||
        target.closest('textarea') ||
        target.isContentEditable
      );

      if (isInputField) {
        if (['Shift', 'Control', 'Alt', 'Meta', 'CapsLock', 'Tab', 'Escape'].includes(e.key)) {
          return;
        }
        triggerTypeClick();
      }
    });

    document.addEventListener('input', (e) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;
      const isInputField = Boolean(
        target instanceof HTMLInputElement ||
        target instanceof HTMLTextAreaElement ||
        target.closest('input') ||
        target.closest('textarea') ||
        target.isContentEditable
      );

      if (isInputField) {
        triggerTypeClick();
      }
    });
  }

  public init(): void {
    if (this.isInitialized) return;
    if (typeof window === 'undefined') return;

    try {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();

      this.masterGain = this.ctx.createGain();
      const initialGain = this.isMuted ? 0 : 0.42;
      this.masterGain.gain.setValueAtTime(initialGain, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);

      // Start procedural ambient soundtrack
      this.startProceduralSynth();

      this.isInitialized = true;
    } catch (e) {
      console.warn('AudioContext initialization notice:', e);
    }
  }

  private startProceduralSynth(): void {
    if (!this.ctx || !this.masterGain) return;

    // Harmonic ethereal chord frequencies (A2, E3, A3, C#4, E4)
    const freqs = [110, 164.81, 220, 277.18, 329.63];

    // Resonant lowpass filter with slow organic breathing
    this.filter = this.ctx.createBiquadFilter();
    this.filter.type = 'lowpass';
    this.filter.frequency.setValueAtTime(520, this.ctx.currentTime);
    this.filter.Q.setValueAtTime(1.8, this.ctx.currentTime);

    // Synth gain to allow muting synth independently for video screens
    this.synthGain = this.ctx.createGain();
    this.synthGain.gain.setValueAtTime(this.isSynthActive ? 1 : 0, this.ctx.currentTime);
    this.filter.connect(this.synthGain);
    this.synthGain.connect(this.masterGain);

    // Subtle LFO for breathing filter movement
    this.lfo = this.ctx.createOscillator();
    this.lfo.frequency.setValueAtTime(0.08, this.ctx.currentTime); // slow ethereal breath
    const lfoGain = this.ctx.createGain();
    lfoGain.gain.setValueAtTime(160, this.ctx.currentTime);
    this.lfo.connect(lfoGain);
    lfoGain.connect(this.filter.frequency);
    this.lfo.start();

    // Create detuned sine & triangle oscillators for rich chorus
    this.oscillators = freqs.map((freq, i) => {
      const osc = this.ctx!.createOscillator();
      const oscGain = this.ctx!.createGain();

      osc.type = i % 2 === 0 ? 'sine' : 'triangle';
      osc.frequency.setValueAtTime(freq, this.ctx!.currentTime);
      // Delicate organic detuning
      osc.detune.setValueAtTime((Math.random() - 0.5) * 6, this.ctx!.currentTime);

      oscGain.gain.setValueAtTime(0.07 / freqs.length, this.ctx!.currentTime);
      osc.connect(oscGain);
      oscGain.connect(this.filter!);
      osc.start();
      return osc;
    });
  }

  /**
   * Ensure audio context is running on user interaction
   */
  public ensureRunning(): void {
    if (!this.isInitialized) {
      this.init();
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  /**
   * Set synth active state (to mute procedural synth when video sound is playing)
   */
  public setSynthActive(active: boolean): void {
    this.isSynthActive = active;
    if (this.synthGain && this.ctx) {
      const target = active ? 1 : 0;
      this.synthGain.gain.setTargetAtTime(target, this.ctx.currentTime, 0.1);
    }
  }

  /**
   * Set explicit mute state
   */
  public setMuted(muted: boolean): void {
    this.isMuted = muted;
    if (typeof window !== 'undefined') {
      localStorage.setItem('portfolio_audio_muted', String(this.isMuted));
    }
    if (this.masterGain && this.ctx) {
      const targetGain = this.isMuted ? 0 : 0.42;
      this.masterGain.gain.setTargetAtTime(targetGain, this.ctx.currentTime, 0.15);
    }
  }

  /**
   * Toggle mute state and persist in localStorage
   */
  public toggleMute(): boolean {
    this.ensureRunning();

    this.isMuted = !this.isMuted;
    if (typeof window !== 'undefined') {
      localStorage.setItem('portfolio_audio_muted', String(this.isMuted));
    }

    if (this.masterGain && this.ctx) {
      const targetGain = this.isMuted ? 0 : 0.42;
      this.masterGain.gain.setTargetAtTime(targetGain, this.ctx.currentTime, 0.15);
    }

    return this.isMuted;
  }

  /**
   * Play high-end subtle micro-tick on menu/button hover
   */
  public playHoverSound(): void {
    if (this.isMuted) return;
    this.ensureRunning();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(2600, now);
      filter.Q.setValueAtTime(3.2, now);

      osc.type = 'sine';
      osc.frequency.setValueAtTime(1600, now);
      osc.frequency.exponentialRampToValueAtTime(800, now + 0.035);

      gain.gain.setValueAtTime(0.032, now);
      gain.gain.exponentialRampToValueAtTime(0.0008, now + 0.035);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.04);
    } catch {
      // Audio context error ignore
    }
  }

  /**
   * Play the ultimate tactile mechanical click on button press
   * Combines high-frequency shaped noise transient + resonant shutter snap + body thud
   */
  public playClickSound(): void {
    if (this.isMuted) return;
    this.ensureRunning();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;

      // 1. Organic high-frequency noise transient click (like a Leica / Apple haptic click)
      const sampleRate = this.ctx.sampleRate;
      const bufferLength = Math.floor(sampleRate * 0.016); // 16ms
      const noiseBuffer = this.ctx.createBuffer(1, bufferLength, sampleRate);
      const data = noiseBuffer.getChannelData(0);
      for (let i = 0; i < bufferLength; i++) {
        const decay = Math.exp(-i / (sampleRate * 0.0028));
        data[i] = (Math.random() * 2 - 1) * decay;
      }
      const noiseSource = this.ctx.createBufferSource();
      noiseSource.buffer = noiseBuffer;

      const noiseFilter = this.ctx.createBiquadFilter();
      noiseFilter.type = 'highpass';
      noiseFilter.frequency.setValueAtTime(1400, now);

      const noiseGain = this.ctx.createGain();
      noiseGain.gain.setValueAtTime(0.12, now);
      noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.016);

      noiseSource.connect(noiseFilter);
      noiseFilter.connect(noiseGain);
      noiseGain.connect(this.ctx.destination);
      noiseSource.start(now);

      // 2. High transient tonal snap
      const snap = this.ctx.createOscillator();
      const snapGain = this.ctx.createGain();
      snap.type = 'triangle';
      snap.frequency.setValueAtTime(1950, now);
      snap.frequency.exponentialRampToValueAtTime(420, now + 0.028);

      snapGain.gain.setValueAtTime(0.08, now);
      snapGain.gain.exponentialRampToValueAtTime(0.001, now + 0.03);

      snap.connect(snapGain);
      snapGain.connect(this.ctx.destination);

      snap.start(now);
      snap.stop(now + 0.035);

      // 3. Low-end mechanical body thud
      const thud = this.ctx.createOscillator();
      const thudGain = this.ctx.createGain();
      thud.type = 'sine';
      thud.frequency.setValueAtTime(220, now);
      thud.frequency.exponentialRampToValueAtTime(65, now + 0.05);

      thudGain.gain.setValueAtTime(0.05, now);
      thudGain.gain.exponentialRampToValueAtTime(0.001, now + 0.055);

      thud.connect(thudGain);
      thudGain.connect(this.ctx.destination);

      thud.start(now);
      thud.stop(now + 0.06);
    } catch {
      // Ignore
    }
  }

  /**
   * Play crisp, satisfying tactile click sound when typing into any input, number, or textarea field
   */
  public playTypingSound(): void {
    if (this.isMuted) return;
    this.ensureRunning();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      // Organic pitch variation so typing feels like physical keyboard switches
      const pitchShift = 1 + (Math.random() - 0.5) * 0.16;

      // 1. Crisp high-frequency transient click snap
      const snap = this.ctx.createOscillator();
      const snapGain = this.ctx.createGain();
      const snapFilter = this.ctx.createBiquadFilter();

      snapFilter.type = 'bandpass';
      snapFilter.frequency.setValueAtTime(2200 * pitchShift, now);
      snapFilter.Q.setValueAtTime(2.2, now);

      snap.type = 'triangle';
      snap.frequency.setValueAtTime(2000 * pitchShift, now);
      snap.frequency.exponentialRampToValueAtTime(450 * pitchShift, now + 0.024);

      snapGain.gain.setValueAtTime(0.095, now);
      snapGain.gain.exponentialRampToValueAtTime(0.001, now + 0.026);

      snap.connect(snapFilter);
      snapFilter.connect(snapGain);
      snapGain.connect(this.ctx.destination);

      snap.start(now);
      snap.stop(now + 0.03);

      // 2. Micro bottom thud for tactile haptic weight
      const tap = this.ctx.createOscillator();
      const tapGain = this.ctx.createGain();
      tap.type = 'sine';
      tap.frequency.setValueAtTime(280 * pitchShift, now);
      tap.frequency.exponentialRampToValueAtTime(80, now + 0.028);

      tapGain.gain.setValueAtTime(0.045, now);
      tapGain.gain.exponentialRampToValueAtTime(0.001, now + 0.03);

      tap.connect(tapGain);
      tapGain.connect(this.ctx.destination);

      tap.start(now);
      tap.stop(now + 0.035);
    } catch {
      // Ignore
    }
  }

  /**
   * Play dynamic atmospheric whoosh / filter swell when switching pages
   */
  public playPageTransitionEffect(): void {
    if (this.isMuted) return;
    this.ensureRunning();
    if (!this.ctx || !this.masterGain) return;

    try {
      const now = this.ctx.currentTime;

      // Temporary filter frequency sweep in the ambient sound
      if (this.filter) {
        this.filter.frequency.cancelScheduledValues(now);
        this.filter.frequency.setValueAtTime(450, now);
        this.filter.frequency.exponentialRampToValueAtTime(1750, now + 0.32);
        this.filter.frequency.exponentialRampToValueAtTime(520, now + 0.75);
      }

      // Layered ethereal sweep
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const bandpass = this.ctx.createBiquadFilter();

      bandpass.type = 'bandpass';
      bandpass.frequency.setValueAtTime(320, now);
      bandpass.frequency.exponentialRampToValueAtTime(1300, now + 0.35);
      bandpass.frequency.exponentialRampToValueAtTime(280, now + 0.8);
      bandpass.Q.setValueAtTime(3.0, now);

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(110, now);
      osc.frequency.exponentialRampToValueAtTime(360, now + 0.35);
      osc.frequency.exponentialRampToValueAtTime(95, now + 0.8);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.11, now + 0.28);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.8);

      osc.connect(bandpass);
      bandpass.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.85);
    } catch {
      // Ignore
    }
  }

  public playWarpSwell(): void {
    if (this.isMuted) return;
    this.ensureRunning();
    if (!this.ctx || !this.masterGain) return;

    try {
      const now = this.ctx.currentTime;
      const noise = this.ctx.createOscillator();
      const sweepGain = this.ctx.createGain();

      noise.type = 'sawtooth';
      noise.frequency.setValueAtTime(80, now);
      noise.frequency.exponentialRampToValueAtTime(880, now + 0.9);

      sweepGain.gain.setValueAtTime(0.001, now);
      sweepGain.gain.linearRampToValueAtTime(0.18, now + 0.5);
      sweepGain.gain.exponentialRampToValueAtTime(0.001, now + 1.2);

      const sweepFilter = this.ctx.createBiquadFilter();
      sweepFilter.type = 'bandpass';
      sweepFilter.frequency.setValueAtTime(300, now);
      sweepFilter.frequency.exponentialRampToValueAtTime(1400, now + 0.9);
      sweepFilter.Q.setValueAtTime(3.0, now);

      noise.connect(sweepFilter);
      sweepFilter.connect(sweepGain);
      sweepGain.connect(this.masterGain);

      noise.start(now);
      noise.stop(now + 1.3);
    } catch {
      // Ignore
    }
  }

  public getMuted(): boolean {
    return this.isMuted;
  }
}

export const ambientAudio = new AmbientAudioEngine();

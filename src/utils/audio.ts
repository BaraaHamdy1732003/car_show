// Web Audio API engine sound generator and ambient exhibition soundscape

class SoundEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private activeOscillators: OscillatorNode[] = [];
  private engineGain: GainNode | null = null;
  private engineFilter: BiquadFilterNode | null = null;
  private ambientGain: GainNode | null = null;
  private isRevving: boolean = false;
  private currentRpm: number = 800;
  private targetRpm: number = 800;
  private animFrameId: number | null = null;

  constructor() {
    // AudioContext will be initialized on first user interaction
  }

  private initCtx() {
    if (!this.ctx) {
      const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtxClass();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    if (this.ctx) {
      if (this.isMuted) {
        if (this.engineGain) this.engineGain.gain.setValueAtTime(0, this.ctx.currentTime);
        if (this.ambientGain) this.ambientGain.gain.setValueAtTime(0, this.ctx.currentTime);
      } else {
        if (this.engineGain) this.engineGain.gain.setValueAtTime(0.12, this.ctx.currentTime);
        if (this.ambientGain) this.ambientGain.gain.setValueAtTime(0.04, this.ctx.currentTime);
      }
    }
    return this.isMuted;
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  public playClick() {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(300, this.ctx.currentTime + 0.05);
      gain.gain.setValueAtTime(0.06, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.05);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.06);
    } catch {
      // Audio fallback
    }
  }

  public playGearShift() {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(320, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(140, this.ctx.currentTime + 0.09);
      gain.gain.setValueAtTime(0.1, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.1);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.11);
    } catch {
      // Audio fallback
    }
  }

  public startEngineSimulator(baseType: string = 'v8', onRpmUpdate?: (rpm: number) => void) {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;

      this.stopEngineSimulator();

      const ctx = this.ctx;
      this.engineGain = ctx.createGain();
      this.engineGain.gain.setValueAtTime(this.isMuted ? 0 : 0.14, ctx.currentTime);

      this.engineFilter = ctx.createBiquadFilter();
      this.engineFilter.type = 'lowpass';
      this.engineFilter.frequency.setValueAtTime(600, ctx.currentTime);
      this.engineFilter.Q.setValueAtTime(3.0, ctx.currentTime);

      // Create multi-harmonic oscillators for deep throaty combustion pulse
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const osc3 = ctx.createOscillator();

      osc1.type = 'sawtooth';
      osc2.type = 'triangle';
      osc3.type = 'square';

      osc1.connect(this.engineFilter);
      osc2.connect(this.engineFilter);
      osc3.connect(this.engineFilter);

      this.engineFilter.connect(this.engineGain);
      this.engineGain.connect(ctx.destination);

      osc1.start();
      osc2.start();
      osc3.start();

      this.activeOscillators = [osc1, osc2, osc3];

      this.currentRpm = 800;
      this.targetRpm = 800;

      const updateLoop = () => {
        if (!this.ctx || this.activeOscillators.length === 0) return;

        // Smoothly interpolate RPM
        const smoothing = this.isRevving ? 0.08 : 0.04;
        this.currentRpm += (this.targetRpm - this.currentRpm) * smoothing;

        if (onRpmUpdate) {
          onRpmUpdate(Math.round(this.currentRpm));
        }

        // Calculate fundamental frequency from RPM
        // For a V8, firing pulses = (RPM / 60) * 4
        const multiplier = baseType === 'v12-na' ? 6 : baseType === 'v10' ? 5 : 4;
        const fundamental = Math.max(25, (this.currentRpm / 60) * (multiplier / 2));

        if (this.activeOscillators[0]) {
          this.activeOscillators[0].frequency.setValueAtTime(fundamental, this.ctx.currentTime);
        }
        if (this.activeOscillators[1]) {
          this.activeOscillators[1].frequency.setValueAtTime(fundamental * 2, this.ctx.currentTime);
        }
        if (this.activeOscillators[2]) {
          this.activeOscillators[2].frequency.setValueAtTime(fundamental * 0.5, this.ctx.currentTime);
        }

        if (this.engineFilter) {
          const cutoff = 400 + (this.currentRpm / 8500) * 3200;
          this.engineFilter.frequency.setValueAtTime(cutoff, this.ctx.currentTime);
        }

        this.animFrameId = requestAnimationFrame(updateLoop);
      };

      this.animFrameId = requestAnimationFrame(updateLoop);
    } catch {
      // Audio fallback
    }
  }

  public setThrottle(isPressed: boolean, maxRpm: number = 8500) {
    this.isRevving = isPressed;
    if (isPressed) {
      this.targetRpm = maxRpm;
    } else {
      this.targetRpm = 800;
    }
  }

  public stopEngineSimulator() {
    if (this.animFrameId) {
      cancelAnimationFrame(this.animFrameId);
      this.animFrameId = null;
    }
    this.activeOscillators.forEach((osc) => {
      try {
        osc.stop();
        osc.disconnect();
      } catch {
        // Ignored
      }
    });
    this.activeOscillators = [];
    if (this.engineGain) {
      this.engineGain.disconnect();
      this.engineGain = null;
    }
    this.isRevving = false;
  }
}

export const soundEngine = new SoundEngine();

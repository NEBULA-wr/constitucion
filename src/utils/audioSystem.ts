/**
 * Web Audio API procedural sound synthesizer and full HTML5 audio track player.
 * Supports playing uploaded local audio files (Blob URLs, MP3/WAV/OGG) and procedural SFX.
 */

class SoundEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private sfxVolume: number = 0.6;
  private ambientVolume: number = 0.45;
  private audioElement: HTMLAudioElement | null = null;
  private isAmbientPlaying: boolean = false;
  private currentTrackUrl: string = '';
  private currentTrackTitle: string = '';
  private ambientOscillators: OscillatorNode[] = [];
  private ambientGain: GainNode | null = null;

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    if (this.audioElement) {
      this.audioElement.muted = muted;
    }
    if (this.ambientGain) {
      this.ambientGain.gain.setValueAtTime(muted ? 0 : this.ambientVolume, this.ctx?.currentTime || 0);
    }
  }

  public getIsMuted() {
    return this.isMuted;
  }

  public setVolumes(sfx: number, ambient: number) {
    this.sfxVolume = Math.max(0, Math.min(1, sfx));
    this.ambientVolume = Math.max(0, Math.min(1, ambient));
    if (this.audioElement) {
      this.audioElement.volume = this.ambientVolume;
    }
    if (this.ambientGain && this.ctx) {
      this.ambientGain.gain.setValueAtTime(this.isMuted ? 0 : this.ambientVolume * 0.15, this.ctx.currentTime);
    }
  }

  public getVolumes() {
    return { sfx: this.sfxVolume, ambient: this.ambientVolume };
  }

  // SFX: Crisp UI Button click
  public playClick() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(700, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(350, this.ctx.currentTime + 0.06);

      gain.gain.setValueAtTime(this.sfxVolume * 0.25, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.06);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.07);
    } catch (e) {}
  }

  // SFX: Book page flip sound
  public playPageFlip() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const bufferSize = this.ctx.sampleRate * 0.12;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const output = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }

      const whiteNoise = this.ctx.createBufferSource();
      whiteNoise.buffer = buffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(1400, this.ctx.currentTime);
      filter.frequency.exponentialRampToValueAtTime(600, this.ctx.currentTime + 0.12);
      filter.Q.value = 3.0;

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(this.sfxVolume * 0.4, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.12);

      whiteNoise.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      whiteNoise.start();
    } catch (e) {}
  }

  // SFX: Correct constitutional answer
  public playSuccess() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6 (Major triad fanfare)
      notes.forEach((freq, idx) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, this.ctx!.currentTime + idx * 0.08);

        gain.gain.setValueAtTime(0, this.ctx!.currentTime + idx * 0.08);
        gain.gain.linearRampToValueAtTime(this.sfxVolume * 0.35, this.ctx!.currentTime + idx * 0.08 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx!.currentTime + idx * 0.08 + 0.35);

        osc.connect(gain);
        gain.connect(this.ctx!.destination);

        osc.start(this.ctx!.currentTime + idx * 0.08);
        osc.stop(this.ctx!.currentTime + idx * 0.08 + 0.4);
      });
    } catch (e) {}
  }

  // SFX: Incorrect answer thud
  public playError() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(160, this.ctx.currentTime);
      osc.frequency.linearRampToValueAtTime(90, this.ctx.currentTime + 0.25);

      gain.gain.setValueAtTime(this.sfxVolume * 0.3, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.25);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.26);
    } catch (e) {}
  }

  // SFX: Badge unlock fanfare
  public playBadgeUnlock() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const notes = [440, 554.37, 659.25, 880, 1108.73]; // A major triumphant arpeggio
      notes.forEach((freq, idx) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, this.ctx!.currentTime + idx * 0.09);

        gain.gain.setValueAtTime(0, this.ctx!.currentTime + idx * 0.09);
        gain.gain.linearRampToValueAtTime(this.sfxVolume * 0.4, this.ctx!.currentTime + idx * 0.09 + 0.03);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx!.currentTime + idx * 0.09 + 0.5);

        osc.connect(gain);
        gain.connect(this.ctx!.destination);

        osc.start(this.ctx!.currentTime + idx * 0.09);
        osc.stop(this.ctx!.currentTime + idx * 0.09 + 0.55);
      });
    } catch (e) {}
  }

  // Play an uploaded or specific audio track (MP3, WAV, Blob URL)
  public async playTrack(url: string, title?: string): Promise<boolean> {
    this.initContext();

    // Stop procedural oscillators if they were running
    this.stopProceduralAmbient();

    if (!this.audioElement) {
      this.audioElement = new Audio();
      this.audioElement.loop = true;
      this.audioElement.preload = 'auto';
    }

    try {
      if (this.ctx && this.ctx.state === 'suspended') {
        await this.ctx.resume().catch(() => {});
      }

      const isSameTrack = this.currentTrackUrl === url;
      if (!isSameTrack) {
        this.audioElement.src = url;
        this.audioElement.load();
      }
      this.audioElement.volume = this.isMuted ? 0 : this.ambientVolume;
      
      // Wait for play() promise to actually succeed
      await this.audioElement.play();

      this.currentTrackUrl = url;
      this.currentTrackTitle = title || this.currentTrackTitle || 'Pista de Audio';
      this.isAmbientPlaying = true;
      return true;
    } catch (err) {
      // Browser autoplay policy rejected un-interacted playback
      this.isAmbientPlaying = false;
      return false;
    }
  }

  public pauseTrack() {
    if (this.audioElement) {
      this.audioElement.pause();
    }
    this.isAmbientPlaying = false;
  }

  public resumeTrack() {
    if (this.audioElement && this.currentTrackUrl) {
      this.audioElement.volume = this.isMuted ? 0 : this.ambientVolume;
      this.audioElement.play().catch(() => {});
      this.isAmbientPlaying = true;
      return true;
    }
    return false;
  }

  // Procedural ambient chord fallback
  private playProceduralAmbient() {
    this.initContext();
    if (this.ambientOscillators.length > 0 || !this.ctx) return;

    try {
      const masterGain = this.ctx.createGain();
      masterGain.gain.setValueAtTime(this.isMuted ? 0 : this.ambientVolume * 0.15, this.ctx.currentTime);
      masterGain.connect(this.ctx.destination);
      this.ambientGain = masterGain;

      const baseFreqs = [130.81, 164.81, 196.00, 261.63]; // C3, E3, G3, C4
      this.ambientOscillators = baseFreqs.map((freq) => {
        const osc = this.ctx!.createOscillator();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, this.ctx!.currentTime);
        osc.connect(masterGain);
        osc.start();
        return osc;
      });
    } catch (e) {}
  }

  private stopProceduralAmbient() {
    this.ambientOscillators.forEach((osc) => {
      try {
        osc.stop();
        osc.disconnect();
      } catch (e) {}
    });
    this.ambientOscillators = [];
  }

  // General ambient toggle
  public async toggleAmbient(preferredUrl?: string, title?: string): Promise<boolean> {
    if (this.isAmbientPlaying) {
      this.stopAmbient();
      return false;
    } else {
      if (preferredUrl) {
        return await this.playTrack(preferredUrl, title);
      } else if (this.currentTrackUrl && this.audioElement) {
        return this.resumeTrack();
      } else {
        this.playProceduralAmbient();
        this.isAmbientPlaying = true;
        this.currentTrackTitle = 'Sinfonía Patria Procedural';
        return true;
      }
    }
  }

  public stopAmbient() {
    if (this.audioElement) {
      this.audioElement.pause();
    }
    this.stopProceduralAmbient();
    this.isAmbientPlaying = false;
  }

  public isPlayingAmbient() {
    return this.isAmbientPlaying;
  }

  public getCurrentTrack() {
    return {
      url: this.currentTrackUrl,
      title: this.currentTrackTitle,
      isPlaying: this.isAmbientPlaying
    };
  }
}

export const sound = new SoundEngine();

/**
 * Audio Engine integrating YouTube IFrame API for "Close to You / Jauh" by Reality Club (Video ID: 7bz81uv3v1E)
 * with graceful fallback to synthesized acoustic indie-pop chord progression.
 */

declare global {
  interface Window {
    YT: {
      Player: new (
        elementId: string | HTMLElement,
        config: {
          videoId?: string;
          playerVars?: Record<string, unknown>;
          events?: {
            onReady?: (event: { target: unknown }) => void;
            onStateChange?: (event: { data: number }) => void;
            onError?: (event: { data: number }) => void;
          };
        }
      ) => YTPlayerInstance;
      PlayerState: {
        UNSTARTED: number;
        ENDED: number;
        PLAYING: number;
        PAUSED: number;
        BUFFERING: number;
        CUED: number;
      };
    };
    onYouTubeIframeAPIReady?: () => void;
  }
}

interface YTPlayerInstance {
  playVideo: () => void;
  pauseVideo: () => void;
  stopVideo: () => void;
  seekTo: (seconds: number, allowSeekAhead?: boolean) => void;
  setVolume: (volume: number) => void;
  getVolume: () => number;
  getCurrentTime: () => number;
  getDuration: () => number;
  getPlayerState: () => number;
  destroy: () => void;
  loadVideoById: (videoId: string) => void;
}

class RomanticAudioPlayer {
  private ytPlayer: YTPlayerInstance | null = null;
  private ytReady: boolean = false;
  private videoId: string = '7bz81uv3v1E'; // Reality Club - Close to You / Jauh
  private isPlaying: boolean = false;
  private volume: number = 0.85;

  private listeners: Set<(playing: boolean) => void> = new Set();
  private currentTimeListeners: Set<(time: number, duration: number) => void> = new Set();
  private timePollInterval: number | null = null;

  // Fallback Web Audio Synth
  private ctx: AudioContext | null = null;
  private synthTimerId: number | null = null;
  private simulatedTime: number = 0;
  private simulatedDuration: number = 240;

  constructor() {
    this.initYouTubeAPI();
  }

  private initYouTubeAPI() {
    if (typeof window === 'undefined') return;

    // Check if script already exists
    if (!document.getElementById('youtube-iframe-api-script')) {
      const tag = document.createElement('script');
      tag.id = 'youtube-iframe-api-script';
      tag.src = 'https://www.youtube.com/iframe_api';
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag?.parentNode?.insertBefore(tag, firstScriptTag);
    }

    const previousReady = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      if (previousReady) previousReady();
      this.attachPlayer();
    };

    if (window.YT && window.YT.Player) {
      this.attachPlayer();
    }
  }

  public setPlayerHostElement(elementId: string) {
    if (window.YT && window.YT.Player) {
      this.attachPlayer(elementId);
    }
  }

  private attachPlayer(containerId: string = 'youtube-audio-host') {
    if (this.ytPlayer) return;
    const targetEl = document.getElementById(containerId);
    if (!targetEl || !window.YT) return;

    try {
      this.ytPlayer = new window.YT.Player(containerId, {
        videoId: this.videoId,
        playerVars: {
          autoplay: 0,
          controls: 0,
          disablekb: 1,
          fs: 0,
          modestbranding: 1,
          rel: 0,
          loop: 1,
          playlist: this.videoId,
          playsinline: 1,
          enablejsapi: 1,
          origin: window.location.origin
        },
        events: {
          onReady: (event) => {
            this.ytReady = true;
            this.ytPlayer?.setVolume(this.volume * 100);
            if (this.isPlaying) {
              this.ytPlayer?.playVideo();
            }
          },
          onStateChange: (event) => {
            // YT.PlayerState.PLAYING === 1, PAUSED === 2, ENDED === 0
            if (event.data === 1) {
              this.isPlaying = true;
              this.notify();
              this.startTimePolling();
              this.stopSynth();
            } else if (event.data === 2 || event.data === 0) {
              this.isPlaying = false;
              this.notify();
            }
          },
          onError: () => {
            // If YouTube error, fallback to synth
            if (this.isPlaying) {
              this.startSynthLoop();
            }
          }
        }
      });
    } catch (e) {
      console.warn('YouTube Player initialization notice:', e);
    }
  }

  public setVideoId(id: string) {
    if (!id || id.trim().length === 0) return;
    this.videoId = id.trim();
    if (this.ytReady && this.ytPlayer) {
      try {
        this.ytPlayer.loadVideoById(this.videoId);
      } catch {
        // Safe catch
      }
    }
  }

  public subscribe(listener: (playing: boolean) => void) {
    this.listeners.add(listener);
    listener(this.isPlaying);
    return () => {
      this.listeners.delete(listener);
    };
  }

  public subscribeTime(listener: (time: number, duration: number) => void) {
    this.currentTimeListeners.add(listener);
    return () => {
      this.currentTimeListeners.delete(listener);
    };
  }

  private notify() {
    this.listeners.forEach((fn) => fn(this.isPlaying));
  }

  private notifyTime(time: number, duration: number) {
    this.currentTimeListeners.forEach((fn) => fn(time, duration));
  }

  private startTimePolling() {
    if (this.timePollInterval !== null) {
      window.clearInterval(this.timePollInterval);
    }
    this.timePollInterval = window.setInterval(() => {
      if (this.ytPlayer && this.ytReady) {
        try {
          const cur = this.ytPlayer.getCurrentTime() || 0;
          const dur = this.ytPlayer.getDuration() || 240;
          this.notifyTime(cur, dur);
        } catch {
          // Ignore polling errors
        }
      } else {
        this.simulatedTime = (this.simulatedTime + 0.5) % this.simulatedDuration;
        this.notifyTime(this.simulatedTime, this.simulatedDuration);
      }
    }, 500);
  }

  public setVolume(vol: number) {
    this.volume = Math.max(0, Math.min(1, vol));
    if (this.ytReady && this.ytPlayer) {
      try {
        this.ytPlayer.setVolume(this.volume * 100);
      } catch {
        // ignore
      }
    }
  }

  public seekTo(seconds: number) {
    if (this.ytReady && this.ytPlayer) {
      try {
        this.ytPlayer.seekTo(seconds, true);
      } catch {
        // ignore
      }
    } else {
      this.simulatedTime = seconds;
      this.notifyTime(this.simulatedTime, this.simulatedDuration);
    }
  }

  public getVolume() {
    return this.volume;
  }

  public getIsPlaying() {
    return this.isPlaying;
  }

  public toggle(): boolean {
    if (this.isPlaying) {
      this.pause();
      return false;
    } else {
      this.play();
      return true;
    }
  }

  public play() {
    this.isPlaying = true;
    this.notify();

    // Check if player host is in DOM; if not attached, attempt attach
    if (!this.ytPlayer) {
      this.attachPlayer();
    }

    if (this.ytReady && this.ytPlayer) {
      try {
        this.ytPlayer.setVolume(this.volume * 100);
        this.ytPlayer.playVideo();
        this.startTimePolling();
        return;
      } catch (err) {
        console.warn('YouTube play attempt, starting fallback:', err);
      }
    }

    // Fallback synth loop if YouTube player is still preparing
    this.startSynthLoop();
  }

  public pause() {
    this.isPlaying = false;
    this.notify();

    if (this.ytReady && this.ytPlayer) {
      try {
        this.ytPlayer.pauseVideo();
      } catch {
        // ignore
      }
    }
    this.stopSynth();
  }

  public setCustomAudioUrl(url: string | null) {
    // If URL is a youtube link or video id, extract video id
    if (url && url.includes('v=')) {
      const match = url.match(/v=([a-zA-Z0-9_-]+)/);
      if (match && match[1]) {
        this.setVideoId(match[1]);
      }
    }
  }

  private stopSynth() {
    if (this.synthTimerId !== null) {
      window.clearInterval(this.synthTimerId);
      this.synthTimerId = null;
    }
  }

  private startSynthLoop() {
    this.stopSynth();
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }

    // Reality Club indie-pop acoustic progression:
    // C - G/B - Am - F
    const chords = [
      [130.81, 196.0, 261.63, 329.63, 392.0], // C
      [123.47, 196.0, 246.94, 293.66, 392.0], // G/B
      [110.0, 164.81, 220.0, 261.63, 329.63], // Am
      [87.31, 174.61, 220.0, 261.63, 349.23]  // F
    ];

    let chordIdx = 0;
    let step = 0;

    const tick = () => {
      if (!this.isPlaying) return;
      const currentChord = chords[chordIdx % chords.length];
      const freq = currentChord[step % currentChord.length];
      this.playSynthPluck(freq, 1.2);
      step++;
      if (step >= 6) {
        step = 0;
        chordIdx++;
      }
    };

    tick();
    this.synthTimerId = window.setInterval(tick, 360);
  }

  private playSynthPluck(freq: number, duration: number) {
    if (!this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(1200, now);
      filter.frequency.exponentialRampToValueAtTime(350, now + duration);

      const targetGain = this.volume * 0.22;
      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.linearRampToValueAtTime(targetGain, now + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + duration + 0.05);
    } catch {
      // AudioContext catch
    }
  }
}

export const romanticAudio = new RomanticAudioPlayer();

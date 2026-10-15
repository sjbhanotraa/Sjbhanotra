/**
 * Video Playback Controller
 * Handles media readiness, seeking to configurable continuation timestamps,
 * browser autoplay policy restrictions, and seamless completion callbacks.
 */

export interface VideoControllerOptions {
  videoElement: HTMLVideoElement;
  videoSrc: string;
  splitTimestamp: number;
  endTimestamp?: number;
  playbackRate?: number;
  onReady?: () => void;
  onEnded?: () => void;
  onError?: (error: Error) => void;
}

export class VideoPlaybackController {
  private video: HTMLVideoElement;
  private options: VideoControllerOptions;
  private isDestroyed = false;
  private timeUpdateListener?: () => void;
  private endedListener?: () => void;
  private errorListener?: (e: Event) => void;

  constructor(options: VideoControllerOptions) {
    this.options = options;
    this.video = options.videoElement;
  }

  public async initialize(): Promise<void> {
    if (this.isDestroyed) return;

    try {
      this.video.src = this.options.videoSrc;
      this.video.playsInline = true;
      this.video.playbackRate = this.options.playbackRate || 1.0;
      this.video.muted = true; // start muted to comply with strict browser autoplay policies

      // Wait until metadata is loaded to know duration and allow seeking
      if (this.video.readyState < HTMLMediaElement.HAVE_METADATA) {
        await new Promise<void>((resolve, reject) => {
          const onMeta = () => {
            this.video.removeEventListener('loadedmetadata', onMeta);
            this.video.removeEventListener('error', onErr);
            resolve();
          };
          const onErr = () => {
            this.video.removeEventListener('loadedmetadata', onMeta);
            this.video.removeEventListener('error', onErr);
            reject(new Error('Failed to load video metadata'));
          };
          this.video.addEventListener('loadedmetadata', onMeta);
          this.video.addEventListener('error', onErr);
        });
      }

      // Seek to split timestamp
      const targetTime = Math.max(0, Math.min(this.options.splitTimestamp, this.video.duration || 0));
      await this.seekTo(targetTime);

      this.options.onReady?.();
    } catch (err) {
      this.options.onError?.(err instanceof Error ? err : new Error(String(err)));
    }
  }

  public async play(): Promise<void> {
    if (this.isDestroyed) return;

    this.attachEventListeners();

    try {
      await this.video.play();
    } catch (err) {
      console.warn('Initial autoplay attempt blocked, retrying muted fallback:', err);
      this.video.muted = true;
      try {
        await this.video.play();
      } catch (retryErr) {
        this.options.onError?.(retryErr instanceof Error ? retryErr : new Error('Video playback failed'));
      }
    }
  }

  public pause(): void {
    if (!this.video.paused) {
      this.video.pause();
    }
  }

  public seekTo(time: number): Promise<void> {
    return new Promise((resolve) => {
      if (Math.abs(this.video.currentTime - time) < 0.05) {
        resolve();
        return;
      }

      const onSeeked = () => {
        this.video.removeEventListener('seeked', onSeeked);
        resolve();
      };

      this.video.addEventListener('seeked', onSeeked);
      this.video.currentTime = time;
    });
  }

  private attachEventListeners(): void {
    // End timestamp or natural video end
    this.timeUpdateListener = () => {
      if (this.options.endTimestamp && this.video.currentTime >= this.options.endTimestamp) {
        this.pause();
        this.options.onEnded?.();
      }
    };

    this.endedListener = () => {
      this.options.onEnded?.();
    };

    this.errorListener = () => {
      this.options.onError?.(new Error('Media playback error encountered'));
    };

    this.video.addEventListener('timeupdate', this.timeUpdateListener);
    this.video.addEventListener('ended', this.endedListener);
    this.video.addEventListener('error', this.errorListener);
  }

  public destroy(): void {
    this.isDestroyed = true;
    this.pause();

    if (this.timeUpdateListener) {
      this.video.removeEventListener('timeupdate', this.timeUpdateListener);
    }
    if (this.endedListener) {
      this.video.removeEventListener('ended', this.endedListener);
    }
    if (this.errorListener) {
      this.video.removeEventListener('error', this.errorListener);
    }
  }
}

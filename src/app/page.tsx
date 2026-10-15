'use client';

import React, { useState, useEffect, useRef } from 'react';
import { ArrowUpRight, Volume2, VolumeX, Sparkles } from 'lucide-react';
import { BackgroundGradient } from '@/components/BackgroundGradient';
import { VideoContinuation } from '@/components/VideoContinuation';
import { LoginScreen } from '@/components/LoginScreen';
import { ambientAudio } from '@/lib/ambient-sound';

type ScreenStep = 'intro' | 'experience';
type IntroPhase = 'video_intro' | 'blackout' | 'explore_ready';

export default function EntryExperience() {
  const [currentScreen, setCurrentScreen] = useState<ScreenStep>('intro');
  const [introPhase, setIntroPhase] = useState<IntroPhase>('video_intro');
  const [isIntroExiting, setIsIntroExiting] = useState(false);
  const [isWarping, setIsWarping] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentSeconds, setCurrentSeconds] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Sync mute state on mount
  useEffect(() => {
    setIsMuted(ambientAudio.getMuted());
  }, []);

  // Configure audio and playback for video_intro (uses video's default music)
  useEffect(() => {
    if (currentScreen !== 'intro') return;

    const video = videoRef.current;
    if (!video) return;

    if (introPhase === 'video_intro') {
      // Silence site procedural synth music so ONLY the video's default sound is playing
      ambientAudio.setSynthActive(false);

      video.currentTime = 0;
      video.playbackRate = 1.0;
      video.muted = isMuted;
      video.volume = 1.0;

      video.play().catch(() => {
        // Autoplay policy fallback: start muted then unmute on first gesture
        video.muted = true;
        video.play().catch(() => {});
      });

      // Unmute on first user gesture if not explicitly muted
      const handleUserGesture = () => {
        if (videoRef.current && introPhase === 'video_intro' && !ambientAudio.getMuted()) {
          videoRef.current.muted = false;
          videoRef.current.volume = 1.0;
          videoRef.current.play().catch(() => {});
        }
      };

      window.addEventListener('pointerdown', handleUserGesture, { once: true });
      window.addEventListener('keydown', handleUserGesture, { once: true });

      return () => {
        window.removeEventListener('pointerdown', handleUserGesture);
        window.removeEventListener('keydown', handleUserGesture);
      };
    } else if (introPhase === 'explore_ready') {
      // Video holds first frame, paused
      video.pause();
      video.currentTime = 0;
      // Activate site ambient music for the Explore screen
      ambientAudio.setSynthActive(true);
      ambientAudio.ensureRunning();
    }
  }, [currentScreen, introPhase, isMuted]);

  // Monitor video playback time: exactly 8 seconds of video
  const handleTimeUpdate = () => {
    const video = videoRef.current;
    if (!video || introPhase !== 'video_intro') return;

    const cur = video.currentTime;
    setCurrentSeconds(Math.min(8, Math.floor(cur)));

    // Smoothly fade audio at 7.4s - 8.0s
    if (cur >= 7.4 && cur < 8.0) {
      const remaining = (8.0 - cur) / 0.6;
      video.volume = Math.max(0, Math.min(1, remaining));
    }

    // At 8 seconds: trigger blackout transition
    if (cur >= 8.0) {
      triggerBlackout();
    }
  };

  const triggerBlackout = () => {
    if (introPhase !== 'video_intro') return;

    const video = videoRef.current;
    if (video) {
      video.pause();
      video.currentTime = 0; // Rewind to first frame
    }

    setIntroPhase('blackout');

    // Display blackout transition animation screen for ~1100ms, then reveal explore screen
    setTimeout(() => {
      setIntroPhase('explore_ready');
      ambientAudio.setSynthActive(true);
      ambientAudio.ensureRunning();
    }, 1150);
  };

  const handleSkipIntro = () => {
    ambientAudio.playClickSound();
    triggerBlackout();
  };

  const handleToggleAudio = () => {
    ambientAudio.playClickSound();
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    ambientAudio.setMuted(nextMuted);

    if (introPhase === 'video_intro' && videoRef.current) {
      videoRef.current.muted = nextMuted;
    }
  };

  const handleExploreClick = () => {
    ambientAudio.ensureRunning();
    ambientAudio.playClickSound();
    ambientAudio.playWarpSwell();

    if (videoRef.current) {
      videoRef.current.pause();
    }

    setIsIntroExiting(true);
    setIsWarping(true);

    // Transition into 4K video + Login Screen
    setTimeout(() => {
      ambientAudio.setSynthActive(true);
      setCurrentScreen('experience');
    }, 950);

    setTimeout(() => {
      setIsWarping(false);
    }, 1500);
  };

  return (
    <main
      style={{
        position: 'relative',
        width: '100vw',
        height: '100vh',
        overflow: 'hidden',
        backgroundColor: 'var(--bg-primary)',
      }}
    >
      {/* Dynamic atmospheric gradient background */}
      <BackgroundGradient />

      {/* 3D Warp Fly-Through Illusion Overlay */}
      {isWarping && <div className="warp-illusion-overlay" aria-hidden="true" />}

      {/* Editorial HUD metadata overlay */}
      <header className="editorial-hud" aria-label="Portfolio Interface Metadata">
        <div className="hud-top">
          <div className="hud-label">
            <span className="hud-indicator-dot" />
            {introPhase === 'video_intro'
              ? 'CINEMATIC INTRO // 8S PREVIEW'
              : introPhase === 'blackout'
              ? 'TRANSITIONING // DISSOLVE'
              : 'PORTFOLIO // EXPLORE READY'}
          </div>

          <div className="hud-center-code">
            {currentScreen === 'intro'
              ? introPhase === 'video_intro'
                ? 'ORIGINAL AUDIO TRACK // ACTIVE'
                : 'AMBIENT SOUND ENGINE // RUNNING'
              : 'PHASE 02 — ACCESS VERIFICATION'}
          </div>

          {/* Static Circular Mute Button controlling audio */}
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <button
              onClick={handleToggleAudio}
              onMouseEnter={() => ambientAudio.playHoverSound()}
              className="static-hud-mute-btn"
              title={isMuted ? 'Turn Sound On' : 'Turn Sound Off'}
              aria-label={isMuted ? 'Unmute Audio' : 'Mute Audio'}
            >
              {isMuted ? (
                <VolumeX size={15} />
              ) : (
                <Volume2 size={15} style={{ color: 'var(--accent-orange)' }} />
              )}
              <span className="hud-circle-tooltip" aria-hidden="true">
                {isMuted ? 'Muted' : 'Sound On'}
              </span>
            </button>
          </div>
        </div>

        <div className="hud-bottom">
          <div className="hud-label" style={{ opacity: 0.75 }}>
            {introPhase === 'video_intro'
              ? 'DEFAULT VIDEO MUSIC'
              : currentScreen === 'intro'
              ? 'SITE AMBIENT MUSIC'
              : '4K TERRAIN ENGINE // ACTIVE'}
          </div>

          <div className="hud-center-code" style={{ opacity: 0.75 }}>
            {currentScreen === 'intro' ? 'SANJANA SHARMA PORTFOLIO' : 'SECURE SESSION IDENTIFIER: 8803100375'}
          </div>

          <div className="hud-label" style={{ opacity: 0.75 }}>
            SINGLE USER GATEWAY
          </div>
        </div>
      </header>

      {/* SCREEN 01: INTRO 8-SECOND VIDEO, BLACKOUT ANIMATION & EXPLORE SCREEN */}
      {currentScreen === 'intro' && (
        <div
          className={`screen-wrapper ${
            currentScreen === 'intro' ? 'screen-active' : 'screen-inactive'
          } ${isIntroExiting ? 'intro-exiting' : ''}`}
          style={{ zIndex: 10 }}
        >
          {/* Fullscreen Video: gemini_generated_video_66d8be31.mp4 with 8s playback & first frame hold */}
          <div className="intro-video-container">
            <video
              ref={videoRef}
              src="/assets/video/gemini_generated_video_66d8be31.mp4"
              playsInline
              onTimeUpdate={handleTimeUpdate}
              className="intro-video-bg"
            />
            {/* Watermark guard overlay to completely conceal any watermark in the bottom corner */}
            <div className="intro-video-watermark-guard" aria-hidden="true" />
          </div>

          {/* Phase 1 Controls: 8-second Countdown Timer Pill & Skip to Explore */}
          {introPhase === 'video_intro' && (
            <>
              <div className="intro-timer-pill" aria-label="Intro Video Timer">
                <span className="intro-timer-dot" />
                <span>00:0{currentSeconds} // 00:08 INTRO</span>
              </div>

              <button
                onClick={handleSkipIntro}
                onMouseEnter={() => ambientAudio.playHoverSound()}
                className="intro-skip-btn"
                aria-label="Skip video intro to explore screen"
              >
                <span>Skip to Explore</span>
                <ArrowUpRight size={13} />
              </button>
            </>
          )}

          {/* Phase 2: Cinematic Blackout Animation Screen */}
          <div
            className={`intro-blackout-screen ${introPhase === 'blackout' ? 'is-active' : ''}`}
            aria-hidden={introPhase !== 'blackout'}
          >
            <div className="blackout-content">
              <div className="blackout-horizon-line" />
              <h2 className="blackout-title">SANJANA SHARMA</h2>
              <span className="blackout-subtitle">— Beyond The Ordinary —</span>
              <span className="blackout-tagline">UI/UX · Creative Development · Purposeful Interaction</span>
            </div>
          </div>

          {/* Phase 3: "Let's Explore" Button in Exact Middle of the Screen (Revealed after Blackout) */}
          <div
            className="cta-explore-middle-wrapper"
            style={{
              opacity: introPhase === 'explore_ready' ? 1 : 0,
              pointerEvents: introPhase === 'explore_ready' ? 'auto' : 'none',
              transform: introPhase === 'explore_ready'
                ? 'translate(-50%, -50%) scale(1)'
                : 'translate(-50%, -46%) scale(0.92)',
              transition: 'opacity 0.65s cubic-bezier(0.16, 1, 0.3, 1), transform 0.65s cubic-bezier(0.16, 1, 0.3, 1)',
            }}
          >
            <button
              id="cta-explore-btn"
              onClick={handleExploreClick}
              onMouseEnter={() => ambientAudio.playHoverSound()}
              className="cta-explore-btn cta-explore-btn-middle"
              aria-label="Let's Explore Portfolio Entry"
            >
              <span>Let&apos;s Explore</span>
              <ArrowUpRight className="cta-arrow-icon" />
            </button>
          </div>

          {/* Updated Floating "Recent Project" Card (Revealed on Explore Screen) */}
          <div
            className="intro-recent-project-card"
            style={{
              opacity: introPhase === 'explore_ready' ? 1 : 0,
              pointerEvents: introPhase === 'explore_ready' ? 'auto' : 'none',
              transform: introPhase === 'explore_ready' ? 'translateY(0)' : 'translateY(16px)',
              transition: 'opacity 0.6s ease 0.2s, transform 0.6s ease 0.2s',
            }}
          >
            <div className="recent-card-badge">
              <span className="recent-card-dot" />
              <span>LIVE PRODUCTION // 2026</span>
            </div>
            <div className="recent-card-body">
              <div className="recent-card-thumb">
                <img
                  src="/assets/live/amber-glass.jpg"
                  alt="ElloMed — Healthcare AI Platform"
                  className="recent-thumb-img"
                />
              </div>
              <div className="recent-card-meta">
                <h4 className="recent-card-title">ElloMed Healthcare AI</h4>
                <span className="recent-card-tag">Clinic Operations &amp; EHR SaaS</span>
              </div>
            </div>
            <button
              onClick={handleExploreClick}
              className="recent-card-cta"
              onMouseEnter={() => ambientAudio.playHoverSound()}
            >
              <span>Explore Live Project</span>
              <ArrowUpRight size={13} />
            </button>
          </div>
        </div>
      )}

      {/* SCREEN 02: 4K TERRAIN VIDEO WITH INTEGRATED LOGIN FORM */}
      {currentScreen === 'experience' && (
        <div
          className="screen-wrapper screen-active"
          style={{ zIndex: 20 }}
        >
          <VideoContinuation>
            {/* Login form directly on the video screen */}
            <LoginScreen />
          </VideoContinuation>
        </div>
      )}
    </main>
  );
}

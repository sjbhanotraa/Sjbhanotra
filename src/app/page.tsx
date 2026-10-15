'use client';

import React, { useState, useEffect } from 'react';
import { ArrowUpRight, Volume2, VolumeX } from 'lucide-react';
import { VideoContinuation } from '@/components/VideoContinuation';
import { LoginScreen } from '@/components/LoginScreen';
import { ambientAudio } from '@/lib/ambient-sound';

type ScreenStep = 'intro' | 'experience';

export default function EntryExperience() {
  const [currentScreen, setCurrentScreen] = useState<ScreenStep>('intro');
  const [isMuted, setIsMuted] = useState(false);

  // Sync mute state and ensure website default music is active across both screens
  useEffect(() => {
    setIsMuted(ambientAudio.getMuted());
    ambientAudio.setSynthActive(true);
    ambientAudio.ensureRunning();

    const handleFirstGesture = () => {
      ambientAudio.ensureRunning();
    };

    window.addEventListener('pointerdown', handleFirstGesture, { once: true, passive: true });
    window.addEventListener('keydown', handleFirstGesture, { once: true, passive: true });

    return () => {
      window.removeEventListener('pointerdown', handleFirstGesture);
      window.removeEventListener('keydown', handleFirstGesture);
    };
  }, []);

  const handleToggleAudio = () => {
    ambientAudio.playClickSound();
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    ambientAudio.setMuted(nextMuted);
  };

  const handleExploreClick = () => {
    ambientAudio.ensureRunning();
    ambientAudio.playClickSound();
    // Seamless cinematic music shift
    ambientAudio.playWarpSwell();

    // Smoothly 3D animate directly to the login form screen with zero blackout or grey gap
    setCurrentScreen('experience');
  };

  return (
    <main
      style={{
        position: 'relative',
        width: '100vw',
        height: '100vh',
        overflow: 'hidden',
        backgroundColor: '#000000',
      }}
    >
      {/* Editorial HUD metadata overlay - All text in crisp white */}
      <header className="editorial-hud editorial-hud-white" aria-label="Portfolio Interface Metadata">
        <div className="hud-top">
          <div className="hud-label">
            <span className="hud-indicator-dot" />
            <span className="hud-text-desktop">{currentScreen === 'intro' ? 'PORTFOLIO // EXPLORE READY' : 'ACCESS VERIFICATION // GATEWAY'}</span>
            <span className="hud-text-mobile">PORTFOLIO // 2026</span>
          </div>

          <div className="hud-center-code hud-center-desktop">
            {currentScreen === 'intro'
              ? 'AMBIENT SOUND ENGINE // RUNNING'
              : 'PHASE 02 — SECURE SESSION'}
          </div>

          {/* Static Circular Mute Button */}
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <button
              onClick={handleToggleAudio}
              onMouseEnter={() => ambientAudio.playHoverSound()}
              className="static-hud-mute-btn"
              title={isMuted ? 'Turn Sound On' : 'Turn Sound Off'}
              aria-label={isMuted ? 'Unmute Audio' : 'Mute Audio'}
            >
              {isMuted ? (
                <VolumeX size={15} color="#FFFFFF" />
              ) : (
                <Volume2 size={15} color="#FFFFFF" />
              )}
              <span className="hud-circle-tooltip" aria-hidden="true">
                {isMuted ? 'Muted' : 'Sound On'}
              </span>
            </button>
          </div>
        </div>

        <div className="hud-bottom">
          <div className="hud-label hud-bottom-left">
            <span className="hud-text-desktop">{currentScreen === 'intro' ? 'DEFAULT SITE MUSIC // ACTIVE' : '4K TERRAIN ENGINE // ACTIVE'}</span>
            <span className="hud-text-mobile">SANJANA SHARMA</span>
          </div>

          <div className="hud-center-code hud-center-desktop">
            {currentScreen === 'intro' ? 'SANJANA SHARMA PORTFOLIO' : 'SECURE SESSION IDENTIFIER: 8803100375'}
          </div>

          <div className="hud-label hud-bottom-right">
            <span className="hud-text-desktop">SINGLE USER GATEWAY</span>
            <span className="hud-text-mobile">SINGLE GATEWAY</span>
          </div>
        </div>
      </header>

      {/* SCREEN 02: 4K UHD TERRAIN VIDEO WITH INTEGRATED LOGIN FORM (Pre-mounted underneath for zero gap) */}
      <div
        className="screen-wrapper"
        style={{
          zIndex: currentScreen === 'experience' ? 20 : 5,
          opacity: currentScreen === 'experience' ? 1 : 0,
          transform:
            currentScreen === 'experience'
              ? 'perspective(1200px) translateZ(0) scale(1)'
              : 'perspective(1200px) translateZ(-60px) scale(0.96)',
          transition:
            'opacity 1.1s cubic-bezier(0.16, 1, 0.3, 1), transform 1.2s cubic-bezier(0.16, 1, 0.3, 1)',
          pointerEvents: currentScreen === 'experience' ? 'auto' : 'none',
        }}
      >
        <VideoContinuation>
          <LoginScreen />
        </VideoContinuation>
      </div>

      {/* SCREEN 01: LET'S EXPLORE SCREEN WITH UHD VIDEO BACKGROUND */}
      <div
        className="screen-wrapper"
        style={{
          zIndex: currentScreen === 'intro' ? 10 : 1,
          opacity: currentScreen === 'intro' ? 1 : 0,
          transform:
            currentScreen === 'intro'
              ? 'perspective(1200px) translateZ(0) scale(1)'
              : 'perspective(1200px) translateZ(120px) scale(1.08)',
          transition:
            'opacity 1.0s cubic-bezier(0.16, 1, 0.3, 1), transform 1.2s cubic-bezier(0.16, 1, 0.3, 1)',
          pointerEvents: currentScreen === 'intro' ? 'auto' : 'none',
        }}
      >
        {/* UHD Video Background: 8679945-uhd_4096_2160_25fps.mp4 */}
        <div className="intro-video-container">
          <video
            src="/assets/video/8679945-uhd_4096_2160_25fps.mp4"
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            className="intro-video-bg"
          />
        </div>

        {/* Explore Flow Center Container: "Let's Explore" Button + Live Project Card After Button on Mobile */}
        <div className="explore-main-center-flow">
          <div className="cta-explore-middle-wrapper">
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

          {/* "Recent Project" Live Production Card: Bottom Right on Desktop, Directly After Button on Mobile */}
          <div className="intro-recent-project-card">
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
      </div>
    </main>
  );
}

'use client';

import React, { useState, useEffect } from 'react';
import { ArrowUpRight, Volume2, VolumeX } from 'lucide-react';
import { VideoContinuation } from '@/components/VideoContinuation';
import { LoginScreen } from '@/components/LoginScreen';
import { ambientAudio } from '@/lib/ambient-sound';

type ScreenStep = 'intro' | 'experience';

export default function EntryExperience() {
  const [currentScreen, setCurrentScreen] = useState<ScreenStep>('intro');
  const [isIntroExiting, setIsIntroExiting] = useState(false);
  const [isWarping, setIsWarping] = useState(false);
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
    ambientAudio.playWarpSwell();

    setIsIntroExiting(true);
    setIsWarping(true);

    // Transition into UHD Video + Login Screen
    setTimeout(() => {
      ambientAudio.setSynthActive(true);
      setCurrentScreen('experience');
    }, 900);

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
        backgroundColor: '#000000',
      }}
    >
      {/* 3D Warp Fly-Through Illusion Overlay */}
      {isWarping && <div className="warp-illusion-overlay" aria-hidden="true" />}

      {/* Editorial HUD metadata overlay - All text in crisp white */}
      <header className="editorial-hud editorial-hud-white" aria-label="Portfolio Interface Metadata">
        <div className="hud-top">
          <div className="hud-label">
            <span className="hud-indicator-dot" />
            {currentScreen === 'intro' ? 'PORTFOLIO // EXPLORE READY' : 'ACCESS VERIFICATION // GATEWAY'}
          </div>

          <div className="hud-center-code">
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
          <div className="hud-label">
            {currentScreen === 'intro' ? 'DEFAULT SITE MUSIC // ACTIVE' : '4K TERRAIN ENGINE // ACTIVE'}
          </div>

          <div className="hud-center-code">
            {currentScreen === 'intro' ? 'SANJANA SHARMA PORTFOLIO' : 'SECURE SESSION IDENTIFIER: 8803100375'}
          </div>

          <div className="hud-label">
            SINGLE USER GATEWAY
          </div>
        </div>
      </header>

      {/* SCREEN 01: LET'S EXPLORE SCREEN WITH UHD VIDEO BACKGROUND */}
      {currentScreen === 'intro' && (
        <div
          className={`screen-wrapper screen-active ${isIntroExiting ? 'intro-exiting' : ''}`}
          style={{ zIndex: 10 }}
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

          {/* "Let's Explore" Button in Exact Middle of the Screen */}
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

          {/* Floating "Recent Project" Live Production Card */}
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
      )}

      {/* SCREEN 02: 4K UHD TERRAIN VIDEO WITH INTEGRATED LOGIN FORM */}
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

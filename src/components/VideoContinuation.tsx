'use client';

import React, { useEffect, useRef, useState } from 'react';
import { ANIMATION_CONFIG } from '@/config/animation';

interface VideoContinuationProps {
  children?: React.ReactNode;
}

export const VideoContinuation: React.FC<VideoContinuationProps> = ({ children }) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.src = ANIMATION_CONFIG.continuation.videoSrc;
    video.currentTime = ANIMATION_CONFIG.continuation.splitTimestamp || 0;
    video.muted = true;
    video.loop = true; // Loop smoothly in the background
    video.playbackRate = ANIMATION_CONFIG.continuation.playbackRate || 1.0;

    const onCanPlay = () => {
      setIsLoaded(true);
      video.play().catch((err) => {
        console.warn('Autoplay handled:', err);
      });
    };

    video.addEventListener('canplaythrough', onCanPlay);

    if (video.readyState >= HTMLMediaElement.HAVE_ENOUGH_DATA) {
      setIsLoaded(true);
      video.play().catch(() => {});
    }

    return () => {
      video.removeEventListener('canplaythrough', onCanPlay);
      video.pause();
    };
  }, []);

  return (
    <div
      className="video-screen-container"
      style={{
        position: 'absolute',
        inset: 0,
        width: '100vw',
        height: '100vh',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#000000',
      }}
    >
      {/* 4K Terrain Landscape Video absolutely positioned to fill background */}
      <video
        ref={videoRef}
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          zIndex: 1,
        }}
        className={`continuation-video transition-opacity duration-1000 ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        }`}
        playsInline
        muted
        loop
        preload="auto"
      />

      {/* Login Form perfectly centered and floating in the middle above video */}
      {children && (
        <div
          className="video-login-center-wrapper"
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 30,
            padding: '1.5rem',
            pointerEvents: 'none',
          }}
        >
          <div
            style={{
              pointerEvents: 'auto',
              width: '100%',
              maxWidth: '420px',
              display: 'flex',
              justifyContent: 'center',
              animation: 'floatInPerspective 0.9s cubic-bezier(0.16, 1, 0.3, 1) forwards',
            }}
          >
            {children}
          </div>
        </div>
      )}
    </div>
  );
};

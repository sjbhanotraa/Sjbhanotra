'use client';

import React, { useEffect, useRef, useState } from 'react';

/**
 * CustomCursor:
 * Renders a smooth, high-precision orange circular cursor for the portfolio.
 * - Center glowing amber/orange dot
 * - Fluid lagging outer trailing ring with warm glow
 * - Dynamic expansion & magnetic bloom on clickable elements (buttons, links, cards)
 */
export const CustomCursor: React.FC = () => {
  const dotRef = useRef<HTMLDivElement | null>(null);
  const ringRef = useRef<HTMLDivElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    // Check if device supports fine hover pointer (disable on touch screens)
    if (typeof window === 'undefined' || window.matchMedia('(pointer: coarse)').matches) {
      return;
    }

    let mouseX = -100;
    let mouseY = -100;
    let ringX = -100;
    let ringY = -100;
    let animationFrameId: number;

    const onMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (!isVisible) setIsVisible(true);

      // Instant update for center dot
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;
      }

      // Check if hovering interactive target
      const target = e.target as HTMLElement | null;
      if (target) {
        const isInteractive = Boolean(
          target.closest('button') ||
          target.closest('a') ||
          target.closest('input') ||
          target.closest('.project-card-link') ||
          target.closest('.cta-explore-btn') ||
          target.closest('.hero-primary-btn') ||
          target.closest('.hero-secondary-btn') ||
          target.closest('[role="button"]')
        );
        setIsHovered(isInteractive);
      }
    };

    const onMouseLeave = () => {
      setIsVisible(false);
    };

    const onMouseEnter = () => {
      setIsVisible(true);
    };

    // Smooth physics loop for outer follower ring
    const render = () => {
      // Lerp damping 0.16 for fluid follower movement
      ringX += (mouseX - ringX) * 0.16;
      ringY += (mouseY - ringY) * 0.16;

      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ringX}px, ${ringY}px, 0)`;
      }

      animationFrameId = requestAnimationFrame(render);
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    document.addEventListener('mouseleave', onMouseLeave);
    document.addEventListener('mouseenter', onMouseEnter);
    animationFrameId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseleave', onMouseLeave);
      document.removeEventListener('mouseenter', onMouseEnter);
      cancelAnimationFrame(animationFrameId);
    };
  }, [isVisible]);

  return (
    <div
      className="custom-cursor-container"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: 0,
        height: 0,
        pointerEvents: 'none',
        zIndex: 999999,
        opacity: isVisible ? 1 : 0,
        transition: 'opacity 0.25s ease',
      }}
      aria-hidden="true"
    >
      {/* 1. Precise Center Glowing Orange Dot */}
      <div
        ref={dotRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: isHovered ? '4px' : '7px',
          height: isHovered ? '4px' : '7px',
          marginLeft: isHovered ? '-2px' : '-3.5px',
          marginTop: isHovered ? '-2px' : '-3.5px',
          borderRadius: '50%',
          backgroundColor: '#FFAE42',
          boxShadow: '0 0 10px rgba(255, 174, 66, 0.95), 0 0 20px rgba(224, 122, 95, 0.6)',
          pointerEvents: 'none',
          willChange: 'transform',
          transition: 'width 0.2s ease, height 0.2s ease, margin 0.2s ease',
        }}
      />

      {/* 2. Smooth Lagging Orange Ring */}
      <div
        ref={ringRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: isHovered ? '54px' : '34px',
          height: isHovered ? '54px' : '34px',
          marginLeft: isHovered ? '-27px' : '-17px',
          marginTop: isHovered ? '-27px' : '-17px',
          borderRadius: '50%',
          border: isHovered
            ? '1.5px solid rgba(255, 174, 66, 0.95)'
            : '1.5px solid rgba(224, 122, 95, 0.75)',
          backgroundColor: isHovered
            ? 'rgba(224, 122, 95, 0.22)'
            : 'rgba(224, 122, 95, 0.08)',
          boxShadow: isHovered
            ? '0 0 24px rgba(224, 122, 95, 0.45), inset 0 0 12px rgba(255, 174, 66, 0.3)'
            : '0 0 12px rgba(224, 122, 95, 0.2)',
          pointerEvents: 'none',
          willChange: 'transform',
          transition: 'width 0.22s cubic-bezier(0.16, 1, 0.3, 1), height 0.22s cubic-bezier(0.16, 1, 0.3, 1), margin 0.22s cubic-bezier(0.16, 1, 0.3, 1), background-color 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease',
        }}
      />
    </div>
  );
};

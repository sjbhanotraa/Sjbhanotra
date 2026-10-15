'use client';

import React, { useEffect, useRef, useState } from 'react';

interface Home3DSceneProps {
  className?: string;
}

interface Particle {
  x: number;
  y: number;
  size: number;
  speedY: number;
  speedX: number;
  opacity: number;
  pulseSpeed: number;
  baseOpacity: number;
}

/**
 * Home3DScene:
 * Renders the architectural rotunda as a full-bleed edge-to-edge background with:
 * 1. 100% full screen coverage (zero grey margins/borders).
 * 2. 3D cursor-driven perspective tilt & parallax with smooth damping.
 * 3. Dynamic cursor spotlight bloom that tracks the mouse over the chamber.
 * 4. Ambient breathing scale motion.
 * 5. Floating ambient golden dust/light motes.
 * 6. Atmospheric depth vignette.
 */
export const Home3DScene: React.FC<Home3DSceneProps> = ({ className }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const imageRef = useRef<HTMLDivElement | null>(null);
  const spotlightRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Mouse coordinates state for dynamic styling
  const mousePos = useRef({ x: 0.5, y: 0.5, currentX: 0.5, currentY: 0.5 });
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    let animationFrameId: number;
    const container = containerRef.current;
    const imageEl = imageRef.current;
    const spotlightEl = spotlightRef.current;
    const canvas = canvasRef.current;

    if (!container || !imageEl || !spotlightEl) return;

    // 1. Setup floating dust particles canvas
    let ctx: CanvasRenderingContext2D | null = null;
    let particles: Particle[] = [];

    if (canvas) {
      ctx = canvas.getContext('2d');
      const resizeCanvas = () => {
        if (!canvas || !container) return;
        canvas.width = container.clientWidth;
        canvas.height = container.clientHeight;
      };
      resizeCanvas();
      window.addEventListener('resize', resizeCanvas);

      // Create 35 warm floating light motes
      const count = 35;
      for (let i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * (canvas.width || window.innerWidth),
          y: Math.random() * (canvas.height || window.innerHeight),
          size: Math.random() * 2.4 + 0.8,
          speedY: -(Math.random() * 0.45 + 0.15),
          speedX: (Math.random() - 0.5) * 0.25,
          opacity: Math.random() * 0.55 + 0.25,
          baseOpacity: Math.random() * 0.55 + 0.25,
          pulseSpeed: Math.random() * 0.025 + 0.01,
        });
      }
    }

    // 2. Mouse Move Listener
    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;
      mousePos.current.x = Math.max(0, Math.min(1, x));
      mousePos.current.y = Math.max(0, Math.min(1, y));
    };

    const handleMouseLeave = () => {
      mousePos.current.x = 0.5;
      mousePos.current.y = 0.5;
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);

    // 3. Animation Loop (60fps smooth interpolation)
    let time = 0;

    const render = () => {
      time += 0.015;

      // Smooth lerp damping towards target mouse position
      const dx = mousePos.current.x - mousePos.current.currentX;
      const dy = mousePos.current.y - mousePos.current.currentY;
      mousePos.current.currentX += dx * 0.055;
      mousePos.current.currentY += dy * 0.055;

      const normX = (mousePos.current.currentX - 0.5) * 2; // -1 to 1
      const normY = (mousePos.current.currentY - 0.5) * 2; // -1 to 1

      // 3D Perspective Tilt calculations
      // Image is scaled to 1.07 to prevent any edge clipping
      const rotateX = -normY * 4.5; // Max 4.5deg tilt on X
      const rotateY = normX * 6.5; // Max 6.5deg tilt on Y
      const translateX = -normX * 18; // Max 18px shift on X
      const translateY = -normY * 12; // Max 12px shift on Y

      // Continuous subtle breathing zoom
      const breatheScale = 1.06 + Math.sin(time * 0.6) * 0.015;

      imageEl.style.transform = `perspective(1100px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translate3d(${translateX.toFixed(1)}px, ${translateY.toFixed(1)}px, 0) scale(${breatheScale.toFixed(3)})`;

      // Update Cursor Dynamic Spotlight Glow
      const spotX = (mousePos.current.currentX * 100).toFixed(1);
      const spotY = (mousePos.current.currentY * 100).toFixed(1);
      spotlightEl.style.background = `radial-gradient(circle 650px at ${spotX}% ${spotY}%, rgba(255, 195, 95, 0.28) 0%, rgba(247, 140, 70, 0.12) 42%, transparent 75%)`;

      // Draw floating dust particles
      if (ctx && canvas) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        for (let i = 0; i < particles.length; i++) {
          const p = particles[i];
          p.y += p.speedY;
          p.x += p.speedX + normX * 0.2; // particles drift with cursor
          p.opacity = p.baseOpacity + Math.sin(time * 2 + i) * 0.15;

          // Wrap around top
          if (p.y < -10) {
            p.y = canvas.height + 10;
            p.x = Math.random() * canvas.width;
          }
          if (p.x < -10) p.x = canvas.width + 10;
          if (p.x > canvas.width + 10) p.x = -10;

          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 220, 160, ${Math.max(0, Math.min(1, p.opacity))})`;
          ctx.shadowBlur = 8;
          ctx.shadowColor = 'rgba(255, 180, 80, 0.8)';
          ctx.fill();
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    // Mark as loaded
    const img = new Image();
    img.src = '/assets/homepage/architectural_rotunda.png';
    img.onload = () => setIsLoaded(true);
    if (img.complete) setIsLoaded(true);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={`home-full-image-scene ${className || ''}`}
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        zIndex: 1,
        pointerEvents: 'none',
      }}
      aria-hidden="true"
    >
      {/* 1. Full Image Layer with 3D Tilt & Parallax */}
      <div
        ref={imageRef}
        style={{
          position: 'absolute',
          inset: '-5%',
          width: '110%',
          height: '110%',
          backgroundImage: 'url(/assets/homepage/architectural_rotunda.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center center',
          backgroundRepeat: 'no-repeat',
          willChange: 'transform',
          transition: isLoaded ? 'opacity 0.8s ease-out' : 'none',
          opacity: isLoaded ? 1 : 0.85,
        }}
      />

      {/* 2. Dynamic Cursor Light Spotlight Glow */}
      <div
        ref={spotlightRef}
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          mixBlendMode: 'screen',
          zIndex: 2,
        }}
      />

      {/* 3. Floating Amber Light Dust Motes Canvas */}
      <canvas
        ref={canvasRef}
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
          zIndex: 3,
        }}
      />

      {/* 4. Atmospheric Vignette & Contrast Gradients */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          zIndex: 4,
          background: 'radial-gradient(circle at 50% 50%, transparent 40%, rgba(12, 14, 18, 0.42) 85%, rgba(12, 14, 18, 0.65) 100%)',
        }}
      />


    </div>
  );
};

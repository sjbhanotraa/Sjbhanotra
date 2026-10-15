'use client';

import React, { useEffect, useRef } from 'react';

/**
 * BackgroundGradient
 * Renders an ultra-smooth, slow-moving atmospheric gradient lighting canvas.
 * Dominant color: #CACDD2 with subtle warm peach, muted orange, soft coral, and neutral grey.
 */
export const BackgroundGradient: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    // Mouse coordinates with smooth lerping
    let targetMouseX = 0.5;
    let targetMouseY = 0.5;
    let currentMouseX = 0.5;
    let currentMouseY = 0.5;

    const handleMouseMove = (e: MouseEvent) => {
      targetMouseX = e.clientX / window.innerWidth;
      targetMouseY = e.clientY / window.innerHeight;
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    let time = 0;

    const render = () => {
      time += 0.003; // slow, gentle cinematic movement

      currentMouseX += (targetMouseX - currentMouseX) * 0.04;
      currentMouseY += (targetMouseY - currentMouseY) * 0.04;

      // 1. Base dominant neutral background #CACDD2
      ctx.fillStyle = '#CACDD2';
      ctx.fillRect(0, 0, width, height);

      // Subtle atmospheric lighting points (slow drifting orbits)
      // Light Orb 1: Warm Peach (#F7C4B2)
      const p1x = width * (0.35 + Math.sin(time * 0.7) * 0.15 + (currentMouseX - 0.5) * 0.08);
      const p1y = height * (0.45 + Math.cos(time * 0.6) * 0.12 + (currentMouseY - 0.5) * 0.08);
      const grad1 = ctx.createRadialGradient(p1x, p1y, 40, p1x, p1y, Math.max(width, height) * 0.6);
      grad1.addColorStop(0, 'rgba(247, 196, 178, 0.28)'); // warm peach
      grad1.addColorStop(0.5, 'rgba(247, 196, 178, 0.10)');
      grad1.addColorStop(1, 'rgba(202, 205, 210, 0)');
      ctx.fillStyle = grad1;
      ctx.fillRect(0, 0, width, height);

      // Light Orb 2: Soft Coral (#EB9684)
      const p2x = width * (0.68 + Math.cos(time * 0.5) * 0.12 - (currentMouseX - 0.5) * 0.06);
      const p2y = height * (0.55 + Math.sin(time * 0.8) * 0.15 - (currentMouseY - 0.5) * 0.06);
      const grad2 = ctx.createRadialGradient(p2x, p2y, 30, p2x, p2y, Math.max(width, height) * 0.55);
      grad2.addColorStop(0, 'rgba(235, 150, 132, 0.22)'); // soft coral
      grad2.addColorStop(0.6, 'rgba(235, 150, 132, 0.06)');
      grad2.addColorStop(1, 'rgba(202, 205, 210, 0)');
      ctx.fillStyle = grad2;
      ctx.fillRect(0, 0, width, height);

      // Light Orb 3: Muted Orange Accent (#E07A5F) - very soft, deep in lower quadrant
      const p3x = width * (0.50 + Math.sin(time * 0.9 + 1.5) * 0.18);
      const p3y = height * (0.80 + Math.cos(time * 0.7 + 2.0) * 0.10);
      const grad3 = ctx.createRadialGradient(p3x, p3y, 20, p3x, p3y, Math.max(width, height) * 0.5);
      grad3.addColorStop(0, 'rgba(224, 122, 95, 0.16)'); // muted orange
      grad3.addColorStop(0.5, 'rgba(224, 122, 95, 0.04)');
      grad3.addColorStop(1, 'rgba(202, 205, 210, 0)');
      ctx.fillStyle = grad3;
      ctx.fillRect(0, 0, width, height);

      // Light Orb 4: Neutral Grey / Subtle Deep Shadow Tone (#B0B5BB)
      const p4x = width * (0.2 + Math.cos(time * 0.4) * 0.1);
      const p4y = height * (0.2 + Math.sin(time * 0.5) * 0.1);
      const grad4 = ctx.createRadialGradient(p4x, p4y, 50, p4x, p4y, Math.max(width, height) * 0.7);
      grad4.addColorStop(0, 'rgba(176, 181, 187, 0.25)');
      grad4.addColorStop(1, 'rgba(202, 205, 210, 0)');
      ctx.fillStyle = grad4;
      ctx.fillRect(0, 0, width, height);

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="cinematic-bg"
      aria-hidden="true"
      style={{ display: 'block' }}
    />
  );
};

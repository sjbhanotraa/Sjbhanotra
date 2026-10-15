'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  ArrowUpRight,
  Sparkles,
  Zap,
  Activity,
  Layers,
  Globe,
  Key,
  Cpu,
  Coffee,
  Compass,
  Flame,
  MessageSquare,
  Package,
} from 'lucide-react';
import { ProjectItem } from '@/config/animation';
import { ambientAudio } from '@/lib/ambient-sound';

export interface ProjectPixelCardProps {
  item: ProjectItem;
  coverImage: string;
  iconName: string;
  shortName: string;
  tag: string;
  onOpenProject: (item: ProjectItem) => void;
}

export const ProjectPixelCard: React.FC<ProjectPixelCardProps> = ({
  item,
  coverImage,
  iconName,
  shortName,
  tag,
  onOpenProject,
}) => {
  const [isRevealed, setIsRevealed] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);
  const cardRef = useRef<HTMLDivElement | null>(null);

  const renderIcon = (type: string) => {
    switch (type) {
      case 'cpu':
        return <Cpu size={15} />;
      case 'activity':
        return <Activity size={15} />;
      case 'key':
        return <Key size={15} />;
      case 'zap':
        return <Zap size={15} />;
      case 'sparkles':
        return <Sparkles size={15} />;
      case 'layers':
        return <Layers size={15} />;
      case 'globe':
        return <Globe size={15} />;
      case 'coffee':
        return <Coffee size={15} />;
      case 'compass':
        return <Compass size={15} />;
      case 'flame':
        return <Flame size={15} />;
      case 'message':
        return <MessageSquare size={15} />;
      case 'package':
        return <Package size={15} />;
      default:
        return <Sparkles size={15} />;
    }
  };

  const handleCardClick = (e: React.MouseEvent) => {
    e.preventDefault();

    if (isAnimating) return;

    const isMobile = typeof window !== 'undefined' && window.innerWidth <= 768;

    if (isRevealed) {
      ambientAudio.playClickSound();
      if (isMobile && item.behanceUrl) {
        window.open(item.behanceUrl, '_blank', 'noopener,noreferrer');
      } else {
        onOpenProject(item);
      }
      return;
    }

    startPixelateVanish();
  };

  const startPixelateVanish = () => {
    ambientAudio.playClickSound();
    setIsAnimating(true);

    const canvas = canvasRef.current;
    const coverImg = imgRef.current;
    const cardEl = cardRef.current;

    if (!canvas || !coverImg || !cardEl) {
      setTimeout(() => {
        setIsRevealed(true);
        setIsAnimating(false);
        onOpenProject(item);
      }, 500);
      return;
    }

    const rect = cardEl.getBoundingClientRect();
    const width = Math.floor(rect.width) || 240;
    const height = Math.floor(rect.height) || 240;
    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) {
      setIsRevealed(true);
      setIsAnimating(false);
      onOpenProject(item);
      return;
    }

    // Prepare offscreen canvas to sample pixel colors from the cover image
    const offscreen = document.createElement('canvas');
    offscreen.width = width;
    offscreen.height = height;
    const offCtx = offscreen.getContext('2d');
    if (offCtx) {
      try {
        offCtx.drawImage(coverImg, 0, 0, width, height);
      } catch (err) {
        console.warn('Offscreen draw notice:', err);
      }
    }

    let imgData: ImageData | null = null;
    try {
      if (offCtx) {
        imgData = offCtx.getImageData(0, 0, width, height);
      }
    } catch {
      // Safe fallback if tainted
    }

    const numRows = 18;
    const numCols = 18;
    const blockW = width / numCols;
    const blockH = height / numRows;

    const duration = 650; // ms
    let startTime: number | null = null;

    const renderFrame = (now: number) => {
      if (!startTime) startTime = now;
      const elapsed = now - startTime;
      const progress = Math.min(1, elapsed / duration);

      ctx.clearRect(0, 0, width, height);

      // The vanish wave travels from top (0) to bottom (1)
      const wave = progress * 1.45;

      for (let r = 0; r < numRows; r++) {
        const rowNorm = r / numRows;
        const diff = wave - rowNorm;
        const rowY = Math.floor(r * blockH);
        const rowHeight = Math.ceil(blockH);

        if (diff < 0) {
          // Untouched normal slice
          if (coverImg.naturalWidth > 0 && coverImg.naturalHeight > 0) {
            ctx.drawImage(
              coverImg,
              0,
              (r * coverImg.naturalHeight) / numRows,
              coverImg.naturalWidth,
              coverImg.naturalHeight / numRows,
              0,
              rowY,
              width,
              rowHeight
            );
          }
        } else if (diff < 0.18) {
          // ACTIVE PIXELATION STAGE: Chunky mosaic pixel blocks
          for (let c = 0; c < numCols; c++) {
            const blockX = Math.floor(c * blockW);
            const blockWidth = Math.ceil(blockW);
            let color = 'rgba(255, 90, 31, 0.9)';

            if (imgData) {
              const sampleX = Math.min(width - 1, Math.floor(blockX + blockW / 2));
              const sampleY = Math.min(height - 1, Math.floor(rowY + blockH / 2));
              const idx = (sampleY * width + sampleX) * 4;
              const red = imgData.data[idx];
              const green = imgData.data[idx + 1];
              const blue = imgData.data[idx + 2];
              color = `rgb(${red}, ${green}, ${blue})`;
            }

            ctx.fillStyle = color;
            ctx.fillRect(blockX, rowY, blockWidth, rowHeight);

            // Subtle digital highlight on leading pixel edge
            if (diff < 0.08) {
              ctx.strokeStyle = 'rgba(255, 200, 100, 0.45)';
              ctx.lineWidth = 1;
              ctx.strokeRect(blockX, rowY, blockWidth, rowHeight);
            }
          }

          // Glowing scanline on leading edge
          if (diff < 0.06) {
            ctx.fillStyle = 'rgba(255, 160, 50, 0.75)';
            ctx.fillRect(0, rowY + rowHeight - 2, width, 2);
          }
        } else if (diff < 0.38) {
          // DISINTEGRATE / DISSOLVE STAGE: Pixels shrink and vanish
          const dissolveProgress = (diff - 0.18) / 0.2;
          const alpha = Math.max(0, 1 - dissolveProgress);
          const scale = Math.max(0.2, 1 - dissolveProgress * 0.8);

          for (let c = 0; c < numCols; c++) {
            const blockX = Math.floor(c * blockW);
            const blockWidth = Math.ceil(blockW);
            let red = 255,
              green = 90,
              blue = 31;

            if (imgData) {
              const sampleX = Math.min(width - 1, Math.floor(blockX + blockW / 2));
              const sampleY = Math.min(height - 1, Math.floor(rowY + blockH / 2));
              const idx = (sampleY * width + sampleX) * 4;
              red = imgData.data[idx];
              green = imgData.data[idx + 1];
              blue = imgData.data[idx + 2];
            }

            ctx.fillStyle = `rgba(${red}, ${green}, ${blue}, ${alpha})`;
            const sw = blockWidth * scale;
            const sh = rowHeight * scale;
            const ox = blockX + (blockWidth - sw) / 2;
            const oy = rowY + (rowHeight - sh) / 2;
            ctx.fillRect(ox, oy, sw, sh);
          }
        }
        // diff >= 0.38: row is completely vanished / transparent!
      }

      if (progress < 1) {
        requestAnimationFrame(renderFrame);
      } else {
        // Pixelation complete: reveal underlying image and open further flow (Behance on mobile, modal on desktop)
        setIsAnimating(false);
        setIsRevealed(true);
        setTimeout(() => {
          const isMobile = typeof window !== 'undefined' && window.innerWidth <= 768;
          if (isMobile && item.behanceUrl) {
            window.open(item.behanceUrl, '_blank', 'noopener,noreferrer');
          } else {
            onOpenProject(item);
          }
        }, 150);
      }
    };

    requestAnimationFrame(renderFrame);
  };

  return (
    <div
      ref={cardRef}
      onClick={handleCardClick}
      onMouseEnter={() => ambientAudio.playHoverSound()}
      className={`project-card-link behance-card pixel-project-card ${isRevealed ? 'is-revealed' : ''}`}
      role="listitem"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          handleCardClick(e as any);
        }
      }}
      aria-label={`Project card: ${item.title}`}
    >
      {/* LAYER 1: The Underlying Actual Project Image (revealed when cover vanishes) */}
      <img
        src={item.image}
        alt={item.title}
        width={224}
        height={226}
        loading="eager"
        decoding="async"
        className="project-actual-img"
      />

      {/* Revealed Info Banner at bottom of revealed card */}
      <div className="project-revealed-info">
        <div className="revealed-badge">
          <span className="live-badge-dot" />
          <span>PROJECT REVEALED</span>
        </div>
        <div className="revealed-title-row">
          <span className="revealed-title">{item.title}</span>
          <ArrowUpRight size={14} className="revealed-arrow" />
        </div>
      </div>

      {/* LAYER 2: The Cover Image Layer (3D artwork from live projects, with icon & little text) */}
      {!isRevealed && (
        <div className={`project-cover-layer ${isAnimating ? 'is-animating' : ''}`}>
          <img
            ref={imgRef}
            src={coverImage}
            alt={`${item.title} Cover Artwork`}
            className="project-cover-img"
            loading="eager"
          />

          {/* Atmospheric gradient for readability */}
          <div className="project-cover-gradient" />

          {/* Top row: Icon emblem & Tag */}
          <div className="project-cover-top">
            <div className="cover-icon-emblem">{renderIcon(iconName)}</div>
            <span className="cover-tag-pill">{tag}</span>
          </div>

          {/* Bottom row: Project Name in Little Text + Tap to Reveal */}
          <div className="project-cover-bottom">
            <div className="cover-text-group">
              <span className="cover-little-name">{shortName}</span>
              <span className="cover-subtitle">{item.category}</span>
            </div>
            <div className="cover-click-cue">
              <span className="cue-dot" />
              <span className="cue-text">TAP TO REVEAL</span>
            </div>
          </div>

          {/* LAYER 3: The Pixelation Vanish Canvas (active during animation) */}
          <canvas
            ref={canvasRef}
            className={`pixel-vanish-canvas ${isAnimating ? 'is-active' : ''}`}
          />
        </div>
      )}
    </div>
  );
};

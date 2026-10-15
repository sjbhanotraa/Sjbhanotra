'use client';

import React from 'react';
import { ArrowUpRight, Sparkles } from 'lucide-react';
import { ANIMATION_CONFIG } from '@/config/animation';
import { ambientAudio } from '@/lib/ambient-sound';

interface HomeHeroProps {
  onExploreProjects: () => void;
}

export const HomeHero: React.FC<HomeHeroProps> = ({ onExploreProjects }) => {
  return (
    <div className="home-hero-content" role="region" aria-label="Hero Introduction">
      {/* Small uppercase category label */}
      <div className="hero-badge animate-fade-in">
        <span className="hero-badge-dot" />
        <span className="hero-badge-text">PORTFOLIO ARCHIVE // 2026</span>
      </div>

      {/* Main Headline with Italian / Italic Font Styling on Beyond */}
      <h1 className="hero-main-headline hero-beyond-headline">
        <span className="mask-reveal-wrap">
          <span className="mask-reveal-inner delay-1">
            <span className="hero-italic-beyond">Beyond</span> The Ordinary
          </span>
        </span>
      </h1>

      {/* Supporting Description */}
      <p className="hero-supporting-copy hero-bio-statement animate-fade-in-delayed">
        I transform ideas into thoughtful digital experiences through UI/UX design, creative development, and purposeful interaction.
      </p>

      {/* Supporting Copy & CTAs */}
      <div className="hero-cta-wrapper animate-fade-in-delayed-2">
        <div className="hero-buttons-row">
          {/* Primary CTA: Explore My Work */}
          <button
            onClick={onExploreProjects}
            onMouseEnter={() => ambientAudio.playHoverSound()}
            className="hero-primary-btn hero-explore-work-btn"
            aria-label="Explore My Work - View Projects Showcase"
          >
            <span>Explore My Work</span>
            <ArrowUpRight size={16} className="hero-btn-icon" />
          </button>

          {/* Secondary CTA: Get In Touch */}
          <a
            href="mailto:sanjana19122001@gmail.com"
            onMouseEnter={() => ambientAudio.playHoverSound()}
            className="hero-secondary-btn"
            aria-label="Get In Touch - Inquire for collaboration"
          >
            <span>Get In Touch</span>
            <Sparkles size={14} className="hero-btn-icon" />
          </a>
        </div>
      </div>
    </div>
  );
};

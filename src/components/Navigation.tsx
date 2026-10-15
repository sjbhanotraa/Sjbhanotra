'use client';

import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Menu, X, ArrowRight, MessageSquare, Mail, Sparkles } from 'lucide-react';
import { ANIMATION_CONFIG } from '@/config/animation';
import { ambientAudio } from '@/lib/ambient-sound';

export type PortfolioSection = 'home' | 'projects' | 'live-projects' | 'resume' | 'contact';

interface NavigationProps {
  activeSection: PortfolioSection;
  onSectionChange: (section: PortfolioSection) => void;
  isMuted: boolean;
  onToggleMute: () => void;
}

export const Navigation: React.FC<NavigationProps> = ({
  activeSection,
  onSectionChange,
  isMuted,
  onToggleMute,
}) => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // Close mobile drawer on ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isMobileOpen) {
        setIsMobileOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isMobileOpen]);

  const handleNavClick = (section: PortfolioSection) => {
    ambientAudio.playClickSound();
    if (section !== activeSection) {
      ambientAudio.playPageTransitionEffect();
    }
    setIsMobileOpen(false);
    onSectionChange(section);
    if (typeof window !== 'undefined') {
      const newHash = section === 'home' ? '#home' : `#${section}`;
      window.history.replaceState(null, '', newHash);
    }
  };

  const handleMuteToggle = () => {
    ambientAudio.playClickSound();
    onToggleMute();
  };

  const toggleMobileMenu = () => {
    ambientAudio.playClickSound();
    setIsMobileOpen((prev) => !prev);
  };

  const navItems: { id: PortfolioSection; label: string; desc: string }[] = [
    { id: 'home', label: 'Home', desc: 'Cover & Interactive Scene' },
    { id: 'projects', label: 'Projects', desc: '12 Authentic Behance Case Studies' },
    { id: 'live-projects', label: 'Live Projects', desc: 'Healthcare, PropTech & Shopify Builds' },
    { id: 'resume', label: 'Resume', desc: 'Full Curriculum Vitae & PDF' },
    { id: 'contact', label: 'Contact', desc: 'Direct Collaboration & WhatsApp' },
  ];

  return (
    <>
      <nav
        className={`portfolio-nav ${activeSection === 'home' ? 'nav-on-image' : 'nav-on-projects'}`}
        role="navigation"
        aria-label="Main Portfolio Navigation"
      >
        <div className="nav-container">
          {/* Left: Wordmark / Logo - returns to Home */}
          <button
            onClick={() => handleNavClick('home')}
            onMouseEnter={() => ambientAudio.playHoverSound()}
            className="nav-wordmark-btn"
            aria-label="Sanjana Sharma Portfolio - Return to Home"
          >
            <span className="nav-wordmark-dot" />
            <span className="nav-wordmark-text">
              {ANIMATION_CONFIG.portfolio.name}
            </span>
          </button>

          {/* Desktop Nav cluster (visible on desktop > 768px) */}
          <div className="nav-menu-cluster desktop-only-cluster">
            {/* 1. Projects (Showcase) */}
            <div className="nav-item-wrapper">
              <button
                onClick={() => handleNavClick('projects')}
                onMouseEnter={() => ambientAudio.playHoverSound()}
                className={`nav-pill-item ${activeSection === 'projects' ? 'is-active' : ''}`}
                aria-current={activeSection === 'projects' ? 'page' : undefined}
              >
                <span className="nav-pill-label">Projects</span>
                <span className="nav-pill-tooltip" aria-hidden="true">Projects</span>
              </button>
            </div>

            {/* 2. Live Projects (Commercial Client Builds & Dashboards) */}
            <div className="nav-item-wrapper">
              <button
                onClick={() => handleNavClick('live-projects')}
                onMouseEnter={() => ambientAudio.playHoverSound()}
                className={`nav-pill-item ${activeSection === 'live-projects' ? 'is-active' : ''}`}
                aria-current={activeSection === 'live-projects' ? 'page' : undefined}
              >
                <span className="nav-pill-label">Live Projects</span>
                <span className="nav-pill-tooltip" aria-hidden="true">Live Projects</span>
              </button>
            </div>

            {/* 3. Resume (Curriculum Vitae) */}
            <div className="nav-item-wrapper">
              <button
                onClick={() => handleNavClick('resume')}
                onMouseEnter={() => ambientAudio.playHoverSound()}
                className={`nav-pill-item ${activeSection === 'resume' ? 'is-active' : ''}`}
                aria-current={activeSection === 'resume' ? 'page' : undefined}
              >
                <span className="nav-pill-label">Resume</span>
                <span className="nav-pill-tooltip" aria-hidden="true">Resume</span>
              </button>
            </div>

            {/* 4. Contact (3D Room Entering Effect) */}
            <div className="nav-item-wrapper">
              <button
                onClick={() => handleNavClick('contact')}
                onMouseEnter={() => ambientAudio.playHoverSound()}
                className={`nav-pill-item ${activeSection === 'contact' ? 'is-active' : ''}`}
                aria-current={activeSection === 'contact' ? 'page' : undefined}
              >
                <span className="nav-pill-label">Contact</span>
                <span className="nav-pill-tooltip" aria-hidden="true">Contact</span>
              </button>
            </div>

            {/* 5. Circular Static Mute Icon Button */}
            <button
              onClick={handleMuteToggle}
              onMouseEnter={() => ambientAudio.playHoverSound()}
              className="nav-circle-mute-btn"
              title={isMuted ? 'Turn Sound On' : 'Turn Sound Off'}
              aria-label={isMuted ? 'Unmute Audio' : 'Mute Audio'}
            >
              {isMuted ? (
                <VolumeX size={15} />
              ) : (
                <Volume2 size={15} style={{ color: 'var(--accent-orange)' }} />
              )}
              <span className="nav-circle-tooltip" aria-hidden="true">
                {isMuted ? 'Muted' : 'Sound On'}
              </span>
            </button>
          </div>

          {/* Mobile Right Controls: Mute + Hamburger Toggle (visible on <= 768px) */}
          <div className="mobile-nav-actions">
            <button
              onClick={handleMuteToggle}
              className="mobile-nav-mute-btn"
              title={isMuted ? 'Turn Sound On' : 'Turn Sound Off'}
              aria-label={isMuted ? 'Unmute Audio' : 'Mute Audio'}
            >
              {isMuted ? (
                <VolumeX size={16} />
              ) : (
                <Volume2 size={16} style={{ color: 'var(--accent-orange)' }} />
              )}
            </button>

            <button
              onClick={toggleMobileMenu}
              className="mobile-hamburger-btn"
              aria-expanded={isMobileOpen}
              aria-label={isMobileOpen ? 'Close Navigation Menu' : 'Open Navigation Menu'}
            >
              {isMobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Sub-Bar: Quick Horizontal Pill Bar (Visible on mobile for instant 1-tap navigation) */}
        <div className="mobile-quick-pills-bar">
          <div className="mobile-pills-scroll">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`mobile-quick-pill ${activeSection === item.id ? 'is-active' : ''}`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* FULLSCREEN MOBILE MENU DRAWER OVERLAY */}
      {isMobileOpen && (
        <div
          className="mobile-nav-drawer-backdrop"
          onClick={() => setIsMobileOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-label="Mobile Navigation Menu"
        >
          <div
            className="mobile-nav-drawer-content"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Drawer Top Header */}
            <div className="drawer-header">
              <div className="drawer-branding">
                <span className="drawer-dot" />
                <span className="drawer-brand-name">{ANIMATION_CONFIG.portfolio.name}</span>
              </div>
              <button
                onClick={() => setIsMobileOpen(false)}
                className="drawer-close-btn"
                aria-label="Close menu"
              >
                <X size={20} />
              </button>
            </div>

            {/* Navigation Links */}
            <div className="drawer-links-list">
              {navItems.map((item, idx) => (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`drawer-link-item ${activeSection === item.id ? 'is-active' : ''}`}
                >
                  <div className="drawer-link-left">
                    <span className="drawer-link-num">0{idx + 1}</span>
                    <div className="drawer-link-text">
                      <span className="drawer-link-title">{item.label}</span>
                      <span className="drawer-link-desc">{item.desc}</span>
                    </div>
                  </div>
                  <ArrowRight size={16} className="drawer-arrow" />
                </button>
              ))}
            </div>

            {/* Quick Contact & WhatsApp Action in Mobile Drawer */}
            <div className="drawer-footer-actions">
              <a
                href="https://wa.me/919682636699?text=Hi%20Sanjana%2C%20I%20would%20like%20to%20discuss%20a%20project"
                target="_blank"
                rel="noopener noreferrer"
                className="drawer-whatsapp-btn"
                onClick={() => ambientAudio.playClickSound()}
              >
                <MessageSquare size={16} style={{ color: '#25D366' }} />
                <span>Chat on WhatsApp</span>
              </a>

              <a
                href="mailto:sanjana19122001@gmail.com"
                className="drawer-email-btn"
                onClick={() => ambientAudio.playClickSound()}
              >
                <Mail size={16} />
                <span>Email Sanjana</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

'use client';

import React, { useState, useEffect } from 'react';
import { Navigation, PortfolioSection } from '@/components/Navigation';
import { Home3DScene } from '@/components/Home3DScene';
import { HomeHero } from '@/components/HomeHero';
import { ProjectsShowcase } from '@/components/ProjectsShowcase';
import { LiveProjectsSection } from '@/components/LiveProjectsSection';
import { ResumeSection } from '@/components/ResumeSection';
import { ContactSection } from '@/components/ContactSection';
import { BackgroundGradient } from '@/components/BackgroundGradient';
import { ambientAudio } from '@/lib/ambient-sound';

interface PortfolioAppProps {
  initialSection?: PortfolioSection;
}

export const PortfolioApp: React.FC<PortfolioAppProps> = ({ initialSection = 'home' }) => {
  const [activeSection, setActiveSection] = useState<PortfolioSection>(initialSection);
  const [isMuted, setIsMuted] = useState(false);

  // Sync with URL hash or search params on client mount
  useEffect(() => {
    setIsMuted(ambientAudio.getMuted());
    if (typeof window !== 'undefined') {
      const hash = window.location.hash.toLowerCase().replace('#', '');
      if (['home', 'projects', 'live-projects', 'resume', 'contact'].includes(hash)) {
        setActiveSection(hash as PortfolioSection);
      }
    }
  }, []);

  const handleToggleMute = () => {
    const muted = ambientAudio.toggleMute();
    setIsMuted(muted);
  };

  const handleSectionChange = (section: PortfolioSection) => {
    if (section !== activeSection) {
      ambientAudio.playPageTransitionEffect();
    }
    setActiveSection(section);
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleExploreProjects = () => {
    ambientAudio.playClickSound();
    handleSectionChange('projects');
    if (typeof window !== 'undefined') {
      window.history.replaceState(null, '', '#projects');
    }
  };

  return (
    <div className={`portfolio-app-root mode-${activeSection}`}>
      {/* Foundational #CACDD2 Background Gradient (visible across sections) */}
      <BackgroundGradient />

      {/* Main Top Navigation Bar (transparent on home image, styled on other pages) */}
      <Navigation
        activeSection={activeSection}
        onSectionChange={handleSectionChange}
        isMuted={isMuted}
        onToggleMute={handleToggleMute}
      />

      {/* Main Content Area */}
      <main className="portfolio-content-area">
        {/* SECTION 1: HOME (Full-Bleed 3D Image Experience + Hero Typography) */}
        <div
          className={`portfolio-section-view home-section ${
            activeSection === 'home' ? 'section-active' : 'section-inactive'
          }`}
          aria-hidden={activeSection !== 'home'}
        >
          <Home3DScene />
          <HomeHero onExploreProjects={handleExploreProjects} />
        </div>

        {/* SECTION 2: PROJECTS (All 12 Behance Projects, Dual Shadow, Full Scroll) */}
        <div
          className={`portfolio-section-view projects-section ${
            activeSection === 'projects' ? 'section-active' : 'section-inactive'
          }`}
          aria-hidden={activeSection !== 'projects'}
        >
          <ProjectsShowcase />
        </div>

        {/* SECTION 3: LIVE PROJECTS (Commercial Builds Matching Image - 2 UI) */}
        <div
          className={`portfolio-section-view live-projects-section ${
            activeSection === 'live-projects' ? 'section-active' : 'section-inactive'
          }`}
          aria-hidden={activeSection !== 'live-projects'}
        >
          <LiveProjectsSection />
        </div>

        {/* SECTION 4: RESUME (Curriculum Vitae with PDF Download & Card Layout) */}
        <div
          className={`portfolio-section-view resume-section ${
            activeSection === 'resume' ? 'section-active' : 'section-inactive'
          }`}
          aria-hidden={activeSection !== 'resume'}
        >
          <ResumeSection />
        </div>

        {/* SECTION 5: CONTACT (3D Room Entering Effect, Image -2 UI & Girl Silhouette) */}
        <div
          className={`portfolio-section-view contact-section ${
            activeSection === 'contact' ? 'section-active contact-room-enter' : 'section-inactive'
          }`}
          aria-hidden={activeSection !== 'contact'}
        >
          <ContactSection />
        </div>
      </main>
    </div>
  );
};

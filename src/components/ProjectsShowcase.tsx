'use client';

import React, { useEffect, useState } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { ANIMATION_CONFIG, ProjectItem } from '@/config/animation';
import { ambientAudio } from '@/lib/ambient-sound';
import { ProjectDetailModal } from '@/components/ProjectDetailModal';
import { ProjectPixelCard } from '@/components/ProjectPixelCard';

const PROJECT_COVERS: Record<
  string,
  { coverImage: string; icon: string; shortName: string; tag: string }
> = {
  '246132999': {
    coverImage: '/assets/live/amber-glass.jpg',
    icon: 'cpu',
    shortName: 'AI & WORKFLOW',
    tag: 'SAAS AUTOMATION',
  },
  '244207705': {
    coverImage: '/assets/live/futuristic-glass.jpg',
    icon: 'activity',
    shortName: 'MINDHAVEN',
    tag: 'HEALTHCARE UI',
  },
  '235725021': {
    coverImage: '/assets/live/liquid-copper.png',
    icon: 'key',
    shortName: 'CARENT',
    tag: 'MOBILITY PORTAL',
  },
  '231633509': {
    coverImage: '/assets/live/neon-helix.png',
    icon: 'zap',
    shortName: 'MONEYPLAY',
    tag: 'FINTECH INTERFACE',
  },
  '248916319': {
    coverImage: '/assets/live/fluted-sphere.png',
    icon: 'sparkles',
    shortName: 'WEDDING SUITE',
    tag: 'EDITORIAL LUXURY',
  },
  '231542687': {
    coverImage: '/assets/live/neon-arc.png',
    icon: 'layers',
    shortName: 'ROOMORA',
    tag: 'INTERIOR APP',
  },
  '232275381': {
    coverImage: '/assets/live/coral-glass.png',
    icon: 'compass',
    shortName: 'SAIL CHAOS',
    tag: 'CREATIVE DIRECTION',
  },
  '229937607': {
    coverImage: '/assets/live/warm-gradient.png',
    icon: 'globe',
    shortName: 'GLOBAL FREIGHT',
    tag: 'LOGISTICS PORTAL',
  },
  '232276203': {
    coverImage: '/assets/live/amber-glass.jpg',
    icon: 'package',
    shortName: 'SHAMPOO 3D',
    tag: 'PACKAGING SYSTEM',
  },
  '246689165': {
    coverImage: '/assets/live/liquid-copper.png',
    icon: 'flame',
    shortName: 'NAVRATRI POSTS',
    tag: 'CULTURAL CAMPAIGN',
  },
  '220555567': {
    coverImage: '/assets/live/neon-arc.png',
    icon: 'message',
    shortName: 'WHATSAPP GUIDE',
    tag: 'PRODUCT ONBOARDING',
  },
  '230879303': {
    coverImage: '/assets/live/neon-helix.png',
    icon: 'activity',
    shortName: 'SPIRIT OF MOTION',
    tag: 'KINETIC IDENTITY',
  },
};

const FALLBACK_COVERS = [
  { coverImage: '/assets/live/amber-glass.jpg', icon: 'cpu', shortName: 'AI PLATFORM', tag: 'AI & SAAS' },
  { coverImage: '/assets/live/futuristic-glass.jpg', icon: 'activity', shortName: 'HEALTHCARE UI', tag: 'HEALTHCARE' },
  { coverImage: '/assets/live/liquid-copper.png', icon: 'key', shortName: 'MARKETPLACE', tag: 'MARKETPLACE' },
  { coverImage: '/assets/live/neon-helix.png', icon: 'zap', shortName: 'FINTECH APP', tag: 'FINTECH' },
  { coverImage: '/assets/live/fluted-sphere.png', icon: 'sparkles', shortName: 'COMMERCE STORE', tag: 'COMMERCE' },
  { coverImage: '/assets/live/neon-arc.png', icon: 'layers', shortName: 'PRODUCT DASHBOARD', tag: 'APPLICATION' },
  { coverImage: '/assets/live/coral-glass.png', icon: 'compass', shortName: 'CREATIVE SUITE', tag: 'EDITORIAL' },
  { coverImage: '/assets/live/warm-gradient.png', icon: 'globe', shortName: 'GLOBAL LOGISTICS', tag: 'LOGISTICS' },
];

export const ProjectsShowcase: React.FC = () => {
  const [projectsList, setProjectsList] = useState<ProjectItem[]>(
    ANIMATION_CONFIG.portfolio.projects || []
  );
  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Sync projects from API
  useEffect(() => {
    let isMounted = true;
    fetch('/api/behance/projects')
      .then((res) => res.json())
      .then((data) => {
        if (isMounted && data?.success && Array.isArray(data.projects) && data.projects.length > 0) {
          setProjectsList(data.projects);
        }
      })
      .catch((err) => {
        console.warn('Behance client sync notice:', err);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const row1 = projectsList.filter((p, i) => (p.row ? p.row === 1 : i < 4));
  const row2 = projectsList.filter((p, i) => (p.row ? p.row === 2 : i >= 4 && i < 8));
  const row3 = projectsList.filter((p, i) => (p.row ? p.row === 3 : i >= 8));

  const handleOpenProject = (project: ProjectItem) => {
    ambientAudio.playClickSound();
    setSelectedProject(project);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const currentProjectIndex = selectedProject
    ? projectsList.findIndex((p) => p.id === selectedProject.id)
    : 0;

  const handleNextProject = () => {
    const nextIdx = (currentProjectIndex + 1) % projectsList.length;
    setSelectedProject(projectsList[nextIdx]);
  };

  const handlePrevProject = () => {
    const prevIdx = (currentProjectIndex - 1 + projectsList.length) % projectsList.length;
    setSelectedProject(projectsList[prevIdx]);
  };

  const getProjectMeta = (item: ProjectItem, globalIndex: number) => {
    const meta = PROJECT_COVERS[item.id] || FALLBACK_COVERS[globalIndex % FALLBACK_COVERS.length];
    return {
      coverImage: meta.coverImage,
      icon: meta.icon,
      shortName: meta.shortName || item.title.slice(0, 18).toUpperCase(),
      tag: meta.tag || item.category || 'CASE STUDY',
    };
  };

  return (
    <section
      className="projects-showcase-section"
      aria-label="Selected Projects Showcase"
    >
      <div className="projects-container">
        {/* ================================================================ */}
        {/* ROW 1                                                            */}
        {/* ================================================================ */}
        <div className="project-meta-row" aria-hidden="true">
          <div className="meta-col">
            <span className="meta-text">FEATURED WORK</span>
          </div>
          <div className="meta-col">
            <span className="meta-text">CAMPAIGN & BRANDING</span>
          </div>
          <div className="meta-col">
            <span className="meta-text">DIGITAL PRODUCTS</span>
          </div>
          <div className="meta-col meta-col-split">
            <span className="meta-text">CURATED</span>
            <span className="meta-text">2026</span>
          </div>
        </div>

        <div className="project-divider-line" />

        <div className="projects-grid-row" role="list">
          {row1.map((item, idx) => {
            const meta = getProjectMeta(item, idx);
            return (
              <ProjectPixelCard
                key={item.id}
                item={item}
                coverImage={meta.coverImage}
                iconName={meta.icon}
                shortName={meta.shortName}
                tag={meta.tag}
                onOpenProject={handleOpenProject}
              />
            );
          })}
        </div>

        {/* ================================================================ */}
        {/* ROW 2                                                            */}
        {/* ================================================================ */}
        <div className="project-meta-row row-2-meta" aria-hidden="true">
          <div className="meta-col">
            <span className="meta-text">OUTDOOR & SOCIAL</span>
          </div>
          <div className="meta-col">
            <span className="meta-text">INTERFACE DESIGN</span>
          </div>
          <div className="meta-col">
            <span className="meta-text">VISUAL IDENTITY</span>
          </div>
          <div className="meta-col meta-col-split">
            <span className="meta-text">SELECTED</span>
            <span className="meta-text">VERIFIED</span>
          </div>
        </div>

        <div className="project-divider-line" />

        <div className="projects-grid-row" role="list">
          {row2.map((item, idx) => {
            const meta = getProjectMeta(item, idx + 4);
            return (
              <ProjectPixelCard
                key={item.id}
                item={item}
                coverImage={meta.coverImage}
                iconName={meta.icon}
                shortName={meta.shortName}
                tag={meta.tag}
                onOpenProject={handleOpenProject}
              />
            );
          })}
        </div>

        {/* ================================================================ */}
        {/* ROW 3                                                            */}
        {/* ================================================================ */}
        <div className="project-meta-row row-3-meta" aria-hidden="true">
          <div className="meta-col">
            <span className="meta-text">WEB & APPLICATION</span>
          </div>
          <div className="meta-col">
            <span className="meta-text">E-COMMERCE & SAAS</span>
          </div>
          <div className="meta-col">
            <span className="meta-text">CREATIVE DIRECTION</span>
          </div>
          <div className="meta-col meta-col-split">
            <span className="meta-text">ARCHIVE</span>
            <span className="meta-text">SHOWCASE</span>
          </div>
        </div>

        <div className="project-divider-line" />

        <div className="projects-grid-row" role="list">
          {row3.map((item, idx) => {
            const meta = getProjectMeta(item, idx + 8);
            return (
              <ProjectPixelCard
                key={item.id}
                item={item}
                coverImage={meta.coverImage}
                iconName={meta.icon}
                shortName={meta.shortName}
                tag={meta.tag}
                onOpenProject={handleOpenProject}
              />
            );
          })}
        </div>

        {/* Bottom CTA Banner: Explore More on Behance */}
        <div className="projects-explore-more-banner">
          <div className="explore-more-content">
            <span className="explore-more-pill">BEHANCE PORTFOLIO ARCHIVE</span>
            <h3 className="explore-more-title">Looking for more design systems & creative works?</h3>
            <p className="explore-more-desc">
              Discover all digital experiences, brand identity systems, and client case studies directly on Sanjana&apos;s official Behance profile.
            </p>
          </div>

          <a
            href="https://www.behance.net/sanjanasharma14"
            target="_blank"
            rel="noopener noreferrer"
            className="explore-more-cta-btn"
            onClick={() => ambientAudio.playClickSound()}
            onMouseEnter={() => ambientAudio.playHoverSound()}
          >
            <span>Explore More on Behance</span>
            <ArrowUpRight size={17} />
          </a>
        </div>
      </div>

      {/* Full In-App Project View Modal */}
      <ProjectDetailModal
        project={selectedProject}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onNext={handleNextProject}
        onPrev={handlePrevProject}
        currentIndex={currentProjectIndex}
        totalProjects={projectsList.length}
      />
    </section>
  );
};

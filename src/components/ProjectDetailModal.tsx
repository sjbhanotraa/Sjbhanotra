'use client';

import React, { useEffect, useCallback } from 'react';
import { X, ChevronLeft, ChevronRight, ExternalLink } from 'lucide-react';
import { ProjectItem } from '@/config/animation';
import { ambientAudio } from '@/lib/ambient-sound';

interface ProjectDetailModalProps {
  project: ProjectItem | null;
  isOpen: boolean;
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
  currentIndex: number;
  totalProjects: number;
}

export const ProjectDetailModal: React.FC<ProjectDetailModalProps> = ({
  project,
  isOpen,
  onClose,
  onNext,
  onPrev,
  currentIndex,
  totalProjects,
}) => {
  const handleClose = useCallback(() => {
    ambientAudio.playClickSound();
    onClose();
  }, [onClose]);

  const handleNext = useCallback(() => {
    ambientAudio.playClickSound();
    ambientAudio.playPageTransitionEffect();
    onNext();
  }, [onNext]);

  const handlePrev = useCallback(() => {
    ambientAudio.playClickSound();
    ambientAudio.playPageTransitionEffect();
    onPrev();
  }, [onPrev]);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleClose();
      } else if (e.key === 'ArrowRight') {
        handleNext();
      } else if (e.key === 'ArrowLeft') {
        handlePrev();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, handleClose, handleNext, handlePrev]);

  if (!isOpen || !project) return null;

  const formattedIndex = String(currentIndex + 1).padStart(2, '0');
  const formattedTotal = String(totalProjects).padStart(2, '0');

  // Direct project link
  const behanceLink =
    project.behanceUrl ||
    `https://www.behance.net/gallery/${project.id}/${encodeURIComponent(project.title.replace(/\s+/g, '-'))}`;

  return (
    <div
      className="project-modal-backdrop"
      onClick={handleClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-project-title"
    >
      <div
        className="project-modal-card project-modal-minimal"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Bar */}
        <header className="project-modal-header">
          <div className="modal-header-meta">
            <span className="modal-index-badge">{formattedIndex} // {formattedTotal}</span>
            <span className="modal-project-name-top">{project.title}</span>
          </div>

          <div className="modal-header-actions">
            {/* Direct Project Full Link CTA */}
            <a
              href={behanceLink}
              target="_blank"
              rel="noopener noreferrer"
              className="modal-behance-cta-btn"
              onClick={() => ambientAudio.playClickSound()}
              onMouseEnter={() => ambientAudio.playHoverSound()}
              title="Open full project on Behance"
            >
              <span>Check on Behance</span>
              <ExternalLink size={14} />
            </a>

            <button
              onClick={handleClose}
              onMouseEnter={() => ambientAudio.playHoverSound()}
              className="modal-close-btn"
              aria-label="Close Project Modal"
            >
              <X size={18} />
            </button>
          </div>
        </header>

        {/* Modal Main Content: Full Project Image & Name with Full Link CTA */}
        <div className="project-modal-body project-modal-body-clean">
          {/* Main Full-Size Artwork Image */}
          <div className="project-modal-image-container">
            <img
              src={project.image}
              alt={project.title}
              className="project-modal-image"
              loading="eager"
            />
          </div>

          {/* Project Details Footer: Name & Big Full Link CTA */}
          <div className="project-modal-bottom-cta-row">
            <div className="project-title-showcase">
              <h2 id="modal-project-title" className="project-modal-title">
                {project.title}
              </h2>
            </div>

            <a
              href={behanceLink}
              target="_blank"
              rel="noopener noreferrer"
              className="modal-full-link-cta-btn"
              onClick={() => ambientAudio.playClickSound()}
              onMouseEnter={() => ambientAudio.playHoverSound()}
            >
              <span>View Full Project on Behance</span>
              <ExternalLink size={16} />
            </a>
          </div>
        </div>

        {/* Modal Footer Navigation */}
        <footer className="project-modal-footer">
          <button
            onClick={handlePrev}
            onMouseEnter={() => ambientAudio.playHoverSound()}
            className="modal-nav-arrow-btn"
            aria-label="Previous Project"
          >
            <ChevronLeft size={18} />
            <span>Previous</span>
          </button>

          <span className="modal-footer-counter">
            {formattedIndex} / {formattedTotal}
          </span>

          <button
            onClick={handleNext}
            onMouseEnter={() => ambientAudio.playHoverSound()}
            className="modal-nav-arrow-btn"
            aria-label="Next Project"
          >
            <span>Next</span>
            <ChevronRight size={18} />
          </button>
        </footer>
      </div>
    </div>
  );
};

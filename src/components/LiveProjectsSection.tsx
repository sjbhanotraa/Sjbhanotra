'use client';

import React, { useState } from 'react';
import {
  ExternalLink,
  ArrowUpRight,
  Sparkles,
  CheckCircle2,
  ShieldCheck,
  Layers,
  Globe,
  Activity,
  Key,
  Zap,
  Coffee,
  MessageSquare,
  Building2,
  HeartPulse,
} from 'lucide-react';
import { ambientAudio } from '@/lib/ambient-sound';

export type LiveCategory = 'all' | 'saas' | 'shopify' | 'wordpress' | 'lovable';

interface LiveProject {
  id: string;
  title: string;
  brandName: string;
  brandTagline: string;
  brandIconType: 'activity' | 'key' | 'sparkles' | 'zap' | 'coffee' | 'message' | 'layers' | 'globe';
  category: 'saas' | 'shopify' | 'wordpress' | 'lovable';
  categoryLabel: string;
  liveUrl: string;
  displayUrl: string;
  image: string;
  role: string;
  timeline: string;
  company: string;
  description: string;
  uiRole: string;
  problemSolvingPoints: string[];
  gradientTheme: string;
}

const LIVE_PROJECTS: LiveProject[] = [
  {
    id: 'ellomed-health',
    title: 'ElloMed — Healthcare AI Platform',
    brandName: 'ELLOMED',
    brandTagline: 'AI Healthcare & Clinic Operations',
    brandIconType: 'activity',
    category: 'saas',
    categoryLabel: 'Healthcare AI & EHR Platform',
    liveUrl: 'https://ellomed.com/',
    displayUrl: 'ellomed.com',
    image: '/assets/live/amber-glass.jpg',
    role: 'UI/UX & AI Product Designer',
    timeline: 'Live Production // Active SaaS',
    company: 'Ellocent Labs / Healthcare Client',
    description: 'All-in-one AI-driven healthcare and clinic operations SaaS empowering doctors, clinics, and pharmacies with automated electronic health records (EHR), intelligent scheduling, and smart clinical notes.',
    uiRole: 'Architected complete clinical consultation workflow, doctor prescription builder, electronic health records (EHR) timeline, and multi-tenant clinic administrator dashboard complying with medical data privacy guidelines.',
    problemSolvingPoints: [
      'Transformed cluttered multi-tab medical chart entry into an intuitive 2-column doctor consultation workspace, cutting patient prescription logging time by 45%.',
      'Engineered responsive appointment calendar with real-time patient queue status and conflict prevention for busy multi-doctor practices.',
      'Designed accessible high-contrast clinical theme ensuring maximum legibility across diverse clinic monitors, tablets, and mobile devices.'
    ],
    gradientTheme: 'linear-gradient(135deg, #1C120B 0%, #2A170C 50%, #3D1F0E 100%)'
  },
  {
    id: 'keylr-marketplace',
    title: 'Keylr — B2B PropTech Marketplace',
    brandName: 'KEYLR',
    brandTagline: 'Property Services Marketplace UK',
    brandIconType: 'key',
    category: 'saas',
    categoryLabel: 'B2B PropTech Marketplace',
    liveUrl: 'https://keylr.com/',
    displayUrl: 'keylr.com',
    image: '/assets/live/futuristic-glass.jpg',
    role: 'Lead Product & Marketplace Designer',
    timeline: 'Live Production // UK Market',
    company: 'Keylr UK / Ellocent Labs',
    description: 'UK-focused B2B property management marketplace connecting property managers, estate agents, and landlords with verified service professionals for inventory, safety compliance, inspections, and check-ins/check-outs.',
    uiRole: 'Led full-lifecycle UX research, service marketplace booking flows, compliance certificate tracking dashboard (EPC, EICR, Gas Safety), and supplier verification interface.',
    problemSolvingPoints: [
      'Eliminated multi-day turnaround for compliance certificates by designing an automated 1-click booking and instant digital report delivery pipeline.',
      'Engineered an intuitive multi-property dashboard for estate agents managing hundreds of units simultaneously with automated renewal alerts.',
      'Designed a mobile-first digital checklist for on-site property inspectors with offline caching and photo documentation upload.'
    ],
    gradientTheme: 'linear-gradient(135deg, #10151C 0%, #15222E 50%, #1E3144 100%)'
  },
  {
    id: 'parvathi-shopify',
    title: 'Parvathi by VVM',
    brandName: 'PARVATHI',
    brandTagline: 'Luxury Couture & Indian Ethnic Wear',
    brandIconType: 'sparkles',
    category: 'shopify',
    categoryLabel: 'Shopify Production Store',
    liveUrl: 'https://www.parvathibyvvm.com/',
    displayUrl: 'www.parvathibyvvm.com',
    image: '/assets/live/liquid-copper.png',
    role: 'UI/UX & AI Designer',
    timeline: 'Live Production // 2024–Present',
    company: 'Codesoftic Tech Private Limited',
    description: 'High-end luxury Indian ethnic fashion & designer couture e-commerce flagship store.',
    uiRole: 'Independently owned end-to-end UI design, product catalog & variant architecture, client discovery meetings, and custom Shopify theme implementation.',
    problemSolvingPoints: [
      'Solved high drop-off on mobile product pages by redesigning the collection filters and variant selectors.',
      'Re-architected catalog taxonomy for multi-attribute ethnic apparel (custom blouse stitching, sizes, fabric variations).',
      'Engineered responsive interaction patterns that achieved 100% client approval and on-time launch.'
    ],
    gradientTheme: 'linear-gradient(135deg, #1C0F0B 0%, #2E150F 50%, #441A12 100%)'
  },
  {
    id: 'pink-tiger-shopify',
    title: 'Pink Tiger',
    brandName: 'PINK TIGER',
    brandTagline: 'Streetwear & Urban Culture Store',
    brandIconType: 'zap',
    category: 'shopify',
    categoryLabel: 'Shopify Streetwear Brand',
    liveUrl: 'https://pinktiiger.com/',
    displayUrl: 'pinktiiger.com',
    image: '/assets/live/neon-helix.png',
    role: 'UI/UX Designer & Catalog Lead',
    timeline: 'Live Production // 2024–Present',
    company: 'Codesoftic Tech Private Limited',
    description: 'High-energy streetwear and urban apparel e-commerce brand store.',
    uiRole: 'Owned end-to-end UI design, streetwear brand styling, dark-mode visual lookbook, catalog data management, and client approval lifecycle.',
    problemSolvingPoints: [
      'Overcame generic Shopify theme limitations by crafting high-contrast editorial typography and brutalist streetwear aesthetics.',
      'Optimized image compression & responsive asset delivery for ultrafast sub-second product page loads.',
      'Engineered intuitive size guide modal and rapid cart drawer micro-interactions to minimize checkout friction.'
    ],
    gradientTheme: 'linear-gradient(135deg, #161014 0%, #26121D 50%, #3B142A 100%)'
  },
  {
    id: 'kaachvalaym-bagels',
    title: 'Kaachvalaym – Bagel Store',
    brandName: 'KAACHVALAYM',
    brandTagline: 'Artisanal Bakery & Fresh Bagels',
    brandIconType: 'coffee',
    category: 'wordpress',
    categoryLabel: 'WordPress E-Commerce (10X Growth)',
    liveUrl: 'https://kaachvalaym.com/',
    displayUrl: 'kaachvalaym.com',
    image: '/assets/live/fluted-sphere.png',
    role: 'UI/UX Designer & WordPress Developer',
    timeline: 'Live Production // Client Approved',
    company: 'Commercial E-Commerce Client',
    description: 'Artisanal bakery and fresh bagel ordering platform serving regional food lovers.',
    uiRole: 'Ground-up redesign and full-stack WordPress/Divi development, menu architecture, custom product configurators, and mobile checkout optimization.',
    problemSolvingPoints: [
      'Delivered a comprehensive redesign that directly drove a 10X increase in store reach and online sales.',
      'Simplified customer food order customization with instant flavor, cream cheese spread, and quantity toggles.',
      'Solved navigation ambiguity by establishing clear visual category grouping and mouth-watering hero photography.'
    ],
    gradientTheme: 'linear-gradient(135deg, #1B140B 0%, #2D1E0C 50%, #472E10 100%)'
  },
  {
    id: 'getaseed-software',
    title: 'GetaSeed Platform',
    brandName: 'GETASEED',
    brandTagline: 'WhatsApp Marketing & Broadcast Automation',
    brandIconType: 'message',
    category: 'wordpress',
    categoryLabel: 'WhatsApp Marketing SaaS & Marketing',
    liveUrl: 'https://getaseed.com/',
    displayUrl: 'getaseed.com',
    image: '/assets/live/neon-arc.png',
    role: 'UI/UX Designer & Product Lead',
    timeline: 'Live Production // Active SaaS',
    company: 'GetaSeed Automation',
    description: 'Enterprise WhatsApp broadcast messaging and marketing automation software.',
    uiRole: 'Designed marketing website in WordPress alongside software/product UI for campaign broadcast scheduling, subscriber segmentation, and API workflows.',
    problemSolvingPoints: [
      'Translated dense developer API parameters into a visual drag-and-drop campaign launcher for non-technical marketers.',
      'Designed high-converting SaaS landing page with interactive ROI calculator and feature comparison breakdown.',
      'Integrated direct WhatsApp API linking across four niche Lovable platforms with Supabase data storage.'
    ],
    gradientTheme: 'linear-gradient(135deg, #0D1612 0%, #11261D 50%, #153D2C 100%)'
  },
  {
    id: 'raj-motors-dashboard',
    title: 'Raj Motors – Drive Flow',
    brandName: 'RAJ MOTORS',
    brandTagline: 'Dealership Reception & Inventory Ops',
    brandIconType: 'layers',
    category: 'lovable',
    categoryLabel: 'Lovable & Supabase Dashboard',
    liveUrl: 'https://raj-drive-flow.lovable.app/',
    displayUrl: 'raj-drive-flow.lovable.app',
    image: '/assets/live/coral-glass.png',
    role: 'Lead Product & Dashboard Designer',
    timeline: 'Live Production // Operational System',
    company: 'Raj Motors Dealership',
    description: 'Automotive dealership operations platform managing reception, live vehicle inventory, and customer client data.',
    uiRole: 'Dashboard information architecture, receptionist check-in UI, inventory status tracking, and Supabase database linking.',
    problemSolvingPoints: [
      'Eliminated manual paperwork bottleneck by creating a fast 3-click customer intake workflow for showroom receptionists.',
      'Engineered high-density, searchable inventory grids with instant status filters (In-Stock, Reserved, In-Transit).',
      'Implemented responsive tablet UI for showroom floor sales reps with instant vehicle spec lookup.'
    ],
    gradientTheme: 'linear-gradient(135deg, #101217 0%, #161D26 50%, #1F2D3D 100%)'
  },
  {
    id: 'seedoo-broadcasting',
    title: 'WhatsApp Broadcasting Suite',
    brandName: 'SEEDOO SUITE',
    brandTagline: 'Multi-Tenant WhatsApp Campaign Hub',
    brandIconType: 'globe',
    category: 'lovable',
    categoryLabel: 'Multi-Tenant Lovable Platforms',
    liveUrl: 'https://seedoo.lovable.app/',
    displayUrl: 'seedoo.lovable.app',
    image: '/assets/live/warm-gradient.png',
    role: 'UI/UX & API Integration Designer',
    timeline: 'Live Production // 4 Niche Platforms',
    company: 'Seedoo, Saloon, Esato, JewelChat',
    description: 'Four vertical SaaS platforms (Seedoo, Saloon, Esato, JewelChat) powered by GetaSeed WhatsApp API.',
    uiRole: 'Designed multi-tenant UI design, broadcast campaign launcher, subscriber group segmentation, and Supabase data storage.',
    problemSolvingPoints: [
      'Customized unique UX flows tailored specifically for beauty salons (Saloon), education (Seedoo), and retail jewelry (JewelChat).',
      'Streamlined subscriber segmentation to enable 1-click broadcast dispatch to thousands of contacts with zero delay.',
      'Created consistent design system enabling rapid deployment of new vertical platforms in record time.'
    ],
    gradientTheme: 'linear-gradient(135deg, #16101E 0%, #241436 50%, #361A54 100%)'
  }
];

export const LiveProjectsSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<LiveCategory>('all');

  const filteredProjects = LIVE_PROJECTS.filter(
    (p) => activeTab === 'all' || p.category === activeTab
  );

  const renderBrandIcon = (type: LiveProject['brandIconType']) => {
    switch (type) {
      case 'activity':
        return <Activity size={20} className="brand-svg-icon" />;
      case 'key':
        return <Key size={20} className="brand-svg-icon" />;
      case 'sparkles':
        return <Sparkles size={20} className="brand-svg-icon" />;
      case 'zap':
        return <Zap size={20} className="brand-svg-icon" />;
      case 'coffee':
        return <Coffee size={20} className="brand-svg-icon" />;
      case 'message':
        return <MessageSquare size={20} className="brand-svg-icon" />;
      case 'layers':
        return <Layers size={20} className="brand-svg-icon" />;
      case 'globe':
      default:
        return <Globe size={20} className="brand-svg-icon" />;
    }
  };

  return (
    <section className="live-projects-section-container" aria-label="Live Commercial Projects">
      {/* Top Section Header matching image - 2 editorial vibe */}
      <div className="live-projects-header-block">
        <div className="live-header-meta">
          <span className="live-status-indicator">
            <span className="pulsing-live-dot" />
            LIVE COMMERCIAL BUILDS
          </span>
          <span className="live-verified-badge">
            <ShieldCheck size={14} style={{ color: 'var(--accent-orange)' }} />
            Verified Client Deployments
          </span>
        </div>

        <h1 className="live-hero-title">Selected Live Projects</h1>
        <p className="live-hero-subtitle">
          Commercial SaaS products, healthcare platforms, PropTech marketplaces, Shopify stores, and Lovable dashboards designed and delivered end-to-end by Sanjana Sharma.
        </p>

        {/* Filter Navigation Tabs */}
        <div className="live-filter-tabs-row" role="tablist">
          <button
            onClick={() => {
              ambientAudio.playClickSound();
              setActiveTab('all');
            }}
            className={`live-tab-btn ${activeTab === 'all' ? 'is-active' : ''}`}
            role="tab"
            aria-selected={activeTab === 'all'}
          >
            All Live Builds ({LIVE_PROJECTS.length})
          </button>
          <button
            onClick={() => {
              ambientAudio.playClickSound();
              setActiveTab('saas');
            }}
            className={`live-tab-btn ${activeTab === 'saas' ? 'is-active' : ''}`}
            role="tab"
            aria-selected={activeTab === 'saas'}
          >
            SaaS & PropTech (2)
          </button>
          <button
            onClick={() => {
              ambientAudio.playClickSound();
              setActiveTab('shopify');
            }}
            className={`live-tab-btn ${activeTab === 'shopify' ? 'is-active' : ''}`}
            role="tab"
            aria-selected={activeTab === 'shopify'}
          >
            Shopify Stores (2)
          </button>
          <button
            onClick={() => {
              ambientAudio.playClickSound();
              setActiveTab('wordpress');
            }}
            className={`live-tab-btn ${activeTab === 'wordpress' ? 'is-active' : ''}`}
            role="tab"
            aria-selected={activeTab === 'wordpress'}
          >
            WordPress & Web (2)
          </button>
          <button
            onClick={() => {
              ambientAudio.playClickSound();
              setActiveTab('lovable');
            }}
            className={`live-tab-btn ${activeTab === 'lovable' ? 'is-active' : ''}`}
            role="tab"
            aria-selected={activeTab === 'lovable'}
          >
            Lovable Dashboards (2)
          </button>
        </div>
      </div>

      {/* Cards List matching image - 2 Horizontal Split Cards */}
      <div className="live-projects-cards-stack">
        {filteredProjects.map((project) => (
          <article
            key={project.id}
            className="live-split-card"
          >
            {/* LEFT SIDE: Live Project Visual Artwork with Brand Name & Icon Overlay */}
            <div className="live-card-visual-col">
              <img
                src={project.image}
                alt={`${project.title} Visual Artwork`}
                className="live-card-hero-img"
                loading="eager"
              />

              {/* Atmospheric Gradient for Readability */}
              <div className="live-visual-overlay-gradient" />

              {/* BRAND NAME & ICON OVERLAY ON THE CARD IMAGE */}
              <div className="live-card-brand-overlay">
                <div className="brand-overlay-top-row">
                  <div className="brand-icon-emblem">
                    {renderBrandIcon(project.brandIconType)}
                  </div>
                  <div className="brand-status-tag">
                    <span className="live-badge-dot" />
                    <span>PRODUCTION ACTIVE</span>
                  </div>
                </div>

                <div className="brand-overlay-bottom-content">
                  <span className="brand-category-kicker">{project.categoryLabel}</span>
                  <h3 className="brand-main-display-title">{project.brandName}</h3>
                  <p className="brand-tagline-text">{project.brandTagline}</p>
                </div>
              </div>
            </div>

            {/* RIGHT SIDE: Rich Gradient, Role, Description, Problem Solving & Live CTA */}
            <div
              className="live-card-content-col"
              style={{ background: project.gradientTheme }}
            >
              {/* Top Row: Title & Author Avatar */}
              <div className="live-card-top-row">
                <div className="live-card-title-group">
                  <h2 className="live-card-title">{project.title}</h2>
                  <span className="live-card-role-line">
                    {project.role} // {project.company}
                  </span>
                </div>

                <div className="live-card-avatar" title="Sanjana Sharma — UI/UX & AI Designer">
                  <img
                    src="/assets/contact-silhouette-hero.jpg"
                    alt="Sanjana Sharma"
                    className="avatar-img"
                  />
                </div>
              </div>

              {/* Direct Live URL Link */}
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="live-url-pill-link"
                onClick={() => ambientAudio.playClickSound()}
                onMouseEnter={() => ambientAudio.playHoverSound()}
              >
                <Globe size={13} style={{ color: 'var(--accent-orange)' }} />
                <span>{project.displayUrl}</span>
                <ExternalLink size={12} />
              </a>

              {/* Project Description */}
              <p className="live-card-desc">
                {project.description}
              </p>

              {/* Section 1: UI/UX Role Worked On */}
              <div className="live-detail-box">
                <h3 className="live-detail-title">
                  <Layers size={13} style={{ color: 'var(--accent-orange)' }} />
                  UI/UX Role & Scope:
                </h3>
                <p className="live-detail-text">
                  {project.uiRole}
                </p>
              </div>

              {/* Section 2: Problem Solving Points */}
              <div className="live-detail-box">
                <h3 className="live-detail-title">
                  <CheckCircle2 size={13} style={{ color: 'var(--accent-orange)' }} />
                  Key Problem-Solving Points & Impact:
                </h3>
                <ul className="live-problem-bullets">
                  {project.problemSolvingPoints.map((point, idx) => (
                    <li key={idx}>{point}</li>
                  ))}
                </ul>
              </div>

              {/* Bottom Row: Direct Live CTA Button */}
              <div className="live-card-bottom-actions">
                <span className="live-timeline-tag">{project.timeline}</span>

                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="live-visit-site-cta"
                  onClick={() => ambientAudio.playClickSound()}
                  onMouseEnter={() => ambientAudio.playHoverSound()}
                >
                  <span>Visit Live Site</span>
                  <ArrowUpRight size={15} />
                </a>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};

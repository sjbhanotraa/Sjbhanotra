'use client';

import React from 'react';
import { Download, Briefcase, GraduationCap, Code2, Globe, Mail, Phone, MapPin, Sparkles, ExternalLink, Award, CheckCircle2 } from 'lucide-react';
import { ambientAudio } from '@/lib/ambient-sound';

export const ResumeSection: React.FC = () => {
  return (
    <section className="resume-section-container" aria-label="Sanjana Sharma Resume & Curriculum Vitae">
      {/* Top Header Bar with Download CTA */}
      <div className="resume-top-banner">
        <div className="resume-title-block">
          <div className="resume-tag-row">
            <span className="resume-role-pill">
              <span className="resume-role-dot" />
              UI/UX & AI Designer
            </span>
            <span className="resume-avail-pill">Available for Roles & Projects</span>
          </div>
          <h1 className="resume-hero-name">SANJANA SHARMA</h1>
          <p className="resume-contact-inline">
            <span className="contact-item"><MapPin size={13} /> Jammu & Kashmir, India</span>
            <span className="contact-divider">•</span>
            <a href="mailto:sanjana19122001@gmail.com" className="contact-link"><Mail size={13} /> sanjana19122001@gmail.com</a>
            <span className="contact-divider">•</span>
            <span className="contact-item"><Phone size={13} /> +91 96826 36699</span>
          </p>
        </div>

        {/* Download Resume Link Button */}
        <div className="resume-cta-block">
          <a
            href="/assets/Sanjana_Sharma_Resume.pdf"
            download="Sanjana_Sharma_Resume.pdf"
            className="resume-download-cta"
            onClick={() => ambientAudio.playClickSound()}
            onMouseEnter={() => ambientAudio.playHoverSound()}
            title="Download full Sanjana Sharma Resume PDF"
          >
            <Download size={16} />
            <span>Download Resume PDF</span>
          </a>
          <div className="resume-social-links">
            <a
              href="https://www.linkedin.com/in/sanjana-sharma"
              target="_blank"
              rel="noopener noreferrer"
              className="resume-social-pill"
              onClick={() => ambientAudio.playClickSound()}
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9h2.79v8.37H6.46v-8.37M7.86 6.3a1.48 1.48 0 1 0 0 2.96 1.48 1.48 0 0 0 0-2.96Z" />
              </svg>
              <span>LinkedIn</span>
              <ExternalLink size={11} />
            </a>
            <a
              href="https://www.behance.net/sanjanasharma14"
              target="_blank"
              rel="noopener noreferrer"
              className="resume-social-pill"
              onClick={() => ambientAudio.playClickSound()}
            >
              <Globe size={13} />
              <span>Behance</span>
              <ExternalLink size={11} />
            </a>
          </div>
        </div>
      </div>

      {/* Grid of Editorial Cards */}
      <div className="resume-cards-grid">
        {/* Card 1: Executive Summary */}
        <div className="resume-card summary-card">
          <div className="card-header">
            <div className="card-header-icon">
              <Sparkles size={18} style={{ color: 'var(--accent-orange)' }} />
            </div>
            <h3 className="card-title">Professional Summary</h3>
          </div>
          <p className="summary-paragraph">
            UI/UX & AI Designer building responsive digital experiences in Figma, WordPress, Shopify, and n8n workflow automation. Owns end-to-end website and dashboard delivery, from interface design and product data management to client communication, with consistent on-time launch and full client approval. Applies AI image generation and prompt engineering to create visuals that support design and marketing needs. Delivered a redesign that drove a 10X increase in reach and sales for an e-commerce client.
          </p>

          <div className="summary-metrics-row">
            <div className="summary-metric-box">
              <span className="metric-num">1.8+</span>
              <span className="metric-tag">Years Experience</span>
            </div>
            <div className="summary-metric-box">
              <span className="metric-num">10X</span>
              <span className="metric-tag">Sales Reach Growth</span>
            </div>
            <div className="summary-metric-box">
              <span className="metric-num">100%</span>
              <span className="metric-tag">Client Approval Rate</span>
            </div>
            <div className="summary-metric-box">
              <span className="metric-num">12+</span>
              <span className="metric-tag">Live Deployed Stores</span>
            </div>
          </div>
        </div>

        {/* Card 2: Core Skills & Competencies */}
        <div className="resume-card skills-card">
          <div className="card-header">
            <div className="card-header-icon">
              <Code2 size={18} style={{ color: 'var(--accent-orange)' }} />
            </div>
            <h3 className="card-title">Skills & Specializations</h3>
          </div>

          <div className="skills-subgroups">
            <div className="skills-group">
              <span className="skills-group-title">Technical Skills</span>
              <div className="pills-cluster">
                {['Shopify Development', 'WordPress Customization', 'HTML5 & CSS3', 'JavaScript', 'n8n Automation', 'Lovable Platforms', 'Supabase', 'ComfyUI', 'Claude AI Themes', 'Divi Builder'].map((skill) => (
                  <span key={skill} className="skill-pill">{skill}</span>
                ))}
              </div>
            </div>

            <div className="skills-group">
              <span className="skills-group-title">Product Design Practice</span>
              <div className="pills-cluster">
                {['Wireframing', 'Prototyping', 'Responsive Design', 'User Research', 'Design Systems', 'Usability Testing', 'Information Architecture'].map((skill) => (
                  <span key={skill} className="skill-pill accent-pill">{skill}</span>
                ))}
              </div>
            </div>

            <div className="skills-group">
              <span className="skills-group-title">Visual Communication</span>
              <div className="pills-cluster">
                {['Visual Design', 'Style Guides', 'Iterative Design', 'Typography', 'Layout Design', 'Micro-Interactions', 'AI Prompt Engineering'].map((skill) => (
                  <span key={skill} className="skill-pill">{skill}</span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Card 3: Work Experience */}
        <div className="resume-card experience-card span-full">
          <div className="card-header">
            <div className="card-header-icon">
              <Briefcase size={18} style={{ color: 'var(--accent-orange)' }} />
            </div>
            <h3 className="card-title">Work Experience</h3>
          </div>

          <div className="timeline-items">
            {/* Experience 1 */}
            <div className="timeline-item current-role">
              <div className="timeline-meta">
                <span className="role-period">Nov 2024 – Present (1.8+ Yrs)</span>
                <span className="role-status-badge">Current Position</span>
              </div>
              <div className="timeline-content">
                <h4 className="role-title">UI/UX & AI Designer</h4>
                <h5 className="role-company">Codesoftic Tech Private Limited</h5>
                <ul className="role-bullets">
                  <li>Independently owned end-to-end design, development, and content management for multiple live Shopify stores (parvathibyvvm.com, pinktiiger.com, Mehhakk Heritage) — UI design, product catalog/data management, and client meetings — achieving 100% client approval and on-time delivery across all projects.</li>
                  <li>Created visually appealing UI aligned with brand guidelines; designed interaction patterns and micro-interactions to improve usability, and maintained scalable design systems/style guides for consistency across projects.</li>
                  <li>Ensured responsive design across devices; conducted usability testing and user research (interviews, surveys) to inform design decisions.</li>
                  <li>Built and customized WordPress themes and plugins; independently designed and developed many WordPress websites end-to-end in Divi Builder and Claude-customized themes.</li>
                  <li>Automated recurring workflows using n8n across Google Sheets, CRMs, and WhatsApp, reducing manual data-handling effort.</li>
                  <li>Worked hands-on with ComfyUI and AI image generation software, applying deep prompt-engineering knowledge to produce high-quality AI-generated visuals for design and marketing use.</li>
                  <li>Built and designed dashboard platforms using Lovable, including a car dealership management dashboard (receptionist, inventory, client data) and an education dashboard for course and booking management.</li>
                  <li>Linked the GetaSeed API across four niche Lovable platforms to enable direct WhatsApp broadcast messaging, handling API integration, UI design, and data storage in Supabase.</li>
                  <li>Hosted YouTube video content for Codesoftic, presenting product and technical videos for the brand&apos;s channel.</li>
                </ul>
              </div>
            </div>

            {/* Experience 2 */}
            <div className="timeline-item">
              <div className="timeline-meta">
                <span className="role-period">Apr 2024 – Sep 2024</span>
              </div>
              <div className="timeline-content">
                <h4 className="role-title">UI/UX Designer</h4>
                <h5 className="role-company">Ellocent Labs</h5>
                <ul className="role-bullets">
                  <li>Assisted in creating clean, user-friendly interface designs based on wireframes and brand guidelines.</li>
                  <li>Collaborated with UX designers, developers, and product managers to turn concepts into functional designs.</li>
                  <li>Used and maintained design systems to ensure visual consistency across platforms.</li>
                  <li>Built interactive prototypes and refined designs based on user and stakeholder feedback.</li>
                  <li>Designed graphics, banners, and posts for digital marketing and social media campaigns.</li>
                </ul>
              </div>
            </div>

            {/* Experience 3 */}
            <div className="timeline-item">
              <div className="timeline-meta">
                <span className="role-period">Dec 2023 – Apr 2024</span>
              </div>
              <div className="timeline-content">
                <h4 className="role-title">Graphic Designer & UI/UX Designer</h4>
                <h5 className="role-company">Solitaire Infosystems Pvt. Ltd.</h5>
                <ul className="role-bullets">
                  <li>Produced design assets including typography and layout work for marketing materials.</li>
                  <li>Designed logos and brand identity elements for client projects.</li>
                  <li>Created social media creatives to support digital marketing efforts.</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Card 4: Major Projects Catalog */}
        <div className="resume-card projects-card span-full">
          <div className="card-header">
            <div className="card-header-icon">
              <Award size={18} style={{ color: 'var(--accent-orange)' }} />
            </div>
            <h3 className="card-title">Major Client & Commercial Projects</h3>
          </div>

          <div className="resume-projects-grid">
            <div className="resume-project-item">
              <div className="resume-proj-header">
                <span className="proj-type-pill">Shopify Live Store</span>
                <a href="https://www.parvathibyvvm.com/" target="_blank" rel="noopener noreferrer" className="proj-link-icon">
                  <ExternalLink size={13} />
                </a>
              </div>
              <h4 className="proj-name">Parvathi by VVM</h4>
              <p className="proj-desc">Independently managed design, product data, and store setup for live luxury ethnic fashion brand; delivered on time with full approval.</p>
            </div>

            <div className="resume-project-item">
              <div className="resume-proj-header">
                <span className="proj-type-pill">Shopify Live Store</span>
                <a href="https://pinktiiger.com/" target="_blank" rel="noopener noreferrer" className="proj-link-icon">
                  <ExternalLink size={13} />
                </a>
              </div>
              <h4 className="proj-name">Pink Tiger</h4>
              <p className="proj-desc">Owned end-to-end UI design and product/catalog management for streetwear fashion brand store.</p>
            </div>

            <div className="resume-project-item">
              <div className="resume-proj-header">
                <span className="proj-type-pill">WordPress E-Commerce</span>
                <a href="https://kaachvalaym.com/" target="_blank" rel="noopener noreferrer" className="proj-link-icon">
                  <ExternalLink size={13} />
                </a>
              </div>
              <h4 className="proj-name">Kaachvalaym Bagel Store</h4>
              <p className="proj-desc">End-to-end design & WordPress development in Divi; redesign directly drove a 10X increase in store reach and online sales.</p>
            </div>

            <div className="resume-project-item">
              <div className="resume-proj-header">
                <span className="proj-type-pill">SaaS & Marketing</span>
                <a href="https://getaseed.com/" target="_blank" rel="noopener noreferrer" className="proj-link-icon">
                  <ExternalLink size={13} />
                </a>
              </div>
              <h4 className="proj-name">GetaSeed Platform</h4>
              <p className="proj-desc">Designed marketing website in WordPress alongside separate software product UI for WhatsApp marketing automation.</p>
            </div>

            <div className="resume-project-item">
              <div className="resume-proj-header">
                <span className="proj-type-pill">Lovable Dashboard</span>
                <a href="https://raj-drive-flow.lovable.app/" target="_blank" rel="noopener noreferrer" className="proj-link-icon">
                  <ExternalLink size={13} />
                </a>
              </div>
              <h4 className="proj-name">Raj Motors – Drive Flow</h4>
              <p className="proj-desc">Car dealership management dashboard managing receptionist operations, vehicle inventory, and customer client data.</p>
            </div>

            <div className="resume-project-item">
              <div className="resume-proj-header">
                <span className="proj-type-pill">WhatsApp API Platforms</span>
                <a href="https://seedoo.lovable.app/" target="_blank" rel="noopener noreferrer" className="proj-link-icon">
                  <ExternalLink size={13} />
                </a>
              </div>
              <h4 className="proj-name">Seedoo, Saloon, Esato, JewelChat</h4>
              <p className="proj-desc">Designed four niche broadcast platforms with GetaSeed WhatsApp API, Supabase data storage, and custom UI design.</p>
            </div>
          </div>
        </div>

        {/* Card 5: Education & Languages */}
        <div className="resume-card education-card">
          <div className="card-header">
            <div className="card-header-icon">
              <GraduationCap size={18} style={{ color: 'var(--accent-orange)' }} />
            </div>
            <h3 className="card-title">Education</h3>
          </div>
          <div className="edu-block">
            <h4 className="edu-degree">B.Tech, Computer Science Engineering</h4>
            <p className="edu-institute">Malout Institute of Management and Information Technology (MIMIT), Punjab</p>
            <div className="edu-meta-tags">
              <span className="edu-pill">2020 – 2024</span>
              <span className="edu-pill score-pill">Score: 71.4%</span>
            </div>
          </div>
        </div>

        {/* Card 6: Languages & Details */}
        <div className="resume-card languages-card">
          <div className="card-header">
            <div className="card-header-icon">
              <Globe size={18} style={{ color: 'var(--accent-orange)' }} />
            </div>
            <h3 className="card-title">Languages & Proficiency</h3>
          </div>
          <div className="lang-list">
            <div className="lang-item">
              <div className="lang-info">
                <span className="lang-name">English</span>
                <span className="lang-status">Professional Fluency</span>
              </div>
              <div className="lang-bar-container">
                <div className="lang-bar-fill" style={{ width: '95%' }} />
              </div>
            </div>

            <div className="lang-item">
              <div className="lang-info">
                <span className="lang-name">Hindi</span>
                <span className="lang-status">Native / Bilingual</span>
              </div>
              <div className="lang-bar-container">
                <div className="lang-bar-fill" style={{ width: '100%' }} />
              </div>
            </div>
          </div>

          <div className="resume-footer-note">
            <CheckCircle2 size={14} style={{ color: 'var(--accent-orange)' }} />
            <span>Verified portfolio record & credentials</span>
          </div>
        </div>
      </div>
    </section>
  );
};

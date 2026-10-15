'use client';

import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle2, ArrowRight, Briefcase, MessageSquare } from 'lucide-react';
import { ambientAudio } from '@/lib/ambient-sound';

export const ContactSection: React.FC = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    ambientAudio.playClickSound();
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
      ambientAudio.playPageTransitionEffect();
    }, 600);
  };

  return (
    <section className="contact-3d-room-wrapper" aria-label="Contact Sanjana Sharma — UI/UX & AI Designer">
      <div className="contact-room-interior">
        {/* Main Two-Card Layout matching Reference UI */}
        <div className="contact-cards-layout">
          {/* LEFT CARD: Silhouette Hero Card */}
          <div
            className="contact-left-card contact-card-with-hero-bg"
            style={{
              backgroundImage: 'linear-gradient(180deg, rgba(14, 16, 22, 0.45) 0%, rgba(14, 16, 22, 0.2) 35%, rgba(14, 16, 22, 0.7) 75%, rgba(14, 16, 22, 0.95) 100%), url(/assets/contact-silhouette-hero.jpg)',
              backgroundSize: 'cover',
              backgroundPosition: 'center 20%',
              backgroundRepeat: 'no-repeat',
            }}
          >
            {/* Top Left Symbol */}
            <div className="left-card-top-icon">
              <span className="copyright-circle">©</span>
              <span className="solid-white-circle" />
            </div>

            {/* Personal Designer Typography */}
            <div className="left-card-header">
              <h2 className="left-card-title">
                LET&apos;S WORK<br />TOGETHER
              </h2>
              <p className="left-card-description">
                Available for full-time product design opportunities, freelance collaborations, and UI/UX consultations. Bringing clarity, craft, and human-centered design to every screen.
              </p>
            </div>

            {/* Glowing Interactive Beacon Pin from reference */}
            <div className="left-card-interactive-pin" aria-hidden="true">
              <span className="pin-ring" />
              <span className="pin-dot" />
            </div>

            {/* Bottom Marquee / Footer */}
            <div className="left-card-footer">
              <span>SANJANA SHARMA ©</span>
              <span>UI/UX &amp; AI DESIGNER</span>
              <span>AVAILABLE FOR HIRE</span>
            </div>
          </div>

          {/* RIGHT CARD: Direct Reach & Interactive Contact Form */}
          <div className="contact-right-card">
            {/* Top Bar of Right Card */}
            <div className="right-card-top-bar">
              <div className="geometric-logo-icon small" aria-hidden="true">
                <span className="geo-diamond" />
                <span className="geo-diamond" />
                <span className="geo-diamond" />
                <span className="geo-diamond" />
              </div>
              <span className="right-card-brandmark">sanjana.</span>
            </div>

            {/* Main Content Area */}
            <div className="right-card-body">
              <div className="right-card-headline-group">
                <h3 className="right-card-headline">
                  —DIRECT COLLABORATION &amp;<br />PURPOSEFUL DESIGN
                </h3>
                <p className="right-card-subtext">
                  I work directly with founders, product teams, and businesses to transform complex problems into clean, intuitive, and human-centered digital experiences.
                </p>
              </div>

              {/* CURRENTLY WORKING COMPANY BADGE */}
              <div className="contact-company-badge">
                <div className="company-badge-header">
                  <span className="live-status-pulse" />
                  <span className="company-badge-tag">CURRENT EMPLOYMENT</span>
                </div>
                <div className="company-badge-body">
                  <div className="company-icon-box">
                    <Briefcase size={16} style={{ color: 'var(--accent-orange)' }} />
                  </div>
                  <div className="company-info-text">
                    <h4 className="company-name">Codesoftic Tech Private Limited</h4>
                    <span className="company-role">UI/UX &amp; AI Designer // Active Full-Time</span>
                  </div>
                </div>
              </div>

              {/* Direct Reach Out Channels (Including Direct WhatsApp Chat Link) */}
              <div className="right-card-channels">
                {/* 1. Direct WhatsApp Chat Link */}
                <a
                  href="https://wa.me/919682636699?text=Hi%20Sanjana%2C%20I%20would%20like%20to%20discuss%20a%20project"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="contact-channel-item whatsapp-channel-item"
                  onClick={() => ambientAudio.playClickSound()}
                >
                  <MessageSquare size={16} style={{ color: '#25D366' }} />
                  <div className="channel-text">
                    <span className="channel-label">WhatsApp Quick Chat</span>
                    <span className="channel-val">+91 96826 36699</span>
                  </div>
                  <span className="channel-action-badge">Chat on WhatsApp &rarr;</span>
                </a>

                {/* 2. Direct Email */}
                <a
                  href="mailto:sanjana19122001@gmail.com"
                  className="contact-channel-item"
                  onClick={() => ambientAudio.playClickSound()}
                >
                  <Mail size={16} style={{ color: 'var(--accent-orange)' }} />
                  <div className="channel-text">
                    <span className="channel-label">Email Direct</span>
                    <span className="channel-val">sanjana19122001@gmail.com</span>
                  </div>
                  <span className="channel-action-badge">Write Mail &rarr;</span>
                </a>

                {/* 3. Phone Calling */}
                <a
                  href="tel:+919682636699"
                  className="contact-channel-item"
                  onClick={() => ambientAudio.playClickSound()}
                >
                  <Phone size={16} style={{ color: 'var(--accent-orange)' }} />
                  <div className="channel-text">
                    <span className="channel-label">Phone Direct</span>
                    <span className="channel-val">+91 96826 36699</span>
                  </div>
                </a>

                {/* 4. Location */}
                <div className="contact-channel-item">
                  <MapPin size={16} style={{ color: 'var(--accent-orange)' }} />
                  <div className="channel-text">
                    <span className="channel-label">Location Base</span>
                    <span className="channel-val">Mohali, Punjab &amp; J&amp;K, India</span>
                  </div>
                </div>
              </div>

              {/* Interactive Quick Contact Form */}
              <div className="right-card-form-wrapper">
                {submitted ? (
                  <div className="contact-success-state">
                    <CheckCircle2 size={24} style={{ color: 'var(--accent-orange)' }} />
                    <h4>Message Received</h4>
                    <p>Thank you for reaching out! Sanjana will reply to your email within 24 hours.</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="quick-contact-form">
                    <div className="form-row">
                      <input
                        type="text"
                        placeholder="Your Name"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="contact-room-input"
                      />
                      <input
                        type="email"
                        placeholder="Your Email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="contact-room-input"
                      />
                    </div>
                    <textarea
                      placeholder="Brief details about your project or role..."
                      rows={3}
                      required
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="contact-room-textarea"
                    />
                    <button
                      type="submit"
                      disabled={loading}
                      className="contact-submit-room-btn"
                      onMouseEnter={() => ambientAudio.playHoverSound()}
                    >
                      <span>{loading ? 'Sending...' : 'Send Inquiry'}</span>
                      {loading ? (
                        <span className="btn-spinner" />
                      ) : (
                        <ArrowRight size={15} />
                      )}
                    </button>
                  </form>
                )}
              </div>
            </div>

            {/* Giant Vertical Typography along the right side */}
            <div className="vertical-adaptability-track" aria-hidden="true">
              <span>ADAPTABILITY</span>
            </div>

            {/* Bottom Values Tags */}
            <div className="right-card-tags-footer">
              <span className="value-tag">INNOVATIONS</span>
              <span className="value-tag">ADAPTABILITY</span>
              <span className="value-tag">PROFESSIONALISM</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

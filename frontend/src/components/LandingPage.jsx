// True Tag - Created by Coding W/ night owls

import React from "react";
import "./LandingPage.css";

export default function LandingPage({ onLaunchWorkspace, onOpenDocs }) {
  const teamMembers = [
    {
      name: "Gulshan Matre",
      role: "Team Leader",
      image: "/team/gulshan.jpg",
      initials: "GM",
    },
    {
      name: "John Mathew",
      role: "Backend & Database",
      image: "/team/john.jpg",
      initials: "JM",
    },
    {
      name: "Himesh Manral",
      role: "Frontend & UI Design",
      image: "/team/himesh.jpg",
      initials: "HM",
    },
    {
      name: "Divyam Yadav",
      role: "AI & Computer Vision",
      image: "/team/divyam.jpg",
      initials: "DY",
    },
  ];

  return (
    <div className="marketing-page-container">
      {/* 1. Top Navigation Bar */}
      <header className="landing-navbar">
        <div className="landing-brand-wrap" onClick={onLaunchWorkspace}>
          <img
            src="/truetag-logo.png"
            alt="TrueTag Logo"
            className="landing-logo-img"
            onError={(e) => {
              e.target.style.display = "none";
            }}
          />
          <span className="landing-brand-text">TrueTag</span>
        </div>

        <div>
          <button
            type="button"
            className="btn btn-primary"
            onClick={onLaunchWorkspace}
          >
            Launch Workspace ➔
          </button>
        </div>
      </header>

      {/* 2. Hero Section */}
      <section className="landing-hero-section">
        <div className="hero-pill-badge">
          🛡️ Built for Legal Metrology (LM-2011) Regulations
        </div>

        <h1 className="landing-hero-title">
          Automated Legal Metrology Compliance for E-Commerce.
        </h1>

        <p className="landing-hero-subtitle">
          Protect your marketplace from regulatory penalties. TrueTag’s AI
          vision engine automatically validates MRP, Net Quantity, and
          Manufacturer declarations across your entire catalog in seconds.
        </p>

        <div className="hero-cta-buttons-row">
          <button
            type="button"
            className="btn btn-primary btn-lg"
            onClick={onLaunchWorkspace}
          >
            🚀 Launch Workspace
          </button>
          <button
            type="button"
            className="btn btn-secondary btn-lg"
            onClick={onOpenDocs || onLaunchWorkspace}
          >
            📜 Read Statutory Rules
          </button>
        </div>

        <div className="hero-mockup-wrapper">
          <img
            src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=1000&q=80"
            alt="TrueTag Automated Computer Vision Packaging Scanner"
          />
        </div>
      </section>

      {/* 3. The Problem We Solve Section */}
      <section className="landing-problem-section">
        <div className="section-tag">Core Capabilities</div>
        <h2 className="section-title">
          Why Leading Marketplaces Trust TrueTag
        </h2>

        <div className="features-3col-grid">
          {/* Card 1 */}
          <div className="feature-white-card">
            <div className="feature-icon-box">⚖️</div>
            <h3 className="feature-card-title">Cross-Verify Listings</h3>
            <p className="feature-card-desc">
              Compares seller metadata with physical packaging extractions to
              flag illegal Section 18 overpricing and Net Quantity discrepancies
              instantly.
            </p>
          </div>

          {/* Card 2 */}
          <div className="feature-white-card">
            <div className="feature-icon-box">🔍</div>
            <h3 className="feature-card-title">Extract & Validate</h3>
            <p className="feature-card-desc">
              Extracts 5-point statutory rules (MRP, Net Qty, Manufacturer Name
              & Address, Country of Origin, Consumer Care) using multi-angle
              OpenCV & OCR.
            </p>
          </div>

          {/* Card 3 */}
          <div className="feature-white-card">
            <div className="feature-icon-box">⚡</div>
            <h3 className="feature-card-title">Scale to Millions</h3>
            <p className="feature-card-desc">
              Automates catalog compliance audits with SHA-256 digital
              certificate generation and immutable audit logs stored for legal
              proof.
            </p>
          </div>
        </div>
      </section>

      {/* 4. The Creators & Footer Section with Floating Hover Cards */}
      <footer className="landing-footer-section">
        <h3 className="footer-event-title">
          Engineered during SquidHack 2026 by Coding W/ Night Owls
        </h3>
        <p className="footer-event-subtitle">
          Built to secure digital consumer trust and automate Legal Metrology
          compliance for Indian e-commerce.
        </p>

        {/* 4-Column Team Members Flexbox with Hover Cards */}
        <div className="team-members-grid">
          {teamMembers.map((member, idx) => (
            <div key={idx} className="team-member-wrapper">
              {/* Floating Profile Card Appearing on Hover */}
              <div className="hover-card">
                <img
                  src={member.image}
                  alt={member.name}
                  className="hover-card-img"
                />
                <div className="hover-card-name">{member.name}</div>
                <div className="hover-card-role">{member.role}</div>
              </div>

              {/* Main Circular Avatar Frame */}
              <div className="team-photo-wrap">
                <img
                  src={member.image}
                  alt={member.name}
                  className="team-photo-img"
                  onError={(e) => {
                    e.target.style.display = "none";
                    if (e.target.nextSibling) {
                      e.target.nextSibling.style.display = "flex";
                    }
                  }}
                />
                <div
                  className="team-avatar-fallback"
                  style={{ display: "none" }}
                >
                  {member.initials}
                </div>
              </div>

              <span className="team-member-name">{member.name}</span>
              <span className="team-member-role">{member.role}</span>
            </div>
          ))}
        </div>

        <div className="footer-copyright-bar">
          © 2026 TrueTag. All rights reserved. Developed for SquidHack 2026 by
          Coding W/ Night Owls.
        </div>
      </footer>
    </div>
  );
}

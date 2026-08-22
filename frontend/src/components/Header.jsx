// True Tag - Created by Coding W/ night owls

import React from "react";

export default function Header({ activeTab, onTabChange }) {
  return (
    <header className="truetag-header">
      <div className="header-inner">
        {/* Left: Brand Emblem and Title */}
        <div className="brand-wrapper">
          <div className="brand-logo-icon">🏷️</div>
          <div className="brand-text-container">
            <div className="brand-title-line">
              <h1 className="brand-name">True Tag</h1>
              <span className="compliance-tag">Legal Metrology LM-2011</span>
            </div>
            <p className="brand-tagline">
              Automated E-Commerce Packaging Compliance Checker
            </p>
          </div>
        </div>

        {/* Right: Hackathon Team Badge & Tab Switcher */}
        <div className="header-right-wrapper">
          <div className="hackathon-credit-badge">
            🏆 SquidHack 2026 — Coding W/ Night Owls
          </div>
          <nav className="header-nav-tabs">
            <button
              type="button"
              className={`tab-btn ${activeTab === "scanner" ? "active-tab" : ""}`}
              onClick={() => onTabChange && onTabChange("scanner")}
            >
              🔍 Audit Scanner
            </button>
            <button
              type="button"
              className={`tab-btn ${activeTab === "history" ? "active-tab" : ""}`}
              onClick={() => onTabChange && onTabChange("history")}
            >
              📋 Audit Logs
            </button>
            <button
              type="button"
              className={`tab-btn ${activeTab === "rules" ? "active-tab" : ""}`}
              onClick={() => onTabChange && onTabChange("rules")}
            >
              📜 Statutory Rules
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
}

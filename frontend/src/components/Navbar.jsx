d;

import React from "react";

export default function Navbar({ activeTab, onTabChange }) {
  return (
    <header className="navbar-header">
      <div className="navbar-container">
        {/* Brand & Logo */}
        <div className="brand-group">
          <div className="brand-emblem">⚖️</div>
          <div>
            <div className="brand-title-row">
              <h1 className="brand-title">Legal Metrology Compliance Portal</h1>
              <span className="badge-tag">LM-2011 Verified</span>
            </div>
            <p className="brand-sub">
              Automated Packaging Compliance & Seller Certification Engine
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="nav-actions">
          <button
            type="button"
            className={`nav-btn ${activeTab === "scanner" ? "active" : ""}`}
            onClick={() => onTabChange("scanner")}
          >
            🔍 New Compliance Audit
          </button>
          <button
            type="button"
            className={`nav-btn ${activeTab === "history" ? "active" : ""}`}
            onClick={() => onTabChange("history")}
          >
            📋 Audit Records & Logs
          </button>
          <button
            type="button"
            className={`nav-btn ${activeTab === "rules" ? "active" : ""}`}
            onClick={() => onTabChange("rules")}
          >
            📜 Statutory Rules
          </button>
        </nav>
      </div>
    </header>
  );
}

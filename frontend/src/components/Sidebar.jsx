// True Tag - Created by Coding W/ night owls

import React from "react";
import "./Sidebar.css";

export default function Sidebar({ activeTab, onTabChange, onGoToLanding }) {
  return (
    <div className="sidebar-container">
      <div>
        {/* Brand Logo & Title Header */}
        <div
          className="sidebar-brand-box"
          onClick={onGoToLanding}
          style={{ cursor: "pointer" }}
          title="Return to Marketing Landing Page"
        >
          <img
            src="/truetag-logo.png"
            alt="TrueTag Official Brand Logo"
            className="sidebar-logo-img"
            onError={(e) => {
              e.target.style.display = "none";
            }}
          />
          <h2 className="sidebar-brand-title">TrueTag</h2>
          <span className="sidebar-brand-subtitle">Since 2026</span>
        </div>

        {/* Vertical Navigation Menu */}
        <nav className="sidebar-nav-list">
          <button
            type="button"
            className={`sidebar-nav-btn ${activeTab === "analytics" ? "active-nav-item" : ""}`}
            onClick={() => onTabChange && onTabChange("analytics")}
          >
            <span className="nav-icon">📊</span>
            <span>Analytics Dashboard</span>
          </button>

          <button
            type="button"
            className={`sidebar-nav-btn ${activeTab === "scanner" ? "active-nav-item" : ""}`}
            onClick={() => onTabChange && onTabChange("scanner")}
          >
            <span className="nav-icon">🔍</span>
            <span>Audit Scanner</span>
          </button>

          <button
            type="button"
            className={`sidebar-nav-btn ${activeTab === "history" ? "active-nav-item" : ""}`}
            onClick={() => onTabChange && onTabChange("history")}
          >
            <span className="nav-icon">📋</span>
            <span>Audit Logs</span>
          </button>

          <button
            type="button"
            className={`sidebar-nav-btn ${activeTab === "rules" ? "active-nav-item" : ""}`}
            onClick={() => onTabChange && onTabChange("rules")}
          >
            <span className="nav-icon">📜</span>
            <span>Statutory Rules</span>
          </button>
        </nav>
      </div>

      {/* Footer Team Attribution */}
      <div className="sidebar-footer-box">
        <button
          type="button"
          className="btn btn-secondary btn-sm"
          style={{ width: "100%", marginBottom: "0.65rem" }}
          onClick={onGoToLanding}
        >
          🌐 View Marketing Page
        </button>
        <div className="sidebar-credit-label">Developed For SquidHack 2026</div>
        <div className="sidebar-credit-team">Coding W/ Night Owls</div>
      </div>
    </div>
  );
}

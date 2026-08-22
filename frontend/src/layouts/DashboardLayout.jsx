// True Tag - Created by Coding W/ night owls

import React from "react";
import Sidebar from "../components/Sidebar";
import "./DashboardLayout.css";

export default function DashboardLayout({
  activeTab,
  onTabChange,
  onGoToLanding,
  title,
  subtitle,
  children,
}) {
  return (
    <div className="dashboard-layout-grid">
      {/* Fixed Left Sidebar */}
      <aside className="dashboard-sidebar-panel">
        <Sidebar
          activeTab={activeTab}
          onTabChange={onTabChange}
          onGoToLanding={onGoToLanding}
        />
      </aside>

      {/* Scrollable Main Content Area */}
      <main className="dashboard-main-content">
        {/* Top Header Bar */}
        <header className="dashboard-top-header">
          <div className="header-title-box">
            <h1>{title || "Automated Legal Metrology Audit"}</h1>
            <p>
              {subtitle ||
                "Verify e-commerce packaged commodity declarations under Indian Legal Metrology Rules, 2011"}
            </p>
          </div>

          <div className="header-badges-row">
            <span className="status-pill-tag">🛡️ LM-2011 Active</span>
            <span className="team-pill-tag">Coding W/ Night Owls</span>
          </div>
        </header>

        {/* Page Content Body */}
        <div className="dashboard-view-body">{children}</div>
      </main>
    </div>
  );
}

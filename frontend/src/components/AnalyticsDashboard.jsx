// True Tag - Created by Coding W/ night owls

import React from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import "./AnalyticsDashboard.css";

export default function AnalyticsDashboard({ onStartAudit, onViewAudit }) {
  const violationData = [
    { name: "Missing MRP", count: 85 },
    { name: "No Country of Origin", count: 42 },
    { name: "Invalid Net Qty", count: 20 },
    { name: "Missing Care Cell", count: 15 },
  ];

  const passFailData = [
    { name: "Compliant (Passed)", value: 87, color: "#00A3E0" },
    { name: "Non-Compliant (Failed)", value: 13, color: "#0A4D7A" },
  ];

  const recentAudits = [
    {
      id: "AUD-8821",
      name: "Pure Organic Wild Forest Honey 500g",
      category: "Packaged Food",
      timestamp: "10 mins ago",
      status: "Passed",
      image:
        "https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=100&q=80",
    },
    {
      id: "AUD-8820",
      name: "Ayurvedic Herbal Hair Oil 200ml",
      category: "Personal Care",
      timestamp: "28 mins ago",
      status: "Passed",
      image:
        "https://images.unsplash.com/photo-1608248597359-5984639d6756?w=100&q=80",
    },
    {
      id: "AUD-8819",
      name: "Immunity Boost Vitamin C Tablets (60 Caps)",
      category: "Supplements",
      timestamp: "1 hour ago",
      status: "Failed",
      image:
        "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=100&q=80",
    },
    {
      id: "AUD-8818",
      name: "Stainless Steel Insulated Flask 750ml",
      category: "Household",
      timestamp: "2 hours ago",
      status: "Passed",
      image:
        "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100&q=80",
    },
  ];

  return (
    <div className="analytics-container">
      {/* 1. Hero Welcome Section */}
      <div className="analytics-hero-card">
        <div className="hero-text-content">
          <h2 className="hero-heading">Enterprise Compliance Overview</h2>
          <p className="hero-description">
            The TrueTag AI vision engine is actively monitoring e-commerce
            catalog declarations against the Indian Legal Metrology (Packaged
            Commodities) Rules, 2011 to eliminate listing penalties and price
            gouging.
          </p>
          <button
            type="button"
            className="btn btn-primary"
            onClick={onStartAudit}
          >
            🚀 Start New Audit
          </button>
        </div>

        <div className="hero-image-wrap">
          <img
            src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=600&q=80"
            alt="E-Commerce Warehouse Packaging & Logistics"
          />
        </div>
      </div>

      {/* 2. Key Performance Indicators (KPI) Grid */}
      <div className="kpi-cards-grid">
        <div className="kpi-card">
          <div className="kpi-header">
            <span>TOTAL PRODUCTS AUDITED</span>
            <span className="kpi-icon">📦</span>
          </div>
          <div className="kpi-value">1,248</div>
          <div className="kpi-footer-note">+14% from last week</div>
        </div>

        <div className="kpi-card">
          <div className="kpi-header">
            <span>OVERALL COMPLIANCE RATE</span>
            <span className="kpi-icon">🛡️</span>
          </div>
          <div className="kpi-value kpi-val-green">87%</div>
          <div className="kpi-footer-note">Meets Section 18 benchmark</div>
        </div>

        <div className="kpi-card">
          <div className="kpi-header">
            <span>CRITICAL VIOLATIONS</span>
            <span className="kpi-icon">⚠️</span>
          </div>
          <div className="kpi-value kpi-val-red">162</div>
          <div className="kpi-footer-note">
            Publication automatically blocked
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-header">
            <span>ACTIVE SELLERS MONITORED</span>
            <span className="kpi-icon">🏪</span>
          </div>
          <div className="kpi-value">315</div>
          <div className="kpi-footer-note">Across 6 major categories</div>
        </div>
      </div>

      {/* 3. Analytics Charts Grid */}
      <div className="analytics-charts-grid">
        {/* Left: Top Statutory Violations Bar Chart */}
        <div className="chart-card-box">
          <h3 className="chart-title-header">Top Statutory Violations</h3>
          <p className="chart-sub-header">
            Frequency of non-compliant declarations under LM-2011
          </p>
          <div style={{ width: "100%", height: 240 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={violationData}
                margin={{ top: 10, right: 10, left: -20, bottom: 20 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#E2E8F0"
                  vertical={false}
                />
                <XAxis
                  dataKey="name"
                  stroke="#64748B"
                  fontSize={11}
                  interval={0}
                  angle={-15}
                  textAnchor="end"
                />
                <YAxis stroke="#64748B" fontSize={11} />
                <Tooltip
                  formatter={(val) => [`${val} Violations`, "Detected"]}
                  contentStyle={{
                    background: "#FFFFFF",
                    borderRadius: "8px",
                    border: "1px solid #E2E8F0",
                    color: "#1E293B",
                    fontSize: "12px",
                    boxShadow: "0 4px 6px rgba(0,0,0,0.05)",
                  }}
                />
                <Bar dataKey="count" fill="#00A3E0" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right: Pass vs Fail Ratio Donut Chart */}
        <div className="chart-card-box">
          <h3 className="chart-title-header">Pass vs. Fail Ratio</h3>
          <p className="chart-sub-header">
            Catalog compliance proportion across active products
          </p>
          <div style={{ width: "100%", height: 240 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={passFailData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {passFailData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(val) => [`${val}%`, "Share"]}
                  contentStyle={{
                    background: "#FFFFFF",
                    borderRadius: "8px",
                    border: "1px solid #E2E8F0",
                    color: "#1E293B",
                    fontSize: "12px",
                  }}
                />
                <Legend
                  verticalAlign="bottom"
                  height={36}
                  formatter={(value) => (
                    <span
                      style={{
                        color: "#1E293B",
                        fontSize: "12px",
                        fontWeight: 600,
                      }}
                    >
                      {value}
                    </span>
                  )}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* 4. Recent Audit Feed Section */}
      <div className="recent-feed-card">
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "1.25rem",
          }}
        >
          <div>
            <h3
              style={{
                fontSize: "1.1rem",
                fontWeight: 800,
                color: "var(--brand-navy)",
                marginBottom: "0.2rem",
              }}
            >
              ⚡ Real-Time Audit Feed
            </h3>
            <p style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
              Recent automated packaging scans processed by TrueTag AI
            </p>
          </div>
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={onStartAudit}
          >
            + New Scan
          </button>
        </div>

        <div style={{ overflowX: "auto" }}>
          <table className="dark-data-table">
            <thead>
              <tr>
                <th>Product Information</th>
                <th>Category</th>
                <th>Scan Time</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {recentAudits.map((item) => (
                <tr key={item.id}>
                  <td>
                    <div className="feed-product-cell">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="feed-product-thumb"
                      />
                      <div>
                        <div>{item.name}</div>
                        <div
                          style={{
                            fontSize: "0.725rem",
                            color: "var(--text-muted)",
                          }}
                        >
                          {item.id}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td style={{ color: "var(--text-muted)" }}>
                    {item.category}
                  </td>
                  <td
                    style={{ color: "var(--text-muted)", fontSize: "0.8rem" }}
                  >
                    {item.timestamp}
                  </td>
                  <td>
                    <span
                      className={`pill-badge ${item.status === "Passed" ? "badge-passed" : "badge-failed"}`}
                    >
                      {item.status === "Passed" ? "✓ PASSED" : "✕ FAILED"}
                    </span>
                  </td>
                  <td>
                    <button
                      type="button"
                      className="btn btn-secondary btn-sm"
                      onClick={() =>
                        onViewAudit ? onViewAudit(item) : onStartAudit()
                      }
                    >
                      View Report
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

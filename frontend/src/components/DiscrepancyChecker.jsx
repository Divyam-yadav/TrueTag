// True Tag - Created by Coding W/ night owls

import React from "react";
import "./DiscrepancyChecker.css";

export default function DiscrepancyChecker({ discrepancies }) {
  if (!discrepancies || discrepancies.length === 0) return null;

  return (
    <div className="discrepancy-card">
      <div className="form-header-row" style={{ marginBottom: "1rem" }}>
        <div>
          <h3
            style={{
              fontSize: "1.15rem",
              fontWeight: 800,
              color: "#0A4D7A",
              marginBottom: "0.2rem",
            }}
          >
            ⚖️ Seller Claim vs Packaging Discrepancy Checker
          </h3>
          <p style={{ fontSize: "0.85rem", color: "#64748B" }}>
            Cross-checking seller listing claims against physical packaging
            extractions (Section 18 Overpricing Check).
          </p>
        </div>
      </div>

      <div className="disc-grid">
        {discrepancies.map((disc, idx) => {
          const isCritical = disc.severity === "Critical";
          const isMatch = disc.severity === "Match";
          return (
            <div
              key={idx}
              className={`disc-item ${isCritical ? "disc-critical" : isMatch ? "disc-match" : "disc-warning"}`}
            >
              <div className="disc-header">
                <span className="disc-field-title">{disc.field}</span>
                <span
                  className={`disc-sev-tag ${isMatch ? "badge-passed" : isCritical ? "badge-failed" : "pill-badge"}`}
                  style={
                    !isMatch && !isCritical
                      ? {
                          backgroundColor: "#FFFBEB",
                          color: "#B45309",
                          border: "1px solid #FDE68A",
                        }
                      : {}
                  }
                >
                  {disc.severity === "Match"
                    ? "✓ MATCH"
                    : disc.severity === "Critical"
                      ? "⛔ CRITICAL MISMATCH"
                      : "⚠️ WARNING"}
                </span>
              </div>
              <div className="disc-comparison">
                <div className="disc-side">
                  <span className="disc-lbl">Seller Declared:</span>
                  <span className="disc-val">{disc.declared}</span>
                </div>
                <div className="disc-arrow">⇄</div>
                <div className="disc-side">
                  <span className="disc-lbl">Packaging Label:</span>
                  <span className="disc-val">{disc.packaging}</span>
                </div>
              </div>
              <p className="disc-detail-msg">{disc.message}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

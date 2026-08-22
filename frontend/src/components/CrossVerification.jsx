import React from "react";

export default function CrossVerification({ discrepancies }) {
  if (!discrepancies || discrepancies.length === 0) return null;

  return (
    <div className="card cross-verif-card">
      <h3 className="section-title">
        ⚖️ Seller Claim vs Packaging Cross-Verification
      </h3>
      <p className="section-description">
        Cross-checking declared catalog price and quantity against physical
        label extractions (Section 18 Overpricing Check).
      </p>

      <div className="cross-verif-grid">
        {discrepancies.map((disc, idx) => {
          const isCritical = disc.severity === "Critical";
          const isMatch = disc.severity === "Match";
          return (
            <div
              key={idx}
              className={`cross-verif-item ${isCritical ? "item-critical" : isMatch ? "item-match" : "item-warning"}`}
            >
              <div className="item-header">
                <span className="field-title">{disc.field}</span>
                <span
                  className={`sev-badge sev-${disc.severity.toLowerCase()}`}
                >
                  {disc.severity === "Match"
                    ? "✓ MATCH"
                    : disc.severity === "Critical"
                      ? "⛔ CRITICAL MISMATCH"
                      : "⚠️ WARNING"}
                </span>
              </div>
              <div className="comparison-row">
                <div className="comp-box">
                  <span className="comp-lbl">Seller Declared:</span>
                  <span className="comp-val">{disc.declared}</span>
                </div>
                <div className="comp-arrow">⇄</div>
                <div className="comp-box">
                  <span className="comp-lbl">Packaging Physical Label:</span>
                  <span className="comp-val">{disc.packaging}</span>
                </div>
              </div>
              <p className="comp-msg">{disc.message}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

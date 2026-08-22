import React, { useState } from "react";

export default function RejectionModal({ result, onClose, onDownload }) {
  const [copied, setCopied] = useState(false);

  if (!result) return null;

  const rules = result.rules_breakdown || {};
  const discrepancies = result.discrepancies || [];
  const ruleKeys = [
    "mrp",
    "net_quantity",
    "manufacturer",
    "country_of_origin",
    "customer_care",
  ];
  const failedRules = ruleKeys.filter((k) => !rules[k]?.passed);

  const handleCopy = () => {
    const reportText = [
      `============================================================`,
      `NATIONAL LEGAL METROLOGY COMPLIANCE AUDIT REPORT (REJECTION)`,
      `Audit Reference ID: ${result.audit_id}`,
      `Date: ${new Date(result.timestamp).toLocaleString()}`,
      `Product Name: ${result.product_name}`,
      `Category: ${result.category}`,
      `Status: PUBLICATION BLOCKED - VIOLATIONS DETECTED`,
      `============================================================\n`,
      `1. STATUTORY DECLARATION BREAKDOWN:`,
      ...ruleKeys.map((key) => {
        const r = rules[key];
        if (!r) return "";
        return `• [${r.passed ? "PASSED" : "FAILED"}] ${r.name}\n  Reference: ${r.statutory_ref}\n  Extracted: ${r.extracted_value || "None (Missing)"}\n  Source: ${r.source_image || "N/A"}\n  ${!r.passed ? "Reason: " + r.failure_reason : ""}\n`;
      }),
      `\n2. CROSS-VERIFICATION DISCREPANCIES:`,
      ...discrepancies.map(
        (d) =>
          `• [Severity: ${d.severity.toUpperCase()}] ${d.field}\n  Declared: ${d.declared} | Packaging: ${d.packaging}\n  Note: ${d.message}\n`,
      ),
      `\n============================================================`,
      `ACTIONABLE FIXES FOR SELLER:`,
      `1. Ensure all 5 statutory declarations are legibly printed on product packaging panels.`,
      `2. Ensure the listed e-commerce selling price does not exceed the printed MRP (Rule 18(2)).`,
      `3. Re-upload all packaging sides (Front, Back, Sides) for automatic re-audit.`,
      `============================================================`,
    ].join("\n");

    navigator.clipboard.writeText(reportText);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal-container rejection-modal-container"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="modal-header rejection-modal-header">
          <div className="modal-title-group">
            <span className="modal-icon">⚠️</span>
            <div>
              <h2 className="modal-title rejection-title">
                Statutory Non-Compliance Audit Report
              </h2>
              <p className="modal-subtitle">
                Legal Metrology (Packaged Commodities) Rules, 2011 • Audit
                Notice
              </p>
            </div>
          </div>
          <button type="button" className="btn-close-modal" onClick={onClose}>
            ✕
          </button>
        </div>

        {/* Audit Document Body */}
        <div className="modal-scroll-content">
          {/* Summary Rejection Banner */}
          <div className="rejection-summary-banner">
            <div className="summary-left">
              <span className="rej-badge">PUBLICATION BLOCKED</span>
              <h3 className="rej-product-title">{result.product_name}</h3>
              <p className="rej-meta">
                Audit ID: <code>{result.audit_id}</code> • Date:{" "}
                {new Date(result.timestamp).toLocaleString()}
              </p>
            </div>
            <div className="summary-score-box">
              <span className="score-num">
                {result.passed_rules_count || 0} / {result.total_rules || 5}
              </span>
              <span className="score-lbl">Rules Met</span>
            </div>
          </div>

          {/* Section 1: Statutory Violations */}
          <div className="report-section">
            <h4 className="report-section-heading">
              1. Statutory Violations Detected ({failedRules.length})
            </h4>
            <div className="violation-cards-list">
              {failedRules.length === 0 ? (
                <p className="no-rule-fails">
                  No individual rule omissions detected.
                </p>
              ) : (
                failedRules.map((k) => {
                  const rule = rules[k];
                  return (
                    <div key={k} className="violation-card">
                      <div className="violation-card-top">
                        <span className="rule-badge-fail">✕ NON-COMPLIANT</span>
                        <span className="statutory-code">
                          {rule.statutory_ref}
                        </span>
                      </div>
                      <h5 className="violation-rule-name">{rule.name}</h5>
                      <p className="violation-reason">{rule.failure_reason}</p>
                      <div className="violation-ext-box">
                        <span className="ext-lbl">
                          Extracted from Packaging:
                        </span>
                        <span className="ext-val">
                          {rule.extracted_value ||
                            "None (Missing / Unreadable)"}
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Section 2: Cross-Verification Discrepancies */}
          <div className="report-section">
            <h4 className="report-section-heading">
              2. Cross-Verification Discrepancies
            </h4>
            <div className="discrepancy-report-list">
              {discrepancies.map((d, idx) => (
                <div
                  key={idx}
                  className={`discrepancy-row-item ${d.severity === "Critical" ? "disc-critical" : d.severity === "Match" ? "disc-match" : "disc-warn"}`}
                >
                  <div className="disc-top">
                    <span className="disc-field">{d.field}</span>
                    <span
                      className={`disc-sev-tag sev-${d.severity.toLowerCase()}`}
                    >
                      {d.severity.toUpperCase()}
                    </span>
                  </div>
                  <div className="disc-compare">
                    <span>
                      Seller Declared: <strong>{d.declared}</strong>
                    </span>
                    <span>
                      Packaging Label: <strong>{d.packaging}</strong>
                    </span>
                  </div>
                  <p className="disc-msg">{d.message}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Section 3: Actionable Seller Remediation Checklist */}
          <div className="report-section remediation-section">
            <h4 className="report-section-heading">
              3. Actionable Remediation Checklist for Seller
            </h4>
            <div className="remediation-steps">
              <div className="step-item">
                <span className="step-num">1</span>
                <div>
                  <strong>Legible Mandatory Labeling:</strong> Ensure all 5
                  statutory declarations (MRP, Net Qty, Manufacturer Name &
                  Address, Country of Origin, Consumer Care details) are printed
                  clearly and prominently on your packaging.
                </div>
              </div>
              <div className="step-item">
                <span className="step-num">2</span>
                <div>
                  <strong>Price Compliance (Rule 18(2)):</strong> Adjust your
                  listing price so that it does not exceed the Maximum Retail
                  Price (MRP) printed on the product packaging.
                </div>
              </div>
              <div className="step-item">
                <span className="step-num">3</span>
                <div>
                  <strong>Multi-Angle Re-Upload:</strong> Take high-resolution,
                  well-lit photos of all packaging panels (Front, Back, and
                  Sides) and re-submit for automated audit verification.
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer Actions */}
        <div className="modal-footer">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={handleCopy}
          >
            {copied ? "✓ Copied Report!" : "📋 Copy Report Text"}
          </button>
          <button
            type="button"
            className="btn btn-primary"
            onClick={onDownload}
          >
            📥 Download Audit Report (.txt)
          </button>
          <button type="button" className="btn btn-secondary" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

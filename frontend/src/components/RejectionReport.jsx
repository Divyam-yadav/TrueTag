// True Tag - Created by Coding W/ night owls

import React, { useState } from "react";
import "./RejectionReport.css";

export default function RejectionReport({ result, onClose }) {
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

  const generateReportText = () => {
    return [
      `============================================================`,
      `TRUE TAG LEGAL METROLOGY COMPLIANCE AUDIT REPORT (REJECTION)`,
      `Audit Reference ID: ${result.audit_id}`,
      `Date: ${new Date(result.timestamp).toLocaleString()}`,
      `Product Name: ${result.product_name}`,
      `Category: ${result.category}`,
      `Status: PUBLICATION BLOCKED - VIOLATIONS DETECTED`,
      `============================================================\n`,
      `1. STATUTORY DECLARATIONS BREAKDOWN:`,
      ...ruleKeys.map((key) => {
        const r = rules[key];
        if (!r) return "";
        return `• [${r.passed ? "PASSED" : "FAILED"}] ${r.name}\n  Reference: ${r.statutory_ref}\n  Extracted: ${r.extracted_value || "None (Missing)"}\n  ${!r.passed ? "Reason: " + r.failure_reason : ""}\n`;
      }),
      `\n2. DISCREPANCIES:`,
      ...discrepancies.map(
        (d) =>
          `• [${d.severity.toUpperCase()}] ${d.field}\n  Declared: ${d.declared} | Packaging: ${d.packaging}\n  Note: ${d.message}\n`,
      ),
      `\n============================================================`,
      `ACTIONABLE REMEDIATION FOR SELLER:`,
      `1. Ensure all 5 statutory declarations are legibly printed on packaging panels.`,
      `2. Ensure the listed e-commerce selling price does not exceed the printed MRP (Rule 18(2)).`,
      `3. Re-upload all packaging sides for automated re-audit.`,
      `============================================================`,
    ].join("\n");
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generateReportText());
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const handleDownload = () => {
    const blob = new Blob([generateReportText()], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `TrueTag_Rejection_Audit_${result.audit_id}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="modal-backdrop-overlay" onClick={onClose}>
      <div className="modal-doc-box" onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="modal-header-top rejection-modal-hdr">
          <div className="modal-title-wrap">
            <span style={{ fontSize: "1.5rem" }}>⚠️</span>
            <div>
              <h2 className="modal-heading-text rejection-title-text">
                Statutory Non-Compliance Notice
              </h2>
              <p className="modal-subheading-text">
                Legal Metrology (Packaged Commodities) Rules, 2011
              </p>
            </div>
          </div>
          <button type="button" className="modal-x-btn" onClick={onClose}>
            ✕
          </button>
        </div>

        {/* Content Body */}
        <div
          style={{ padding: "1.5rem", maxHeight: "70vh", overflowY: "auto" }}
        >
          {/* Summary Banner */}
          <div className="rejection-summary-panel">
            <div>
              <span className="rej-status-tag">PUBLICATION BLOCKED</span>
              <h3
                style={{
                  color: "#1E293B",
                  fontSize: "1.15rem",
                  marginBottom: "0.2rem",
                  fontWeight: 800,
                }}
              >
                {result.product_name}
              </h3>
              <p style={{ color: "#64748B", fontSize: "0.78rem" }}>
                Audit ID: <code>{result.audit_id}</code> • Date:{" "}
                {new Date(result.timestamp).toLocaleString()}
              </p>
            </div>
            <div className="rej-score-box">
              <span className="rej-score-num">
                {result.passed_rules_count || 0} / {result.total_rules || 5}
              </span>
              <span style={{ fontSize: "0.7rem", color: "#64748B" }}>
                Rules Met
              </span>
            </div>
          </div>

          {/* Section 1: Violations */}
          <h4 className="report-sect-heading">
            1. Statutory Violations Detected ({failedRules.length})
          </h4>
          <div className="violation-items-list">
            {failedRules.length === 0 ? (
              <p style={{ color: "#64748B", fontSize: "0.85rem" }}>
                No individual declaration omissions detected.
              </p>
            ) : (
              failedRules.map((k) => {
                const rule = rules[k];
                return (
                  <div key={k} className="violation-card-dark">
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginBottom: "0.35rem",
                      }}
                    >
                      <span className="badge-failed pill-badge">
                        ✕ NON-COMPLIANT
                      </span>
                      <span className="legal-code-tag">
                        <code>{rule.statutory_ref}</code>
                      </span>
                    </div>
                    <h5
                      style={{
                        color: "#1E293B",
                        fontSize: "0.9rem",
                        marginBottom: "0.25rem",
                        fontWeight: 700,
                      }}
                    >
                      {rule.name}
                    </h5>
                    <p
                      style={{
                        color: "#B91C1C",
                        fontSize: "0.8rem",
                        marginBottom: "0.5rem",
                      }}
                    >
                      {rule.failure_reason}
                    </p>
                    <div style={{ fontSize: "0.75rem", color: "#64748B" }}>
                      Extracted from packaging:{" "}
                      <span style={{ color: "#B91C1C", fontWeight: 600 }}>
                        {rule.extracted_value || "None (Missing)"}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Section 2: Remediation */}
          <h4 className="report-sect-heading">
            2. Actionable Remediation Checklist for Seller
          </h4>
          <div className="remediation-box-dark">
            <div className="remediation-step-row">
              <span className="step-circle-num">1</span>
              <div>
                <strong>Legible Declarations:</strong> Ensure all 5 statutory
                declarations (MRP, Net Qty, Manufacturer Name & Address, Country
                of Origin, Consumer Care) are prominently printed on packaging.
              </div>
            </div>
            <div className="remediation-step-row">
              <span className="step-circle-num">2</span>
              <div>
                <strong>Price Compliance (Rule 18(2)):</strong> Adjust your
                listed price so that it does not exceed the Maximum Retail Price
                (MRP) printed on the package.
              </div>
            </div>
            <div className="remediation-step-row">
              <span className="step-circle-num">3</span>
              <div>
                <strong>Multi-Angle Re-Upload:</strong> Take high-resolution
                photos of all packaging panels and re-submit for automated audit
                verification.
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer Actions with unified buttons */}
        <div className="modal-actions-footer">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={handleCopy}
          >
            {copied ? "✓ Copied Report!" : "📋 Copy Report Text"}
          </button>
          <button
            type="button"
            className="btn btn-download"
            onClick={handleDownload}
          >
            📥 Download Report (.txt)
          </button>
          <button type="button" className="btn btn-secondary" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

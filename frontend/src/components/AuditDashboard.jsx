import React, { useState } from "react";
import PriceChart from "./PriceChart";
import CertificateModal from "./CertificateModal";
import RejectionModal from "./RejectionModal";

export default function AuditDashboard({ result, onReset }) {
  const [showCertModal, setShowCertModal] = useState(false);
  const [showRejectionModal, setShowRejectionModal] = useState(false);

  if (!result) return null;

  const isCompliant = result.is_compliant;
  const passedCount = result.passed_rules_count || 0;
  const totalRules = result.total_rules || 5;
  const rules = result.rules_breakdown || {};
  const discrepancies = result.discrepancies || [];
  const certificate = result.certificate;

  const ruleKeys = [
    "mrp",
    "net_quantity",
    "manufacturer",
    "country_of_origin",
    "customer_care",
  ];

  const handleDownloadRejectionReport = () => {
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

    const blob = new Blob([reportText], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Rejection_Audit_${result.audit_id}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="audit-dashboard-container">
      {/* 1. Overall Status Banner */}
      <div
        className={`status-banner ${isCompliant ? "banner-pass" : "banner-fail"}`}
      >
        <div className="banner-icon-box">{isCompliant ? "🛡️" : "⚠️"}</div>
        <div className="banner-text">
          <div className="banner-status-title">
            {isCompliant
              ? "PUBLISH APPROVED — FULLY COMPLIANT"
              : "PUBLICATION BLOCKED — VIOLATIONS DETECTED"}
          </div>
          <p className="banner-status-desc">
            {isCompliant
              ? "All 5 statutory Legal Metrology declarations verified across packaging photos with zero overpricing discrepancies."
              : `Compliance check failed: ${totalRules - passedCount} statutory declaration(s) missing or critical pricing mismatch detected.`}
          </p>
          <div className="banner-meta-row">
            <span>
              Audit ID: <strong>{result.audit_id}</strong>
            </span>
            <span>
              Commodity: <strong>{result.product_name}</strong>
            </span>
            <span>
              Score:{" "}
              <strong>
                {passedCount} / {totalRules} Rules Met
              </strong>
            </span>
          </div>
        </div>
      </div>

      {/* 2. 5-Point Legal Metrology Breakdown Table */}
      <div className="card breakdown-card">
        <div className="card-header-row">
          <div>
            <h3 className="section-title">
              5-Point Legal Metrology Declarations Breakdown
            </h3>
            <p className="section-description">
              Verification under Legal Metrology (Packaged Commodities) Rules,
              2011 across uploaded image panels.
            </p>
          </div>
          <span className="count-pill">
            {passedCount} / {totalRules} Passed
          </span>
        </div>

        <div className="table-responsive">
          <table className="breakdown-table">
            <thead>
              <tr>
                <th>Mandatory Rule</th>
                <th>Statutory Legal Clause</th>
                <th>Extracted Value from Packaging</th>
                <th>Source Panel</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {ruleKeys.map((key) => {
                const rule = rules[key];
                if (!rule) return null;
                return (
                  <tr
                    key={key}
                    className={rule.passed ? "row-pass" : "row-fail"}
                  >
                    <td className="rule-name-cell">
                      <strong>{rule.name}</strong>
                    </td>
                    <td className="rule-clause-cell">
                      <code>{rule.statutory_ref}</code>
                    </td>
                    <td className="rule-extracted-cell">
                      {rule.passed ? (
                        <span className="extracted-text-val">
                          {rule.extracted_value || "Detected"}
                        </span>
                      ) : (
                        <span className="missing-text-val">
                          Missing / Unreadable
                        </span>
                      )}
                    </td>
                    <td className="rule-source-cell">
                      {rule.source_image ? (
                        <span className="source-tag">
                          📷 {rule.source_image}
                        </span>
                      ) : (
                        <span className="source-tag-none">—</span>
                      )}
                    </td>
                    <td>
                      <span
                        className={`status-badge ${rule.passed ? "badge-pass" : "badge-fail"}`}
                      >
                        {rule.passed ? "✓ PASSED" : "✕ FAILED"}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* 3. Cross-Verification Panel */}
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

      {/* 4. Real-Time Price Tracking Graph */}
      <PriceChart
        priceHistory={result.price_history}
        declaredMrp={result.declared_mrp}
        packagingMrp={result.extracted_numeric_mrp}
      />

      {/* 5. Seller Action Panel */}
      <div className="card action-card">
        <h3 className="section-title">
          {isCompliant
            ? "🎉 Seller Compliance Actions & Certification"
            : "🛠️ Corrective Actions for Seller"}
        </h3>

        {isCompliant ? (
          <div className="action-content pass-actions">
            <p className="action-desc">
              Congratulations! This product meets all statutory requirements of
              the Legal Metrology (Packaged Commodities) Rules, 2011 and is
              approved for e-commerce listing.
            </p>
            <div className="btn-group">
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => setShowCertModal(true)}
              >
                🛡️ View & Download Seller Certificate (PDF)
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() =>
                  window.open(
                    `/api/products/${result.audit_id}/certificate/download`,
                    "_blank",
                  )
                }
              >
                📥 Direct PDF Download
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={onReset}
              >
                🔍 Audit Another Product
              </button>
            </div>
          </div>
        ) : (
          <div className="action-content fail-actions">
            <p className="action-desc">
              This product listing cannot be approved due to statutory Legal
              Metrology violations. You can view the full interactive audit
              report or download it below:
            </p>
            <ul className="fail-reasons-list">
              {ruleKeys
                .filter((k) => !rules[k]?.passed)
                .map((k) => (
                  <li key={k}>
                    <strong>{rules[k]?.name}:</strong>{" "}
                    {rules[k]?.failure_reason}
                  </li>
                ))}
              {result.has_critical_violation && (
                <li>
                  <strong>Illegal Overpricing:</strong> Seller listed price
                  exceeds packaging MRP. Lower the listed price to or below
                  packaging MRP.
                </li>
              )}
            </ul>
            <div className="btn-group">
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => setShowRejectionModal(true)}
              >
                👁️ View Rejection Audit Report
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={handleDownloadRejectionReport}
              >
                📥 Download Report (.txt)
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={onReset}
              >
                🔄 Fix Details & Re-Upload Photos
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Certificate Modal */}
      {showCertModal && certificate && (
        <CertificateModal
          certificate={certificate}
          auditId={result.audit_id}
          onClose={() => setShowCertModal(false)}
        />
      )}

      {/* Rejection Audit Report Viewer Modal */}
      {showRejectionModal && (
        <RejectionModal
          result={result}
          onClose={() => setShowRejectionModal(false)}
          onDownload={handleDownloadRejectionReport}
        />
      )}
    </div>
  );
}

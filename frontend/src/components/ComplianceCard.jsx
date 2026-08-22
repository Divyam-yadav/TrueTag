import React from "react";

export default function ComplianceCard({ result }) {
  if (!result) return null;

  const isCompliant = result.is_compliant;
  const passedCount = result.passed_rules_count || 0;
  const totalRules = result.total_rules || 5;
  const rules = result.rules_breakdown || {};
  const ruleKeys = [
    "mrp",
    "net_quantity",
    "manufacturer",
    "country_of_origin",
    "customer_care",
  ];

  return (
    <div className="compliance-card-flow">
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

      {/* 2. 5-Point Legal Metrology Declarations Breakdown Table */}
      <div className="card breakdown-card">
        <div className="card-header-row">
          <div>
            <h3 className="section-title">
              5-Point Legal Metrology Declarations Breakdown
            </h3>
            <p className="section-description">
              Statutory verification under Legal Metrology (Packaged
              Commodities) Rules, 2011.
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
    </div>
  );
}

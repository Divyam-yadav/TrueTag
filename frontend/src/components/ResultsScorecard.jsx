// True Tag - Created by Coding W/ night owls

import React from "react";
import "./ResultsScorecard.css";

export default function ResultsScorecard({ result }) {
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
    <div className="scorecard-flow-wrap">
      {/* 1. Overall Audit Status Banner */}
      <div
        className={`dark-status-banner ${isCompliant ? "banner-passed" : "banner-failed"}`}
      >
        <div className="status-icon-box">{isCompliant ? "🛡️" : "⚠️"}</div>
        <div className="status-content">
          <div className="status-heading">
            {isCompliant
              ? "TRUE TAG CERTIFIED — FULLY COMPLIANT"
              : "PUBLICATION BLOCKED — VIOLATIONS DETECTED"}
          </div>
          <p className="status-desc">
            {isCompliant
              ? "All 5 statutory Legal Metrology declarations verified across packaging photos with zero overpricing discrepancies."
              : `Compliance check failed: ${totalRules - passedCount} statutory declaration(s) missing or critical pricing mismatch detected.`}
          </p>
          <div className="status-meta-row">
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

      {/* 2. Spacious 5-Point Legal Metrology Scorecard Table */}
      <div className="scorecard-card">
        <div
          className="form-header-row"
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "1.25rem",
            alignItems: "center",
          }}
        >
          <div>
            <h3
              style={{
                fontSize: "1.15rem",
                fontWeight: 700,
                color: "#f8fafc",
                marginBottom: "0.2rem",
              }}
            >
              5-Point Legal Metrology Scorecard
            </h3>
            <p style={{ fontSize: "0.825rem", color: "#94a3b8" }}>
              Statutory verification under Indian Legal Metrology (Packaged
              Commodities) Rules, 2011.
            </p>
          </div>
          <span className="status-pill-tag">
            {passedCount} / {totalRules} Passed
          </span>
        </div>

        <div className="scorecard-table-scroll">
          <table className="dark-data-table">
            <thead>
              <tr>
                <th>Mandatory Rule</th>
                <th>Statutory Legal Clause</th>
                <th>Extracted Value from Packaging</th>
                <th>Status Badge</th>
              </tr>
            </thead>
            <tbody>
              {ruleKeys.map((key) => {
                const rule = rules[key];
                if (!rule) return null;
                return (
                  <tr key={key}>
                    <td className="rule-name-cell">{rule.name}</td>
                    <td className="legal-code-tag">
                      <code>{rule.statutory_ref}</code>
                    </td>
                    <td>
                      {rule.passed ? (
                        <div className="extracted-box">
                          <span className="extracted-val-text">
                            {rule.extracted_value || "Detected"}
                          </span>
                          {rule.source_image && (
                            <span className="source-badge">
                              📷 {rule.source_image}
                            </span>
                          )}
                        </div>
                      ) : (
                        <span className="missing-val-text">
                          Missing / Unreadable
                        </span>
                      )}
                    </td>
                    <td>
                      <span
                        className={`pill-badge ${rule.passed ? "badge-passed" : "badge-failed"}`}
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

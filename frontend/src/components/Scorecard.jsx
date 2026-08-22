import React from "react";

export default function Scorecard({ result }) {
  if (!result) return null;

  const isPass = result.overall_status === "Pass" || result.is_compliant;

  const rulesList = [
    {
      id: "mrp",
      title: "Maximum Retail Price (MRP)",
      description: "Mandatory declaration of MRP inclusive of all taxes.",
      found: result.mrp_found ?? result.rules?.mrp_found,
    },
    {
      id: "net_quantity",
      title: "Net Quantity / Weight",
      description: "Clear statement of net weight, volume, or count of units.",
      found: result.net_quantity_found ?? result.rules?.net_quantity_found,
    },
    {
      id: "manufacturer",
      title: "Manufacturer / Packer Name & Address",
      description: "Identity and complete address of manufacturer or packer.",
      found: result.manufacturer_found ?? result.rules?.manufacturer_found,
    },
    {
      id: "country_of_origin",
      title: "Country of Origin",
      description: 'Mandatory origin statement (e.g., "Made in India").',
      found:
        result.country_of_origin_found ?? result.rules?.country_of_origin_found,
    },
    {
      id: "customer_care",
      title: "Consumer Care / Helpline",
      description:
        "Contact phone number, email, or postal address for consumer grievances.",
      found: result.customer_care_found ?? result.rules?.customer_care_found,
    },
  ];

  const passedCount = rulesList.filter((r) => r.found).length;

  return (
    <div className="card scorecard-card">
      <div className="scorecard-header">
        <div>
          <h2 className="section-title">2. Compliance Scorecard</h2>
          <p className="section-description">
            Legal Metrology (Packaged Commodities) Rules Verification
          </p>
        </div>
        <div
          className={`status-pill ${isPass ? "status-pass" : "status-fail"}`}
        >
          <span className="status-dot"></span>
          <span className="status-text">
            {isPass ? "COMPLIANT (PASS)" : "NON-COMPLIANT (FAIL)"}
          </span>
        </div>
      </div>

      {/* Summary Score Bar */}
      <div className="score-summary-bar">
        <div className="score-label">
          <span>
            Compliance Score: <strong>{passedCount} / 5 Rules Met</strong>
          </span>
          <span className="score-percentage">
            {Math.round((passedCount / 5) * 100)}%
          </span>
        </div>
        <div className="progress-track">
          <div
            className={`progress-fill ${isPass ? "fill-pass" : "fill-warning"}`}
            style={{ width: `${(passedCount / 5) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* Rules Breakdown Checklist */}
      <div className="rules-list">
        {rulesList.map((rule) => (
          <div
            key={rule.id}
            className={`rule-item ${rule.found ? "rule-passed" : "rule-failed"}`}
          >
            <div className="rule-icon-box">
              {rule.found ? (
                <span className="icon-check">✓</span>
              ) : (
                <span className="icon-cross">✕</span>
              )}
            </div>
            <div className="rule-info">
              <div className="rule-title-row">
                <span className="rule-name">{rule.title}</span>
                <span
                  className={`rule-badge ${rule.found ? "badge-found" : "badge-missing"}`}
                >
                  {rule.found ? "Found" : "Missing"}
                </span>
              </div>
              <p className="rule-desc">{rule.description}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Regulatory Context Notice */}
      <div className="compliance-notice">
        <span className="notice-icon">ℹ️</span>
        <span className="notice-text">
          Under Legal Metrology Rules, e-commerce listings must mandate all 5
          statutory declarations prior to sale.
        </span>
      </div>
    </div>
  );
}

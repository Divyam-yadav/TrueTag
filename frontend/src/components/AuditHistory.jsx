// TrueTag - Created by Coding W/ night owls

import React, { useEffect, useState } from "react";
import { fetchAuditHistory } from "../api/backendClient";
import "./AuditHistory.css";

export default function AuditHistory({ onSelectAudit }) {
  const [audits, setAudits] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAudits();
  }, []);

  const loadAudits = async () => {
    setLoading(true);
    try {
      const data = await fetchAuditHistory(20);
      if (data && data.audits) {
        setAudits(data.audits);
      }
    } catch (err) {
      console.warn("Could not fetch audit history:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="history-card-dark">
      <div
        className="form-header-row"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div>
          <h2
            style={{
              fontSize: "1.25rem",
              fontWeight: 800,
              color: "#0A4D7A",
              marginBottom: "0.2rem",
            }}
          >
            📋 Historical Compliance Audit Logs
          </h2>
          <p style={{ fontSize: "0.85rem", color: "#64748B" }}>
            Immutable audit records stored in MongoDB{" "}
            <code>compliance_audits</code> collection.
          </p>
        </div>
        <button
          type="button"
          className="btn btn-secondary btn-sm"
          onClick={loadAudits}
        >
          🔄 Refresh Logs
        </button>
      </div>

      {loading ? (
        <div className="empty-logs-box">
          <div
            className="btn-spinner"
            style={{
              borderColor: "rgba(0, 163, 224, 0.3)",
              borderTopColor: "#00A3E0",
              margin: "0 auto 1rem",
              width: "32px",
              height: "32px",
            }}
          ></div>
          <p>Loading historical audit logs from MongoDB...</p>
        </div>
      ) : audits.length === 0 ? (
        <div className="empty-logs-box">
          <span className="empty-logs-icon">📭</span>
          <h3
            style={{
              color: "#1E293B",
              marginBottom: "0.25rem",
              fontWeight: 800,
            }}
          >
            No Compliance Audits Logged Yet
          </h3>
          <p>Perform your first packaging scan from the "Audit Scanner" tab.</p>
        </div>
      ) : (
        <div className="history-table-scroll">
          <table className="dark-data-table">
            <thead>
              <tr>
                <th>Audit ID</th>
                <th>Timestamp</th>
                <th>Product Title</th>
                <th>Category</th>
                <th>Declared Price</th>
                <th>Score</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {audits.map((item, idx) => {
                const isPass =
                  item.is_compliant || item.compliance_status === "COMPLIANT";
                return (
                  <tr key={idx}>
                    <td className="audit-id-tag">
                      <code>{item.audit_id}</code>
                    </td>
                    <td style={{ color: "#64748B", fontSize: "0.78rem" }}>
                      {item.timestamp
                        ? new Date(item.timestamp).toLocaleString()
                        : "Recent"}
                    </td>
                    <td style={{ color: "#1E293B", fontWeight: 600 }}>
                      {item.product_name}
                    </td>
                    <td style={{ color: "#64748B" }}>
                      {item.category || "Commodity"}
                    </td>
                    <td style={{ color: "#0A4D7A", fontWeight: 700 }}>
                      ₹{item.declared_mrp}
                    </td>
                    <td>
                      <span style={{ fontWeight: 700, color: "#00A3E0" }}>
                        {item.passed_rules_count || (isPass ? 5 : 2)}/5
                      </span>
                    </td>
                    <td>
                      <span
                        className={`pill-badge ${isPass ? "badge-passed" : "badge-failed"}`}
                      >
                        {isPass ? "COMPLIANT" : "REJECTED"}
                      </span>
                    </td>
                    <td>
                      <button
                        type="button"
                        className="btn btn-secondary btn-sm"
                        onClick={() => onSelectAudit(item)}
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

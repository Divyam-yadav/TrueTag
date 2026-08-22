// True Tag - Created by Coding W/ night owls

import React, { useState } from "react";
import "./OfficialCertificate.css";

export default function OfficialCertificate({ certificate, auditId, onClose }) {
  const [copied, setCopied] = useState(false);

  if (!certificate) return null;

  const handleCopyBadge = () => {
    navigator.clipboard.writeText(certificate.embed_badge_snippet || "");
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const handleDownloadPdf = () => {
    window.open(`/api/products/${auditId}/certificate/download`, "_blank");
  };

  return (
    <div className="modal-backdrop-overlay" onClick={onClose}>
      <div className="modal-doc-box" onClick={(e) => e.stopPropagation()}>
        {/* Modal Window Top Header */}
        <div className="modal-header-top">
          <div className="modal-title-wrap">
            <span style={{ fontSize: "1.5rem" }}>🛡️</span>
            <div>
              <h2 className="modal-heading-text">
                Official True Tag Compliance Certificate
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

        {/* Printable Legal Document Paper with Elegant Double Navy Border */}
        <div className="legal-doc-sheet">
          {/* Top Center Logo & Title Header */}
          <div className="cert-center-header">
            <img
              src="/truetag-logo.png"
              alt="True Tag Official Brand Logo"
              className="cert-center-logo"
              onError={(e) => {
                e.target.style.display = "none";
              }}
            />
            <h3 className="doc-gov-title">NATIONAL COMPLIANCE CERTIFICATION</h3>
            <p className="doc-act-text">
              Under Legal Metrology (Packaged Commodities) Rules, 2011
            </p>

            {/* Large Emerald Verified Seal */}
            <div className="emerald-verified-seal">
              ✓ Verified Seller Legal Metrology LM-2011
            </div>
          </div>

          {/* Key Credential Fields */}
          <div className="doc-details-list">
            <div className="doc-row-item">
              <span className="doc-label">
                Official Certificate Serial Number:
              </span>
              <span className="doc-val cert-serial-tag">
                {certificate.certificate_id}
              </span>
            </div>
            <div className="doc-row-item">
              <span className="doc-label">Product Name:</span>
              <span className="doc-val">
                <strong>{certificate.product_name}</strong>
              </span>
            </div>
            <div className="doc-row-item">
              <span className="doc-label">Commodity Category:</span>
              <span className="doc-val">{certificate.category}</span>
            </div>
            <div className="doc-row-item">
              <span className="doc-label">Verified Packaging MRP:</span>
              <span
                className="doc-val"
                style={{ color: "#047857", fontWeight: 700 }}
              >
                {certificate.verified_packaging_mrp}
              </span>
            </div>
            <div className="doc-row-item">
              <span className="doc-label">Verified Net Quantity:</span>
              <span className="doc-val">
                {certificate.verified_net_quantity}
              </span>
            </div>
            <div className="doc-row-item">
              <span className="doc-label">Verification Engine:</span>
              <span className="doc-val">TrueTag AI (Coding W/ Night Owls)</span>
            </div>
            <div className="doc-row-item">
              <span className="doc-label">Timestamp of Issuance:</span>
              <span className="doc-val">
                {new Date(certificate.issued_at).toLocaleString()}
              </span>
            </div>
            <div className="doc-row-item">
              <span className="doc-label">
                Statutory Declarations Verified:
              </span>
              <span
                className="doc-val"
                style={{ color: "#047857", fontWeight: 700 }}
              >
                5 / 5 Mandatories Verified Compliant
              </span>
            </div>
          </div>

          {/* Cryptographic SHA-256 Hash */}
          <div className="signature-crypto-box">
            <span className="crypto-label">
              🔒 Cryptographic SHA-256 Verification Hash:
            </span>
            <code className="crypto-hash-code">
              {certificate.certificate_hash}
            </code>
          </div>
        </div>

        {/* Embed Verification Badge Section */}
        <div className="embed-code-drawer">
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "0.65rem",
            }}
          >
            <h4
              style={{ fontSize: "0.85rem", color: "#1E293B", fontWeight: 700 }}
            >
              🛍️ Embed TrueTag Verified Badge in E-Commerce Listing
            </h4>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={handleCopyBadge}
            >
              {copied ? "✓ Copied HTML!" : "📋 Copy Badge Code"}
            </button>
          </div>
          <div
            style={{
              background: "#FFFFFF",
              padding: "0.75rem",
              borderRadius: "6px",
              border: "1px dashed #CBD5E1",
            }}
          >
            <div
              dangerouslySetInnerHTML={{
                __html: certificate.embed_badge_snippet,
              }}
            />
          </div>
        </div>

        {/* Modal Window Footer with .btn-download and .btn-secondary */}
        <div className="modal-actions-footer">
          <button type="button" className="btn btn-secondary" onClick={onClose}>
            Close
          </button>
          <button
            type="button"
            className="btn btn-download"
            onClick={handleDownloadPdf}
          >
            📥 Download Official PDF Certificate
          </button>
        </div>
      </div>
    </div>
  );
}

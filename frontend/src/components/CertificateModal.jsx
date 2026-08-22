import React, { useState } from "react";

export default function CertificateModal({ certificate, auditId, onClose }) {
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
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="modal-header">
          <div className="modal-title-group">
            <span className="modal-icon">🛡️</span>
            <div>
              <h2 className="modal-title">
                Official Digital Compliance Certificate
              </h2>
              <p className="modal-subtitle">
                Indian Legal Metrology (Packaged Commodities) Rules, 2011
              </p>
            </div>
          </div>
          <button type="button" className="btn-close-modal" onClick={onClose}>
            ✕
          </button>
        </div>

        {/* Certificate Paper Layout */}
        <div className="cert-paper">
          <div className="cert-header">
            <div className="cert-emblem">⚖️</div>
            <h3 className="cert-gov-title">
              NATIONAL COMPLIANCE CERTIFICATION
            </h3>
            <p className="cert-act">
              Under Legal Metrology (Packaged Commodities) Rules, 2011
            </p>
            <div className="cert-status-badge">
              OFFICIALLY COMPLIANT & APPROVED
            </div>
          </div>

          <div className="cert-body">
            <div className="cert-field-row">
              <span className="cert-label">Certificate ID:</span>
              <span className="cert-value cert-code">
                {certificate.certificate_id}
              </span>
            </div>
            <div className="cert-field-row">
              <span className="cert-label">Product Name:</span>
              <span className="cert-value">
                <strong>{certificate.product_name}</strong>
              </span>
            </div>
            <div className="cert-field-row">
              <span className="cert-label">Category:</span>
              <span className="cert-value">{certificate.category}</span>
            </div>
            <div className="cert-field-row">
              <span className="cert-label">Verified Packaging MRP:</span>
              <span className="cert-value cert-price">
                {certificate.verified_packaging_mrp}
              </span>
            </div>
            <div className="cert-field-row">
              <span className="cert-label">Verified Net Quantity:</span>
              <span className="cert-value">
                {certificate.verified_net_quantity}
              </span>
            </div>
            <div className="cert-field-row">
              <span className="cert-label">Issued At:</span>
              <span className="cert-value">
                {new Date(certificate.issued_at).toLocaleString()}
              </span>
            </div>
            <div className="cert-field-row">
              <span className="cert-label">Compliance Score:</span>
              <span className="cert-value score-pass">
                5 / 5 Statutory Declarations Confirmed
              </span>
            </div>
          </div>

          {/* Cryptographic Hash */}
          <div className="cert-hash-box">
            <span className="hash-label">
              🔒 Cryptographic SHA-256 Signature:
            </span>
            <code className="hash-code">{certificate.certificate_hash}</code>
          </div>
        </div>

        {/* Embeddable Badge Section */}
        <div className="embed-section">
          <div className="embed-header">
            <h4>🛍️ Embed Verification Badge in E-Commerce Listing</h4>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={handleCopyBadge}
            >
              {copied ? "✓ Copied HTML!" : "📋 Copy Badge Code"}
            </button>
          </div>
          <div className="badge-preview-box">
            <div
              dangerouslySetInnerHTML={{
                __html: certificate.embed_badge_snippet,
              }}
            />
          </div>
        </div>

        {/* Modal Actions */}
        <div className="modal-footer">
          <button type="button" className="btn btn-secondary" onClick={onClose}>
            Close
          </button>
          <button
            type="button"
            className="btn btn-primary"
            onClick={handleDownloadPdf}
          >
            📥 Download Official PDF Certificate
          </button>
        </div>
      </div>
    </div>
  );
}

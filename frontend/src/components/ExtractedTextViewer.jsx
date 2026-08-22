import React, { useState } from "react";

export default function ExtractedTextViewer({ extractedText, filename }) {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!extractedText) return null;

  return (
    <div className="card text-viewer-card">
      <div
        className="text-viewer-header"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="title-row">
          <span className="terminal-icon">📝</span>
          <h3 className="section-title-sm">
            OCR Extracted Text ({filename || "image"})
          </h3>
        </div>
        <button type="button" className="toggle-btn">
          {isExpanded ? "Hide Raw Text ▲" : "View Raw OCR Text ▼"}
        </button>
      </div>

      {isExpanded && (
        <div className="text-content-box">
          <pre className="raw-text-block">
            {extractedText.trim()
              ? extractedText
              : "[No legible text detected by OCR]"}
          </pre>
        </div>
      )}
    </div>
  );
}

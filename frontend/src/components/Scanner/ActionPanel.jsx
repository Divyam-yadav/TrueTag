// True Tag - Created by Coding W/ night owls

import React from "react";
import "./ActionPanel.css";

export default function ActionPanel({ isLoading, photoCount, onExecute }) {
  return (
    <div className="action-panel-bar">
      <div className="action-panel-info">
        <span className="action-info-emblem">⚖️</span>
        <span className="action-info-text">
          Ready for evaluation •{" "}
          <strong>
            {photoCount} photo{photoCount !== 1 ? "s" : ""} staged
          </strong>
        </span>
      </div>

      <button
        type="button"
        className="btn btn-primary btn-lg"
        disabled={isLoading}
        onClick={onExecute}
      >
        {isLoading ? (
          <>
            <span className="btn-spinner"></span>
            <span>Running TrueTag AI...</span>
          </>
        ) : (
          <>
            <span>🚀</span>
            <span>Execute TrueTag Audit</span>
          </>
        )}
      </button>
    </div>
  );
}

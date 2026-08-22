// True Tag - Created by Coding W/ night owls

import React from "react";
import "./SkeletonLoader.css";

export default function SkeletonLoader({ statusText }) {
  return (
    <div className="dark-skeleton-card">
      <div className="scanner-laser-line"></div>

      <div className="skeleton-header-box">
        <div className="spinner-electric"></div>
        <div>
          <h4 className="skeleton-text-title">
            {statusText || "Processing Packaging Photos..."}
          </h4>
          <p className="skeleton-text-subtitle">
            True Tag Computer Vision Engine • Coding W/ night owls
          </p>
        </div>
      </div>

      <div className="skeleton-pulse-group">
        <div className="skeleton-bar skeleton-bar-top"></div>
        <div className="skeleton-bar"></div>
        <div className="skeleton-bar"></div>
        <div className="skeleton-bar"></div>
        <div className="skeleton-bar"></div>
        <div className="skeleton-bar"></div>
      </div>
    </div>
  );
}

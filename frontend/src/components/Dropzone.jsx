import React, { useState, useRef } from "react";

export default function Dropzone({
  onFileSelected,
  previewUrl,
  isLoading,
  onClear,
}) {
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith("image/")) {
        onFileSelected(file);
      } else {
        alert("Please drop an image file (JPEG, PNG, etc.).");
      }
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      onFileSelected(e.target.files[0]);
    }
  };

  return (
    <div className="card dropzone-card">
      <h2 className="section-title">1. Upload Packaging Image</h2>
      <p className="section-description">
        Upload a front or back panel image of the product to analyze mandatory
        declarations.
      </p>

      <div
        className={`dropzone-area ${isDragOver ? "drag-active" : ""} ${previewUrl ? "has-preview" : ""}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => !previewUrl && fileInputRef.current.click()}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*"
          style={{ display: "none" }}
        />

        {previewUrl ? (
          <div className="preview-container">
            <img
              src={previewUrl}
              alt="Product packaging preview"
              className="preview-image"
            />
            <div className="preview-overlay">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={(e) => {
                  e.stopPropagation();
                  onClear();
                }}
                disabled={isLoading}
              >
                Change Image
              </button>
            </div>
          </div>
        ) : (
          <div className="dropzone-placeholder">
            <div className="upload-icon">📸</div>
            <p className="upload-main-text">Drag & drop packaging image here</p>
            <p className="upload-sub-text">
              or click to browse files (JPEG, PNG, WebP)
            </p>
            <button
              type="button"
              className="btn btn-primary upload-btn"
              onClick={(e) => {
                e.stopPropagation();
                fileInputRef.current.click();
              }}
            >
              Select Image File
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// True Tag - Created by Coding W/ night owls

import React, { useRef, useState } from "react";
import "./ImageDropzone.css";

export default function ImageDropzone({ images, onImagesChange }) {
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef(null);

  const panelLabels = [
    "Front Panel / Brand",
    "Back Panel / Mandatories",
    "Side Panel 1 (Ingredients)",
    "Side Panel 2 (Care Cell)",
    "Bottom Panel / Barcode",
  ];

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
    if (e.dataTransfer.files) {
      addFiles(Array.from(e.dataTransfer.files));
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files) {
      addFiles(Array.from(e.target.files));
    }
  };

  const addFiles = (newFiles) => {
    const validImages = newFiles.filter((file) =>
      file.type.startsWith("image/"),
    );
    const totalCount = images.length + validImages.length;
    if (totalCount > 5) {
      alert("Maximum 5 packaging photos allowed per audit scan.");
      const allowed = validImages.slice(0, 5 - images.length);
      appendImages(allowed);
    } else {
      appendImages(validImages);
    }
  };

  const appendImages = (filesList) => {
    const formatted = filesList.map((file) => ({
      file,
      name: file.name,
      size: (file.size / 1024).toFixed(1) + " KB",
      previewUrl: URL.createObjectURL(file),
    }));
    onImagesChange([...images, ...formatted]);
  };

  const removeImage = (index) => {
    const updated = [...images];
    URL.revokeObjectURL(updated[index].previewUrl);
    updated.splice(index, 1);
    onImagesChange(updated);
  };

  return (
    <div className="image-dropzone-card">
      <div className="dropzone-header-row">
        <div>
          <h2 className="dropzone-title">
            Step 2: Multi-Angle Packaging Photos (Up to 5)
          </h2>
          <p className="dropzone-desc">
            Upload high-resolution photos of all packaging panels (Front, Back,
            Sides, Barcode) to aggregate declarations.
          </p>
        </div>
        <div className="dropzone-pills-wrap">
          <span className="step-badge">Step 2 of 2</span>
          <span className="count-badge">{images.length} / 5 Photos</span>
        </div>
      </div>

      {/* Dashed Drop Area */}
      {images.length < 5 && (
        <div
          className={`sleek-drop-area ${isDragOver ? "drag-hover" : ""}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current.click()}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            multiple
            style={{ display: "none" }}
          />
          <span className="drop-icon-box">📸</span>
          <p className="drop-main-label">
            Drag & drop packaging photos here or click to browse
          </p>
          <p className="drop-sub-label">Supports JPEG, PNG, and WebP labels</p>
        </div>
      )}

      {/* Uploaded Panels Grid */}
      {images.length > 0 && (
        <div className="panels-grid">
          {images.map((img, idx) => (
            <div key={idx} className="panel-card">
              <div className="panel-tag-header">
                {panelLabels[idx] || `Angle ${idx + 1}`}
              </div>
              <div className="panel-img-preview">
                <img src={img.previewUrl} alt={`Packaging panel ${idx + 1}`} />
              </div>
              <div className="panel-footer-meta">
                <span className="panel-filename" title={img.name}>
                  {img.name}
                </span>
                <span className="panel-size">{img.size}</span>
              </div>
              <button
                type="button"
                className="remove-panel-btn"
                onClick={() => removeImage(idx)}
                title="Remove photo"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

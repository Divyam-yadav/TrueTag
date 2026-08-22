// True Tag - Created by Coding W/ night owls

import React, { useRef, useState } from "react";

export default function MultiImageDropzone({ images, onImagesChange }) {
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef(null);

  const panelTags = [
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
      alert("Maximum 5 packaging photos allowed per compliance audit.");
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
    <div className="card upload-card">
      <div className="card-header-bar">
        <div>
          <h2 className="card-title">
            Step 2: Multi-Angle Packaging Photos (Up to 5)
          </h2>
          <p className="card-subtitle">
            Upload clear photos of all packaging panels (Front, Back, Sides,
            Barcode) to aggregate mandatory declarations.
          </p>
        </div>
        <div className="upload-meta-pill-group">
          <span className="step-indicator-pill">Step 2 of 2</span>
          <span className="count-indicator-pill">
            {images.length} / 5 Photos
          </span>
        </div>
      </div>

      {/* Wide 2px Dashed Dropzone */}
      {images.length < 5 && (
        <div
          className={`wide-dropzone-box ${isDragOver ? "dropzone-active" : ""}`}
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
          <div className="dropzone-inner-content">
            <span className="dropzone-camera-icon">📸</span>
            <p className="dropzone-main-text">
              Drag & drop packaging photos here or click to browse
            </p>
            <p className="dropzone-sub-text">
              Supports Front, Back, Sides & Barcode labels (PNG, JPEG, WebP)
            </p>
          </div>
        </div>
      )}

      {/* CSS Grid of Small Square Thumbnails with 'X' corner remove button */}
      {images.length > 0 && (
        <div className="thumbnails-css-grid">
          {images.map((img, idx) => (
            <div key={idx} className="square-thumbnail-card">
              {/* Panel Tag */}
              <div className="thumbnail-panel-tag">
                {panelTags[idx] || `Angle ${idx + 1}`}
              </div>

              {/* Thumbnail Image Box */}
              <div className="thumbnail-image-box">
                <img src={img.previewUrl} alt={`Packaging panel ${idx + 1}`} />
              </div>

              {/* Meta Label */}
              <div className="thumbnail-meta-row">
                <span className="thumbnail-filename" title={img.name}>
                  {img.name}
                </span>
                <span className="thumbnail-filesize">{img.size}</span>
              </div>

              {/* Tiny 'X' Corner Remove Button */}
              <button
                type="button"
                className="corner-close-btn"
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

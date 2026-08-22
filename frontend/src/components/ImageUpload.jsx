import React, { useRef, useState } from "react";

export default function ImageUpload({ images, onImagesChange }) {
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
      alert("Maximum 5 images allowed per compliance audit.");
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
      <div className="card-header-row">
        <div>
          <h2 className="section-title">
            Step 2: Multi-Angle Packaging Photos (Up to 5)
          </h2>
          <p className="section-description">
            Upload clear photos of all packaging sides (Front, Back, Sides,
            Barcode) to aggregate mandatory declarations.
          </p>
        </div>
        <div className="upload-badge-group">
          <span className="step-pill">Step 2 of 2</span>
          <span className="count-pill">{images.length} / 5 Photos</span>
        </div>
      </div>

      {/* Drag & Drop Upload Zone */}
      {images.length < 5 && (
        <div
          className={`multi-dropzone ${isDragOver ? "drag-active" : ""}`}
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
          <div className="dropzone-content">
            <span className="dropzone-icon">📸</span>
            <p className="dropzone-title">
              Drag & drop packaging photos here or click to browse
            </p>
            <p className="dropzone-sub">
              Upload Front, Back, Sides & Barcode labels (JPEG, PNG, WebP)
            </p>
          </div>
        </div>
      )}

      {/* Image Preview Grid */}
      {images.length > 0 && (
        <div className="preview-grid">
          {images.map((img, idx) => (
            <div key={idx} className="preview-card">
              <div className="preview-tag">
                {panelTags[idx] || `Angle ${idx + 1}`}
              </div>
              <div className="preview-img-box">
                <img src={img.previewUrl} alt={`Packaging panel ${idx + 1}`} />
              </div>
              <div className="preview-meta">
                <span className="preview-filename" title={img.name}>
                  {img.name}
                </span>
                <span className="preview-size">{img.size}</span>
              </div>
              <button
                type="button"
                className="btn-remove-img"
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

import React from "react";

export default function ProductForm({ formData, onChange }) {
  const categories = [
    "Packaged Food & Beverages",
    "Personal Care & Cosmetics",
    "Nutritional Supplements & Health",
    "Cleaning & Household Supplies",
    "Baby Care & Hygiene",
    "Consumer Electronics & Accessories",
  ];

  return (
    <div className="card form-card">
      <div className="card-header-row">
        <div>
          <h2 className="section-title">Step 1: Product & Listing Details</h2>
          <p className="section-description">
            Enter seller catalog metadata to cross-verify against physical label
            declarations.
          </p>
        </div>
        <span className="step-pill">Step 1 of 2</span>
      </div>

      <div className="form-grid">
        {/* Product Title */}
        <div className="form-group full-width">
          <label className="form-label">
            Product Title / Name <span className="req">*</span>
          </label>
          <input
            type="text"
            className="form-input"
            placeholder="e.g. Pure Organic Wild Forest Honey"
            value={formData.productName}
            onChange={(e) => onChange("productName", e.target.value)}
            required
          />
        </div>

        {/* Commodity Category */}
        <div className="form-group">
          <label className="form-label">Commodity Category</label>
          <select
            className="form-select"
            value={formData.category}
            onChange={(e) => onChange("category", e.target.value)}
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* Declared MRP */}
        <div className="form-group">
          <label className="form-label">
            Seller Declared Price / MRP (₹) <span className="req">*</span>
          </label>
          <div className="input-prefix-box">
            <span className="input-prefix">₹</span>
            <input
              type="number"
              step="0.01"
              min="1"
              className="form-input with-prefix"
              placeholder="e.g. 499.00"
              value={formData.declaredMrp}
              onChange={(e) => onChange("declaredMrp", e.target.value)}
              required
            />
          </div>
          <span className="input-hint">
            Will be cross-checked against packaging label price
          </span>
        </div>

        {/* Declared Net Quantity */}
        <div className="form-group">
          <label className="form-label">
            Declared Net Quantity / Units <span className="req">*</span>
          </label>
          <input
            type="text"
            className="form-input"
            placeholder="e.g. 500 g or 250 ml or 2 Units"
            value={formData.declaredNetQuantity}
            onChange={(e) => onChange("declaredNetQuantity", e.target.value)}
            required
          />
          <span className="input-hint">
            Specify exact weight, volume, or count of units
          </span>
        </div>

        {/* Product Description */}
        <div className="form-group">
          <label className="form-label">Listing Description</label>
          <input
            type="text"
            className="form-input"
            placeholder="Brief description of the product as shown to consumers"
            value={formData.description}
            onChange={(e) => onChange("description", e.target.value)}
          />
        </div>
      </div>
    </div>
  );
}

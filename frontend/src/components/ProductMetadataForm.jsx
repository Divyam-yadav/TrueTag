// True Tag - Created by Coding W/ night owls

import React from "react";

export default function ProductMetadataForm({ formData, onChange }) {
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
      <div className="card-header-bar">
        <div>
          <h2 className="card-title">Step 1: Product & Catalog Claims</h2>
          <p className="card-subtitle">
            Enter seller listing claims to cross-verify against physical label
            declarations under Section 18.
          </p>
        </div>
        <span className="step-indicator-pill">Step 1 of 2</span>
      </div>

      <div className="form-layout-grid">
        {/* Product Title */}
        <div className="form-field-group full-width-field">
          <label className="form-field-label">
            Product Title / Name <span className="required-star">*</span>
          </label>
          <input
            type="text"
            className="text-input-field"
            placeholder="e.g. Pure Organic Wild Forest Honey"
            value={formData.productName}
            onChange={(e) => onChange("productName", e.target.value)}
            required
          />
        </div>

        {/* Category */}
        <div className="form-field-group">
          <label className="form-field-label">Commodity Category</label>
          <select
            className="select-input-field"
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
        <div className="form-field-group">
          <label className="form-field-label">
            Seller Declared Listing Price / MRP (₹){" "}
            <span className="required-star">*</span>
          </label>
          <div className="currency-input-wrapper">
            <span className="currency-symbol-tag">₹</span>
            <input
              type="number"
              step="0.01"
              min="1"
              className="text-input-field with-currency-prefix"
              placeholder="e.g. 499.00"
              value={formData.declaredMrp}
              onChange={(e) => onChange("declaredMrp", e.target.value)}
              required
            />
          </div>
          <span className="field-hint-text">
            Cross-checked against physical packaging MRP (Rule 18(2))
          </span>
        </div>

        {/* Declared Net Quantity */}
        <div className="form-field-group">
          <label className="form-field-label">
            Declared Net Quantity <span className="required-star">*</span>
          </label>
          <input
            type="text"
            className="text-input-field"
            placeholder="e.g. 500 g or 250 ml or 2 Units"
            value={formData.declaredNetQuantity}
            onChange={(e) => onChange("declaredNetQuantity", e.target.value)}
            required
          />
          <span className="field-hint-text">
            Specify exact weight, volume, or count of units
          </span>
        </div>

        {/* Product Description */}
        <div className="form-field-group full-width-field">
          <label className="form-field-label">Product Description</label>
          <input
            type="text"
            className="text-input-field"
            placeholder="Brief product description for consumer listing"
            value={formData.description}
            onChange={(e) => onChange("description", e.target.value)}
          />
        </div>
      </div>
    </div>
  );
}

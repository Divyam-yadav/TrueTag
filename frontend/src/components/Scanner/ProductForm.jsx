// True Tag - Created by Coding W/ night owls

import React from "react";
import "./ProductForm.css";

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
    <div className="product-form-card">
      <div className="form-header-row">
        <div>
          <h2 className="form-title">Step 1: Product Catalog Claims</h2>
          <p className="form-desc">
            Enter the seller claims to cross-verify against physical label
            declarations under Section 18.
          </p>
        </div>
        <span className="step-badge">Step 1 of 2</span>
      </div>

      <div className="form-fields-grid">
        {/* Row 1 - Left: Product Title */}
        <div className="field-group">
          <label className="field-label">
            Product Title / Name <span className="req-star">*</span>
          </label>
          <input
            type="text"
            className="corporate-input"
            placeholder="e.g. Pure Organic Wild Forest Honey"
            value={formData.productName}
            onChange={(e) => onChange("productName", e.target.value)}
            required
          />
        </div>

        {/* Row 1 - Right: Commodity Category */}
        <div className="field-group">
          <label className="field-label">Commodity Category</label>
          <select
            className="corporate-select"
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

        {/* Row 2 - Left: Declared Net Quantity */}
        <div className="field-group">
          <label className="field-label">
            Declared Net Quantity <span className="req-star">*</span>
          </label>
          <input
            type="text"
            className="corporate-input"
            placeholder="e.g. 500 g or 250 ml or 2 Units"
            value={formData.declaredNetQuantity}
            onChange={(e) => onChange("declaredNetQuantity", e.target.value)}
            required
          />
          <span className="field-help-text">
            Specify exact weight, volume, or count of units
          </span>
        </div>

        {/* Row 2 - Right: Declared Listing Price */}
        <div className="field-group">
          <label className="field-label">
            Seller Declared Price / MRP (₹) <span className="req-star">*</span>
          </label>
          <div className="currency-input-box">
            <span className="currency-symbol">₹</span>
            <input
              type="number"
              step="0.01"
              min="1"
              className="corporate-input has-currency"
              placeholder="e.g. 499.00"
              value={formData.declaredMrp}
              onChange={(e) => onChange("declaredMrp", e.target.value)}
              required
            />
          </div>
          <span className="field-help-text">
            Cross-checked against physical label MRP (Rule 18(2))
          </span>
        </div>

        {/* Row 3 - Full Width Textarea: Product Description */}
        <div className="field-group field-span-2">
          <label className="field-label">Product Description</label>
          <textarea
            className="corporate-textarea"
            rows={3}
            placeholder="Enter brief product description for consumer listing..."
            value={formData.description}
            onChange={(e) => onChange("description", e.target.value)}
          />
        </div>
      </div>
    </div>
  );
}

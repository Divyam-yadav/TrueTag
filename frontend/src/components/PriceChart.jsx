import React from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

export default function PriceChart({
  priceHistory,
  declaredMrp,
  packagingMrp,
}) {
  if (!priceHistory || priceHistory.length === 0) return null;

  return (
    <div className="card price-chart-card">
      <div className="chart-header">
        <div>
          <h3 className="section-title-sm">
            📈 Price Compliance & Real-Time Market Tracker
          </h3>
          <p className="section-description-sm">
            Tracking Seller Listing Price vs Statutory Packaging MRP Cap vs
            Market Benchmark
          </p>
        </div>
        <div className="price-legend-summary">
          <div className="legend-item">
            <span className="dot dot-packaging"></span>
            <span>
              Packaging MRP (Cap):{" "}
              <strong>₹{packagingMrp || declaredMrp}</strong>
            </span>
          </div>
          <div className="legend-item">
            <span className="dot dot-listing"></span>
            <span>
              Listing Price: <strong>₹{declaredMrp}</strong>
            </span>
          </div>
        </div>
      </div>

      <div className="chart-container" style={{ width: "100%", height: 260 }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={priceHistory}
            margin={{ top: 10, right: 20, left: 0, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis dataKey="date" stroke="#94a3b8" fontSize={12} />
            <YAxis
              stroke="#94a3b8"
              fontSize={12}
              domain={["auto", "auto"]}
              unit="₹"
            />
            <Tooltip
              formatter={(val, name) => [`₹${val}`, name]}
              contentStyle={{
                background: "#ffffff",
                borderRadius: "8px",
                border: "1px solid #e2e8f0",
                fontSize: "12px",
              }}
            />
            <Legend wrapperStyle={{ fontSize: "12px", paddingTop: "8px" }} />
            <Line
              type="monotone"
              dataKey="packaging_mrp"
              name="Packaging MRP (Legal Max)"
              stroke="#ef4444"
              strokeWidth={3}
              strokeDasharray="5 5"
              dot={{ r: 4 }}
            />
            <Line
              type="monotone"
              dataKey="listing_price"
              name="Seller Listing Price"
              stroke="#4f46e5"
              strokeWidth={2.5}
              dot={{ r: 4 }}
            />
            <Line
              type="monotone"
              dataKey="market_average"
              name="Market Benchmark Avg"
              stroke="#10b981"
              strokeWidth={2}
              dot={{ r: 3 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="chart-footer-note">
        <span className="icon">⚖️</span>
        <span>
          <strong>Legal Metrology Rule 18(2):</strong> Selling or listing any
          packaged commodity at a price higher than the Maximum Retail Price
          (MRP) printed on the package is prohibited under Indian law.
        </span>
      </div>
    </div>
  );
}

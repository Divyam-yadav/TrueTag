// True Tag - Created by Coding W/ night owls

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
import "./MarketPriceChart.css";

export default function MarketPriceChart({
  priceHistory,
  declaredMrp,
  packagingMrp,
}) {
  if (!priceHistory || priceHistory.length === 0) return null;

  return (
    <div className="price-chart-card">
      <div className="chart-header-row">
        <div>
          <h3
            style={{
              fontSize: "1.15rem",
              fontWeight: 800,
              color: "#0A4D7A",
              marginBottom: "0.2rem",
            }}
          >
            📈 Price Compliance & Market Tracker
          </h3>
          <p style={{ fontSize: "0.85rem", color: "#64748B" }}>
            Tracking Seller Listing Price vs Statutory Packaging MRP Cap vs
            Market Benchmark
          </p>
        </div>
        <div className="chart-legend-box">
          <div className="legend-point">
            <span className="dot-color dot-red"></span>
            <span>
              Packaging MRP (Cap):{" "}
              <strong style={{ color: "#0A4D7A" }}>
                ₹{packagingMrp || declaredMrp}
              </strong>
            </span>
          </div>
          <div className="legend-point">
            <span className="dot-color dot-cyan"></span>
            <span>
              Listing Price:{" "}
              <strong style={{ color: "#0A4D7A" }}>₹{declaredMrp}</strong>
            </span>
          </div>
        </div>
      </div>

      <div style={{ width: "100%", height: 260 }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={priceHistory}
            margin={{ top: 10, right: 20, left: 0, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
            <XAxis dataKey="date" stroke="#64748B" fontSize={12} />
            <YAxis
              stroke="#64748B"
              fontSize={12}
              domain={["auto", "auto"]}
              unit="₹"
            />
            <Tooltip
              formatter={(val, name) => [`₹${val}`, name]}
              contentStyle={{
                background: "#FFFFFF",
                borderRadius: "8px",
                border: "1px solid #E2E8F0",
                color: "#1E293B",
                fontSize: "12px",
                boxShadow: "0 4px 6px rgba(0,0,0,0.05)",
              }}
            />
            <Legend wrapperStyle={{ fontSize: "12px", paddingTop: "8px" }} />
            <Line
              type="monotone"
              dataKey="packaging_mrp"
              name="Packaging MRP (Legal Max Cap)"
              stroke="#EF4444"
              strokeWidth={3}
              strokeDasharray="5 5"
              dot={{ r: 4 }}
            />
            <Line
              type="monotone"
              dataKey="listing_price"
              name="Seller Listing Price"
              stroke="#00A3E0"
              strokeWidth={2.5}
              dot={{ r: 4 }}
            />
            <Line
              type="monotone"
              dataKey="market_average"
              name="Market Benchmark Avg"
              stroke="#047857"
              strokeWidth={2}
              dot={{ r: 3 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="chart-note-box">
        <span>⚖️</span>
        <span>
          <strong>Legal Metrology Rule 18(2):</strong> Listing or selling any
          packaged commodity at a price higher than the printed Maximum Retail
          Price (MRP) is illegal under Indian law.
        </span>
      </div>
    </div>
  );
}

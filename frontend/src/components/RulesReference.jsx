// True Tag - Created by Coding W/ night owls

import React from "react";
import "./RulesReference.css";

export default function RulesReference() {
  const rulesList = [
    {
      clause: "Rule 6(1)(a)",
      title: "Maximum Retail Price (MRP)",
      desc: "Mandatory declaration of MRP inclusive of all taxes. Prohibits dual pricing and overpricing on e-commerce platforms under Section 18 / Rule 18(2).",
    },
    {
      clause: "Rule 6(1)(b)",
      title: "Net Quantity / Weight / Measure",
      desc: "Standard units of weight (g, kg), volume (ml, l), or count of commodities. Must be clearly readable on the principal display panel.",
    },
    {
      clause: "Rule 6(1)(d)",
      title: "Name & Address of Manufacturer / Packer",
      desc: "Complete identity, registered factory premises, or manufacturing unit address of the manufacturer, packer, or importer.",
    },
    {
      clause: "Rule 6(1)(n)",
      title: "Country of Origin",
      desc: "Mandatory for all e-commerce listings to declare the country of origin to enable informed consumer decision-making.",
    },
    {
      clause: "Rule 6(1)(e)",
      title: "Consumer Care Redressal Details",
      desc: "Direct customer grievance contact channels including physical address, telephone helpline number, and support email address.",
    },
  ];

  return (
    <div className="history-card-dark">
      <div className="form-header-row">
        <div>
          <h2 className="form-title">
            📜 Indian Legal Metrology Statutory Guide
          </h2>
          <p className="form-desc">
            Legal Metrology (Packaged Commodities) Rules, 2011 & Consumer
            Protection (E-Commerce) Rules, 2020.
          </p>
        </div>
      </div>

      <div className="rules-grid-dark">
        {rulesList.map((item, idx) => (
          <div key={idx} className="rule-box-card">
            <div className="rule-header-badge">
              <span className="rule-clause-chip">{item.clause}</span>
            </div>
            <h3 className="rule-title-h3">{item.title}</h3>
            <p className="rule-body-desc">{item.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

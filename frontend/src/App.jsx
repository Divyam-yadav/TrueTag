// True Tag - Created by Coding W/ night owls

import React, { useState } from "react";
import LandingPage from "./components/LandingPage";
import DashboardLayout from "./layouts/DashboardLayout";
import AnalyticsDashboard from "./components/AnalyticsDashboard";
import ProductForm from "./components/Scanner/ProductForm";
import ImageDropzone from "./components/Scanner/ImageDropzone";
import ActionPanel from "./components/Scanner/ActionPanel";
import SkeletonLoader from "./components/SkeletonLoader";
import ResultsScorecard from "./components/ResultsScorecard";
import DiscrepancyChecker from "./components/DiscrepancyChecker";
import MarketPriceChart from "./components/MarketPriceChart";
import OfficialCertificate from "./components/OfficialCertificate";
import RejectionReport from "./components/RejectionReport";
import AuditHistory from "./components/AuditHistory";
import RulesReference from "./components/RulesReference";
import { analyzePackaging } from "./api/backendClient";

/**
 * Main App component
 */
export default function App() {
  const [inWorkspace, setInWorkspace] = useState(false);
  const [activeTab, setActiveTab] = useState("analytics");

  const [formData, setFormData] = useState({
    productName: "",
    category: "Packaged Food & Beverages",
    description: "",
    declaredMrp: "",
    declaredNetQuantity: "",
  });

  const [images, setImages] = useState([]);

  const [isLoading, setIsLoading] = useState(false);
  const [statusStep, setStatusStep] = useState("");
  const [errorMessage, setErrorMessage] = useState(null);
  const [auditResult, setAuditResult] = useState(null);

  const [showCertModal, setShowCertModal] = useState(false);
  const [showRejectionModal, setShowRejectionModal] = useState(false);

  const handleFormChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleRunAudit = async () => {
    if (!formData.productName.trim()) {
      setErrorMessage("Please enter the Product Title.");
      return;
    }
    if (!formData.declaredMrp || isNaN(formData.declaredMrp)) {
      setErrorMessage("Please enter a valid Declared Listing Price (MRP).");
      return;
    }
    if (images.length === 0) {
      setErrorMessage(
        "Please upload at least 1 packaging photo (up to 5) to analyze declarations.",
      );
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);
    setStatusStep(
      "Step 1/4: Running OpenCV Noise Reduction & Auto-Rotation...",
    );

    try {
      const data = new FormData();
      data.append("product_name", formData.productName);
      data.append("category", formData.category);
      data.append("description", formData.description || "");
      data.append("declared_mrp", parseFloat(formData.declaredMrp));
      data.append("declared_net_quantity", formData.declaredNetQuantity || "");

      images.forEach((img) => {
        data.append("files", img.file);
      });

      setTimeout(() => {
        setStatusStep(
          "Step 2/4: Extracting Tesseract Tokens & Statutory Clauses...",
        );
      }, 700);

      setTimeout(() => {
        setStatusStep(
          "Step 3/4: Cross-Verifying Seller Listing vs Physical Packaging (Section 18 Price Check)...",
        );
      }, 1400);

      const result = await analyzePackaging(data);

      setStatusStep(
        "Step 4/4: Finalizing Audit Records & Cryptographic Verification Signature...",
      );
      setAuditResult(result);
    } catch (err) {
      console.error("Audit execution error:", err);
      const detail =
        err.response?.data?.detail ||
        err.message ||
        "Failed to complete packaging audit.";
      setErrorMessage(`Audit Failed: ${detail}`);
    } finally {
      setIsLoading(false);
      setStatusStep("");
    }
  };

  const handleReset = () => {
    setAuditResult(null);
    setImages([]);
    setErrorMessage(null);
  };

  if (!inWorkspace) {
    return (
      <LandingPage
        onLaunchWorkspace={() => {
          setInWorkspace(true);
          setActiveTab("analytics");
        }}
        onOpenDocs={() => {
          setInWorkspace(true);
          setActiveTab("rules");
        }}
      />
    );
  }

  return (
    <DashboardLayout
      activeTab={activeTab}
      onTabChange={setActiveTab}
      onGoToLanding={() => setInWorkspace(false)}
      title={
        activeTab === "analytics"
          ? "Enterprise Analytics & Overview"
          : activeTab === "scanner"
            ? auditResult
              ? "Compliance Audit Results"
              : "Packaging Compliance Scanner"
            : activeTab === "history"
              ? "Historical Audit Logs"
              : "Statutory Metrology Rules Guide"
      }
      subtitle={
        activeTab === "analytics"
          ? "Real-time catalog compliance metrics and statutory legal verification health"
          : activeTab === "scanner"
            ? auditResult
              ? "Verified under Legal Metrology (Packaged Commodities) Rules, 2011"
              : "Upload packaging photos and verify mandatory declarations"
            : activeTab === "history"
              ? "Explore immutable compliance records saved in MongoDB"
              : "Official reference guide for statutory e-commerce declarations"
      }
    >
      {/* Tab 0: Home Landing Page - Analytics Dashboard */}
      {activeTab === "analytics" && (
        <AnalyticsDashboard
          onStartAudit={() => {
            handleReset();
            setActiveTab("scanner");
          }}
          onViewAudit={() => {
            setActiveTab("history");
          }}
        />
      )}

      {/* Tab 1: Compliance Scanner View */}
      {activeTab === "scanner" && (
        <div>
          {!auditResult ? (
            <div className="audit-form-flow">
              {/* Step 1: Product Form */}
              <ProductForm formData={formData} onChange={handleFormChange} />

              {/* Step 2: Image Dropzone */}
              <ImageDropzone images={images} onImagesChange={setImages} />

              {/* Error Alert */}
              {errorMessage && (
                <div
                  style={{
                    padding: "1rem",
                    backgroundColor: "#FEF2F2",
                    border: "1px solid #FECACA",
                    borderRadius: "8px",
                    color: "#B91C1C",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.75rem",
                    marginBottom: "1rem",
                  }}
                >
                  <span>⚠️</span>
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Pulsing Skeleton Loader during AI execution */}
              {isLoading && <SkeletonLoader statusText={statusStep} />}

              {/* Step 3: Action Bar at the Bottom */}
              <ActionPanel
                isLoading={isLoading}
                photoCount={images.length}
                onExecute={handleRunAudit}
              />
            </div>
          ) : (
            /* Results View Dashboard */
            <div>
              {/* 5-Point Legal Metrology Scorecard */}
              <ResultsScorecard result={auditResult} />

              {/* Discrepancy Checker Panel */}
              <DiscrepancyChecker discrepancies={auditResult.discrepancies} />

              {/* Real-time Price Tracker Graph */}
              <MarketPriceChart
                priceHistory={auditResult.price_history}
                declaredMrp={auditResult.declared_mrp}
                packagingMrp={auditResult.extracted_numeric_mrp}
              />

              {/* Action Controls Card */}
              <div className="scorecard-card" style={{ marginTop: "1.5rem" }}>
                <h3
                  style={{
                    fontSize: "1.15rem",
                    fontWeight: 800,
                    color: "var(--brand-navy)",
                    marginBottom: "0.5rem",
                  }}
                >
                  {auditResult.is_compliant
                    ? "🎉 TrueTag Compliance Verification & Certification"
                    : "🛠️ Actionable Remediation for Seller"}
                </h3>

                {auditResult.is_compliant ? (
                  <div style={{ marginTop: "0.75rem" }}>
                    <p
                      style={{
                        color: "var(--text-muted)",
                        fontSize: "0.875rem",
                        marginBottom: "1.25rem",
                      }}
                    >
                      Congratulations! This product satisfies all statutory
                      requirements under Legal Metrology (Packaged Commodities)
                      Rules, 2011 and is certified for e-commerce publishing.
                    </p>
                    <div
                      style={{
                        display: "flex",
                        gap: "0.75rem",
                        flexWrap: "wrap",
                      }}
                    >
                      <button
                        type="button"
                        className="btn btn-primary"
                        onClick={() => setShowCertModal(true)}
                      >
                        🛡️ View & Download Official Certificate (PDF)
                      </button>
                      <button
                        type="button"
                        className="btn btn-download"
                        onClick={() =>
                          window.open(
                            `/api/products/${auditResult.audit_id}/certificate/download`,
                            "_blank",
                          )
                        }
                      >
                        📥 Direct PDF Download
                      </button>
                      <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={handleReset}
                      >
                        🔍 Audit Another Product
                      </button>
                    </div>
                  </div>
                ) : (
                  <div style={{ marginTop: "0.75rem" }}>
                    <p
                      style={{
                        color: "var(--text-muted)",
                        fontSize: "0.875rem",
                        marginBottom: "1.25rem",
                      }}
                    >
                      Publication is blocked due to non-compliance under Indian
                      Legal Metrology Rules. View the full interactive rejection
                      audit report or download it below:
                    </p>
                    <div
                      style={{
                        display: "flex",
                        gap: "0.75rem",
                        flexWrap: "wrap",
                      }}
                    >
                      <button
                        type="button"
                        className="btn btn-primary"
                        onClick={() => setShowRejectionModal(true)}
                      >
                        👁️ View Rejection Audit Report
                      </button>
                      <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={handleReset}
                      >
                        🔄 Fix Claims & Re-Upload Photos
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Certificate Modal */}
              {showCertModal && auditResult.certificate && (
                <OfficialCertificate
                  certificate={auditResult.certificate}
                  auditId={auditResult.audit_id}
                  onClose={() => setShowCertModal(false)}
                />
              )}

              {/* Rejection Report Modal */}
              {showRejectionModal && (
                <RejectionReport
                  result={auditResult}
                  onClose={() => setShowRejectionModal(false)}
                />
              )}
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Historical Audit Records */}
      {activeTab === "history" && (
        <AuditHistory
          onSelectAudit={(item) => {
            setAuditResult(item);
            setActiveTab("scanner");
          }}
        />
      )}

      {/* Tab 3: Statutory Rules Guide */}
      {activeTab === "rules" && <RulesReference />}
    </DashboardLayout>
  );
}

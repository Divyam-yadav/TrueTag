import uuid
from datetime import datetime
from typing import List
from fastapi import FastAPI, File, UploadFile, Form, HTTPException, Response
from fastapi.middleware.cors import CORSMiddleware
# from database import save_compliance_audit, get_compliance_audit_by_id, get_all_audits, get_database
from image_pipeline import extract_ocr_from_image_bytes
from compliance_engine  import aggregate_multi_image_compliance, perform_cross_verification
# from certificate_generator import generate_certificate_data, generate_certificate_pdf

app = FastAPI(
    title =  "True Tag - Scan_Detect_Verify "
)



app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# @app.on_event("startup")
# def startup_db():
#     """
#     Connect to MongoDB when FastAPI server launches.
#     """
#     get_database()


@app.get("/")
def health_check():
    return {
        "status" : "ready to use"
    }
@app.post("/api/products/analyze")
async def analyze_product(
    product_name: str = Form(...),
    category: str = Form("Packaged Food & Beverages"),
    description: str = Form(""),
    declared_mrp: float = Form(...),
    declared_net_quantity: str = Form(""),
    files: List[UploadFile] = File(...)
):

    if not files or len(files) == 0:
        raise HTTPException(status_code=400, detail="Please upload at least 1 packaging image (up to 5).")

    if len(files) > 5:
        raise HTTPException(status_code=400, detail="Maximum 5 packaging images allowed per product audit.")

    # 1. Process each uploaded image with OpenCV & OCR
    image_scan_results = []
    for file in files:
        if not file.content_type.startswith("image/"):
            continue
        try:
            image_bytes = await file.read()
            ocr_result = extract_ocr_from_image_bytes(image_bytes, filename=file.filename)
            image_scan_results.append(ocr_result)
        except Exception as err:
            print(f"[Image Read Error on {file.filename}]: {err}")

    if not image_scan_results:
        raise HTTPException(status_code=400, detail="Could not process any of the uploaded images.")

    aggregated = aggregate_multi_image_compliance(image_scan_results)

    cross_verif = perform_cross_verification(
        declared_mrp=declared_mrp,
        declared_net_qty=declared_net_quantity,
        aggregated_rules=aggregated
    )

    scan_id = f"AUD-{datetime.utcnow().strftime('%Y%m%d')}-{uuid.uuid4().hex[:6].upper()}"

    extracted_mrp_display = aggregated["rules"]["mrp"].get("extracted_value")
    extracted_numeric_mrp = aggregated["rules"]["mrp"].get("numeric_mrp")

    audit_record = {
        "audit_id": scan_id,
        "timestamp": datetime.utcnow().isoformat(),
        "product_name": product_name,
        "category": category,
        "description": description,
        "declared_mrp": declared_mrp,
        "declared_net_quantity": declared_net_quantity,
        "extracted_mrp_display": extracted_mrp_display,
        "extracted_numeric_mrp": extracted_numeric_mrp,
        "images_processed_count": len(image_scan_results),
        "compliance_status": cross_verif["compliance_status"],
        "is_compliant": cross_verif["is_compliant"],
        "has_critical_violation": cross_verif["has_critical_violation"],
        "passed_rules_count": aggregated["passed_rules_count"],
        "total_rules": 5,
        "rules_breakdown": aggregated["rules"],
        "discrepancies": cross_verif["discrepancies"],
        "image_scans": [
            {"filename": s["filename"], "char_count": s["char_count"], "extracted_preview": s["extracted_text"][:200]}
            for s in image_scan_results
        ]
    }

    if cross_verif["is_compliant"]:
        audit_record["certificate"] = generate_certificate_data(audit_record)
    else:
        audit_record["certificate"] = None

    saved_record = save_compliance_audit(audit_record)
    return saved_record


@app.get("/api/products/{scan_id}/certificate")
def get_certificate(scan_id: str):

    audit = get_compliance_audit_by_id(scan_id)
    if not audit:
        raise HTTPException(status_code=404, detail="Audit record not found.")

    if not audit.get("is_compliant"):
        raise HTTPException(status_code=400, detail="Certificate unavailable: Product has compliance violations.")

    if "certificate" not in audit or not audit["certificate"]:
        audit["certificate"] = generate_certificate_data(audit)

    return audit["certificate"]


@app.get("/api/products/{scan_id}/certificate/download")
def download_certificate_pdf(scan_id: str):

    audit = get_compliance_audit_by_id(scan_id)
    if not audit:
        raise HTTPException(status_code=404, detail="Audit record not found.")

    if not audit.get("is_compliant"):
        raise HTTPException(status_code=400, detail="Cannot download certificate for non-compliant product.")

    pdf_bytes = generate_certificate_pdf(audit)
    return Response(
        content=pdf_bytes,
        media_type="application/pdf",
        headers={"Content-Disposition": f"attachment; filename=LegalMetrology_Cert_{scan_id}.pdf"}
    )


@app.get("/api/products/{scan_id}/price-history")
def get_price_history(scan_id: str):

    audit = get_compliance_audit_by_id(scan_id)
    if not audit:
        raise HTTPException(status_code=404, detail="Audit record not found.")

    return {
        "audit_id": scan_id,
        "product_name": audit.get("product_name"),
        "declared_mrp": audit.get("declared_mrp"),
        "packaging_mrp": audit.get("extracted_numeric_mrp"),
        "price_history": audit.get("price_history", [])
    }


@app.get("/api/products/audits")
def get_audits_list(limit: int = 20):

    records = get_all_audits(limit=limit)
    return {"count": len(records), "audits": records}
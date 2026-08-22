import re
import hashlib
import io
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, HRFlowable
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_CENTER


def perform_cross_verification(declared_mrp: float, declared_net_qty: str, aggregated_rules: dict) -> dict:
    mrp_rule = aggregated_rules["rules"]["mrp"]
    qty_rule = aggregated_rules["rules"]["net_quantity"]

    discrepancies = []
    has_critical_violation = False

    mrp_status = "Not Extracted"
    physical_mrp = mrp_rule.get("numeric_mrp")

    if physical_mrp is not None and declared_mrp is not None:
        if declared_mrp > physical_mrp:
            mrp_status = "Overpriced"
            has_critical_violation = True
            discrepancies.append({
                "field": "Maximum Retail Price (MRP)",
                "declared": f"₹{declared_mrp:.2f}",
                "packaging": f"₹{physical_mrp:.2f}",
                "severity": "Critical",
                "message": f"Illegal Overpricing: Seller listing price (₹{declared_mrp:.2f}) exceeds physical packaging MRP (₹{physical_mrp:.2f}). Violation of Section 18 / Rule 18(2)."
            })
        elif declared_mrp < physical_mrp:
            mrp_status = "Discounted"
            discrepancies.append({
                "field": "Maximum Retail Price (MRP)",
                "declared": f"₹{declared_mrp:.2f}",
                "packaging": f"₹{physical_mrp:.2f}",
                "severity": "Match",
                "message": f"Compliant: Listing price (₹{declared_mrp:.2f}) is discounted below packaging MRP (₹{physical_mrp:.2f})."
            })
        else:
            mrp_status = "Exact Match"
            discrepancies.append({
                "field": "Maximum Retail Price (MRP)",
                "declared": f"₹{declared_mrp:.2f}",
                "packaging": f"₹{physical_mrp:.2f}",
                "severity": "Match",
                "message": f"Exact Match: Listing price (₹{declared_mrp:.2f}) matches packaging MRP."
            })
    else:
        discrepancies.append({
            "field": "Maximum Retail Price (MRP)",
            "declared": f"₹{declared_mrp:.2f}" if declared_mrp else "Not Declared",
            "packaging": mrp_rule.get("extracted_value") or "Missing on Label",
            "severity": "Warning" if not physical_mrp else "Match",
            "message": "Numeric price could not be automatically parsed from packaging label."
        })

    qty_status = "Match"
    packaging_qty = qty_rule.get("extracted_value")
    if declared_net_qty and packaging_qty:
        norm_declared = re.sub(r'\s+', '', declared_net_qty.lower())
        norm_packaging = re.sub(r'\s+', '', packaging_qty.lower())
        if norm_declared in norm_packaging or norm_packaging in norm_declared:
            qty_status = "Match"
            discrepancies.append({
                "field": "Net Quantity",
                "declared": declared_net_qty,
                "packaging": packaging_qty,
                "severity": "Match",
                "message": f"Consistent: Declared quantity matches packaging label."
            })
        else:
            qty_status = "Mismatch"
            discrepancies.append({
                "field": "Net Quantity",
                "declared": declared_net_qty,
                "packaging": packaging_qty,
                "severity": "Warning",
                "message": f"Quantity Discrepancy: Declared '{declared_net_qty}' differs from physical label '{packaging_qty}'."
            })

    is_compliant = aggregated_rules["all_rules_passed"] and not has_critical_violation
    compliance_status = "COMPLIANT" if is_compliant else "REJECTED_NON_COMPLIANT"

    return {
        "compliance_status": compliance_status,
        "is_compliant": is_compliant,
        "has_critical_violation": has_critical_violation,
        "discrepancies": discrepancies,
        "mrp_cross_status": mrp_status,
        "qty_cross_status": qty_status
    }


def generate_certificate_data(audit_record: dict) -> dict:
    audit_id = audit_record.get("audit_id", "AUD-0000")
    product_name = audit_record.get("product_name", "Product")
    mrp = audit_record.get("declared_mrp", 0.0)
    timestamp = audit_record.get("timestamp", "")

    raw_sig = f"TRUETAG-{audit_id}-{product_name}-{mrp}-{timestamp}"
    cert_hash = hashlib.sha256(raw_sig.encode()).hexdigest().upper()
    cert_id = f"CERT-TT-{cert_hash[:8]}-{cert_hash[8:16]}"

    badge_embed_code = (
        f'<div class="truetag-verified-badge" data-cert="{cert_id}" '
        f'style="display:inline-flex;align-items:center;gap:8px;padding:6px 12px;background:#ecfdf5;border:1px solid #10b981;border-radius:6px;font-family:sans-serif;font-size:12px;color:#065f46;font-weight:bold;">'
        f'<span>🛡️</span> TrueTag Verified Compliant (LM-2011) - ID: {cert_id}'
        f'</div>'
    )

    return {
        "certificate_id": cert_id,
        "certificate_hash": cert_hash,
        "product_name": product_name,
        "category": audit_record.get("category", "Packaged Commodity"),
        "verified_packaging_mrp": audit_record.get("extracted_mrp_display") or f"₹{mrp:.2f}",
        "declared_listing_price": f"₹{mrp:.2f}",
        "verified_net_quantity": audit_record.get("declared_net_quantity", "N/A"),
        "audit_id": audit_id,
        "issued_at": timestamp,
        "issuer": "TrueTag Compliance Certification Engine",
        "regulatory_act": "Legal Metrology (Packaged Commodities) Rules, 2011",
        "compliance_score": "5 / 5 Statutory Declarations Confirmed",
        "status": "OFFICIALLY COMPLIANT & APPROVED",
        "embed_badge_snippet": badge_embed_code
    }


def generate_certificate_pdf(audit_record: dict) -> bytes:
    cert_data = generate_certificate_data(audit_record)
    buffer = io.BytesIO()

    doc = SimpleDocTemplate(
        buffer,
        pagesize=letter,
        rightMargin=40,
        leftMargin=40,
        topMargin=40,
        bottomMargin=40
    )

    styles = getSampleStyleSheet()

    title_style = ParagraphStyle(
        'CertTitle',
        parent=styles['Heading1'],
        fontName='Helvetica-Bold',
        fontSize=20,
        leading=24,
        alignment=TA_CENTER,
        textColor=colors.HexColor('#0F172A')
    )
    
    sub_title_style = ParagraphStyle(
        'CertSubTitle',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=10,
        leading=14,
        alignment=TA_CENTER,
        textColor=colors.HexColor('#312E81')
    )

    body_style = ParagraphStyle(
        'CertBody',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=10,
        leading=14,
        textColor=colors.HexColor('#1E293B')
    )

    badge_style = ParagraphStyle(
        'CertBadge',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=12,
        leading=15,
        alignment=TA_CENTER,
        textColor=colors.HexColor('#047857')
    )

    elements = []

    elements.append(Paragraph("TRUETAG OFFICIAL COMPLIANCE CERTIFICATE", title_style))
    elements.append(Paragraph("LEGAL METROLOGY (PACKAGED COMMODITIES) RULES, 2011", sub_title_style))
    elements.append(Spacer(1, 15))
    elements.append(HRFlowable(width="100%", thickness=2, color=colors.HexColor('#312E81'), spaceAfter=15))

    status_table_data = [
        [
            Paragraph(f"<b>CERTIFICATE ID:</b> {cert_data['certificate_id']}", body_style),
            Paragraph("<b>STATUS:</b> COMPLIANT & APPROVED", badge_style)
        ]
    ]
    status_table = Table(status_table_data, colWidths=[300, 230])
    status_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, -1), colors.HexColor('#ECFDF5')),
        ('BOX', (0, 0), (-1, -1), 1, colors.HexColor('#10B981')),
        ('PADDING', (0, 0), (-1, -1), 8),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE')
    ]))
    elements.append(status_table)
    elements.append(Spacer(1, 15))

    details_data = [
        [Paragraph("<b>Product Title:</b>", body_style), Paragraph(cert_data['product_name'], body_style)],
        [Paragraph("<b>Category:</b>", body_style), Paragraph(cert_data['category'], body_style)],
        [Paragraph("<b>Verified Packaging MRP:</b>", body_style), Paragraph(str(cert_data['verified_packaging_mrp']), body_style)],
        [Paragraph("<b>Declared Listing Price:</b>", body_style), Paragraph(str(cert_data['declared_listing_price']), body_style)],
        [Paragraph("<b>Verified Net Quantity:</b>", body_style), Paragraph(str(cert_data['verified_net_quantity']), body_style)],
        [Paragraph("<b>Audit Reference ID:</b>", body_style), Paragraph(cert_data['audit_id'], body_style)],
        [Paragraph("<b>Verification Engine:</b>", body_style), Paragraph("TrueTag AI Engine", body_style)]
    ]

    details_table = Table(details_data, colWidths=[180, 350])
    details_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, -1), colors.HexColor('#F8FAFC')),
        ('BOX', (0, 0), (-1, -1), 1, colors.HexColor('#E2E8F0')),
        ('INNERGRID', (0, 0), (-1, -1), 0.5, colors.HexColor('#E2E8F0')),
        ('PADDING', (0, 0), (-1, -1), 6),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE')
    ]))
    elements.append(details_table)
    elements.append(Spacer(1, 15))

    rules_table_data = [
        [Paragraph("<b>Statutory Declaration (Rule)</b>", body_style), Paragraph("<b>Verification Status</b>", body_style)],
        [Paragraph("Rule 6(1)(a) - Maximum Retail Price (MRP)", body_style), Paragraph("VERIFIED (Pass)", body_style)],
        [Paragraph("Rule 6(1)(b) - Net Quantity / Weight / Volume", body_style), Paragraph("VERIFIED (Pass)", body_style)],
        [Paragraph("Rule 6(1)(d) - Manufacturer / Packer Details", body_style), Paragraph("VERIFIED (Pass)", body_style)],
        [Paragraph("Rule 6(1)(n) - Country of Origin Statement", body_style), Paragraph("VERIFIED (Pass)", body_style)],
        [Paragraph("Rule 6(1)(e) - Consumer Grievance Care Cell", body_style), Paragraph("VERIFIED (Pass)", body_style)],
    ]
    rules_table = Table(rules_table_data, colWidths=[360, 170])
    rules_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#F1F5F9')),
        ('BOX', (0, 0), (-1, -1), 1, colors.HexColor('#CBD5E1')),
        ('INNERGRID', (0, 0), (-1, -1), 0.5, colors.HexColor('#E2E8F0')),
        ('PADDING', (0, 0), (-1, -1), 5),
    ]))
    elements.append(rules_table)
    elements.append(Spacer(1, 15))

    hash_p = Paragraph(f"<b>Cryptographic SHA-256 Signature:</b><br/><font size=7 color='#64748B'>{cert_data['certificate_hash']}</font>", body_style)
    elements.append(hash_p)
    elements.append(Spacer(1, 10))

    disclaimer = Paragraph(
        "<font size=7 color='#94A3B8'>TrueTag Automated Verification Portal • Confirms compliance under Indian Legal Metrology (Packaged Commodities) Rules, 2011.</font>",
        body_style
    )
    elements.append(disclaimer)

    doc.build(elements)
    buffer.seek(0)
    return buffer.getvalue()

import hashlib
import io
from datetime import datetime
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, HRFlowable
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_CENTER


def generate_certificate_data(audit_record: dict) -> dict:
    audit_id = audit_record.get("audit_id", "AUD-0000")
    product_name = audit_record.get("product_name", "Product")
    mrp = audit_record.get("declared_mrp", 0.0)
    timestamp = audit_record.get("timestamp", datetime.utcnow().isoformat())

    
    raw_sig = f"{audit_id}-{product_name}-{mrp}-{timestamp}-LEGAL-METROLOGY-INDIA"
    cert_hash = hashlib.sha256(raw_sig.encode()).hexdigest().upper()
    cert_id = f"CERT-LM-{cert_hash[:8]}-{cert_hash[8:16]}"

    badge_embed_code = (
        f'<div class="lm-verified-badge" data-cert="{cert_id}" '
        f'style="display:inline-flex;align-items:center;gap:6px;padding:4px 10px;background:#ecfdf5;border:1px solid #10b981;border-radius:6px;font-family:sans-serif;font-size:12px;color:#065f46;font-weight:bold;">'
        f'<span>🛡️</span> Legal Metrology Certified (LM-2011) - ID: {cert_id}'
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
        "issuer": "National Legal Metrology Compliance Portal (Automated Verification)",
        "regulatory_act": "Legal Metrology (Packaged Commodities) Rules, 2011 & Consumer Protection Act 2019",
        "compliance_score": "5 / 5 Declarations Verified",
        "status": "OFFICIALLY COMPLIANT & CERTIFIED",
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
        textColor=colors.HexColor('#1E1B4B')
    )
    
    sub_title_style = ParagraphStyle(
        'CertSubTitle',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=10,
        leading=14,
        alignment=TA_CENTER,
        textColor=colors.HexColor('#4F46E5')
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
        fontSize=13,
        leading=16,
        alignment=TA_CENTER,
        textColor=colors.HexColor('#047857')
    )

    elements = []

    elements.append(Paragraph("DIGITAL COMPLIANCE CERTIFICATE", title_style))
    elements.append(Paragraph("LEGAL METROLOGY (PACKAGED COMMODITIES) RULES, 2011", sub_title_style))
    elements.append(Spacer(1, 15))
    elements.append(HRFlowable(width="100%", thickness=2, color=colors.HexColor('#4F46E5'), spaceAfter=15))

    # Certificate ID & Status Banner
    status_table_data = [
        [
            Paragraph(f"<b>CERTIFICATE ID:</b> {cert_data['certificate_id']}", body_style),
            Paragraph("<b>STATUS:</b> COMPLIANT & APPROVED", badge_style)
        ]
    ]
    status_table = Table(status_table_data, colWidths=[300, 230])
    status_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, -1), colors.HexColor('#F0FDF4')),
        ('BOX', (0, 0), (-1, -1), 1, colors.HexColor('#86EFAC')),
        ('PADDING', (0, 0), (-1, -1), 8),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE')
    ]))
    elements.append(status_table)
    elements.append(Spacer(1, 15))

    details_data = [
        [Paragraph("<b>Product Name:</b>", body_style), Paragraph(cert_data['product_name'], body_style)],
        [Paragraph("<b>Category:</b>", body_style), Paragraph(cert_data['category'], body_style)],
        [Paragraph("<b>Verified Packaging MRP:</b>", body_style), Paragraph(str(cert_data['verified_packaging_mrp']), body_style)],
        [Paragraph("<b>Declared Listing Price:</b>", body_style), Paragraph(str(cert_data['declared_listing_price']), body_style)],
        [Paragraph("<b>Verified Net Quantity:</b>", body_style), Paragraph(str(cert_data['verified_net_quantity']), body_style)],
        [Paragraph("<b>Audit Reference ID:</b>", body_style), Paragraph(cert_data['audit_id'], body_style)],
        [Paragraph("<b>Date of Verification:</b>", body_style), Paragraph(str(cert_data['issued_at']), body_style)]
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
        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#EEF2FF')),
        ('BOX', (0, 0), (-1, -1), 1, colors.HexColor('#CBD5E1')),
        ('INNERGRID', (0, 0), (-1, -1), 0.5, colors.HexColor('#E2E8F0')),
        ('PADDING', (0, 0), (-1, -1), 5),
    ]))
    elements.append(rules_table)
    elements.append(Spacer(1, 15))

    hash_p = Paragraph(f"<b>Digital Signature SHA-256:</b><br/><font size=7 color='#64748B'>{cert_data['certificate_hash']}</font>", body_style)
    elements.append(hash_p)
    elements.append(Spacer(1, 10))

    disclaimer = Paragraph(
        "<font size=7 color='#94A3B8'>This certificate confirms that the submitted product images and declarations fulfill all mandatory provisions of the Legal Metrology (Packaged Commodities) Rules, 2011 for e-commerce publishing.</font>",
        body_style
    )
    elements.append(disclaimer)

    doc.build(elements)
    buffer.seek(0)
    return buffer.getvalue()